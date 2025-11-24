// src/components/PlaceInfo/ImageCarousel.jsx
import React from "react";
import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";

const ImageCarousel = ({ media, currentSlide, setCurrentSlide }) => {
  const { darkMode } = useDarkMode();

  // Validar y procesar medios (fotos y videos)
  const mediosValidos = Array.isArray(media) 
    ? media.filter(item => {
        if (!item || typeof item !== 'string') return false;
        
        // Verificar si es video (extensiones comunes)
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        const isVideo = videoExtensions.some(ext => 
          item.toLowerCase().includes(ext) || item.includes('video')
        );
        
        // Verificar si es imagen (extensiones comunes o URLs de imagen)
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const isImage = imageExtensions.some(ext => 
          item.toLowerCase().includes(ext)
        ) || item.includes('image') || item.startsWith('data:image');
        
        return isVideo || isImage;
      }).map(url => ({
        url: url.trim(),
        type: url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.webm') || 
              url.toLowerCase().includes('.ogg') || url.toLowerCase().includes('.mov') ||
              url.toLowerCase().includes('.avi') || url.includes('video') ? 'video' : 'image'
      }))
    : [];

  if (mediosValidos.length === 0) {
    return (
      <motion.div 
        className={`relative w-full h-96 rounded-2xl overflow-hidden shadow-xl mb-6 transition-all duration-300 ${
          darkMode ? 'border border-gray-700' : ''
        }`}
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <span className={`transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No hay medios disponibles
          </span>
        </div>
      </motion.div>
    );
  }

  // Función para obtener URL segura
  const getSafeMediaUrl = (url) => {
    if (!url || typeof url !== 'string') {
      return '/placeholder.jpg';
    }
    
    if (url.includes('placeimg.com') && url.includes('water')) {
      return '/placeholder.jpg';
    }
    
    return url;
  };

  // Renderizar el medio actual (imagen o video)
  const renderCurrentMedia = () => {
    const currentMedia = mediosValidos[currentSlide];
    
    if (currentMedia.type === 'video') {
      return (
        <video
          key={currentMedia.url}
          className="w-full h-full object-cover"
          controls
          muted
          autoPlay
          loop
          playsInline
          onError={(e) => {
            console.error('Error cargando video:', currentMedia.url);
            e.target.style.display = 'none';
          }}
        >
          <source src={getSafeMediaUrl(currentMedia.url)} type="video/mp4" />
          <source src={getSafeMediaUrl(currentMedia.url)} type="video/webm" />
          <source src={getSafeMediaUrl(currentMedia.url)} type="video/ogg" />
          Tu navegador no soporta el elemento de video.
        </video>
      );
    } else {
      return (
        <img
          src={getSafeMediaUrl(currentMedia.url)}
          alt={`Vista ${currentSlide + 1} del lugar`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      );
    }
  };

  // Ícono para el tipo de medio
  const getMediaIcon = (type, index) => {
    if (type === 'video') {
      return (
        <div className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-black/70 text-white'
        }`}>
          🎥
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className={`relative w-full h-96 rounded-2xl overflow-hidden shadow-xl mb-6 transition-all duration-300 ${
        darkMode ? 'border border-gray-700' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Medio actual (imagen o video) */}
      {renderCurrentMedia()}

      {/* Overlay para mejor contraste */}
      {darkMode && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      )}

      {/* Controles de navegación */}
      {mediosValidos.length > 1 && (
        <>
          {/* Botones de navegación */}
          <button
            onClick={() => setCurrentSlide((currentSlide - 1 + mediosValidos.length) % mediosValidos.length)}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 ${
              darkMode 
                ? 'bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-600' 
                : 'bg-white/80 hover:bg-white text-gray-800'
            }`}
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentSlide((currentSlide + 1) % mediosValidos.length)}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 ${
              darkMode 
                ? 'bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-600' 
                : 'bg-white/80 hover:bg-white text-gray-800'
            }`}
          >
            ›
          </button>

          {/* Miniaturas con indicadores de tipo */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {mediosValidos.map((media, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? darkMode 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white shadow-md'
                    : darkMode 
                      ? 'bg-white/40 hover:bg-white/60' 
                      : 'bg-white/50 hover:bg-white/80'
                }`}
                title={media.type === 'video' ? 'Video' : 'Imagen'}
              >
                {getMediaIcon(media.type, index)}
              </button>
            ))}
          </div>

          {/* Contador e indicador de tipo */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
            darkMode 
              ? 'bg-gray-800/80 text-white border border-gray-600' 
              : 'bg-black/50 text-white'
          }`}>
            <div className="flex items-center gap-2">
              <span>
                {currentSlide + 1} / {mediosValidos.length}
              </span>
              <span className={`text-xs ${
                mediosValidos[currentSlide].type === 'video' ? 'text-blue-300' : 'text-green-300'
              }`}>
                {mediosValidos[currentSlide].type === 'video' ? '🎥' : '🖼️'}
              </span>
            </div>
          </div>

          {/* Indicador de modo oscuro */}
          <div className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-semibold transition-all duration-300 z-10 ${
            darkMode 
              ? 'bg-gray-800/80 text-green-400 border border-gray-600' 
              : 'bg-white/80 text-green-700'
          }`}>
            {darkMode ? '🌙' : '☀️'} {mediosValidos[currentSlide].type === 'video' ? 'Video' : 'Galería'}
          </div>
        </>
      )}

      {/* Efecto de brillo en los bordes */}
      {darkMode && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-white/5"></div>
        </div>
      )}
    </motion.div>
  );
};

export default ImageCarousel;