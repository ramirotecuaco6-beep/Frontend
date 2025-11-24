// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext"; // 👈 Importa el nuevo provider

// Componentes principales
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas
import Inicio from "./components/Inicio";
import LugaresPopulares from "./components/LugaresPopulares";
import Actividades from "./components/Actividades";
import Contacto from "./components/Contacto";
import DetalleLugar from "./components/DetalleLugar";
import ActividadDetalle from "./components/ActividadDetalle";
import RutaDetalle from "./components/RutaDetalle";

// 🧩 Tus componentes personales
import Perfil from "./components/Perfil";
import Galeria from "./components/Galeria";

function App() {
  return (
    <DarkModeProvider> {/* 👈 Envuelve todo con DarkModeProvider */}
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="App relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"> {/* 👈 Agrega clases para modo oscuro */}
              <Navbar />
              <main className="min-h-screen"> {/* 👈 Contenedor principal */}
                <Routes>
                  {/* Rutas generales */}
                  <Route path="/" element={<Inicio />} />
                  <Route path="/lugares" element={<LugaresPopulares />} />
                  <Route path="/actividades" element={<Actividades />} />
                  <Route path="/contacto" element={<Contacto />} />

                  {/* ✅ Rutas personales */}
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/galeria" element={<Galeria />} />

                  {/* Rutas con parámetros */}
                  <Route path="/lugar/:id" element={<DetalleLugar />} />
                  <Route path="/actividad/:id" element={<ActividadDetalle />} />
                  <Route path="/ruta/:nombreLugar" element={<RutaDetalle />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;