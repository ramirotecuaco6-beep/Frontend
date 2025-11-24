import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export function useActividades() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadActividades = async () => {
    try {
      setLoading(true);
      const data = await apiService.getActividades(); // fetch a /api/actividades
      setActividades(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al obtener las actividades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActividades();
  }, []);

  return { actividades, loading, error, refetch: loadActividades };
}
