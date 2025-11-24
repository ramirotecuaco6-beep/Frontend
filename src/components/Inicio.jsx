import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext'; // ✅ Importar el contexto

export default function Inicio() {
  const { darkMode } = useDarkMode(); // ✅ Obtener el estado del modo oscuro
  const [showWelcome, setShowWelcome] = useState(true);

  // Ocultar el mensaje de bienvenida después de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      id="inicio" 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900' 
          : 'bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900'
      }`}
    >
      {/* Fondo con partículas animadas */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Partículas para modo claro */}
        {!darkMode && (
          <>
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-float-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/15 rounded-full animate-float animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/25 rounded-full animate-float animation-delay-4000"></div>
            <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-white/10 rounded-full animate-float-slow animation-delay-1000"></div>
          </>
        )}
        
        {/* Partículas para modo oscuro */}
        {darkMode && (
          <>
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary-400/30 rounded-full animate-float-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-accent-400/25 rounded-full animate-float animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary-300/40 rounded-full animate-float animation-delay-4000"></div>
            <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-accent-300/20 rounded-full animate-float-slow animation-delay-1000"></div>
          </>
        )}

        {/* Overlay sutil */}
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-primary-900/40' 
            : 'bg-gradient-to-br from-primary-900/40 via-primary-800/30 to-accent-900/30'
        }`}></div>
      </div>

      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]' 
            : 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.2)_1px,transparent_0)] bg-[length:20px_20px]'
        }`}></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Badge de bienvenida temporal */}
        {showWelcome && (
          <div className={`inline-flex items-center px-6 py-3 rounded-full backdrop-blur-sm border mb-8 transition-all duration-500 animate-fade-in ${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700 text-primary-300' 
              : 'bg-white/10 border-white/20 text-white'
          }`}>
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="font-semibold text-sm">
              {darkMode ? '🌙 Bienvenido al modo oscuro' : '☀️ Bienvenido a la aventura'}
            </span>
          </div>
        )}

        {/* Título principal */}
        <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight transition-all duration-500 ${
          darkMode 
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-accent-300 to-primary-400' 
            : 'text-white'
        }`}>
          Descubre<br className="hidden md:block" />
          <span className="text-5xl md:text-7xl lg:text-8xl">Libres</span>
        </h1>
        
        {/* Descripción */}
        <p className={`text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto mb-12 transition-all duration-500 ${
          darkMode 
            ? 'text-gray-200' 
            : 'text-white/90'
        }`}>
          Donde cada sendero cuenta una historia y cada experiencia se convierte en un recuerdo eterno.
          <span className={`block text-lg md:text-xl mt-4 ${
            darkMode ? 'text-gray-300' : 'text-white/80'
          }`}>
            Explora la naturaleza en su estado más puro
          </span>
        </p>
        
        {/* CTA Buttons - Eliminados según solicitud */}

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto p-6 rounded-3xl backdrop-blur-md border transition-all duration-500 ${
          darkMode 
            ? 'bg-gray-800/30 border-gray-700' 
            : 'bg-white/10 border-white/20'
        }`}>
          <div className="text-center">
            <div className={`text-2xl md:text-3xl font-bold mb-2 ${
              darkMode ? 'text-primary-300' : 'text-white'
            }`}>50+</div>
            <div className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-white/80'
            }`}>Lugares Únicos</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl md:text-3xl font-bold mb-2 ${
              darkMode ? 'text-accent-300' : 'text-white'
            }`}>1000+</div>
            <div className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-white/80'
            }`}>Aventureros</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl md:text-3xl font-bold mb-2 ${
              darkMode ? 'text-primary-300' : 'text-white'
            }`}>15+</div>
            <div className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-white/80'
            }`}>Años Experiencia</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl md:text-3xl font-bold mb-2 ${
              darkMode ? 'text-accent-300' : 'text-white'
            }`}>4.9★</div>
            <div className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-white/80'
            }`}>Rating</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center transition-colors duration-300 ${
            darkMode ? 'border-primary-400' : 'border-white'
          }`}>
            <div className={`w-1 h-3 rounded-full mt-2 animate-bounce transition-colors duration-300 ${
              darkMode ? 'bg-primary-400' : 'bg-white'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Efectos de gradiente adicionales */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-current opacity-10"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-current opacity-10"></div>
      
      {/* Efectos de brillo dinámicos */}
      <div className={`absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse-soft transition-all duration-1000 ${
        darkMode ? 'bg-primary-500' : 'bg-white'
      }`}></div>
      <div className={`absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse-soft animation-delay-2000 transition-all duration-1000 ${
        darkMode ? 'bg-accent-500' : 'bg-accent-400'
      }`}></div>
    </section>
  );
}