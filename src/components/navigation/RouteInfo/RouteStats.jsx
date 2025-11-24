import React from 'react';
import { useDarkMode } from '../../../context/DarkModeContext'; // ✅ Ruta corregida

const RouteStats = ({ distance, userPath, speed, isNavigating, achievements, accuracy }) => {
  const { darkMode } = useDarkMode();

  return (
    <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white'
    }`}>
      <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
        darkMode ? 'text-green-400' : 'text-green-700'
      }`}>
        🏆 Logros de la Ruta
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
            darkMode ? 'text-green-300' : 'text-green-600'
          }`}>
            📊 Estadísticas
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`font-semibold transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                📏 Distancia recorrida:
              </span>
              <span className={`font-mono transition-colors duration-300 ${
                darkMode ? 'text-green-300' : 'text-green-600'
              }`}>
                {distance.toFixed(2)} km
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`font-semibold transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                📍 Puntos GPS registrados:
              </span>
              <span className={`font-mono transition-colors duration-300 ${
                darkMode ? 'text-blue-300' : 'text-blue-600'
              }`}>
                {userPath.length}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`font-semibold transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                🚗 Velocidad actual:
              </span>
              <span className={`font-mono transition-colors duration-300 ${
                darkMode ? 'text-yellow-300' : 'text-yellow-600'
              }`}>
                {(speed * 3.6).toFixed(0)} km/h
              </span>
            </div>

            {/* Nueva estadística: Precisión GPS */}
            {accuracy && (
              <div className="flex justify-between items-center">
                <span className={`font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  🎯 Precisión GPS:
                </span>
                <span className={`font-mono transition-colors duration-300 ${
                  accuracy > 50 
                    ? darkMode ? 'text-red-300' : 'text-red-600'
                    : darkMode ? 'text-green-300' : 'text-green-600'
                }`}>
                  {accuracy.toFixed(0)} m
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className={`font-semibold transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                🎯 Estado navegación:
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                isNavigating 
                  ? darkMode 
                    ? 'bg-green-700 text-green-300' 
                    : 'bg-green-100 text-green-800'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-400' 
                    : 'bg-gray-100 text-gray-600'
              }`}>
                {isNavigating ? '🟢 Activa' : '⚫ Inactiva'}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
            darkMode ? 'text-green-300' : 'text-green-600'
          }`}>
            🏅 Logros Desbloqueados
          </h4>
          <div className="space-y-3">
            {achievements.length > 0 ? (
              achievements.map((logro, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700' 
                      : 'bg-green-50 hover:bg-green-100'
                  }`}
                >
                  <span className={`text-lg transition-colors duration-300 ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-500'
                  }`}>
                    ✅
                  </span>
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-200' : 'text-green-700'
                  }`}>
                    {logro}
                  </span>
                </div>
              ))
            ) : (
              <div className={`text-center p-4 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700/30 text-gray-400' 
                  : 'bg-gray-50 text-gray-500'
              }`}>
                <p className="mb-2">🚶‍♂️</p>
                <p>Comienza a caminar para desbloquear logros</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`font-semibold transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Progreso de la ruta
          </span>
          <span className={`text-sm transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {Math.min(100, Math.round((distance / 5) * 100))}%
          </span>
        </div>
        <div className={`w-full rounded-full h-2 transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              darkMode ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${Math.min(100, Math.round((distance / 5) * 100))}%` }}
          ></div>
        </div>
        <p className={`text-xs mt-1 transition-colors duration-300 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {distance.toFixed(2)} km de 5.00 km completados
        </p>
      </div>
    </div>
  );
};

export default RouteStats;