import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import MapCenterUpdater from './MapControls/MapCenterUpdater';
import TripleClickHandler from './MapControls/TripleClickHandler';
import CenterControl from './MapControls/CenterControl';
import { userIcon, destinationIcon } from '../utils/mapUtils';

const NavigationMap = ({
  position,
  lugarActual,
  customDestination,
  routeGeometry,
  userPath,
  speed,
  autoCentering,
  onTripleClick,
  onCenterToggle
}) => {
  // Estado local solo para el modo oscuro del mapa
  const [darkMapMode, setDarkMapMode] = useState(false);

  const toggleMapMode = () => {
    setDarkMapMode(!darkMapMode);
  };

  // Tiles mejorados para modo oscuro
  const getTileLayer = () => {
    if (darkMapMode) {
      return {
        url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      };
    } else {
      return {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      };
    }
  };

  const tileConfig = getTileLayer();

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden relative transition-all duration-300 ${
      darkMapMode 
        ? 'border-2 border-gray-700 shadow-xl' 
        : 'border-2 border-green-300 shadow-md'
    }`}>
      <MapContainer
        center={position || lugarActual.coordenadas}
        zoom={13}
        style={{ 
          height: '100%', 
          width: '100%',
          minHeight: '384px'
        }}
        className="interactive-map z-0"
      >
        {/* TileLayer mejorado */}
        <TileLayer
          url={tileConfig.url}
          attribution={tileConfig.attribution}
        />

        {/* Componentes de control del mapa */}
        <MapCenterUpdater position={position} autoCentering={autoCentering} />
        <TripleClickHandler onTripleClick={onTripleClick} />
        <CenterControl onCenterClick={onCenterToggle} autoCentering={autoCentering} />

        {/* Marcador de posición actual */}
        {position && (
          <Marker position={position} icon={userIcon}>
            <Popup>
              <div className={`text-center p-2 rounded-lg ${
                darkMapMode 
                  ? 'bg-gray-800 text-white border border-gray-600' 
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}>
                <strong>📍 Tu ubicación actual</strong>
                <br/>
                <span className={`text-xs ${darkMapMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Vel: {(speed * 3.6).toFixed(0)} km/h
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcador del destino */}
        <Marker
          position={customDestination || lugarActual.coordenadas}
          icon={destinationIcon}
        >
          <Popup>
            <div className={`text-center p-2 rounded-lg ${
              darkMapMode 
                ? 'bg-gray-800 text-white border border-gray-600' 
                : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              <strong>
                🎯 {customDestination ? 'Nuevo Destino' : lugarActual.nombre}
              </strong>
              <br/>
              <span className={`text-xs ${darkMapMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {customDestination ? 'Destino personalizado' : (lugarActual.direccion || 'Sin dirección específica')}
              </span>
            </div>
          </Popup>
        </Marker>

        {/* Ruta trazada - Colores mejorados */}
        {routeGeometry && (
          <Polyline
            positions={routeGeometry}
            color={darkMapMode ? "#60A5FA" : "#2563EB"}
            weight={6}
            opacity={darkMapMode ? 0.9 : 0.8}
          />
        )}

        {/* Ruta recorrida - Colores mejorados */}
        {userPath.length > 1 && (
          <Polyline
            positions={userPath}
            color={darkMapMode ? "#10B981" : "#059669"}
            weight={4}
            opacity={0.9}
          />
        )}
      </MapContainer>

      {/* Botón de toggle modo oscuro SOLO del mapa */}
      <button
        onClick={toggleMapMode}
        className={`absolute top-2 right-2 px-3 py-2 rounded-lg font-semibold text-sm z-10 transition-all duration-300 flex items-center gap-2 ${
          darkMapMode 
            ? 'bg-gray-800 text-amber-400 border border-gray-600 hover:bg-gray-700' 
            : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
        }`}
        title={darkMapMode ? 'Cambiar a mapa claro' : 'Cambiar a mapa oscuro'}
      >
        {darkMapMode ? '☀️ Mapa Claro' : '🌙 Mapa Oscuro'}
      </button>

      {/* Indicador de modo del mapa */}
      <div className={`absolute top-14 right-2 px-2 py-1 rounded text-xs font-semibold z-10 transition-all duration-300 ${
        darkMapMode 
          ? 'bg-gray-800 text-green-400 border border-gray-600' 
          : 'bg-white text-green-700 border border-green-200'
      }`}>
        {darkMapMode ? '🌙 Mapa Oscuro' : '☀️ Mapa Claro'}
      </div>

      {/* Indicador de centrado automático */}
      <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold z-10 transition-all duration-300 ${
        autoCentering 
          ? darkMapMode 
            ? 'bg-green-800 text-green-300 border border-green-600' 
            : 'bg-green-100 text-green-800 border border-green-300'
          : darkMapMode 
            ? 'bg-gray-700 text-gray-400 border border-gray-600' 
            : 'bg-gray-100 text-gray-600 border border-gray-300'
      }`}>
        {autoCentering ? '📍 Auto-centrado' : '🔄 Centrado manual'}
      </div>
    </div>
  );
};

export default NavigationMap;