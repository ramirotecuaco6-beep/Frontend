import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useApiData = () => {
  const [lugares, setLugares] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lugaresData, actividadesData] = await Promise.all([
        apiService.getLugares(),
        apiService.getActividades(),
      ]);
      setLugares(lugaresData);
      setActividades(actividadesData);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { lugares, actividades, loading, error, refetch: loadData };
};
