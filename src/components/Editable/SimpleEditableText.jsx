import React, { useState } from 'react';
import { isEditMode, content } from '../Admin/SimpleAdmin';

const SimpleEditableText = ({ 
  children, 
  elementKey, 
  className = '', 
  as: Component = 'div'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content[elementKey] || children);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    content[elementKey] = text;
    localStorage.setItem('site_content', JSON.stringify(content));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(content[elementKey] || children);
    setIsEditing(false);
  };

  if (isEditMode && isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Editando texto</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-gray-900 resize-none bg-white text-lg"
            rows="6"
            autoFocus
          />
          <div className="flex gap-2 mt-4 justify-end">
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium">
              Cancelar
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium">
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const showBorder = isEditMode && !isEditing;

  return (
    <Component
      className={`${className} ${showBorder ? 'border-2 border-dashed border-yellow-400 rounded-lg p-2 cursor-pointer hover:bg-yellow-50' : ''}`}
      onClick={handleClick}
    >
      {content[elementKey] || children}
      {showBorder && (
        <span className="ml-2 text-yellow-600 text-xs">✏️</span>
      )}
    </Component>
  );
};

export default SimpleEditableText;