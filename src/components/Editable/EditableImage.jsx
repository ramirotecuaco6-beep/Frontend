import React, { useState, useRef, useEffect } from 'react';
import { useEdit } from '../../context/EditContext';

const EditableText = ({ 
  children, 
  elementKey, 
  className = '', 
  as: Component = 'div',
  ...props 
}) => {
  const { isEditMode, content, updateContent } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content[elementKey] || children);
  const textareaRef = useRef(null);

  // Actualizar texto cuando cambia el contenido
  useEffect(() => {
    if (content[elementKey] !== undefined) {
      setText(content[elementKey]);
    }
  }, [content, elementKey]);

  const handleClick = (e) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    updateContent(elementKey, text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(content[elementKey] || children);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Si estamos en modo edición pero no editando este elemento
  const showEditBorder = isEditMode && !isEditing;

  if (isEditMode && isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Editando: <code className="bg-gray-100 px-2 py-1 rounded">{elementKey}</code>
          </h3>
          
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
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

  return (
    <>
      <Component
        className={`
          ${className} 
          ${showEditBorder ? 'editable-element cursor-pointer border-2 border-dashed border-yellow-400 rounded-lg p-2 m-1 hover:bg-yellow-50 transition-all relative' : ''}
        `}
        onClick={handleClick}
        {...props}
      >
        {content[elementKey] || children}
        
        {showEditBorder && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
            ✏️
          </span>
        )}
      </Component>
    </>
  );
};

export default EditableText;