import { useState, useEffect } from "react";

export default function StepTracker() {
  const [tracking, setTracking] = useState(false);
  const [positions, setPositions] = useState([]);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [mode, setMode] = useState("caminar");
  const [error, setError] = useState(null);

  // Función para calcular distancia entre dos puntos
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // Iniciar seguimiento GPS
  useEffect(() => {
    let watchId;
    if (tracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPositions((prev) => [...prev, { lat: latitude, lon: longitude }]);
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true }
      );
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, [tracking]);

  // Calcular distancia total y calorías
  useEffect(() => {
    if (positions.length < 2) return;
    let total = 0;
    for (let i = 1; i < positions.length; i++) {
      total += getDistance(
        positions[i - 1].lat,
        positions[i - 1].lon,
        positions[i].lat,
        positions[i].lon
      );
    }
    setDistance(total);
    const caloriesPerKm = mode === "caminar" ? 60 : 35;
    setCalories(total * caloriesPerKm);
  }, [positions, mode]);

  return (
    <div className="p-6 bg-green-50/90 rounded-2xl shadow-lg max-w-md mx-auto mt-12 border border-green-200 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        🌿 Rastreador de Ruta
      </h2>

      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Distancia:</span>{" "}
          {distance.toFixed(2)} km
        </p>
        <p>
          <span className="font-semibold">Calorías quemadas:</span>{" "}
          {calories.toFixed(0)} kcal
        </p>
        <p>
          <span className="font-semibold">Modo:</span>{" "}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="ml-2 px-2 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="caminar">Caminar 🚶‍♂️</option>
            <option value="bicicleta">Bicicleta 🚴‍♀️</option>
          </select>
        </p>
      </div>

      <button
        onClick={() => setTracking((prev) => !prev)}
        className={`mt-5 w-full px-6 py-2 rounded-xl font-semibold text-white transition-all duration-300 ${
          tracking
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {tracking ? "Detener Rastreo" : "Iniciar Rastreo"}
      </button>

      {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
    </div>
  );
}
