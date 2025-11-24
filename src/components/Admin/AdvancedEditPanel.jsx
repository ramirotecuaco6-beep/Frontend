import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ImageCarouselEditor from './ImageCarouselEditor';
import RichTextEditor from './RichTextEditor';

const AdvancedEditPanel = ({ isOpen, onClose, currentContent }) => {
  const { theme, updateTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('content');
  const [showCarouselEditor, setShowCarouselEditor] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [editingText, setEditingText] = useState('');

  const updateColor = (colorType, value) => {
    updateTheme({
      ...theme,
      colors: {
        ...theme.colors,
        [colorType]: value
      }
    });
  };

  const updateTypography = (type, value) => {
    updateTheme({
      ...theme,
      typography: {
        ...theme.typography,
        [type]: value
      }
    });
  };

  const tabs = [
    { id: 'content', name: '📝 Contenido', icon: '📝' },
    { id: 'media', name: '🖼️ Multimedia', icon: '🖼️' },
    { id: 'design', name: '🎨 Diseño', icon: '🎨' },
    { id: 'layout', name: '📐 Diseño', icon: '📐' },
    { id: 'advanced', name: '⚙️ Avanzado', icon: '⚙️' }
  ];

  return (
    <>
      {/* Panel principal */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white rounded-2xl shadow-xl w-11/12 h-5/6 flex flex-col transform transition-transform duration-300 scale-100">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-green-700">🎛️ Panel de Control Avanzado</h2>
            <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">×</button>
          </div>

          {/* Tabs */}
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'content' && (
              <ContentTab 
                onEditCarousel={() => setShowCarouselEditor(true)}
                onEditText={(text) => {
                  setEditingText(text);
                  setShowTextEditor(true);
                }}
              />
            )}
            
            {activeTab === 'media' && <MediaTab />}
            
            {activeTab === 'design' && (
              <DesignTab 
                theme={theme}
                updateColor={updateColor}
                updateTypography={updateTypography}
              />
            )}
            
            {activeTab === 'layout' && <LayoutTab theme={theme} />}
            
            {activeTab === 'advanced' && <AdvancedTab />}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Modo Desarrollador Activado
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('app_theme');
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Restablecer Todo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editores modales */}
      {showCarouselEditor && (
        <ImageCarouselEditor
          images={currentContent?.carouselImages}
          onSave={(images) => {
            console.log('Guardar carousel:', images);
            setShowCarouselEditor(false);
          }}
          onClose={() => setShowCarouselEditor(false)}
        />
      )}

      {showTextEditor && (
        <RichTextEditor
          value={editingText}
          onChange={(newText) => {
            console.log('Nuevo texto:', newText);
            setShowTextEditor(false);
          }}
          onClose={() => setShowTextEditor(false)}
        />
      )}
    </>
  );
};

// Componentes de las pestañas (simplificados para este ejemplo)
const ContentTab = ({ onEditCarousel, onEditText }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <button 
        onClick={onEditCarousel}
        className="p-6 border-2 border-dashed border-green-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors text-left"
      >
        <div className="text-3xl mb-2">🎠</div>
        <h3 className="font-semibold mb-1">Editor de Carrusel</h3>
        <p className="text-sm text-gray-600">Agrega, elimina y reorganiza imágenes del carrusel</p>
      </button>
      
      <button 
        onClick={() => onEditText('<p>Edita tu texto aquí...</p>')}
        className="p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
      >
        <div className="text-3xl mb-2">📝</div>
        <h3 className="font-semibold mb-1">Editor de Texto</h3>
        <p className="text-sm text-gray-600">Edita texto con formato avanzado</p>
      </button>
    </div>
  </div>
);

const DesignTab = ({ theme, updateColor, updateTypography }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">🎨 Paleta de Colores</h3>
      <div className="grid grid-cols-2 gap-4">
        <ColorPicker 
          label="Color Principal" 
          value={theme.colors.primary}
          onChange={(color) => updateColor('primary', color)}
        />
        <ColorPicker 
          label="Color Secundario" 
          value={theme.colors.secondary}
          onChange={(color) => updateColor('secondary', color)}
        />
        <ColorPicker 
          label="Color de Acento" 
          value={theme.colors.accent}
          onChange={(color) => updateColor('accent', color)}
        />
        <ColorPicker 
          label="Color de Fondo" 
          value={theme.colors.background}
          onChange={(color) => updateColor('background', color)}
        />
      </div>
    </div>
  </div>
);

const ColorPicker = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <div className="flex gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-12 rounded cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-lg font-mono text-sm"
      />
    </div>
  </div>
);

const MediaTab = () => <div>Media Tab Content</div>;
const LayoutTab = () => <div>Layout Tab Content</div>;
const AdvancedTab = () => <div>Advanced Tab Content</div>;

export default AdvancedEditPanel;