export default function Tours() {
  const tours = [
    { title: "Tour en la Selva", description: "Explora senderos naturales, cascadas y aprende sobre la flora y fauna local con guías expertos." },
    { title: "Aventura en Montaña", description: "Siente la emoción de subir montañas y disfrutar de vistas impresionantes." },
    { title: "Recorrido Cultural", description: "Conoce comunidades locales, su gastronomía, tradiciones y su historia ancestral." },
  ];

  return (
    <section id="tours" className="py-24 px-6 bg-gray-50">
      <h2 className="text-4xl font-bold text-center text-ecoGreen mb-12">Nuestros Tours 🌿</h2>
      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {tours.map((tour, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition flex flex-col">
            <h3 className="text-2xl font-semibold text-ecoBrown mb-4">{tour.title}</h3>
            <p className="text-gray-600 flex-grow">{tour.description}</p>
            <button className="mt-6 bg-ecoGreen text-white px-6 py-3 rounded-full font-semibold hover:bg-ecoBrown transition">
              Reservar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
