import React, { useState, useRef } from 'react';

const RichTextEditor = ({ 
  value, 
  onChange, 
  onClose,
  isEditMode 
}) => {
  const editorRef = useRef(null);
  const [currentStyle, setCurrentStyle] = useState('paragraph');

  const applyStyle = (style, value = '') => {
    document.execCommand(style, false, value);
    editorRef.current.focus();
  };

  const handleSave = () => {
    onChange(editorRef.current.innerHTML);
    onClose();
  };

  const toolbarButtons = [
    { label: 'B', style: 'bold', title: 'Negrita' },
    { label: 'I', style: 'italic', title: 'Itálica' },
    { label: 'U', style: 'underline', title: 'Subrayado' },
    { label: 'S', style: 'strikeThrough', title: 'Tachado' },
    { label: 'H1', style: 'formatBlock', value: '<h1>', title: 'Título 1' },
    { label: 'H2', style: 'formatBlock', value: '<h2>', title: 'Título 2' },
    { label: 'H3', style: 'formatBlock', value: '<h3>', title: 'Título 3' },
    { label: 'P', style: 'formatBlock', value: '<p>', title: 'Párrafo' },
    { label: '🔗', style: 'createLink', value: prompt('Ingresa la URL:'), title: 'Enlace' },
    { label: '📄', style: 'insertUnorderedList', title: 'Lista' },
    { label: '1.', style: 'insertOrderedList', title: 'Lista numerada' },
  ];

  const colorOptions = [
    '#000000', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', 
    '#0891b2', '#4f46e5', '#7c3aed', '#db2777', '#475569'
  ];

  const fontSizeOptions = [
    '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-green-700">📝 Editor de Texto Enriquecido</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">×</button>
        </div>

        {/* Barra de herramientas */}
        <div className="border-b p-3 bg-gray-50 space-y-2">
          {/* Estilos básicos */}
          <div className="flex flex-wrap gap-1">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => applyStyle(button.style, button.value)}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                title={button.title}
              >
                {button.label}
              </button>
            ))}
          </div>

          {/* Colores */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Color:</span>
            <div className="flex gap-1">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => applyStyle('foreColor', color)}
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Tamaño de fuente */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tamaño:</span>
            <select 
              onChange={(e) => applyStyle('fontSize', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {fontSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Fuente */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Fuente:</span>
            <select 
              onChange={(e) => applyStyle('fontName', e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="system-ui">System UI</option>
            </select>
          </div>
        </div>

        {/* Área de edición */}
        <div className="flex-1 p-4">
          <div
            ref={editorRef}
            contentEditable
            dangerouslySetInnerHTML={{ __html: value }}
            className="w-full h-full border border-gray-300 rounded-lg p-4 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ 
              minHeight: '300px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
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
            Guardar Texto
          </button>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;