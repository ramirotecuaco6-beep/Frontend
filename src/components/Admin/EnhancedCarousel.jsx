import React, { useState, useEffect } from 'react';

const EnhancedCarousel = ({ items, settings = {} }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(settings.autoplay !== false);

  const defaultSettings = {
    autoplay: true,
    interval: 4000,
    showIndicators: true,
    showControls: true,
    transition: 'slide',
    height: '20rem',
    ...settings
  };

  useEffect(() => {
    if (!defaultSettings.autoplay || !isPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, defaultSettings.interval);

    return () => clearInterval(interval);
  }, [currentIndex, defaultSettings.autoplay, defaultSettings.interval, isPlaying, items.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false); // Pausar al cambiar manualmente
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
    setIsPlaying(false);
  };

  if (!items || items.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center h-64">
        <p className="text-gray-500">No hay elementos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      {/* Carrusel principal */}
      <div 
        className="relative overflow-hidden"
        style={{ height: defaultSettings.height }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            ) : item.type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center text-white p-4">
                  <div className="text-6xl mb-4">🎥</div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-lg opacity-90 mb-4">{item.description}</p>
                  {item.duration && (
                    <p className="text-sm opacity-75">Duración: {item.duration}</p>
                  )}
                  <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Reproducir Video
                  </button>
                </div>
              </div>
            ) : null}
            
            {/* Overlay de información */}
            {(item.title || item.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
                {item.title && (
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-sm opacity-90">{item.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      {defaultSettings.showControls && items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
          >
            ›
          </button>
        </>
      )}

      {/* Indicadores */}
      {defaultSettings.showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  );
};

export default EnhancedCarousel;