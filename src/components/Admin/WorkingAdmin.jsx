import React, { useState, useEffect } from 'react';
import { useGlobalState } from "../hooks/useGlobalState";const WorkingAdmin = () => {
  const { isAdmin, isEditMode, updateState } = useGlobalState();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');

  // Tecla A 3 veces
  useEffect(() => {
    let count = 0;
    let lastTime = 0;

    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const now = Date.now();
      if (e.key === 'a' || e.key === 'A') {
        if (now - lastTime > 1000) count = 0;
        count++;
        lastTime = now;

        if (count === 3) {
          if (!isAdmin) {
            setShowLogin(true);
          } else {
            updateState({ isEditMode: !isEditMode });
          }
          count = 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAdmin, isEditMode, updateState]);

  const handleLogin = (e) => {
    e.preventDefault();
    const passwords = ['admin123', 'ecoturismo2024', 'admin', '1234'];
    
    if (passwords.includes(password)) {
      updateState({ 
        isAdmin: true, 
        isEditMode: true 
      });
      setShowLogin(false);
      setPassword('');
      console.log('✅ Login exitoso');
    } else {
      alert('Contraseña incorrecta. Prueba con: admin123');
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Salir del modo administrador?')) {
      updateState({ 
        isAdmin: false, 
        isEditMode: false 
      });
      console.log('🚪 Logout exitoso');
    }
  };

  const handleToggleEdit = () => {
    updateState({ isEditMode: !isEditMode });
    console.log('🔄 Edit mode toggled:', !isEditMode);
  };

  console.log('🎯 WorkingAdmin State:', { isAdmin, isEditMode });

  return (
    <>
      {/* Botones PRINCIPALES - ESTOS SÍ FUNCIONAN */}
      <div className="fixed top-4 right-4 z-50">
        {!isAdmin ? (
          <button
            onClick={() => {
              console.log('🔧 Botón admin clickeado');
              setShowLogin(true);
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-bold border-2 border-yellow-400"
          >
            <span>🔧</span>
            Modo Admin
          </button>
        ) : (
          <div className="flex gap-2 bg-white p-3 rounded-lg shadow-lg border-2 border-green-500">
            <button
              onClick={handleToggleEdit}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold border-2 ${
                isEditMode 
                  ? 'bg-orange-500 text-white hover:bg-orange-600 border-orange-600' 
                  : 'bg-green-500 text-white hover:bg-green-600 border-green-600'
              }`}
            >
              <span className="text-lg">{isEditMode ? '✏️' : '👁️'}</span>
              <span>{isEditMode ? 'EDITANDO' : 'VISTA'}</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-bold border-2 border-red-700"
            >
              <span>🚪</span>
              SALIR
            </button>

            <div className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 font-bold border-2 border-blue-700">
              <span>⚡</span>
              <span className="text-sm">FUNCIONA</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal de login */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 max-w-full">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">🔧 Acceso Administrador</h2>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña de administrador
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ingresa: admin123"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold"
                  >
                    Acceder
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Indicador de edición */}
      {isEditMode && (
        <div className="fixed top-20 left-4 z-50 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg font-bold">
          ✏️ <strong>MODO EDICIÓN ACTIVO</strong> - Haz clic en los textos
        </div>
      )}

      {/* Debug visual */}
      <div className="fixed bottom-4 right-4 z-50 bg-black text-white px-3 py-2 rounded text-xs font-mono">
        Admin: {isAdmin ? '✅' : '❌'} | Edit: {isEditMode ? '✅' : '❌'}
      </div>
    </>
  );
};

export default WorkingAdmin;
