import { useState, useEffect, useRef } from 'react';
import { getDistanceFromLatLonInKm } from '../utils/mapUtils';

export const useNavigation = (routeCalculated, lugarActual, customDestination, nextTurn, setCurrentInstruction) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [distance, setDistance] = useState(0);
  const [userPath, setUserPath] = useState([]);
  const [lastPosition, setLastPosition] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const lastPositionRef = useRef(null);

  const updateInstructions = (currentPos) => {
    if (!routeCalculated) return;

    const currentDestination = customDestination || lugarActual.coordenadas;
    const distanciaAlDestino = getDistanceFromLatLonInKm(
      currentPos[0], currentPos[1],
      currentDestination[0], currentDestination[1]
    );

    let nuevaInstruccion = "";

    if (distanciaAlDestino < 0.05) {
      const destinationName = customDestination ? 'nuevo destino' : lugarActual.nombre;
      nuevaInstruccion = `🎯 ¡Has llegado a ${destinationName}!`;
    } else if (distanciaAlDestino < 0.2) {
      nuevaInstruccion = `📍 Estás a ${(distanciaAlDestino * 1000).toFixed(0)} metros - casi llegas`;
    } else if (distanciaAlDestino < 1) {
      nuevaInstruccion = `📍 Muy cerca: ${distanciaAlDestino.toFixed(1)} km para llegar`;
    } else if (nextTurn && distanciaAlDestino < 5) {
      nuevaInstruccion = `↪️ Próxima maniobra en ${nextTurn.distance} km: ${nextTurn.instruction}`;
    }

    if (nuevaInstruccion && nuevaInstruccion !== setCurrentInstruction) {
      setCurrentInstruction(nuevaInstruccion);
    }
  };

  const handlePositionUpdate = (currentPos, currentSpeed) => {
    setUserPath(prev => [...prev, currentPos]);
    
    if (lastPositionRef.current) {
      const segmentDistance = getDistanceFromLatLonInKm(
        lastPositionRef.current[0], lastPositionRef.current[1],
        currentPos[0], currentPos[1]
      );
      if (segmentDistance > 0.001) {
        setDistance(prev => prev + segmentDistance);
      }
    }
    lastPositionRef.current = currentPos;
    
    updateInstructions(currentPos);
  };

  const checkAchievements = (currentDistance) => {
    const nuevosLogros = [];
    if (currentDistance >= 0.1 && !achievements.includes("Primeros pasos ecológicos")) {
      nuevosLogros.push("Primeros pasos ecológicos");
    }
    if (currentDistance >= 0.5 && !achievements.includes("Explorador del sendero")) {
      nuevosLogros.push("Explorador del sendero");
    }
    if (currentDistance >= 1 && !achievements.includes("Aventurero de la naturaleza")) {
      nuevosLogros.push("Aventurero de la naturaleza");
    }
    if (currentDistance >= 3 && !achievements.includes("Guardián del bosque")) {
      nuevosLogros.push("Guardián del bosque");
    }
    
    if (nuevosLogros.length > 0) {
      setAchievements((prev) => [...prev, ...nuevosLogros]);
    }
  };

  useEffect(() => {
    checkAchievements(distance);
  }, [distance]);

  const startNavigation = () => {
    setIsNavigating(true);
    setUserPath([]);
    setDistance(0);
    setAchievements([]);
    lastPositionRef.current = null;
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setUserPath([]);
    setDistance(0);
    lastPositionRef.current = null;
  };

  return {
    isNavigating,
    distance,
    userPath,
    achievements,
    startNavigation,
    stopNavigation,
    handlePositionUpdate
  };
};