import { useState } from 'react';
import { MAPBOX_ACCESS_TOKEN } from '../utils/constants';
import { getDistanceFromLatLonInKm } from '../utils/mapUtils';

export const useRouteCalculation = () => {
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [estimatedDistance, setEstimatedDistance] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [nextTurn, setNextTurn] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeCalculated, setRouteCalculated] = useState(false);

  const calculateRouteWithMapbox = async (startCoords, endCoords, lugarActual, customDestination, autoCentering) => {
    try {
      setLoadingRoute(true);
      
      const start = `${startCoords[1]},${startCoords[0]}`;
      const end = `${endCoords[1]},${endCoords[0]}`;
      
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&steps=true&overview=full&access_token=${MAPBOX_ACCESS_TOKEN}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // Obtener geometría de la ruta
        const geometry = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRouteGeometry(geometry);
        
        // Información de la ruta
        setEstimatedDistance((route.distance / 1000).toFixed(1) + ' km');
        setEstimatedTime(Math.round(route.duration / 60) + ' min');
        
        // Generar instrucciones desde los pasos
        if (route.legs && route.legs[0].steps) {
          generateMapboxInstructions(route.legs[0].steps, lugarActual, customDestination);
        } else {
          generateSimpleInstructions(route.distance / 1000, lugarActual, customDestination, autoCentering);
        }
        
        setRouteCalculated(true);
        setLoadingRoute(false);
        return true;
      } else {
        throw new Error('No se encontraron rutas');
      }
      
    } catch (error) {
      console.error('Error con Mapbox:', error);
      setLoadingRoute(false);
      
      // Fallback a ruta simple
      createStraightRoute(startCoords, endCoords, lugarActual, customDestination, autoCentering);
      return true;
    }
  };

  const generateMapboxInstructions = (steps, lugarActual, customDestination) => {
    const routeInstructions = steps.map((step, index) => {
      const distance = (step.distance / 1000).toFixed(1);
      const instruction = step.maneuver.instruction.replace(/<[^>]*>/g, '');
      const maneuver = step.maneuver.type;
      
      let icon = "📍";
      if (maneuver.includes('turn')) {
        if (maneuver.includes('left')) icon = "↩️";
        else if (maneuver.includes('right')) icon = "↪️";
      } else if (maneuver.includes('arrive')) icon = "🎯";
      else if (maneuver.includes('depart')) icon = "🚗";
      
      if (index === 0) {
        return `${icon} Inicia tu viaje. ${instruction}`;
      } else if (index === steps.length - 1) {
        return `🎯 Has llegado a: ${customDestination ? 'Nuevo destino' : lugarActual.nombre}`;
      } else if (distance > 0.5) {
        return `${icon} En ${distance} km: ${instruction}`;
      } else {
        return `${icon} Próximo: ${instruction}`;
      }
    });
    
    setInstructions(routeInstructions);
    
    if (steps.length > 1) {
      const nextStep = steps[1];
      setNextTurn({
        distance: (nextStep.distance / 1000).toFixed(1),
        instruction: nextStep.maneuver.instruction.replace(/<[^>]*>/g, '')
      });
    }
  };

  const createStraightRoute = (start, end, lugarActual, customDestination, autoCentering) => {
    const straightRoute = [start, end];
    setRouteGeometry(straightRoute);
    
    const distancia = getDistanceFromLatLonInKm(start[0], start[1], end[0], end[1]);
    setEstimatedDistance(distancia.toFixed(1) + ' km');
    setEstimatedTime(Math.round(distancia * 2) + ' min');
    
    generateSimpleInstructions(distancia, lugarActual, customDestination, autoCentering);
    setRouteCalculated(true);
  };

  const generateSimpleInstructions = (distancia, lugarActual, customDestination, autoCentering) => {
    const destinationName = customDestination ? 'Nuevo destino' : lugarActual.nombre;
    const simpleInstructions = [
      "🚗 Inicia tu viaje hacia el destino",
      "📏 Sigue la ruta trazada en el mapa",
      autoCentering 
        ? "🗺️ Centrado automático ACTIVADO" 
        : "🗺️ Centrado automático DESACTIVADO - mueve el mapa libremente",
      "👀 Mantente atento a las señales de tránsito",
      distancia > 10 ? "⛽ Viaje largo - considera paradas" : "📍 Estás relativamente cerca",
      `🎯 Destino final: ${destinationName}`
    ];
    
    setInstructions(simpleInstructions);
  };

  const resetRoute = () => {
    setRouteGeometry(null);
    setEstimatedTime(null);
    setEstimatedDistance(null);
    setInstructions([]);
    setNextTurn(null);
    setRouteCalculated(false);
    setLoadingRoute(false);
  };

  return {
    routeGeometry,
    estimatedTime,
    estimatedDistance,
    instructions,
    nextTurn,
    loadingRoute,
    routeCalculated,
    calculateRouteWithMapbox,
    resetRoute,
    setInstructions
  };
};