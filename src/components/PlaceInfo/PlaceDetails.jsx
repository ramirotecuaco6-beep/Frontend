// src/components/PlaceInfo/PlaceDetails.jsx
import React from "react";
import { useDarkMode } from "../../context/DarkModeContext"; // ✅ Importar el contexto

const PlaceDetails = ({ lugarActual, customDestination }) => {
  const { darkMode } = useDarkMode(); // ✅ Obtener el estado del modo oscuro

  // Validación robusta del objeto lugarActual
  if (!lugarActual || typeof lugarActual !== 'object') {
    return (
      <div className={`rounded-lg p-4 mb-6 transition-all duration-300 ${
        darkMode 
          ? 'bg-yellow-900/30 border border-yellow-700' 
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <p className={`transition-colors duration-300 ${
          darkMode ? 'text-yellow-300' : 'text-yellow-700'
        }`}>
          ⚠️ Información del lugar no disponible temporalmente
        </p>
      </div>
    );
  }

  // Función segura para obtener valores
  const getSafeValue = (value, defaultValue = "No disponible") => {
    if (value === null || value === undefined || value === "") {
      return defaultValue;
    }
    return value;
  };

  // Validar coordenadas
  const coordenadasValidas = Array.isArray(lugarActual.coordenadas) && 
                            lugarActual.coordenadas.length === 2 &&
                            !isNaN(lugarActual.coordenadas[0]) && 
                            !isNaN(lugarActual.coordenadas[1]);

  return (
    <div className={`p-6 rounded-2xl shadow-lg mb-8 transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white'
    }`}>
      <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
        darkMode ? 'text-green-400' : 'text-green-700'
      }`}>
        📋 Información del Destino
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            📍 Nombre:
          </h4>
          <p className={`text-lg font-medium transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {getSafeValue(lugarActual.nombre)}
          </p>
        </div>
        
        {/* Descripción */}
        <div className="md:col-span-2">
          <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            📝 Descripción:
          </h4>
          <p className={`leading-relaxed transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {getSafeValue(lugarActual.descripcion)}
          </p>
        </div>
        
        {/* Coordenadas */}
        {coordenadasValidas && (
          <div className="md:col-span-2">
            <h4 className={`font-semibold mb-2 transition-colors duration-300 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              🌐 Coordenadas:
            </h4>
            <p className={`font-mono text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Lat: {lugarActual.coordenadas[0].toFixed(6)}, 
              Lng: {lugarActual.coordenadas[1].toFixed(6)}
            </p>
          </div>
        )}

        {/* Información adicional si está disponible */}
        {(lugarActual.caracteristicas || lugarActual.precio || lugarActual.rating) && (
          <div className={`md:col-span-2 border-t pt-4 transition-colors duration-300 ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h4 className={`font-semibold mb-3 transition-colors duration-300 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              📊 Información Adicional
            </h4>
            <div className="flex flex-wrap gap-3">
              {lugarActual.caracteristicas && Array.isArray(lugarActual.caracteristicas) && (
                <span className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  darkMode 
                    ? 'bg-green-900/50 text-green-300 border border-green-700' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  🏷️ {lugarActual.caracteristicas.join(", ")}
                </span>
              )}
              {lugarActual.precio && (
                <span className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  darkMode 
                    ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  💰 {lugarActual.precio}
                </span>
              )}
              {lugarActual.rating && (
                <span className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  darkMode 
                    ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  ⭐ {lugarActual.rating}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Destino personalizado */}
      {customDestination && Array.isArray(customDestination) && customDestination.length === 2 && (
        <div className={`mt-4 p-4 rounded-lg border transition-all duration-300 ${
          darkMode 
            ? 'bg-blue-900/30 border-blue-700' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`font-semibold transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            🎯 Destino personalizado establecido
          </p>
          <p className={`text-sm mt-1 transition-colors duration-300 ${
            darkMode ? 'text-blue-200' : 'text-blue-600'
          }`}>
            Coordenadas: {customDestination[0].toFixed(6)}, {customDestination[1].toFixed(6)}
          </p>
        </div>
      )}

      {/* Advertencia si no hay coordenadas */}
      {!coordenadasValidas && (
        <div className={`mt-4 p-4 rounded-lg border transition-all duration-300 ${
          darkMode 
            ? 'bg-red-900/30 border-red-700' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`font-semibold transition-colors duration-300 ${
            darkMode ? 'text-red-300' : 'text-red-700'
          }`}>
            ⚠️ Coordenadas no disponibles
          </p>
          <p className={`text-sm mt-1 transition-colors duration-300 ${
            darkMode ? 'text-red-200' : 'text-red-600'
          }`}>
            La navegación GPS no estará disponible para este destino.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;