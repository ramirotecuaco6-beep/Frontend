// src/components/shared/GridDeTarjetas.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext"; // ✅ Importar el contexto

export default function GridDeTarjetas({ titulo, subtitulo, items, tipo }) {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // ✅ Obtener el estado del modo oscuro

  const handleVerMas = (item) => {
    if (tipo === "actividades") {
      navigate(`/actividad/${item._id}`);
    } else {
      navigate(`/lugar/${item._id}`);
    }
  };

  const handleComoLlegar = (item) => {
    // Para actividades, usar el nombre del lugar relacionado
    if (tipo === "actividades" && item.lugar) {
      console.log("Navegando a ruta con nombre de lugar:", item.lugar);
      navigate(`/ruta/${encodeURIComponent(item.lugar)}`);
    } else if (tipo === "lugares" && item.nombre) {
      // Para lugares, usar el nombre directamente
      console.log("Navegando a ruta con nombre de lugar:", item.nombre);
      navigate(`/ruta/${encodeURIComponent(item.nombre)}`);
    } else {
      console.error("No se puede determinar el destino para la navegación:", item);
      // Fallback: mostrar error
      alert("No se puede calcular la ruta: información del destino no disponible");
    }
  };

  return (
    <section
      className={`py-24 px-6 transition-all duration-500 ${
        tipo === "actividades"
          ? darkMode 
            ? "bg-gradient-to-b from-gray-900 to-gray-800" 
            : "bg-gradient-to-b from-white to-green-50"
          : darkMode 
            ? "bg-gradient-to-b from-gray-800 to-gray-900" 
            : "bg-gradient-to-b from-primary-50 to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div
            className={`inline-block ${
              tipo === "actividades"
                ? darkMode 
                  ? "bg-green-700" 
                  : "bg-green-600"
                : darkMode 
                  ? "bg-gradient-to-r from-accent-600 to-accent-700" 
                  : "bg-gradient-to-r from-accent-500 to-accent-600"
            } text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg transition-all duration-300`}
          >
            {tipo === "actividades" ? "🏞️ Experiencias Únicas" : "🗺️ Descubre"}
          </div>

          <h2 className={`text-5xl font-black mb-6 transition-all duration-500 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {titulo}{" "}
            {tipo === "lugares" && (
              <span className={`${
                darkMode 
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-secondary-400" 
                  : "text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-secondary-600"
              }`}>
                Emblemáticos
              </span>
            )}
          </h2>

          <p className={`text-xl max-w-2xl mx-auto leading-relaxed transition-all duration-500 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {subtitulo}
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
          {items.map((item, idx) => {
            const id = item._id || item.id || idx;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`group rounded-3xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 hover:shadow-2xl hover:shadow-gray-900/50' 
                    : 'bg-white border-gray-100 hover:shadow-2xl'
                } border hover:scale-105`}
              >
                {/* Imagen */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={item.imagen_url || "/placeholder.jpg"}
                    alt={item.nombre || "Imagen"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {item.rating && tipo === "lugares" && (
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold shadow-md transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700/90 text-yellow-400' 
                        : 'bg-white/90 text-gray-800'
                    }`}>
                      ⭐ {item.rating}
                    </span>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 group-hover:${
                      tipo === "actividades" 
                        ? darkMode ? 'text-green-400' : 'text-green-600'
                        : darkMode ? 'text-accent-400' : 'text-accent-600'
                    } ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.nombre || item.titulo}
                    </h3>

                    <p className={`mb-4 leading-relaxed line-clamp-4 transition-colors duration-300 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {item.descripcion || "Descripción no disponible"}
                    </p>

                    {tipo === "actividades" && item.lugar && (
                      <div className="mb-4">
                        <p className={`text-sm transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          📍 Ubicación: <span className={`font-semibold ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            {item.lugar}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.caracteristicas?.map((feature, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col md:flex-row gap-3 mt-auto">
                    {tipo === "actividades" ? (
                      <>
                        <button
                          onClick={() => handleVerMas(item)}
                          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                            darkMode 
                              ? 'bg-green-800 hover:bg-green-700 text-green-200' 
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          Ver Más
                        </button>
                        <button
                          onClick={() => handleComoLlegar(item)}
                          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                            darkMode 
                              ? 'bg-green-600 hover:bg-green-500 text-white' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          Cómo Llegar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleVerMas(item)}
                          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                            darkMode 
                              ? 'bg-accent-600 hover:bg-accent-500 text-white' 
                              : 'bg-accent-600 hover:bg-accent-700 text-white'
                          }`}
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => handleComoLlegar(item)}
                          className={`flex-1 p-3 rounded-xl transition-all duration-300 ${
                            darkMode 
                              ? 'border border-gray-600 hover:border-accent-500 hover:text-accent-400 text-gray-300' 
                              : 'border border-gray-300 hover:border-accent-600 hover:text-accent-600'
                          }`}
                        >
                          📍 Cómo Llegar
                        </button>
                        {item.reservable && (
                          <button
                            onClick={() => navigate(`/reserva/${id}`)}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                              darkMode 
                                ? 'bg-green-600 hover:bg-green-500 text-white' 
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            Reservar
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mensaje si no hay items */}
        {items.length === 0 && (
          <div className="text-center py-16">
            <div className={`text-6xl mb-4 ${
              darkMode ? 'text-gray-500' : 'text-gray-300'
            }`}>
              {tipo === "actividades" ? "🏞️" : "🗺️"}
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              No hay {tipo === "actividades" ? "actividades" : "lugares"} disponibles
            </h3>
            <p className={`${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Prueba a revisar más tarde o contacta con nosotros.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}