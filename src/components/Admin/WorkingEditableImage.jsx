import React from 'react';
import { useGlobalState } from '../hooks/useGlobalState';

const WorkingEditableImage = ({ 
  src, 
  fieldKey, 
  alt = '', 
  className = '',
  ...props 
}) => {
  const { isEditMode, content, updateContent } = useGlobalState();

  const handleEdit = () => {
    if (!isEditMode) return;
    
    const newImage = prompt('Ingresa la nueva URL de la imagen:', content[fieldKey] || src);
    if (newImage !== null) {
      updateContent(fieldKey, newImage);
    }
  };

  const imageUrl = content[fieldKey] || src;

  return (
    <div 
      onClick={handleEdit}
      className={`relative ${isEditMode ? 'cursor-pointer border-2 border-dashed border-blue-400' : ''}`}
    >
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        {...props}
      />
      {isEditMode && (
        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
            ✏️ Editar imagen
          </span>
        </div>
      )}
    </div>
  );
};

export default WorkingEditableImage;