import React, { useState, useEffect } from 'react';

// Estado global simple
let isAdmin = false;
let isEditMode = false;
const content = {};

const SimpleAdmin = () => {
  const [_, forceUpdate] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');

  // Cargar estado al iniciar
  useEffect(() => {
    isAdmin = localStorage.getItem('is_admin') === 'true';
    isEditMode = localStorage.getItem('edit_mode') === 'true';
    
    const savedContent = localStorage.getItem('site_content');
    if (savedContent) {
      Object.assign(content, JSON.parse(savedContent));
    }
    
    forceUpdate(n => n + 1);
  }, []);

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
            isEditMode = !isEditMode;
            localStorage.setItem('edit_mode', isEditMode.toString());
            forceUpdate(n => n + 1);
          }
          count = 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const login = () => {
    isAdmin = true;
    isEditMode = true;
    localStorage.setItem('is_admin', 'true');
    localStorage.setItem('edit_mode', 'true');
    setShowLogin(false);
    setPassword('');
    forceUpdate(n => n + 1);
  };

  const logout = () => {
    if (window.confirm('¿Salir del modo administrador?')) {
      isAdmin = false;
      isEditMode = false;
      localStorage.removeItem('is_admin');
      localStorage.removeItem('edit_mode');
      window.location.reload();
    }
  };

  const toggleEdit = () => {
    isEditMode = !isEditMode;
    localStorage.setItem('edit_mode', isEditMode.toString());
    forceUpdate(n => n + 1);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const passwords = ['admin123', 'ecoturismo2024', 'admin', '1234'];
    if (passwords.includes(password)) {
      login();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {!isAdmin ? (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-bold"
          >
            <span>🔧</span>
            Modo Admin
          </button>
        ) : (
          <div className="flex gap-2 bg-white p-2 rounded-lg shadow-lg border-2 border-green-500">
            <button
              onClick={toggleEdit}
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
              onClick={logout}
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
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Contraseña: admin123"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold">
                    Acceder
                  </button>
                  <button type="button" onClick={() => setShowLogin(false)} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-bold">
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

// Exportar las variables globales para que otros componentes las usen
export { isAdmin, isEditMode, content };
export default SimpleAdmin;