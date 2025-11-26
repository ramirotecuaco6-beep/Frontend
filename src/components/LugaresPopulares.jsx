import GridDeTarjetas from "./shared/GridDeTarjetas";
import { useLugares } from "../hooks/useLugares";

export default function LugaresPopulares() {
  const { lugares, loading, error } = useLugares();

  if (loading) return (
    <div className="section-padding">
      <div className="container-responsive">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
          </div>
          <div className="grid-responsive">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card-responsive animate-pulse">
                <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="section-padding">
      <div className="container-responsive text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-red-600 font-semibold">Error al cargar los lugares</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="section-padding">
      <div className="container-responsive">
        <GridDeTarjetas
          tipo="lugares"
          titulo="Lugares"
          subtitulo="Descubre los destinos más increíbles de Libres"
          items={lugares}
        />
      </div>
    </section>
  );
}