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
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🌿</span>
              </div>
              <h3 className="text-2xl font-black">Ecolibres</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Conectando aventureros con la belleza natural de Libres, Puebla. 
              Experiencias únicas, recuerdos eternos.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <button key={social} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-colors duration-300">
                  <span className="text-white">📱</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {['Inicio', 'Actividades', 'Lugares', 'Contacto', 'Galería'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tours populares */}
          <div>
            <h4 className="font-bold text-lg mb-6">Tours Populares</h4>
            <ul className="space-y-3">
              {['Espeleología', 'Senderismo', 'Avistamiento', 'Camping', 'Fotografía'].map((tour) => (
                <li key={tour}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300">
                    {tour}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-white/70 mb-4">
              Suscríbete para recibir ofertas y novedades
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="tu@email.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-l-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
              <button className="bg-accent-500 text-white px-6 py-3 rounded-r-2xl font-semibold hover:bg-accent-600 transition-colors">
                →
              </button>
            </div>
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