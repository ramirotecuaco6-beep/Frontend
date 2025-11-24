import React from 'react';
import { useDarkMode } from '../../context/DarkModeContext'; // ✅ Ruta corregida

const NavigationControls = ({ 
  isNavigating, 
  loadingRoute, 
  onStartNavigation, 
  onStopNavigation 
}) => {
  const { darkMode } = useDarkMode();

  return (
    <div className="flex gap-2">
      {!isNavigating ? (
        <button
          onClick={onStartNavigation}
          disabled={loadingRoute}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 ${
            darkMode 
              ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/25' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {loadingRoute ? (
            <>
              <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${
                darkMode ? 'border-green-200' : 'border-white'
              }`}></div>
              Calculando...
            </>
          ) : (
            <>
              <span className="text-base">🚗</span>
              Iniciar Navegación
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onStopNavigation}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
            darkMode 
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/25' 
              : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          <span className="text-base">⏹️</span>
          Detener Navegación
        </button>
      )}
    </div>
  );
};

export default NavigationControls;