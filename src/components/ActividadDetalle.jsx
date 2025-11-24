// src/components/ActividadDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiService } from "../services/api";
import { useDarkMode } from "../context/DarkModeContext"; // ✅ Importar el contexto

const ActividadDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // ✅ Obtener el estado del modo oscuro
  const [actividad, setActividad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        setLoading(true);
        const actividadData = await apiService.getActividadPorId(id);
        setActividad(actividadData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActividad();
  }, [id]);

  const handleComoLlegar = () => {
    if (actividad?.lugar) {
      navigate(`/ruta/${encodeURIComponent(actividad.lugar)}`);
    }
  };

  if (loading) {
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
            Cargando actividad...
          </p>
        </div>
      </section>
    );
  }

  if (error || !actividad) {
    return (
      <section className={`pt-24 pb-16 min-h-screen px-6 transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-green-50 to-white'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className={`text-6xl mb-4 ${
            darkMode ? 'text-red-400' : 'text-red-500'
          }`}>
            ⚠️
          </div>
          <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            Error
          </h2>
          <p className={`mb-6 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {error || "Actividad no encontrada"}
          </p>
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
        </div>
      </section>
    );
  }

  return (
    <section className={`pt-24 pb-16 min-h-screen px-6 transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-green-50 to-white'
    }`}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className={`px-4 py-2 rounded-lg mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          ← Volver a Actividades
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white'
          }`}
        >
          {/* Imagen */}
          <div className="relative h-80 w-full">
            <img 
              src={actividad.imagen_url || "/placeholder.jpg"} 
              alt={actividad.nombre}
              className="w-full h-full object-cover"
            />
            {/* Overlay para modo oscuro */}
            {darkMode && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
            )}
          </div>
          
          {/* Contenido */}
          <div className="p-8">
            <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-green-400' : 'text-green-700'
            }`}>
              {actividad.nombre}
            </h1>
            <p className={`text-lg mb-6 leading-relaxed transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {actividad.descripcion}
            </p>
            
            {/* Información adicional */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {actividad.lugar && (
                <div className={`p-4 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-green-900/30 border border-green-700' 
                    : 'bg-green-50'
                }`}>
                  <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-green-300' : 'text-green-800'
                  }`}>
                    📍 Ubicación
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    darkMode ? 'text-green-200' : 'text-green-700'
                  }`}>
                    {actividad.lugar}
                  </p>
                </div>
              )}
              
              {actividad.duracion && (
                <div className={`p-4 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-blue-900/30 border border-blue-700' 
                    : 'bg-blue-50'
                }`}>
                  <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-blue-300' : 'text-blue-800'
                  }`}>
                    ⏱️ Duración
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    darkMode ? 'text-blue-200' : 'text-blue-700'
                  }`}>
                    {actividad.duracion}
                  </p>
                </div>
              )}
              
              {actividad.dificultad && (
                <div className={`p-4 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-orange-900/30 border border-orange-700' 
                    : 'bg-orange-50'
                }`}>
                  <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-orange-300' : 'text-orange-800'
                  }`}>
                    ⚡ Dificultad
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    darkMode ? 'text-orange-200' : 'text-orange-700'
                  }`}>
                    {actividad.dificultad}
                  </p>
                </div>
              )}
              
              {actividad.precio && (
                <div className={`p-4 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-purple-900/30 border border-purple-700' 
                    : 'bg-purple-50'
                }`}>
                  <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-purple-300' : 'text-purple-800'
                  }`}>
                    💰 Precio
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    darkMode ? 'text-purple-200' : 'text-purple-700'
                  }`}>
                    {actividad.precio}
                  </p>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              {actividad.lugar && (
                <button
                  onClick={handleComoLlegar}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    darkMode 
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/25' 
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  🗺️ Cómo Llegar
                </button>
              )}
              
              <button
                onClick={() => navigate('/actividades')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  darkMode 
                    ? 'border border-green-500 text-green-400 hover:bg-green-900/30' 
                    : 'border border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                Ver Más Actividades
              </button>
            </div>

            {/* Información adicional si está disponible */}
            {(actividad.caracteristicas || actividad.equipamiento) && (
              <div className={`mt-8 pt-6 border-t transition-colors duration-300 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-green-400' : 'text-green-700'
                }`}>
                  ℹ️ Información Adicional
                </h2>
                
                {actividad.caracteristicas && (
                  <div className="mb-4">
                    <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>
                      🎯 Características
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(actividad.caracteristicas) ? (
                        actividad.caracteristicas.map((caracteristica, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {caracteristica}
                          </span>
                        ))
                      ) : (
                        <span className={`transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {actividad.caracteristicas}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {actividad.equipamiento && (
                  <div>
                    <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>
                      🎒 Equipamiento Recomendado
                    </h3>
                    <p className={`transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {actividad.equipamiento}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActividadDetalle;