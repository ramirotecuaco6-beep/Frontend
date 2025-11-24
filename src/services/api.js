// src/services/api.js

// ⬅ Cargar URL desde .env
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

console.log("🌐 API conectada a:", BASE_URL);

export const apiService = {
  // Lugares
  getLugares: async () => {
    const res = await fetch(`${BASE_URL}/lugares`);
    if (!res.ok) throw new Error("Error al obtener los lugares");
    return res.json();
  },

  getLugarPorNombre: async (nombreLugar) => {
    const res = await fetch(`${BASE_URL}/lugares/${encodeURIComponent(nombreLugar)}`);
    if (!res.ok) throw new Error("Error al obtener el lugar");
    return res.json();
  },

  getLugarPorId: async (id) => {
    const res = await fetch(`${BASE_URL}/lugares/id/${id}`);
    if (!res.ok) throw new Error("Error al obtener el lugar");
    return res.json();
  },

  // Actividades
  getActividades: async () => {
    const res = await fetch(`${BASE_URL}/actividades`);
    if (!res.ok) throw new Error("Error al obtener las actividades");
    return res.json();
  },

  getActividadPorId: async (id) => {
    const res = await fetch(`${BASE_URL}/actividades/${id}`);
    if (!res.ok) throw new Error("Error al obtener la actividad");
    return res.json();
  },

  getActividadesPorLugar: async (nombreLugar) => {
    const res = await fetch(`${BASE_URL}/actividades/por-lugar/${encodeURIComponent(nombreLugar)}`);
    if (!res.ok) throw new Error("Error al obtener las actividades del lugar");
    return res.json();
  },

  // Rutas adicionales
  getActividadPorNombre: async (nombreActividad) => {
    const res = await fetch(`${BASE_URL}/actividades/nombre/${encodeURIComponent(nombreActividad)}`);
    if (!res.ok) throw new Error("Error al obtener la actividad");
    return res.json();
  }
};
