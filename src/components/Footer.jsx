export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-primary-900 text-white py-16 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">

              <h3 className="text-2xl font-black">Ecolibres</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Conectando aventureros con la belleza natural de Libres, Puebla. 
              Experiencias únicas, recuerdos eternos.
            </p>

          </div>
        </div>
        
        {/* Línea divisoria */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60">
              © 2025 Ecolibres. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}