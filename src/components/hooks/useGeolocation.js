import { useState, useRef } from 'react';

export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [gpsAvailable, setGpsAvailable] = useState(false);
  const [error, setError] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(null); // 🔥 NUEVO: para medir precisión
  const watchIdRef = useRef(null);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalización no soportada"));
        return;
      }

      // 🔥 OPCIONES MEJORADAS para máxima precisión
      const highAccuracyOptions = {
        enableHighAccuracy: true,    // 🔥 Forzar alta precisión
        timeout: 30000,              // 🔥 Más tiempo de espera
        maximumAge: 0                // 🔥 No usar datos en caché
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [
            position.coords.latitude,
            position.coords.longitude
          ];
          
          // 🔥 NUEVO: Guardar información de precisión
          setAccuracy(position.coords.accuracy);
          console.log('📍 Ubicación obtenida - Precisión:', position.coords.accuracy + 'm');
          
          setPosition(userLocation);
          setGpsAvailable(true);
          resolve(userLocation);
        },
        (error) => {
          let errorMessage = "Error obteniendo ubicación";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permiso de ubicación denegado. Por favor habilita la ubicación en tu navegador y dispositivo.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Información de ubicación no disponible. Verifica que el GPS esté activado.";
              break;
            case error.TIMEOUT:
              errorMessage = "Tiempo de espera agotado. El GPS está tardando mucho en responder.";
              break;
          }
          console.error('❌ Error GPS:', errorMessage, error);
          setError(errorMessage);
          setGpsAvailable(false);
          reject(new Error(errorMessage));
        },
        highAccuracyOptions  // 🔥 Usar opciones mejoradas
      );
    });
  };

  const startWatchingPosition = (onPositionUpdate) => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    // 🔥 OPCIONES MEJORADAS para seguimiento
    const watchOptions = {
      enableHighAccuracy: true,      // 🔥 Alta precisión
      maximumAge: 1000,              // 🔥 Actualizar cada segundo
      timeout: 5000                  // 🔥 Timeout más corto para respuestas rápidas
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const currentPos = [pos.coords.latitude, pos.coords.longitude];
        const currentSpeed = pos.coords.speed || 0;
        const currentAccuracy = pos.coords.accuracy;
        
        setPosition(currentPos);
        setSpeed(currentSpeed);
        setAccuracy(currentAccuracy); // 🔥 Actualizar precisión
        setGpsAvailable(true);
        setError(null);

        console.log('🔄 GPS Update - Precisión:', currentAccuracy + 'm', 'Velocidad:', currentSpeed);
        
        if (onPositionUpdate) {
          onPositionUpdate(currentPos, currentSpeed, currentAccuracy); // 🔥 Pasar precisión
        }
      },
      (err) => {
        console.error('❌ Error en seguimiento GPS:', err);
        let errorMsg = `Error GPS: ${err.message}`;
        
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = "Permiso de ubicación revocado. Recarga la página y permite la ubicación.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = "Señal GPS perdida. Verifica tu conexión a internet y GPS.";
        }
        
        setError(errorMsg);
        setGpsAvailable(false);
      },
      watchOptions  // 🔥 Usar opciones mejoradas
    );

    console.log('🎯 Iniciando seguimiento GPS con alta precisión');
  };

  const stopWatchingPosition = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log('⏹️ Seguimiento GPS detenido');
    }
  };

  // 🔥 NUEVO: Función para verificar permisos
  const checkPermissions = async () => {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        console.log('🔐 Estado del permiso:', permission.state);
        return permission.state;
      } catch (e) {
        console.log('No se pudo verificar el permiso:', e);
        return 'unknown';
      }
    }
    return 'unknown';
  };

  return {
    position,
    gpsAvailable,
    error,
    speed,
    accuracy,  // 🔥 NUEVO: Exportar precisión
    setGpsAvailable,
    setError,
    getUserLocation,
    startWatchingPosition,
    stopWatchingPosition,
    checkPermissions  // 🔥 NUEVO: Exportar verificación de permisos
  };
};