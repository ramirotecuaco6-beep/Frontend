import React, { useState } from "react";

// ⬅ Cargar URL desde .env
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

console.log("🌐 Contacto conectado a:", BASE_URL);

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setMessage("❌ Por favor completa todos los campos obligatorios");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // ✅ ENVÍO REAL AL BACKEND - ACTUALIZADO CON BASE_URL
      const response = await fetch(`${BASE_URL}/contacto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ ¡Mensaje enviado! Los administradores te contactarán en menos de 24 horas.");
        setFormData({
          nombre: "",
          email: "",
          asunto: "",
          mensaje: ""
        });
      } else {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

    } catch (error) {
      console.error("Error enviando formulario:", error);
      setMessage("❌ Error al enviar el mensaje. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 px-6 bg-gradient-to-br from-gray-900 to-primary-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Información de contacto */}
          <div className="text-white animate-slide-up">
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
              📞 Contáctanos
            </div>
            <h2 className="text-5xl font-black text-white mb-6">
              ¿Listo para <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-secondary-400">aventurarte</span>?
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Estamos aquí para ayudarte a planificar la experiencia perfecta en Libres. 
              Respondemos todas tus preguntas en menos de 24 horas.
            </p>
            

          </div>
          
          {/* Formulario */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Nombre completo *
                  </label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Correo electrónico *
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Asunto
                </label>
                <input 
                  type="text" 
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Mensaje *
                </label>
                <textarea 
                  rows="5"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all resize-none"
                  placeholder="Cuéntanos sobre tu aventura ideal..."
                  required
                />
              </div>

              {/* Mensaje de estado */}
              {message && (
                <div className={`p-3 rounded-xl text-center font-semibold ${
                  message.includes("✅") 
                    ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  {message}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-accent-500 to-secondary-500 hover:from-accent-600 hover:to-secondary-600 text-white text-lg py-4 rounded-2xl flex items-center justify-center gap-3 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Mensaje</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-white/60 text-sm text-center">
                * Campos obligatorios
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}