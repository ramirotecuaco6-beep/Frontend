import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import { updateProfile, updatePassword } from "firebase/auth";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaCamera,
  FaImages,
  FaUser,
  FaCog,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaMapMarkerAlt,
  FaHiking,
  FaSwimmer,
  FaTree,
  FaMountain,
  FaMoon,
  FaSun,
  FaTrophy,
  FaRoute,
  FaMap
} from "react-icons/fa";

// Cargar URL desde .env
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

console.log("Perfil conectado a:", BASE_URL);

export default function Perfil() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [photoURL, setPhotoURL] = useState("");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const [userPhotos, setUserPhotos] = useState([]);
  
  // Nuevos estados para el progreso
  const [rutasCompletadas, setRutasCompletadas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loadingProgreso, setLoadingProgreso] = useState(false);
  
  // Estados para edición
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editActivity, setEditActivity] = useState("");
  const [deletingPhoto, setDeletingPhoto] = useState(null);

  // Estados para subir foto
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadLocation, setUploadLocation] = useState("");
  const [uploadActivity, setUploadActivity] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");

  // Actividades predefinidas
  const activities = [
    { value: "senderismo", label: "Senderismo", icon: FaHiking },
    { value: "natacion", label: "Natación", icon: FaSwimmer },
    { value: "camping", label: "Camping", icon: FaTree },
    { value: "escalada", label: "Escalada", icon: FaMountain },
    { value: "observacion", label: "Observación de aves", icon: FaTree },
    { value: "fotografia", label: "Fotografía natural", icon: FaCamera }
  ];

  // Sincronizar usuario con backend al cargar
  useEffect(() => {
    if (user) {
      syncUserWithBackend();
      loadProfilePhoto();
    }
  }, [user]);

  // Cargar datos de progreso cuando se active la pestaña
  useEffect(() => {
    if (user && activeTab === "progreso") {
      cargarProgreso();
    }
  }, [user, activeTab]);

  // Cargar progreso y estadísticas
  const cargarProgreso = async () => {
    if (!user) return;
    
    setLoadingProgreso(true);
    try {
      const token = await user.getIdToken();
      
      // Cargar rutas completadas
      const resRutas = await fetch(`${BASE_URL}/users/${user.uid}/rutas-completadas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const dataRutas = await resRutas.json();
      if (dataRutas.success) {
        setRutasCompletadas(dataRutas.rutas || []);
        setEstadisticas(dataRutas.estadisticas);
      }

      // Cargar estadísticas detalladas
      const resStats = await fetch(`${BASE_URL}/users/${user.uid}/estadisticas-rutas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const dataStats = await resStats.json();
      if (dataStats.success) {
        setEstadisticas(dataStats.estadisticas);
      }
      
    } catch (error) {
      console.error('Error cargando progreso:', error);
      setMessage('Error cargando tu progreso');
    } finally {
      setLoadingProgreso(false);
    }
  };

  // Sincronizar usuario con backend
  const syncUserWithBackend = async () => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${BASE_URL}/user/sync`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        console.log("Usuario sincronizado con backend:", data.user);
        if (data.user.photoUrl) {
          setPhotoURL(data.user.photoUrl);
        }
        if (data.user.displayName) {
          setDisplayName(data.user.displayName);
        }
      }
    } catch (err) {
      console.error("Error sincronizando usuario:", err);
    }
  };

  // Mensajes automáticos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadProfilePhoto = async () => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${BASE_URL}/user/profile-photo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.photo) {
        setPhotoURL(data.photo);
      } else {
        setPhotoURL(user.photoURL || "https://via.placeholder.com/150");
      }
    } catch (err) {
      console.error("Error cargando foto de perfil:", err);
      setPhotoURL(user.photoURL || "https://via.placeholder.com/150");
    }
  };

  // Cargar galería
  useEffect(() => {
    if (user && activeTab === "galeria") loadUserPhotos();
  }, [user, activeTab]);

  const loadUserPhotos = async () => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${BASE_URL}/user/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUserPhotos(data.photos || []);
      } else {
        throw new Error(data.error || "Error cargando fotos");
      }
    } catch (err) {
      console.error("Error cargando galería:", err);
      setMessage("Error cargando galería: " + err.message);
    }
  };

  // Subir nueva foto de perfil
  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("type", "profile");

      const res = await fetch(`${BASE_URL}/user/upload-photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.photoUrl) {
        setPhotoURL(data.photoUrl);
        await updateProfile(user, { photoURL: data.photoUrl });
        setMessage("Foto de perfil actualizada correctamente");
      } else {
        throw new Error(data.error || "Error al subir la foto");
      }
    } catch (err) {
      console.error("Error al subir foto:", err);
      setMessage("Error al subir la foto de perfil: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Manejar selección de archivo para galería
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 40 * 1024 * 1024) {
      setMessage("La imagen es demasiado grande (máx. 40MB)");
      return;
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    setShowUploadModal(true);
    e.target.value = "";
  };

  // Subir foto a galería con todos los datos
  const handleGalleryUpload = async () => {
    if (!selectedFile) {
      setMessage("Por favor selecciona una foto");
      return;
    }

    setUploading(true);
    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("photo", selectedFile);
      formData.append("type", "gallery");
      formData.append("description", uploadDescription || "Mi aventura en EcoLibres");
      formData.append("location", uploadLocation || "Ubicación no especificada");
      if (uploadActivity) {
        formData.append("activity", uploadActivity);
      }

      const res = await fetch(`${BASE_URL}/user/upload-photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage("¡Foto subida correctamente a tu galería!");
        setShowUploadModal(false);
        resetUploadForm();
        loadUserPhotos();
      } else {
        throw new Error(data.error || "Error al subir la foto");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error al subir la foto: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Resetear formulario de upload
  const resetUploadForm = () => {
    setSelectedFile(null);
    setFilePreview("");
    setUploadDescription("");
    setUploadLocation("");
    setUploadActivity("");
  };

  // Editar foto
  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setEditDescription(photo.description || "");
    setEditLocation(photo.location || "");
    setEditActivity(photo.activity || "");
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!editingPhoto) return;

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${BASE_URL}/user/photos/${editingPhoto._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          description: editDescription,
          location: editLocation,
          activity: editActivity
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Foto actualizada correctamente");
        setEditingPhoto(null);
        loadUserPhotos();
      } else {
        throw new Error(data.error || "Error al actualizar la foto");
      }
    } catch (err) {
      console.error("Error actualizando foto:", err);
      setMessage("Error al actualizar la foto: " + err.message);
    }
  };

  // Eliminar foto
  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta foto? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeletingPhoto(photoId);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${BASE_URL}/user/photos/${photoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Foto eliminada correctamente");
        loadUserPhotos();
      } else {
        throw new Error(data.error || "Error al eliminar la foto");
      }
    } catch (err) {
      console.error("Error eliminando foto:", err);
      setMessage("Error al eliminar la foto: " + err.message);
    } finally {
      setDeletingPhoto(null);
    }
  };

  // Obtener etiqueta de actividad
  const getActivityLabel = (activityValue) => {
    const activity = activities.find(a => a.value === activityValue);
    return activity ? activity.label : "Actividad no especificada";
  };

  // Actualizar nombre
  const handleNameChange = async () => {
    if (!displayName.trim()) {
      setMessage("El nombre no puede estar vacío");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      setMessage("Nombre actualizado");
    } catch (err) {
      console.error(err);
      setMessage("Error al actualizar el nombre");
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(user, newPassword);
      setMessage("Contraseña actualizada");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Error al cambiar contraseña. Vuelve a iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    if (window.confirm("¿Deseas cerrar sesión?")) await logout();
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600 text-lg mt-20 dark:bg-gray-900 dark:text-gray-300">
        Inicia sesión para ver tu perfil.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-6 mt-20">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-green-200 dark:border-gray-700">
        {/* Tabs - AGREGADA PESTAÑA PROGRESO */}
        <div className="flex border-b bg-green-700 dark:bg-gray-900 text-white">
          {[
            { id: "perfil", label: "Perfil", icon: FaUser },
            { id: "progreso", label: "Mi Progreso", icon: FaTrophy },
            { id: "galeria", label: "Galería", icon: FaImages },
            { id: "config", label: "Configuración", icon: FaCog },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all flex-1 ${
                activeTab === tab.id
                  ? "bg-green-800 dark:bg-gray-700 border-b-4 border-white"
                  : "hover:bg-green-600 dark:hover:bg-gray-600"
              }`}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {/* PERFIL */}
          {activeTab === "perfil" && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">Información Personal</h2>

              <div className="relative inline-block">
                <img
                  src={photoURL || user.photoURL || "https://via.placeholder.com/150"}
                  alt="Perfil"
                  className="w-36 h-36 rounded-full object-cover border-4 border-green-600 dark:border-green-500 shadow-lg"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <label className="absolute bottom-0 right-0 bg-green-600 dark:bg-green-500 text-white p-3 rounded-full cursor-pointer hover:bg-green-700 dark:hover:bg-green-600 transition">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && <p className="text-sm text-gray-500 dark:text-gray-400">Subiendo...</p>}

              <div className="max-w-sm mx-auto text-left">
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <div className="flex gap-2">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="border rounded-md p-2 flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={handleNameChange}
                    disabled={loading}
                    className="bg-green-600 dark:bg-green-500 text-white px-4 rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition disabled:bg-gray-300 dark:disabled:bg-gray-600"
                  >
                    Guardar
                  </button>
                </div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-1">Correo</label>
                <p className="p-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md">{user.email}</p>
              </div>
            </div>
          )}

          {/* NUEVA PESTAÑA: PROGRESO Y MAPA DE CALOR */}
          {activeTab === "progreso" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                Mi Progreso y Logros
              </h2>

              {loadingProgreso ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando tu progreso...</p>
                </div>
              ) : (
                <>
                  {/* ESTADÍSTICAS PRINCIPALES */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
                      <FaRoute className="text-3xl text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {estadisticas?.totalRutas || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Rutas Completadas</p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
                      <FaMapMarkerAlt className="text-3xl text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {estadisticas?.lugaresUnicos || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Lugares Únicos</p>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg text-center">
                      <FaHiking className="text-3xl text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {(estadisticas?.distanciaTotal || 0).toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Km Recorridos</p>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center">
                      <FaTree className="text-3xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {userPhotos.length}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Fotos de Aventuras</p>
                    </div>
                  </div>

                  {/* MAPA DE CALOR (Placeholder) */}
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                      <FaMap /> Mapa de Mis Aventuras
                    </h3>
                    <div className="h-64 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      {rutasCompletadas.length > 0 ? (
                        <div className="text-center">
                          <FaMap className="text-4xl text-gray-400 mb-2 mx-auto" />
                          <p className="text-gray-600 dark:text-gray-300">
                            Mapa interactivo con {rutasCompletadas.length} rutas completadas
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Próximamente: integración con mapas en tiempo real
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FaMap className="text-4xl text-gray-400 mb-2 mx-auto" />
                          <p className="text-gray-600 dark:text-gray-300">
                            Completa tu primera ruta para ver tu mapa de calor
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Explora lugares y guarda tus aventuras
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* HISTORIAL DE RUTAS RECIENTES */}
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">
                      Historial de Rutas Recientes
                    </h3>
                    {rutasCompletadas.length > 0 ? (
                      <div className="space-y-3">
                        {rutasCompletadas.slice(0, 5).map((ruta, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-white">
                                {ruta.lugarNombre}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {ruta.distancia.toFixed(1)} km • {ruta.duracion} min
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(ruta.fecha).toLocaleDateString()}
                              </p>
                              <span className="inline-block bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                                {ruta.tipoActividad}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FaRoute className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-300">
                          Aún no has completado rutas
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Navega a lugares y completa rutas para ver tu historial aquí
                        </p>
                      </div>
                    )}
                  </div>

                  {/* LOGROS Y RECOMPENSAS */}
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                      <FaTrophy /> Logros por Desbloquear
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                        <div className="text-2xl mb-2">🥾</div>
                        <p className="font-semibold">Primera Aventura</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Completa tu primera ruta
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: rutasCompletadas.length > 0 ? '100%' : '0%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                        <div className="text-2xl mb-2">🏞️</div>
                        <p className="font-semibold">Explorador Novato</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Visita 3 lugares diferentes
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((estadisticas?.lugaresUnicos || 0) / 3 * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* GALERÍA MEJORADA */}
          {activeTab === "galeria" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Mi Galería de Aventuras</h2>
                <div className="flex gap-2">
                  <label className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 dark:hover:bg-green-600 transition flex items-center gap-2">
                    <FaCamera /> Subir Aventura
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {userPhotos.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <FaImages className="text-6xl text-gray-300 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Aún no tienes aventuras en tu galería</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Comparte tu primera aventura usando el botón "Subir Aventura"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userPhotos.map((photo) => (
                    <div key={photo._id} className="relative group bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.description}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                      
                      {/* Botones de acción */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditPhoto(photo)}
                          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
                          title="Editar aventura"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo._id)}
                          disabled={deletingPhoto === photo._id}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition shadow-lg disabled:bg-gray-400"
                          title="Eliminar aventura"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>

                      {/* Información de la foto */}
                      <div className="p-3">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {photo.description || "Mi aventura en la naturaleza"}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-600 dark:text-gray-400">
                          <FaMapMarkerAlt size={10} />
                          <span className="truncate">{photo.location || "Ubicación no especificada"}</span>
                        </div>
                        {photo.activity && (
                          <div className="mt-1">
                            <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                              {getActivityLabel(photo.activity)}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(photo.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONFIGURACIÓN CON MODO OSCURO GLOBAL */}
          {activeTab === "config" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Configuración</h2>
              
              {/* Modo Oscuro Global */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Modo Oscuro Global
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {darkMode ? "Modo oscuro activado en toda la app" : "Modo claro activado en toda la app"}
                    </p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className="sr-only">Modo oscuro</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center justify-center w-5">
                      <FaSun size={10} className={`text-yellow-500 ${darkMode ? 'opacity-0' : 'opacity-100'}`} />
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center w-5">
                      <FaMoon size={10} className={`text-blue-400 ${darkMode ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Cambiar contraseña */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Cambiar contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border rounded-md p-2 w-full mb-3 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  placeholder="Nueva contraseña"
                />
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full disabled:bg-gray-300 dark:disabled:bg-gray-600"
                >
                  Cambiar contraseña
                </button>
              </div>

              {/* Redes sociales */}
              <div className="flex justify-center gap-6 text-2xl text-gray-600 dark:text-gray-400">
                <a
                  href={`https://facebook.com/sharer/sharer.php?u=https://ecolibres.com/perfil/${user.uid || user.email}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-700 dark:hover:text-blue-400 transition"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-pink-700 dark:hover:text-pink-400 transition"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://twitter.com/intent/tweet?text=Mis logros en Ecolibres`"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-500 dark:hover:text-blue-300 transition"
                >
                  <FaTwitter />
                </a>
              </div>

              {/* Cerrar sesión */}
              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition w-full"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE SUBIR AVENTURA */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Compartir Aventura</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {filePreview && (
                <img
                  src={filePreview}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg border dark:border-gray-600"
                />
              )}
              
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Descripción de tu aventura
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full border rounded-md p-2 h-20 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Comparte los detalles de tu aventura en la naturaleza..."
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {uploadDescription.length}/200 caracteres
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Ubicación
                </label>
                <input
                  type="text"
                  value={uploadLocation}
                  onChange={(e) => setUploadLocation(e.target.value)}
                  className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="¿Dónde fue tu aventura?"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de actividad
                </label>
                <select
                  value={uploadActivity}
                  onChange={(e) => setUploadActivity(e.target.value)}
                  className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Selecciona una actividad</option>
                  {activities.map((activity) => (
                    <option key={activity.value} value={activity.value}>
                      {activity.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGalleryUpload}
                  disabled={uploading || !selectedFile}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300"
                >
                  {uploading ? "Subiendo..." : "Subir Aventura"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Editar Aventura</h3>
              <button
                onClick={() => setEditingPhoto(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <img
                src={editingPhoto.url}
                alt="Editando"
                className="w-full h-48 object-cover rounded-lg"
              />
              
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border rounded-md p-2 h-20 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Describe tu aventura..."
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {editDescription.length}/200 caracteres
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="¿Dónde tomaste esta foto?"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de actividad
                </label>
                <select
                  value={editActivity}
                  onChange={(e) => setEditActivity(e.target.value)}
                  className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Selecciona una actividad</option>
                  {activities.map((activity) => (
                    <option key={activity.value} value={activity.value}>
                      {activity.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <FaSave /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje flotante */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in z-50">
          {message}
        </div>
      )}
    </div>
  );
}