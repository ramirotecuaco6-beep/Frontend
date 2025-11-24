import React, { createContext, useContext, useState, useEffect } from 'react';

const EditContext = createContext();

export const useEdit = () => {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error('useEdit debe usarse dentro de EditProvider');
  }
  return context;
};

export const EditProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar estado guardado
  useEffect(() => {
    console.log('📥 Cargando contenido guardado...');
    
    const savedContent = localStorage.getItem('site_content');
    const savedEditMode = localStorage.getItem('edit_mode');
    
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        console.log('📁 Contenido cargado:', parsedContent);
        setContent(parsedContent);
      } catch (error) {
        console.error('❌ Error cargando contenido:', error);
      }
    }
    
    if (savedEditMode === 'true') {
      console.log('🎛️ Modo edición activado desde localStorage');
      setIsEditMode(true);
    }
    
    setIsLoaded(true);
  }, []);

  const updateContent = (key, newContent) => {
    console.log('💾 Guardando contenido:', key, newContent);
    
    const updated = { 
      ...content, 
      [key]: newContent 
    };
    
    setContent(updated);
    
    // Guardar en localStorage inmediatamente
    try {
      localStorage.setItem('site_content', JSON.stringify(updated));
      console.log('✅ Contenido guardado en localStorage');
    } catch (error) {
      console.error('❌ Error guardando contenido:', error);
    }
  };

  const toggleEditMode = () => {
    const newMode = !isEditMode;
    console.log('🎛️ Cambiando modo edición a:', newMode);
    setIsEditMode(newMode);
    localStorage.setItem('edit_mode', newMode.toString());
  };

  const setEditMode = (mode) => {
    console.log('🎛️ Estableciendo modo edición a:', mode);
    setIsEditMode(mode);
    localStorage.setItem('edit_mode', mode.toString());
  };

  // Debug: mostrar contenido actual
  useEffect(() => {
    if (isLoaded) {
      console.log('📊 Estado actual EditContext:', { 
        isEditMode, 
        content,
        contentKeys: Object.keys(content) 
      });
    }
  }, [isEditMode, content, isLoaded]);

  return (
    <EditContext.Provider value={{
      isEditMode,
      setIsEditMode: setEditMode,
      content,
      updateContent,
      toggleEditMode
    }}>
      {children}
    </EditContext.Provider>
  );
};