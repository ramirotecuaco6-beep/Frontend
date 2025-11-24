import GridDeTarjetas from "./shared/GridDeTarjetas";
import { useLugares } from "../hooks/useLugares";

export default function LugaresPopulares() {
  const { lugares, loading, error } = useLugares();

  if (loading) return <p className="text-center mt-10">Cargando lugares...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <GridDeTarjetas
      tipo="lugares"
      titulo="Lugares"
      subtitulo="Los destinos más increíbles de Libres."
      items={lugares}
    />
  );
}
