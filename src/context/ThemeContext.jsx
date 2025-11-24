import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    // Colores principales
    colors: {
      primary: '#16a34a', // green-600
      secondary: '#3b82f6', // blue-500
      accent: '#eab308', // yellow-500
      background: '#f0fdf4', // green-50
      text: '#1f2937', // gray-800
      white: '#ffffff'
    },
    // Tipografía
    typography: {
      fontFamily: 'system-ui, sans-serif',
      h1: '2.25rem', // text-4xl
      h2: '1.875rem', // text-3xl
      h3: '1.5rem', // text-2xl
      body: '1.125rem', // text-lg
      small: '0.875rem' // text-sm
    },
    // Espaciado
    spacing: {
      small: '0.5rem',
      medium: '1rem',
      large: '1.5rem',
      xlarge: '2rem'
    },
    // Bordes
    borderRadius: {
      small: '0.375rem',
      medium: '0.5rem',
      large: '0.75rem',
      xlarge: '1rem'
    },
    // Sombras
    shadows: {
      small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      large: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
    }
  });

  // Cargar tema guardado
  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  // Guardar tema
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('app_theme', JSON.stringify(newTheme));
  };

  // Aplicar estilos CSS personalizados
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --color-primary: ${theme.colors.primary};
        --color-secondary: ${theme.colors.secondary};
        --color-accent: ${theme.colors.accent};
        --color-background: ${theme.colors.background};
        --color-text: ${theme.colors.text};
        --color-white: ${theme.colors.white};
        
        --font-family: ${theme.typography.fontFamily};
        --text-h1: ${theme.typography.h1};
        --text-h2: ${theme.typography.h2};
        --text-h3: ${theme.typography.h3};
        --text-body: ${theme.typography.body};
        --text-small: ${theme.typography.small};
        
        --spacing-small: ${theme.spacing.small};
        --spacing-medium: ${theme.spacing.medium};
        --spacing-large: ${theme.spacing.large};
        --spacing-xlarge: ${theme.spacing.xlarge};
        
        --radius-small: ${theme.borderRadius.small};
        --radius-medium: ${theme.borderRadius.medium};
        --radius-large: ${theme.borderRadius.large};
        --radius-xlarge: ${theme.borderRadius.xlarge};
        
        --shadow-small: ${theme.shadows.small};
        --shadow-medium: ${theme.shadows.medium};
        --shadow-large: ${theme.shadows.large};
      }
      
      .custom-bg-primary { background-color: var(--color-primary) !important; }
      .custom-text-primary { color: var(--color-primary) !important; }
      .custom-border-primary { border-color: var(--color-primary) !important; }
      
      .custom-bg-secondary { background-color: var(--color-secondary) !important; }
      .custom-text-secondary { color: var(--color-secondary) !important; }
      
      .custom-bg-accent { background-color: var(--color-accent) !important; }
      .custom-text-accent { color: var(--color-accent) !important; }
      
      .custom-bg-background { background-color: var(--color-background) !important; }
      .custom-text-text { color: var(--color-text) !important; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};