import React, { useState } from 'react';
import MediaManager from './MediaManager';

const EnhancedCarouselEditor = ({ items: initialItems, onSave, onClose }) => {
  const [items, setItems] = useState(initialItems || []);
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [carouselSettings, setCarouselSettings] = useState({
    autoplay: true,
    interval: 4000,
    showIndicators: true,
    showControls: true,
    transition: 'slide',
    height: '20rem'
  });

  const handleMediaSelect = (selectedMedia) => {
    const newItems = selectedMedia.map(media => ({
      id: media.id,
      type: media.type,
      url: media.url,
      alt: media.alt || media.title,
      title: media.title,
      description: media.description,
      thumbnail: media.thumbnail,
      duration: media.duration
    }));
    
    setItems([...items, ...newItems]);
    setShowMediaManager(false);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const moveItem = (fromIndex, toIndex) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  const handleSave = () => {
    onSave({
      items,
      settings: carouselSettings
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl h-5/6 flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-green-700">🎠 Editor de Carrusel Avanzado</h2>
            <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">×</button>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-hidden">
            {/* Panel de configuración */}
            <div className="space-y-6 overflow-y-auto">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">⚙️ Configuración del Carrusel</h3>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={carouselSettings.autoplay}
                        onChange={(e) => setCarouselSettings(prev => ({
                          ...prev,
                          autoplay: e.target.checked
                        }))}
                      />
                      <span>Autoplay</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Intervalo (ms)
                    </label>
                    <input
                      type="number"
                      value={carouselSettings.interval}
                      onChange={(e) => setCarouselSettings(prev => ({
                        ...prev,
                        interval: parseInt(e.target.value)
                      }))}
                      className="w-full p-2 border rounded-lg"
                      min="1000"
                      step="500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Altura del carrusel
                    </label>
                    <select
                      value={carouselSettings.height}
                      onChange={(e) => setCarouselSettings(prev => ({
                        ...prev,
                        height: e.target.value
                      }))}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="16rem">Pequeño (16rem)</option>
                      <option value="20rem">Mediano (20rem)</option>
                      <option value="24rem">Grande (24rem)</option>
                      <option value="28rem">Extra Grande (28rem)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowMediaManager(true)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <span>📚</span>
                Abrir Gestor de Multimedia
              </button>

              <div className="space-y-3">
                <h4 className="font-semibold">📋 Elementos del Carrusel ({items.length})</h4>
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {item.type === 'image' ? '🖼️' : '🎥'}
                      </span>
                      <span className="flex-1 text-sm truncate">{item.title}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveItem(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-30"
                        >
                          ⬆️
                        </button>
                        <button
                          onClick={() => moveItem(index, Math.min(items.length - 1, index + 1))}
                          disabled={index === items.length - 1}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-30"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      placeholder="Título"
                      className="w-full p-1 border rounded text-sm mb-1"
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Descripción"
                      rows="2"
                      className="w-full p-1 border rounded text-sm resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vista previa */}
            <div className="col-span-2 bg-gray-100 rounded-lg p-4 overflow-y-auto">
              <h3 className="font-semibold mb-3">👁️ Vista Previa del Carrusel</h3>
              <div className="bg-white rounded-lg shadow-inner p-4">
                <div 
                  className="rounded-lg overflow-hidden mb-4 bg-black"
                  style={{ height: carouselSettings.height }}
                >
                  {items.length > 0 ? (
                    <div className="relative w-full h-full">
                      {items.map((item, index) => (
                        <div
                          key={item.id}
                          className={`absolute inset-0 transition-opacity duration-500 ${
                            index === 0 ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.alt}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                              <div className="text-center text-white">
                                <div className="text-4xl mb-2">🎥</div>
                                <p className="text-lg font-semibold">{item.title}</p>
                                <p className="text-sm opacity-75">{item.description}</p>
                                {item.duration && (
                                  <p className="text-xs mt-2">Duración: {item.duration}</p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Overlay de información */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                            <h4 className="font-bold text-lg">{item.title}</h4>
                            <p className="text-sm opacity-90">{item.description}</p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Indicadores */}
                      {carouselSettings.showIndicators && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                          {items.map((_, index) => (
                            <button
                              key={index}
                              className={`w-3 h-3 rounded-full transition-all ${
                                index === 0 ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎠</div>
                        <p>No hay elementos en el carrusel</p>
                        <p className="text-sm">Agrega algunas imágenes o videos</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Total de elementos:</strong> {items.length}</p>
                  <p><strong>Imágenes:</strong> {items.filter(i => i.type === 'image').length}</p>
                  <p><strong>Videos:</strong> {items.filter(i => i.type === 'video').length}</p>
                  <p><strong>Configuración:</strong> {
                    carouselSettings.autoplay ? `Autoplay cada ${carouselSettings.interval}ms` : 'Manual'
                  }</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Guardar Carrusel
            </button>
          </div>
        </div>
      </div>

      {/* Modal del gestor de multimedia */}
      {showMediaManager && (
        <MediaManager
          onMediaSelect={handleMediaSelect}
          onClose={() => setShowMediaManager(false)}
          currentSelection={items}
        />
      )}
    </>
  );
};

export default EnhancedCarouselEditor;