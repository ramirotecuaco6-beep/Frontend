// src/components/RutaDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

// Servicios y utilidades
import { apiService } from "../services/api";
import { setupLeafletIcons } from "./utils/mapUtils";

// Hooks personalizados
import { useGeolocation } from "./hooks/useGeolocation";
import { useRouteCalculation } from "./hooks/useRouteCalculation";
import { useNavigation } from "./hooks/useNavigation";
import { useDarkMode } from "../context/DarkModeContext";
import { useAuth } from "../context/AuthContext";

// Componentes modulares
import ImageCarousel from "./PlaceInfo/ImageCarousel";
import PlaceDetails from "./PlaceInfo/PlaceDetails";
import NavigationControls from "./navigation/NavigationControls";
import NavigationMap from "./navigation/NavigationMap";
import RouteInstructions from "./navigation/RouteInfo/RouteInstructions";
import RouteStats from "./navigation/RouteInfo/RouteStats";

// Configurar iconos de Leaflet
setupLeafletIcons();

// Cargar URL desde .env
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

const RutaDetalle = () => {
  const { nombreLugar } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { user } = useAuth();
  
  // Estados del componente
  const [lugarActual, setLugarActual] = useState(null);
  const [loadingLugar, setLoadingLugar] = useState(true);
  const [errorLugar, setErrorLugar] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState("Haz clic en 'Iniciar Navegación' para comenzar");
  const [autoCentering, setAutoCentering] = useState(true);
  const [customDestination, setCustomDestination] = useState(null);
  const [inicioNavegacion, setInicioNavegacion] = useState(null);

  // Custom Hooks
  const {
    position,
    gpsAvailable,
    error: geoError,
    speed,
    accuracy,
    setGpsAvailable,
    setError,
    getUserLocation,
    startWatchingPosition,
    stopWatchingPosition,
    checkPermissions
  } = useGeolocation();

  const {
    routeGeometry,
    estimatedTime,
    estimatedDistance,
    instructions,
    nextTurn,
    loadingRoute,
    routeCalculated,
    calculateRouteWithMapbox,
    resetRoute,
    setInstructions
  } = useRouteCalculation();

  const {
    isNavigating,
    distance,
    userPath,
    achievements,
    startNavigation: startNav,
    stopNavigation: stopNav,
    handlePositionUpdate
  } = useNavigation(routeCalculated, lugarActual, customDestination, nextTurn, setCurrentInstruction);

  // Función para guardar ruta completada en el backend
  const guardarRutaCompletada = async (lugar, distancia, duracion, coordenadas, tipoActividad = "senderismo") => {
    try {
      if (!user) {
        console.warn('No hay usuario autenticado para guardar ruta');
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch(`${BASE_URL}/users/${user.uid}/rutas-completadas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lugarId: lugar._id || lugar.id,
          lugarNombre: lugar.nombre,
          distancia: distancia,
          duracion: duracion,
          coordenadas: coordenadas,
          tipoActividad: tipoActividad,
          fecha: new Date().toISOString()
        })
      });
      
      const data = await res.json();
      if (data.success) {
        console.log('Ruta guardada en historial:', data.message);
        return data;
      } else {
        throw new Error(data.message || 'Error al guardar ruta');
      }
    } catch (error) {
      console.error('Error guardando ruta:', error);
    }
  };

  // Efecto para detectar cuando el usuario llega al destino y guardar la ruta
  useEffect(() => {
    if (distance < 0.1 && isNavigating && lugarActual && inicioNavegacion) {
      console.log('Usuario llego al destino! Guardando ruta...');
      
      // Calcular duracion aproximada
      const duracionMinutos = Math.floor((Date.now() - inicioNavegacion) / 60000);
      
      // Guardar ruta completada
      guardarRutaCompletada(
        lugarActual,
        distance,
        duracionMinutos,
        userPath,
        "senderismo"
      );
      
      // Mostrar mensaje de exito
      setCurrentInstruction(`¡Llegaste a ${lugarActual.nombre}! Ruta guardada en tu historial.`);
      
      // Vibrar si el dispositivo lo permite
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }, [distance, isNavigating, lugarActual, inicioNavegacion, userPath]);

  // Función para normalizar coordenadas (objeto → array)
  const normalizarCoordenadas = (lugar) => {
    if (!lugar || !lugar.coordenadas) {
      console.warn("No hay coordenadas para normalizar");
      return null;
    }
    
    console.log("Normalizando coordenadas:", lugar.coordenadas);
    console.log("Tipo de coordenadas:", typeof lugar.coordenadas);
    console.log("Es array?:", Array.isArray(lugar.coordenadas));
    
    let lat, lng;
    
    // Caso 1: Ya es un array [lat, lng]
    if (Array.isArray(lugar.coordenadas) && lugar.coordenadas.length === 2) {
      [lat, lng] = lugar.coordenadas;
      console.log("Coordenadas ya son array:", [lat, lng]);
    }
    // Caso 2: Es un objeto {lat, lng} 
    else if (lugar.coordenadas.lat !== undefined && lugar.coordenadas.lng !== undefined) {
      lat = lugar.coordenadas.lat;
      lng = lugar.coordenadas.lng;
      console.log("Coordenadas convertidas de objeto {lat, lng}:", [lat, lng]);
    }
    // Caso 3: Es un objeto con índices numéricos {0: lat, 1: lng}
    else if (lugar.coordenadas[0] !== undefined && lugar.coordenadas[1] !== undefined) {
      lat = lugar.coordenadas[0];
      lng = lugar.coordenadas[1];
      console.log("Coordenadas convertidas de objeto {0, 1}:", [lat, lng]);
    }
    // Caso 4: Es un objeto anidado (puede pasar con MongoDB)
    else if (lugar.coordenadas.coordinates && Array.isArray(lugar.coordenadas.coordinates)) {
      [lng, lat] = lugar.coordenadas.coordinates; // MongoDB usa [lng, lat]
      console.log("Coordenadas convertidas de GeoJSON:", [lat, lng]);
    }
    else {
      console.warn("Formato de coordenadas no reconocido:", lugar.coordenadas);
      return null;
    }
    
    // Validar que las coordenadas sean números válidos
    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
      console.warn("Coordenadas no son números válidos:", lat, lng);
      return null;
    }
    
    // Validar rangos de latitud y longitud
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.warn("Coordenadas fuera de rango:", lat, lng);
      return null;
    }
    
    const coordenadasNormalizadas = [lat, lng];
    console.log("Coordenadas finales normalizadas:", coordenadasNormalizadas);
    
    // Verificar si son coordenadas de CDMX
    const esCDMX = lat === 19.4326 && lng === -99.1332;
    if (esCDMX) {
      console.warn("Las coordenadas son de CDMX, probablemente valores por defecto");
    }
    
    return coordenadasNormalizadas;
  };

  // Buscar lugar por nombre o ID - con normalización de coordenadas
  useEffect(() => {
    let mounted = true;
    const fetchLugar = async () => {
      setLoadingLugar(true);
      setErrorLugar(null);

      console.log("Iniciando busqueda");
      console.log("Parametro recibido:", nombreLugar);

      if (!nombreLugar) {
        setErrorLugar("No se especificó el destino.");
        setLoadingLugar(false);
        return;
      }

      try {
        const decodedNombre = decodeURIComponent(nombreLugar);
        
        // Verificar si el parámetro parece un ObjectId de MongoDB
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(decodedNombre);
        
        if (isObjectId) {
          console.log("El parámetro parece un ObjectId, buscando por ID...");
          // Buscar por ID
          try {
            const lugarData = await apiService.getLugarPorId(decodedNombre);
            if (mounted && lugarData) {
              const lugarFinal = lugarData.lugar || lugarData;
              console.log("Lugar encontrado por ID:", lugarFinal.nombre);
              console.log("Coordenadas originales:", lugarFinal.coordenadas);
              
              // Normalizar coordenadas
              const coordenadasNormalizadas = normalizarCoordenadas(lugarFinal);
              if (coordenadasNormalizadas) {
                lugarFinal.coordenadas = coordenadasNormalizadas;
                console.log("Coordenadas normalizadas:", lugarFinal.coordenadas);
              } else {
                console.warn("No se pudieron normalizar las coordenadas, usando coordenadas reales de Puebla");
                const coordenadasReales = {
                  "Grutas de Xonotla": [19.8546, -97.3556],
                  "Río Libres": [19.8000, -97.4000]
                };
                lugarFinal.coordenadas = coordenadasReales[lugarFinal.nombre] || [19.0414, -98.2063];
              }
              
              setLugarActual(lugarFinal);
            } else {
              throw new Error("No se encontró lugar con ese ID");
            }
          } catch (errId) {
            console.warn("No se encontró por ID, intentando por nombre...");
            try {
              const res = await apiService.getLugarPorNombre(decodedNombre);
              if (mounted && res) {
                const lugarFinal = res.lugar || res;
                console.log("Lugar encontrado por nombre:", lugarFinal.nombre);
                console.log("Coordenadas originales:", lugarFinal.coordenadas);
                
                // Normalizar coordenadas
                const coordenadasNormalizadas = normalizarCoordenadas(lugarFinal);
                if (coordenadasNormalizadas) {
                  lugarFinal.coordenadas = coordenadasNormalizadas;
                  console.log("Coordenadas normalizadas:", lugarFinal.coordenadas);
                } else {
                  console.warn("No se pudieron normalizar las coordenadas, usando coordenadas reales de Puebla");
                  const coordenadasReales = {
                    "Grutas de Xonotla": [19.8546, -97.3556],
                    "Río Libres": [19.8000, -97.4000]
                  };
                  lugarFinal.coordenadas = coordenadasReales[lugarFinal.nombre] || [19.0414, -98.2063];
                }
                
                setLugarActual(lugarFinal);
              } else {
                throw new Error("No se encontró lugar con ese nombre");
              }
            } catch (errName) {
              throw new Error(`No se encontró ningún lugar con ID o nombre: ${decodedNombre}`);
            }
          }
        } else {
          console.log("El parámetro parece un nombre, buscando por nombre...");
          try {
            const res = await apiService.getLugarPorNombre(decodedNombre);
            if (mounted && res) {
              const lugarFinal = res.lugar || res;
              console.log("Lugar encontrado por nombre:", lugarFinal.nombre);
              console.log("Coordenadas originales:", lugarFinal.coordenadas);
              
              // Normalizar coordenadas
              const coordenadasNormalizadas = normalizarCoordenadas(lugarFinal);
              if (coordenadasNormalizadas) {
                lugarFinal.coordenadas = coordenadasNormalizadas;
                console.log("Coordenadas normalizadas:", lugarFinal.coordenadas);
              } else {
                console.warn("No se pudieron normalizar las coordenadas, usando coordenadas reales de Puebla");
                const coordenadasReales = {
                  "Grutas de Xonotla": [19.8546, -97.3556],
                  "Río Libres": [19.8000, -97.4000]
                };
                lugarFinal.coordenadas = coordenadasReales[lugarFinal.nombre] || [19.0414, -98.2063];
              }
              
              setLugarActual(lugarFinal);
            } else {
              throw new Error("No se encontró lugar con ese nombre");
            }
          } catch (errName) {
            console.warn("No se encontró por nombre, intentando en lista completa...");
            // Fallback: buscar en lista completa
            const all = await apiService.getLugares();
            if (!Array.isArray(all) || all.length === 0) {
              throw new Error("No hay lugares disponibles en el sistema");
            }
            
            console.log("Total de lugares disponibles:", all.length);
            
            // Buscar por nombre (case insensitive)
            const matchByName = all.find((it) => {
              if (!it.nombre) return false;
              return it.nombre.toLowerCase() === decodedNombre.toLowerCase();
            });
            
            if (matchByName) {
              console.log("Lugar encontrado en lista completa:", matchByName.nombre);
              console.log("Coordenadas originales:", matchByName.coordenadas);
              
              // Normalizar coordenadas
              const coordenadasNormalizadas = normalizarCoordenadas(matchByName);
              if (coordenadasNormalizadas) {
                matchByName.coordenadas = coordenadasNormalizadas;
                console.log("Coordenadas normalizadas:", matchByName.coordenadas);
              } else {
                console.warn("No se pudieron normalizar las coordenadas, usando coordenadas reales de Puebla");
                const coordenadasReales = {
                  "Grutas de Xonotla": [19.8546, -97.3556],
                  "Río Libres": [19.8000, -97.4000]
                };
                matchByName.coordenadas = coordenadasReales[matchByName.nombre] || [19.0414, -98.2063];
              }
              
              if (mounted) setLugarActual(matchByName);
            } else {
              throw new Error(`Lugar "${decodedNombre}" no encontrado`);
            }
          }
        }
      } catch (err) {
        console.error("Error cargando lugar:", err);
        if (mounted) setErrorLugar(err.message || "No se pudo cargar el lugar");
      } finally {
        if (mounted) setLoadingLugar(false);
      }
    };

    fetchLugar();
    return () => {
      mounted = false;
    };
  }, [nombreLugar]);

  // Auto-avance del carrusel
  useEffect(() => {
    if (!lugarActual) return;
    
    const imagenes = lugarActual.imagenes || (lugarActual.imagen_url ? [lugarActual.imagen_url] : []);
    if (imagenes.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % imagenes.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [lugarActual]);

  // Manejar triple clic para nuevo destino
  const handleTripleClick = async (latlng) => {
    if (!isNavigating) return;
    
    const newDestination = [latlng.lat, latlng.lng];
    setCustomDestination(newDestination);
    setCurrentInstruction("Calculando nueva ruta...");
    
    try {
      await calculateRouteWithMapbox(position, newDestination, lugarActual, newDestination, autoCentering);
      setCurrentInstruction("Nueva ruta calculada. Continúa tu viaje.");
    } catch (err) {
      console.error("Error al recalcular ruta:", err);
      setCurrentInstruction("Error al recalcular la ruta");
    }
  };

  // Toggle centrado automático
  const toggleAutoCentering = () => {
    setAutoCentering(prev => !prev);
    setCurrentInstruction(
      autoCentering 
        ? "Centrado automático DESACTIVADO - Puedes mover el mapa libremente" 
        : "Centrado automático ACTIVADO - El mapa te seguirá"
    );
  };

  // Iniciar navegación con verificación de permisos
  const startNavigation = async () => {
    console.log("Iniciando navegación");
    console.log("Lugar actual:", lugarActual?.nombre);
    console.log("Coordenadas destino:", lugarActual?.coordenadas);

    if (!lugarActual?.coordenadas) {
      setCurrentInstruction("Coordenadas del destino no disponibles");
      return;
    }

    try {
      // Verificar permisos primero
      const permissionStatus = await checkPermissions();
      
      if (permissionStatus === 'denied') {
        setCurrentInstruction("Permiso de ubicación denegado. Por favor habilita la ubicación en tu navegador.");
        setError("Permiso de ubicación denegado");
        return;
      }

      // Guardar el momento de inicio para calcular duración
      setInicioNavegacion(Date.now());
      
      startNav();
      setAutoCentering(true);
      setCustomDestination(null);
      setCurrentInstruction("Obteniendo tu ubicación GPS...");

      const userLocation = await getUserLocation();
      setGpsAvailable(true);
      
      // Mostrar información de precisión obtenida
      if (accuracy) {
        setCurrentInstruction(`Ubicación obtenida (Precisión: ${accuracy.toFixed(0)}m). Calculando ruta...`);
      } else {
        setCurrentInstruction("Ubicación obtenida. Calculando ruta...");
      }
      
      console.log("Calculando ruta desde:", userLocation, "hacia:", lugarActual.coordenadas);
      await calculateRouteWithMapbox(userLocation, lugarActual.coordenadas, lugarActual, null, true);
      
      // Iniciar seguimiento GPS
      startWatchingPosition((currentPos, currentSpeed, currentAccuracy) => {
        handlePositionUpdate(currentPos, currentSpeed, currentAccuracy);
      });
      
    } catch (error) {
      console.error("Error en navegación:", error);
      
      let errorMessage = error.message;
      if (error.message.includes("denied")) {
        errorMessage = "Permiso de ubicación denegado. Por favor habilita la ubicación en tu navegador.";
      } else if (error.message.includes("no disponible")) {
        errorMessage = "GPS no disponible. Verifica que el GPS esté activado y tengas conexión a internet.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Tiempo de espera agotado. Intenta salir al aire libre para mejor señal GPS.";
      }
      
      setCurrentInstruction(errorMessage);
      setGpsAvailable(false);
      setError(error.message);
    }
  };

  const stopNavigation = () => {
    stopNav();
    resetRoute();
    stopWatchingPosition();
    setCurrentInstruction("Haz clic en 'Iniciar Navegación' para comenzar");
    setAutoCentering(true);
    setCustomDestination(null);
    setInicioNavegacion(null);
  };

  // Actualizar instrucciones cuando se calcula la ruta
  useEffect(() => {
    if (instructions && instructions.length > 0 && routeCalculated) {
      setCurrentInstruction(instructions[0]);
    }
  }, [instructions, routeCalculated]);

  // Mostrar consejos de precisión
  useEffect(() => {
    if (accuracy && accuracy > 100) {
      setCurrentInstruction(prev => 
        prev + " Sugerencia: Muévete a un área abierta para mejor precisión GPS"
      );
    }
  }, [accuracy]);

  // Renderizado condicional
  if (loadingLugar) {
    return (
      <section className={`pt-24 pb-16 min-h-screen px-6 transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-green-50 to-white'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${
            darkMode ? 'border-green-400' : 'border-green-600'
          }`}></div>
          <p className={`mt-4 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Cargando información del lugar...
          </p>
        </div>
      </section>
    );
  }

  if (errorLugar) {
    return (
      <section className={`pt-24 pb-16 min-h-screen px-6 transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-green-50 to-white'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            Error
          </h2>
          <p className={`mb-4 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {errorLugar}
          </p>
          <p className={`text-sm mb-6 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Parámetro recibido: "{nombreLugar}"
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate(-1)} 
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-500 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              ← Volver
            </button>
            <button 
              onClick={() => navigate('/lugares')} 
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Ver Todos los Lugares
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!lugarActual) {
    return (
      <section className={`pt-24 pb-16 min-h-screen px-6 transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-green-50 to-white'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className={`transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Lugar no encontrado
          </p>
          <button 
            onClick={() => navigate(-1)} 
            className={`mt-4 px-4 py-2 rounded-lg transition-all duration-300 ${
              darkMode 
                ? 'bg-green-600 hover:bg-green-500 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            ← Volver
          </button>
        </div>
      </section>
    );
  }

  // Normalizar lista de imágenes - VERSIÓN CORREGIDA
  const imagenes = 
    lugarActual.imagenes && Array.isArray(lugarActual.imagenes) && lugarActual.imagenes.length > 0 
      ? lugarActual.imagenes 
      : lugarActual.imagen_url 
        ? [lugarActual.imagen_url] 
        : [];

  console.log("Imágenes para carrusel:", imagenes);
  console.log("Cantidad de imágenes:", imagenes.length);

  return (
    <section className={`pt-24 pb-16 min-h-screen px-6 transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-green-50 to-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        
        <button
          onClick={() => navigate(-1)}
          className={`px-4 py-2 rounded-lg mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          ← Volver
        </button>

        <h2 className={`text-4xl font-extrabold mb-4 transition-colors duration-300 ${
          darkMode ? 'text-green-400' : 'text-green-700'
        }`}>
          Ruta hacia: {customDestination ? 'Nuevo Destino' : (lugarActual.nombre || "Destino")}
        </h2>

        {/* Mostrar información de error de GPS si existe */}
        {geoError && (
          <div className={`rounded-lg p-4 mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-red-900/30 border border-red-700' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div className={`transition-colors duration-300 ${
                darkMode ? 'text-red-300' : 'text-red-700'
              }`}>
                <p className="font-semibold">Problema de ubicación detectado</p>
                <p className="text-sm mt-1">{String(geoError)}</p>
              </div>
            </div>
          </div>
        )}

        {/* CARRUSEL DE IMÁGENES - VERSIÓN CORREGIDA */}
        <div className="mb-8">
          {imagenes.length > 0 ? (
            <ImageCarousel 
              media={imagenes}  
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
            />
          ) : (
            <motion.div 
              className={`relative w-full h-96 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className={`text-6xl mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  🖼️
                </span>
                <span className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No hay imágenes disponibles para este lugar
                </span>
                {/* Debug info */}
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  <p>Debug: imagen_url = {lugarActual.imagen_url ? 'PRESENTE' : 'AUSENTE'}</p>
                  <p>Debug: imagenes = {lugarActual.imagenes ? `Array(${lugarActual.imagenes.length})` : 'AUSENTE'}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Información del lugar */}
        <PlaceDetails 
          lugarActual={lugarActual}
          customDestination={customDestination}
        />

        {/* Navegación y Mapa */}
        <div className={`p-6 rounded-2xl shadow-lg mb-8 transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-2xl font-bold transition-colors duration-300 ${
              darkMode ? 'text-green-400' : 'text-green-700'
            }`}>
              Navegación en Tiempo Real
            </h3>
            <NavigationControls 
              isNavigating={isNavigating}
              loadingRoute={loadingRoute}
              onStartNavigation={startNavigation}
              onStopNavigation={stopNavigation}
            />
          </div>

          {/* Información de la ruta */}
          <RouteInstructions 
            currentInstruction={currentInstruction}
            estimatedDistance={estimatedDistance}
            estimatedTime={estimatedTime}
            distance={distance}
            userPath={userPath}
            autoCentering={autoCentering}
            accuracy={accuracy}
          />

          {/* Mapa interactivo */}
          <NavigationMap
            position={position}
            lugarActual={lugarActual}
            customDestination={customDestination}
            routeGeometry={routeGeometry}
            userPath={userPath}
            speed={speed}
            autoCentering={autoCentering}
            onTripleClick={handleTripleClick}
            onCenterToggle={toggleAutoCentering}
          />
        </div>

        {/* Estadísticas y logros */}
        <RouteStats 
          distance={distance}
          userPath={userPath}
          speed={speed}
          isNavigating={isNavigating}
          achievements={achievements}
          accuracy={accuracy}
        />
      </div>
    </section>
  );
};

export default RutaDetalle;