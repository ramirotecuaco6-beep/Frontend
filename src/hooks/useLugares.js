import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export function useLugares() {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLugares = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLugares();
      setLugares(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al obtener los lugares");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLugares();
  }, []);

  return { lugares, loading, error, refetch: loadLugares };
}
