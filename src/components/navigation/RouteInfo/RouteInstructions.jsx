import React from 'react';
import { useDarkMode } from '../../../context/DarkModeContext'; // ✅ Importar el contexto

const RouteInstructions = ({ 
  currentInstruction, 
  estimatedDistance, 
  estimatedTime, 
  distance, 
  userPath,
  autoCentering,
  accuracy
}) => {
  const { darkMode } = useDarkMode(); // ✅ Obtener el estado del modo oscuro

  const getAccuracyColor = (acc) => {
    if (!acc) return darkMode ? 'text-gray-400' : 'text-gray-500';
    if (acc < 10) return darkMode ? 'text-green-400' : 'text-green-600';
    if (acc < 50) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getAccuracyText = (acc) => {
    if (!acc) return 'Desconocida';
    if (acc < 10) return 'Excelente';
    if (acc < 50) return 'Buena';
    if (acc < 100) return 'Regular';
    return 'Baja';
  };

  const getAccuracyBgColor = (acc) => {
    if (!acc) return darkMode ? 'bg-gray-700/50' : 'bg-gray-100';
    if (acc < 10) return darkMode ? 'bg-green-900/30' : 'bg-green-50';
    if (acc < 50) return darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50';
    return darkMode ? 'bg-red-900/30' : 'bg-red-50';
  };

  return (
    <div className={`mb-4 p-4 rounded-lg border transition-all duration-300 ${
      darkMode 
        ? 'bg-blue-900/20 border-blue-700' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      {/* Instrucción principal */}
      <div className={`p-3 rounded-lg border mb-3 transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800 border-green-700' 
          : 'bg-white border-green-200'
      }`}>
        <p className={`font-semibold flex items-center gap-2 text-lg transition-colors duration-300 ${
          darkMode ? 'text-green-300' : 'text-green-700'
        }`}>
          <span className="text-xl">📢</span>
          {currentInstruction}
        </p>
        
        {/* Información de precisión GPS */}
        {accuracy && (
          <div className={`mt-2 p-2 rounded-lg transition-all duration-300 ${getAccuracyBgColor(accuracy)}`}>
            <p className={`text-sm font-medium ${getAccuracyColor(accuracy)}`}>
              🎯 Precisión GPS: {accuracy.toFixed(0)} metros ({getAccuracyText(accuracy)})
            </p>
            {accuracy > 50 && (
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                darkMode ? 'text-orange-300' : 'text-orange-600'
              }`}>
                💡 Sugerencia: Muévete a un área abierta para mejor precisión
              </p>
            )}
          </div>
        )}
        
        {/* Indicador de modo manual */}
        {!autoCentering && (
          <p className={`text-xs mt-2 transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-600'
          }`}>
            ✨ Modo manual activado - mueve el mapa libremente
          </p>
        )}
      </div>
      
      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
        <div className="text-center">
          <span className={`font-semibold block transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            📏 Total:
          </span>
          <p className={`transition-colors duration-300 ${
            darkMode ? 'text-blue-200' : 'text-blue-600'
          }`}>
            {estimatedDistance || '--'}
          </p>
        </div>
        
        <div className="text-center">
          <span className={`font-semibold block transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            ⏱️ Tiempo:
          </span>
          <p className={`transition-colors duration-300 ${
            darkMode ? 'text-blue-200' : 'text-blue-600'
          }`}>
            {estimatedTime || '--'}
          </p>
        </div>
        
        <div className="text-center">
          <span className={`font-semibold block transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            🚶 Recorrido:
          </span>
          <p className={`transition-colors duration-300 ${
            darkMode ? 'text-green-300' : 'text-green-600'
          }`}>
            {distance.toFixed(2)} km
          </p>
        </div>
        
        <div className="text-center">
          <span className={`font-semibold block transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            📍 Puntos GPS:
          </span>
          <p className={`transition-colors duration-300 ${
            darkMode ? 'text-blue-200' : 'text-blue-600'
          }`}>
            {userPath.length}
          </p>
        </div>
        
        <div className="text-center">
          <span className={`font-semibold block transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            🎯 Precisión:
          </span>
          <p className={`font-medium ${getAccuracyColor(accuracy)}`}>
            {accuracy ? `${accuracy.toFixed(0)}m` : '--'}
          </p>
        </div>
      </div>

      {/* Indicadores visuales adicionales */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
          autoCentering 
            ? darkMode 
              ? 'bg-green-800 text-green-300' 
              : 'bg-green-100 text-green-800'
            : darkMode 
              ? 'bg-gray-700 text-gray-400' 
              : 'bg-gray-100 text-gray-600'
        }`}>
          {autoCentering ? '📍 Auto-centrado' : '🔄 Manual'}
        </span>
        
        <span className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
          userPath.length > 0 
            ? darkMode 
              ? 'bg-blue-800 text-blue-300' 
              : 'bg-blue-100 text-blue-800'
            : darkMode 
              ? 'bg-gray-700 text-gray-400' 
              : 'bg-gray-100 text-gray-600'
        }`}>
          {userPath.length > 0 ? '📈 GPS Activo' : '📉 GPS Inactivo'}
        </span>

        {accuracy && (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
            accuracy < 50 
              ? darkMode 
                ? 'bg-green-800 text-green-300' 
                : 'bg-green-100 text-green-800'
              : darkMode 
                ? 'bg-red-800 text-red-300' 
                : 'bg-red-100 text-red-800'
          }`}>
            {accuracy < 50 ? '🎯 Buena Precisión' : '⚠️ Baja Precisión'}
          </span>
        )}
      </div>
    </div>
  );
};

export default RouteInstructions;