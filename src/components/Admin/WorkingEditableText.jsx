import React, { useState } from 'react';
import { useGlobalState } from '../../hooks/useGlobalState';

const WorkingEditableText = ({ 
  children, 
  elementKey, 
  className = '', 
  as: Component = 'div'
}) => {
  const { isEditMode, content, updateContent } = useGlobalState();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content[elementKey] || children);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      console.log('📝 Iniciando edición para:', elementKey);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    console.log('💾 Guardando:', elementKey, text);
    updateContent(elementKey, text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log('❌ Cancelando edición');
    setText(content[elementKey] || children);
    setIsEditing(false);
  };

  if (isEditMode && isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Editando: <code className="bg-gray-100 px-2 py-1 rounded">{elementKey}</code>
          </h3>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-gray-900 resize-none bg-white text-lg"
            rows="6"
            autoFocus
            placeholder="Escribe tu contenido aquí..."
          />
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              💡 <strong>Atajos:</strong> Ctrl+Enter = Guardar • Esc = Cancelar
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600"
              >
                ❌ Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
              >
                ✅ Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showBorder = isEditMode && !isEditing;

  return (
    <Component
      className={`${className} ${showBorder ? 'cursor-pointer border-2 border-dashed border-yellow-400 rounded-lg p-2 m-1 hover:bg-yellow-50 transition-all relative' : ''}`}
      onClick={handleClick}
    >
      {content[elementKey] || children}
      
      {showBorder && (
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
          ✏️
        </span>
      )}
    </Component>
  );
};

export default WorkingEditableText;