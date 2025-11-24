import React, { useState, useRef } from 'react';

const MediaManager = ({ onMediaSelect, onClose, currentSelection = [] }) => {
  const [media, setMedia] = useState([
    // Ejemplos iniciales
    {
      id: 1,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1545337267-5c4bcd042b9d?auto=format&fit=crop&w=800&q=80',
      alt: 'Grutas de Zapotitlán',
      title: 'Entrada a las grutas',
      description: 'Formaciones rocosas únicas',
      size: '2.1 MB',
      dimensions: '1200x800'
    },
    {
      id: 2,
      type: 'video',
      url: 'https://example.com/video1.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
      title: 'Tour por el bosque',
      description: 'Recorrido virtual por los senderos',
      duration: '2:30',
      size: '15.2 MB'
    },
    {
      id: 3,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80',
      alt: 'Reserva de aves',
      title: 'Santuario de aves migratorias',
      description: 'Hábitat natural protegido',
      size: '1.8 MB',
      dimensions: '1200x800'
    }
  ]);
  
  const [selectedMedia, setSelectedMedia] = useState(currentSelection);
  const [activeTab, setActiveTab] = useState('all');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const mediaTypes = [
    { id: 'all', name: '📁 Todos', icon: '📁' },
    { id: 'image', name: '🖼️ Imágenes', icon: '🖼️' },
    { id: 'video', name: '🎥 Videos', icon: '🎥' },
    { id: 'upload', name: '📤 Subir', icon: '📤' }
  ];

  const filteredMedia = activeTab === 'all' 
    ? media 
    : media.filter(item => item.type === activeTab);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setUploading(true);

    for (const file of files) {
      // Simular subida a cloudinary o servidor
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'file';
      
      // Crear URL local para previsualización
      const objectUrl = URL.createObjectURL(file);

      const newMedia = {
        id: Date.now() + Math.random(),
        type: fileType,
        url: objectUrl, // En producción sería la URL del servidor
        title: file.name.replace(/\.[^/.]+$/, ""), // Remover extensión
        description: '',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        dimensions: fileType === 'image' ? '1200x800' : null,
        duration: fileType === 'video' ? '0:00' : null,
        file: file // Guardar referencia al archivo
      };

      setMedia(prev => [newMedia, ...prev]);
    }

    setUploading(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  const toggleMediaSelection = (mediaItem) => {
    setSelectedMedia(prev => {
      const isSelected = prev.some(item => item.id === mediaItem.id);
      if (isSelected) {
        return prev.filter(item => item.id !== mediaItem.id);
      } else {
        return [...prev, mediaItem];
      }
    });
  };

  const removeMedia = (id) => {
    setMedia(prev => prev.filter(item => item.id !== id));
    setSelectedMedia(prev => prev.filter(item => item.id !== id));
  };

  const updateMediaInfo = (id, field, value) => {
    setMedia(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleInsert = () => {
    onMediaSelect(selectedMedia);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-green-700">📚 Gestor de Multimedia</h2>
            <p className="text-sm text-gray-600">Administra imágenes, videos y archivos</p>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">×</button>
        </div>

        {/* Tabs y Controles */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <div className="flex gap-1">
            {mediaTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === type.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {selectedMedia.length} seleccionados
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <span>📤</span>
              Subir Archivos
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-6 p-6 overflow-hidden">
          {/* Panel lateral - Filtros y info */}
          <div className="space-y-6">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-4xl mb-2">📁</div>
              <p className="text-sm text-gray-600 mb-2">
                Arrastra archivos aquí o haz clic para subir
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, MP4, WEBM hasta 50MB
              </p>
            </div>

            {uploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Subiendo archivos...
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📊 Estadísticas</h4>
              <div className="space-y-1 text-sm">
                <p>Imágenes: {media.filter(m => m.type === 'image').length}</p>
                <p>Videos: {media.filter(m => m.type === 'video').length}</p>
                <p>Total: {media.length} archivos</p>
              </div>
            </div>
          </div>

          {/* Grid de multimedia */}
          <div className="col-span-3 overflow-y-auto">
            {filteredMedia.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📁</div>
                <p>No hay archivos multimedia</p>
                <p className="text-sm">Sube algunos archivos para comenzar</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredMedia.map(item => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    isSelected={selectedMedia.some(s => s.id === item.id)}
                    onSelect={() => toggleMediaSelection(item)}
                    onRemove={() => removeMedia(item.id)}
                    onUpdate={(field, value) => updateMediaInfo(item.id, field, value)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedMedia.length} elementos seleccionados
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleInsert}
              disabled={selectedMedia.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Insertar Seleccionados ({selectedMedia.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaCard = ({ item, isSelected, onSelect, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div 
      className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
        isSelected 
          ? 'border-green-500 ring-2 ring-green-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Preview */}
      <div className="relative aspect-video bg-gray-100">
        {item.type === 'image' ? (
          <img 
            src={item.url} 
            alt={item.alt}
            className="w-full h-full object-cover"
          />
        ) : item.type === 'video' ? (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="text-white text-center">
              <div className="text-3xl mb-2">🎥</div>
              <p className="text-sm">{item.duration}</p>
            </div>
          </div>
        ) : null}
        
        {/* Badge de tipo */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {item.type === 'image' ? '🖼️' : '🎥'}
        </div>

        {/* Botones de acción */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700"
          >
            🗑️
          </button>
        </div>

        {/* Checkbox de selección */}
        <div className="absolute bottom-2 left-2">
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
            isSelected 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'bg-white border-gray-300'
          }`}>
            {isSelected && '✓'}
          </div>
        </div>
      </div>

      {/* Información editable */}
      <div className="p-3">
        {isEditing ? (
          <div className="space-y-2" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              value={item.title}
              onChange={(e) => onUpdate('title', e.target.value)}
              className="w-full p-1 border rounded text-sm"
              placeholder="Título"
            />
            <textarea
              value={item.description}
              onChange={(e) => onUpdate('description', e.target.value)}
              className="w-full p-1 border rounded text-sm resize-none"
              placeholder="Descripción"
              rows="2"
            />
            <input
              type="text"
              value={item.alt || ''}
              onChange={(e) => onUpdate('alt', e.target.value)}
              className="w-full p-1 border rounded text-sm"
              placeholder="Texto alternativo"
            />
            <button
              onClick={() => setIsEditing(false)}
              className="w-full bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        ) : (
          <>
            <h4 className="font-semibold text-sm truncate">{item.title}</h4>
            <p className="text-xs text-gray-600 truncate">{item.description}</p>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{item.size}</span>
              {item.dimensions && <span>{item.dimensions}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaManager;