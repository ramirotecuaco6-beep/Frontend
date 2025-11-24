import React from 'react';
import { useGlobalState } from '../hooks/useGlobalState';

const WorkingEditableText = ({ 
  children, 
  fieldKey, 
  element: Element = 'span', 
  className = '',
  ...props 
}) => {
  const { isEditMode, content, updateContent } = useGlobalState();

  const handleEdit = () => {
    if (!isEditMode) return;
    
    const newText = prompt('Editar texto:', content[fieldKey] || children);
    if (newText !== null) {
      updateContent(fieldKey, newText);
    }
  };

  const displayText = content[fieldKey] || children;

  return (
    <Element
      onClick={handleEdit}
      className={`${className} ${
        isEditMode 
          ? 'cursor-pointer border-2 border-dashed border-yellow-400 p-1 rounded hover:bg-yellow-50 transition-colors' 
          : ''
      }`}
      {...props}
    >
      {displayText}
    </Element>
  );
};

export default WorkingEditableText;