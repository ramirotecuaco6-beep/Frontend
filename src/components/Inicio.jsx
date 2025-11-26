import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

// Importa tus imágenes locales
import libresDia from '../assets/libres-dia.jpg';
import libresNoche from '../assets/libres-noche.jpg';

export default function Inicio() {
  const { darkMode } = useDarkMode();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Usa tus imágenes locales
  const backgroundImages = {
    light: libresDia,
    dark: libresNoche
  };

  return (
    <section 
      id="inicio" 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        darkMode 
          ? 'bg-gray-900' 
          : 'bg-primary-900'
      }`}
      style={{
        backgroundImage: `url(${darkMode ? backgroundImages.dark : backgroundImages.light})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay para mejorar legibilidad del texto */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        darkMode 
          ? 'bg-gray-900/70' 
          : 'bg-primary-900/50'
      }`}></div>

      {/* Efectos de partículas sutiles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Partículas para modo claro */}
        {!darkMode && (
          <>
            <div className="absolute top-1/4 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-white/20 rounded-full animate-float-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-4 h-4 sm:w-6 sm:h-6 bg-white/15 rounded-full animate-float animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 sm:w-3 sm:h-3 bg-white/25 rounded-full animate-float animation-delay-4000"></div>
          </>
        )}
        
        {/* Partículas para modo oscuro */}
        {darkMode && (
          <>
            <div className="absolute top-1/4 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-primary-400/30 rounded-full animate-float-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-4 h-4 sm:w-6 sm:h-6 bg-accent-400/25 rounded-full animate-float animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 sm:w-3 sm:h-3 bg-primary-300/40 rounded-full animate-float animation-delay-4000"></div>
          </>
        )}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Badge de bienvenida temporal */}
        {showWelcome && (
          <div className={`inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full backdrop-blur-sm border mb-6 sm:mb-8 transition-all duration-500 animate-fade-in ${
            darkMode 
              ? 'bg-gray-800/70 border-gray-600 text-primary-300' 
              : 'bg-white/20 border-white/30 text-white'
          }`}>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-2 sm:mr-3 animate-pulse"></span>
            <span className="font-semibold text-xs sm:text-sm">
              {darkMode ? '🌙 Bienvenido al modo nocturno' : '☀️ Bienvenido a la aventura'}
            </span>
          </div>
        )}

        {/* Título principal */}
        <h1 className={`font-black mb-4 sm:mb-6 leading-tight transition-all duration-500 ${
          darkMode 
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-accent-300 to-primary-400' 
            : 'text-white drop-shadow-2xl'
        } text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl`}>
          Descubre<br className="hidden sm:block" />
          <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl block mt-2 sm:mt-4">Libres</span>
        </h1>
        
        {/* Descripción */}
        <p className={`leading-relaxed max-w-4xl mx-auto mb-8 sm:mb-12 transition-all duration-500 drop-shadow-2xl ${
          darkMode 
            ? 'text-gray-200' 
            : 'text-white'
        } text-base sm:text-lg md:text-xl lg:text-2xl px-2`}>
          Donde cada sendero cuenta una historia y cada experiencia se convierte en un recuerdo eterno.
          <span className={`block mt-2 sm:mt-3 md:mt-4 ${
            darkMode ? 'text-gray-300' : 'text-white/90'
          } text-sm sm:text-base md:text-lg lg:text-xl`}>
            Explora la naturaleza en su estado más puro
          </span>
        </p>
        
        {/* Stats */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-md border transition-all duration-500 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-600' 
            : 'bg-white/20 border-white/30'
        }`}>
          <div className="text-center">
            <div className={`font-bold mb-1 sm:mb-2 drop-shadow-2xl ${
              darkMode ? 'text-primary-300' : 'text-white'
            } text-xl sm:text-2xl md:text-3xl`}>5+</div>
            <div className={`text-xs sm:text-sm ${
              darkMode ? 'text-gray-300' : 'text-white/90'
            }`}>Lugares Únicos</div>
          </div>
          <div className="text-center">
            <div className={`font-bold mb-1 sm:mb-2 drop-shadow-2xl ${
              darkMode ? 'text-accent-300' : 'text-white'
            } text-xl sm:text-2xl md:text-3xl`}>1000+</div>
            <div className={`text-xs sm:text-sm ${
              darkMode ? 'text-gray-300' : 'text-white/90'
            }`}>Aventureros</div>
          </div>
          <div className="text-center">
            <div className={`font-bold mb-1 sm:mb-2 drop-shadow-2xl ${
              darkMode ? 'text-primary-300' : 'text-white'
            } text-xl sm:text-2xl md:text-3xl`}>15+</div>
            <div className={`text-xs sm:text-sm ${
              darkMode ? 'text-gray-300' : 'text-white/90'
            }`}>Años Experiencia</div>
          </div>
          <div className="text-center">
            <div className={`font-bold mb-1 sm:mb-2 drop-shadow-2xl ${
              darkMode ? 'text-accent-300' : 'text-white'
            } text-xl sm:text-2xl md:text-3xl`}>4.9★</div>
            <div className={`text-xs sm:text-sm ${
              darkMode ? 'text-gray-300' : 'text-white/90'
            }`}>Rating</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2">
          <div className={`w-5 h-8 sm:w-6 sm:h-10 border-2 rounded-full flex justify-center transition-colors duration-300 backdrop-blur-sm ${
            darkMode ? 'border-primary-400' : 'border-white'
          }`}>
            <div className={`w-1 h-2 sm:h-3 rounded-full mt-1 sm:mt-2 animate-bounce transition-colors duration-300 ${
              darkMode ? 'bg-primary-400' : 'bg-white'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Efectos de gradiente adicionales */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 sm:h-48 bg-gradient-to-t transition-all duration-1000 ${
        darkMode 
          ? 'from-gray-900/80 to-transparent' 
          : 'from-primary-900/60 to-transparent'
      }`}></div>
      <div className={`absolute top-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-b transition-all duration-1000 ${
        darkMode 
          ? 'from-gray-900/80 to-transparent' 
          : 'from-primary-900/60 to-transparent'
      }`}></div>
    </section>
  );
}