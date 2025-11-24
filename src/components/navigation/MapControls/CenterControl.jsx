import React from 'react';

const CenterControl = ({ onCenterClick, autoCentering }) => {
  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={onCenterClick}
          className={`p-2 bg-white border border-gray-300 rounded shadow-lg transition-all duration-200 ${
            autoCentering 
              ? 'text-blue-600 hover:text-blue-800' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          title={autoCentering ? "Centrado automático activado" : "Centrado automático desactivado"}
        >
          <div className="flex items-center gap-1">
            {autoCentering ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM10 6a1 1 0 011 1v6a1 1 0 11-2 0V7a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Centrando</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Centrar</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default CenterControl;