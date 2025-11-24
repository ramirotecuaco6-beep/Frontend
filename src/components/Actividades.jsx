import GridDeTarjetas from "./shared/GridDeTarjetas";
import { useActividades } from "../hooks/useActividades";

export default function Actividades() {
  const { actividades, loading, error } = useActividades();

  if (loading) return <p className="text-center mt-10">Cargando actividades...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <GridDeTarjetas
      tipo="actividades"
      titulo="Actividades Ecológicas"
      subtitulo="Descubre tus rutas y conecta con la naturaleza."
      items={actividades}
    />
  );
}
