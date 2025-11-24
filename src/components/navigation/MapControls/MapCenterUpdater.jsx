import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

const TripleClickHandler = ({ onTripleClick }) => {
  const map = useMap();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  useEffect(() => {
    const handleMapClick = (e) => {
      clickCountRef.current += 1;

      // Limpiar timer anterior
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }

      // Configurar nuevo timer
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500); // 500ms para triple clic

      // Si son 3 clics, ejecutar callback
      if (clickCountRef.current === 3) {
        onTripleClick(e.latlng);
        clickCountRef.current = 0;
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current);
        }
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, [map, onTripleClick]);

  return null;
};

export default TripleClickHandler;