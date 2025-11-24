import React, { useState } from 'react';

const ImageCarouselEditor = ({ 
  images: initialImages, 
  onSave, 
  onClose 
}) => {
  const [images, setImages] = useState(initialImages || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, {
        url: newImageUrl,
        alt: 'Nueva imagen',
        title: 'Título de imagen',
        description: 'Descripción de la imagen'
      }]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index, field, value) => {
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    );
    setImages(updatedImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  const handleSave = () => {
    onSave(images);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-green-700">🎠 Editor de Carrusel</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden">
          {/* Panel de edición */}
          <div className="space-y-4 overflow-y-auto">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">➕ Agregar Nueva Imagen</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL de la imagen..."
                  className="flex-1 p-2 border rounded-lg"
                />
                <button 
                  onClick={addImage}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                También puedes arrastrar imágenes aquí
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">🖼️ Imágenes del Carrusel</h3>
              {images.map((image, index) => (
                <div key={index} className="border rounded-lg p-3 bg-white">
                  <div className="flex gap-3">
                    <img 
                      src={image.url} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => updateImage(index, 'alt', e.target.value)}
                        placeholder="Texto alternativo"
                        className="w-full p-1 border rounded text-sm"
                      />
                      <input
                        type="text"
                        value={image.title}
                        onChange={(e) => updateImage(index, 'title', e.target.value)}
                        placeholder="Título"
                        className="w-full p-1 border rounded text-sm"
                      />
                      <textarea
                        value={image.description}
                        onChange={(e) => updateImage(index, 'description', e.target.value)}
                        placeholder="Descripción"
                        rows="2"
                        className="w-full p-1 border rounded text-sm resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveImage(index, Math.max(0, index - 1))}
                        className="text-gray-600 hover:text-gray-800"
                        disabled={index === 0}
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                        className="text-gray-600 hover:text-gray-800"
                        disabled={index === images.length - 1}
                      >
                        ⬇️
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vista previa */}
          <div className="bg-gray-100 rounded-lg p-4 overflow-y-auto">
            <h3 className="font-semibold mb-3">👁️ Vista Previa</h3>
            <div className="bg-white rounded-lg shadow-inner p-4">
              <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                {images.length > 0 ? (
                  <>
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          index === 0 ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                          <h4 className="font-bold">{image.title}</h4>
                          <p className="text-sm">{image.description}</p>
                        </div>
                      </div>
                    ))}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No hay imágenes en el carrusel
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Total de imágenes:</strong> {images.length}</p>
                <p><strong>Resolución recomendada:</strong> 1200×600 px</p>
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
  );
};

export default ImageCarouselEditor;