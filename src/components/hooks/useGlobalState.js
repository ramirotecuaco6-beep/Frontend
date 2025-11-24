import { useState, useEffect } from 'react';

// Estado global real
export const useGlobalState = () => {
  const [state, setState] = useState({
    isAdmin: false,
    isEditMode: false,
    content: {}
  });

  // Cargar estado inicial
  useEffect(() => {
    const savedState = localStorage.getItem('global_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
        console.log('✅ Estado cargado:', parsed);
      } catch (error) {
        console.error('❌ Error cargando estado:', error);
      }
    }
  }, []);

  // Guardar estado cuando cambie
  useEffect(() => {
    localStorage.setItem('global_state', JSON.stringify(state));
    console.log('💾 Estado guardado:', state);
  }, [state]);

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const updateContent = (key, value) => {
    setState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value
      }
    }));
  };

  return {
    ...state,
    updateState,
    updateContent
  };
};