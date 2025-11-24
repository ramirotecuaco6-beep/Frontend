import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode debe ser usado dentro de un DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Verificar localStorage primero
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    
    // Verificar preferencia del sistema
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return false;
  });

  // Aplicar modo oscuro al documento
  const applyDarkMode = (isDark) => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      if (isDark) {
        html.classList.add('dark');
        html.style.colorScheme = 'dark';
      } else {
        html.classList.remove('dark');
        html.style.colorScheme = 'light';
      }
    }
  };

  // Efecto para aplicar modo oscuro al cargar y cuando cambia
  useEffect(() => {
    applyDarkMode(darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Solo cambiar si no hay preferencia guardada en localStorage
      const saved = localStorage.getItem('darkMode');
      if (saved === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Establecer modo oscuro directamente
  const setDarkModeState = (isDark) => {
    setDarkMode(isDark);
  };

  const value = {
    darkMode,
    toggleDarkMode,
    setDarkMode: setDarkModeState,
    isDarkMode: darkMode // alias para compatibilidad
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};