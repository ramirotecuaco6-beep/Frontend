import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext"; 

import logo from '../assets/logo_ proyecto.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // datos del contexto
  const { user, logout, loading } = useAuth();
  
  // Modo oscuro
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    if (isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
  }, [location]);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Actividades", path: "/actividades" },
    { name: "Lugares", path: "/lugares" },
    { name: "Galería", path: "/galeria" },
    { name: "Contacto", path: "/contacto" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* LOGO */}
          <div className="flex items-center space-x-3  **min-w-[160px]**">
            <img 
              src={logo} 
              alt="Ecolibres Logo" 
              className="w-28 h-21 object-contain **ml-[-1.8rem]** "
            />
            <div>
              <h1
                className={`text-2xl font-black transition-colors duration-300 ${
                  isScrolled 
                    ? "text-green-800 dark:text-green-400" 
                    : "text-white"
                }`}
              >
                Ecolibres
              </h1>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isScrolled 
                    ? "text-gray-500 dark:text-gray-400" 
                    : "text-white/80"
                }`}
              >
                De aquí pa'llá.
              </p>
            </div>
          </div>

          {/* MENÚ DESKTOP */}
          <ul className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`font-semibold transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400"
                        : "text-white hover:text-green-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-green-500 transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </li>
              );
            })}
          </ul>

          {/* BOTONES DESKTOP ✅ ACTUALIZADO CON MODO OSCURO */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* ✅ BOTÓN TOGGLE MODO OSCURO/CLARO */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
              aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>

            {loading ? (
              <span className="text-gray-500 dark:text-gray-400 text-sm">Cargando...</span>
            ) : user ? (
              <>
                <span
                  onClick={handleProfileClick}
                  className="cursor-pointer text-green-800 dark:text-green-400 font-semibold hover:underline"
                >
                  Bienvenido, {user.displayName || user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all duration-300"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-5 py-2 border border-green-600 rounded-xl text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                Iniciar Sesión
              </button>
            )}

           
          </div>

          {/* BOTÓN HAMBURGUESA MÓVIL */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-md ${
              isScrolled 
                ? "text-green-800 dark:text-green-400" 
                : "text-white"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* OVERLAY OSCURO */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* MENÚ MÓVIL ✅ ACTUALIZADO CON MODO OSCURO */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-500 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-4">Menú</h2>
          
          {/* ✅ BOTÓN MODO OSCURO EN MÓVIL */}
          <div className="mb-6">
            <button
              onClick={toggleDarkMode}
              className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>{isDarkMode ? "☀️" : "🌙"}</span>
              <span>{isDarkMode ? "Modo Claro" : "Modo Oscuro"}</span>
            </button>
          </div>

          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-auto space-y-3">
            {user ? (
              <>
                <p
                  onClick={handleProfileClick}
                  className="text-center text-green-800 dark:text-green-400 font-semibold cursor-pointer hover:underline"
                >
                  {user.displayName || user.email}
                </p>
                <button
                  onClick={logout}
                  className="w-full border border-red-500 text-red-600 dark:text-red-400 py-3 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLoginClick();
                }}
                className="w-full border border-green-600 text-green-700 dark:text-green-400 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                Iniciar Sesión
              </button>
            )}
            
          </div>
        </div>
      </div>

      {/* MODAL DE AUTENTICACIÓN */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
}