import React, { useState, useEffect } from 'react';
import { useEdit } from '../../context/EditContext';

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const saved = localStorage.getItem('is_admin');
      const adminStatus = saved === 'true';
      console.log('🔍 Estado admin:', adminStatus);
      setIsAdmin(adminStatus);
    };

    checkAdminStatus();

    const handleChange = () => {
      console.log('🔄 Evento adminStatusChanged recibido');
      checkAdminStatus();
    };

    window.addEventListener('adminStatusChanged', handleChange);
    return () => window.removeEventListener('adminStatusChanged', handleChange);
  }, []);

  const login = () => {
    console.log('🔑 Ejecutando login');
    localStorage.setItem('is_admin', 'true');
    window.dispatchEvent(new Event('adminStatusChanged'));
  };

  const logout = () => {
    console.log('🚪 Ejecutando logout');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('edit_mode');
    window.dispatchEvent(new Event('adminStatusChanged'));
    setTimeout(() => window.location.reload(), 100);
  };

  return { isAdmin, login, logout };
};

const AdminAccess = () => {
  const { isAdmin, login, logout } = useAdmin();
  const { isEditMode, toggleEditMode } = useEdit();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');

  const handleToggleEdit = () => {
    console.log('🔄 Botón toggle edit clickeado');
    console.log('📊 Estado antes:', { isEditMode });
    toggleEditMode();
    // Verificar cambio después de un momento
    setTimeout(() => {
      console.log('📊 Estado después:', { isEditMode });
    }, 100);
  };

  const handleLogout = () => {
    console.log('🚪 Botón logout clickeado');
    if (window.confirm('¿Salir del modo administrador?')) {
      logout();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const passwords = ['admin123', 'ecoturismo2024', 'admin', '1234'];
    
    if (passwords.includes(password)) {
      console.log('✅ Login exitoso');
      login();
      setShowLogin(false);
      setPassword('');
    } else {
      alert(`Contraseña incorrecta. Prueba con: ${passwords.join(', ')}`);
    }
  };

  console.log('🎯 Render AdminAccess:', { isAdmin, isEditMode });

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {!isAdmin ? (
          <button
            onClick={() => {
              console.log('🔧 Botón Modo Admin clickeado');
              setShowLogin(true);
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-bold"
          >
            <span>🔧</span>
            Modo Admin
          </button>
        ) : (
          <div className="flex gap-2 bg-white p-2 rounded-lg shadow-lg border-2 border-green-500">
            <button
              onClick={handleToggleEdit}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold ${
                isEditMode 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <span>{isEditMode ? '✏️' : '👁️'}</span>
              {isEditMode ? 'Editando' : 'Vista'}
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-bold"
            >
              <span>🚪</span>
              Salir
            </button>
          </div>
        )}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 max-w-full">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">🔧 Acceso Administrador</h2>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ingresa la contraseña"
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

      {isEditMode && (
        <div className="fixed top-20 left-4 z-50 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg font-bold">
          ✏️ MODO EDICIÓN ACTIVO
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50 bg-black text-white px-3 py-2 rounded text-xs font-mono">
        A:{isAdmin ? '✅' : '❌'} E:{isEditMode ? '✅' : '❌'}
      </div>
    </>
  );
};

export default AdminAccess;