// ✅ Importa las funciones necesarias del SDK modular de Firebase
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getIdToken,
  updateProfile,

  // ⬅ AÑADIDO: Importaciones para Google Sign-In
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

// 🧩 Configuración de Firebase (datos reales del proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyBg_MLIEqy8-yGnX1HtlDH_2KIi-FuLM",
  authDomain: "ecoturismo-5a0e0.firebaseapp.com",
  projectId: "ecoturismo-5a0e0",
  storageBucket: "ecoturismo-5a0e0.appspot.com",
  messagingSenderId: "1046038352351",
  appId: "1:1046038352351:web:25d154de1f65041489346a",
  measurementId: "G-QSCEL7X9NW"
};

// 🚀 Inicializa Firebase
const app = initializeApp(firebaseConfig);

// --- Servicios principales ---
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// --- Servicio para MongoDB Atlas ---
// 🔥 CORREGIDO: Usar variable de entorno de Vite para frontend
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

export const mongoService = {
  // Crear usuario en MongoDB
  async createUser(userData) {
    try {
      console.log("MONGO SERVICE: Creando usuario en MongoDB Atlas...", userData);
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creando usuario en MongoDB');
      }

      const result = await response.json();
      console.log("MONGO SERVICE: Usuario creado exitosamente en MongoDB");
      return result;
    } catch (error) {
      console.error('MONGO SERVICE: Error en createUser:', error);
      throw error;
    }
  },

  // Obtener usuario desde MongoDB
  async getUser(uid) {
    try {
      console.log("MONGO SERVICE: Obteniendo usuario desde MongoDB...", uid);
      const response = await fetch(`${API_BASE_URL}/users/${uid}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuario no encontrado en MongoDB'); // Mensaje clave
        }
        throw new Error('Error obteniendo usuario de MongoDB');
      }

      const userData = await response.json();
      console.log("MONGO SERVICE: Usuario obtenido exitosamente");
      return userData;
    } catch (error) {
      console.error('MONGO SERVICE: Error en getUser:', error);
      throw error;
    }
  },

  // Actualizar usuario completo
  async updateUser(uid, userData) {
    try {
      console.log("MONGO SERVICE: Actualizando usuario en MongoDB...", uid);
      const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error actualizando usuario en MongoDB');
      }

      const result = await response.json();
      console.log("MONGO SERVICE: Usuario actualizado exitosamente");
      return result;
    } catch (error) {
      console.error('MONGO SERVICE: Error en updateUser:', error);
      throw error;
    }
  },

  // Actualizar logros del usuario
  async updateUserAchievements(uid, achievements) {
    try {
      console.log("MONGO SERVICE: Actualizando logros en MongoDB...", uid, achievements);
      const response = await fetch(`${API_BASE_URL}/users/${uid}/achievements`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logros: achievements })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error actualizando logros');
      }

      const result = await response.json();
      console.log("MONGO SERVICE: Logros actualizados exitosamente");
      return result;
    } catch (error) {
      console.error('MONGO SERVICE: Error en updateUserAchievements:', error);
      throw error;
    }
  },

  // Agregar un logro específico
  async addAchievement(uid, achievement) {
    try {
      console.log("MONGO SERVICE: Agregando logro en MongoDB...", uid, achievement);
      const response = await fetch(`${API_BASE_URL}/users/${uid}/achievements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(achievement)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error agregando logro');
      }

      const result = await response.json();
      console.log("MONGO SERVICE: Logro agregado exitosamente");
      return result;
    } catch (error) {
      console.error('MONGO SERVICE: Error en addAchievement:', error);
      throw error;
    }
  },

  // Obtener solo los logros del usuario
  async getUserAchievements(uid) {
    try {
      console.log("MONGO SERVICE: Obteniendo logros desde MongoDB...", uid);
      const user = await this.getUser(uid);
      return user.logros || [];
    } catch (error) {
      console.error('MONGO SERVICE: Error en getUserAchievements:', error);
      throw error;
    }
  },

  // 🔥 NUEVO: Sincronizar usuario (para login con Google y otros)
  async syncUser(userData) {
    try {
      console.log("MONGO SERVICE: Sincronizando usuario...", userData);
      const response = await fetch(`${API_BASE_URL}/user/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await userData.getIdToken?.()}`,
        },
        body: JSON.stringify({
          email: userData.email,
          uid: userData.uid,
          displayName: userData.displayName || "",
          photoURL: userData.photoURL || ""
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error sincronizando usuario');
      }

      const result = await response.json();
      console.log("MONGO SERVICE: Usuario sincronizado exitosamente");
      return result;
    } catch (error) {
      console.error('MONGO SERVICE: Error en syncUser:', error);
      throw error;
    }
  }
};

// --- Funciones de autenticación ---

// 🧩 Proveedor de Google
const googleProvider = new GoogleAuthProvider();

/**
 * Inicia sesión con Google a través de un popup.
 * Crea el usuario en MongoDB si es la primera vez.
 * @returns {Promise<UserCredential>}
 */
export const loginWithGoogle = async () => {
  try {
    console.log("FIREBASE UTILS: 1. Iniciando sesión con Google...");

    // 1. Iniciar sesión con Google (Popup)
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    console.log("FIREBASE UTILS: 2. Usuario autenticado en Auth. UID:", user.uid);

    // 2. Comprobar si el usuario existe en MongoDB Atlas (Lógica de Upsert)
    try {
      await mongoService.getUser(user.uid);
      console.log("FIREBASE UTILS: 3. Usuario ya existe en MongoDB. No se requiere creación.");
    } catch (error) {
      // Si el error es 'Usuario no encontrado en MongoDB', procedemos a crearlo.
      if (error.message === 'Usuario no encontrado en MongoDB') {
        console.log("FIREBASE UTILS: 3. Usuario NUEVO. Creando registro en MongoDB Atlas...");
        await mongoService.createUser({
          uid: user.uid,
          email: user.email,
          // Usamos el displayName y photoURL que vienen de Google
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
          logros: [],
        });
        console.log("FIREBASE UTILS: 4. Usuario creado en MongoDB Atlas exitosamente.");
      } else {
        // Re-lanzar otros errores (ej. error de red con el API)
        throw error;
      }
    }

    console.log("FIREBASE UTILS: 5. Finalizando función loginWithGoogle.");
    return userCredential;
  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR en loginWithGoogle:", error.code, error.message);

    // Manejar errores específicos de Google
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error("El inicio de sesión fue cancelado.");
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error("Error de conexión. Revisa tu internet.");
    }

    throw error;
  }
};

/**
 * Inicia sesión con correo y contraseña.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export const login = async (email, password) => {
  try {
    console.log("FIREBASE UTILS: Iniciando sesión...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("FIREBASE UTILS: Sesión iniciada exitosamente");
    return userCredential;
  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR en login:", error.code, error.message);
    throw error;
  }
};

/**
 * Registra un nuevo usuario con correo y contraseña.
 * Crea el usuario en Firebase Auth y luego en MongoDB Atlas.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export const register = async (email, password) => {
  try {
    console.log("FIREBASE UTILS: 1. Llamando a Firebase Auth para crear usuario...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("FIREBASE UTILS: 2. Usuario creado en Auth. UID:", user.uid);

    // ✅ NUEVO: Crear usuario en MongoDB Atlas
    console.log("FIREBASE UTILS: 2.5. Creando usuario en MongoDB Atlas...");
    await mongoService.createUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: new Date().toISOString(),
      logros: [], // Array vacío inicial para logros
    });
    console.log("FIREBASE UTILS: 2.6. Usuario creado en MongoDB Atlas exitosamente.");

    console.log("FIREBASE UTILS: 3. Finalizando función register.");
    return userCredential;
  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR en register:", error.code, error.message);

    // Si falla la creación en MongoDB, podrías considerar eliminar el usuario de Auth
    if (auth.currentUser) {
      try {
        await auth.currentUser.delete();
        console.log("FIREBASE UTILS: Usuario eliminado de Auth debido a error en MongoDB");
      } catch (deleteError) {
        console.error("FIREBASE UTILS: Error eliminando usuario de Auth:", deleteError);
      }
    }

    throw error;
  }
};

// --- Función para actualizar datos del perfil ---
/**
 * Actualiza el nombre o la foto de perfil del usuario.
 * Actualiza tanto en Firebase Auth como en MongoDB Atlas.
 * @param {object} updates { displayName?, photoURL? }
 */
export const updateUserProfile = async (updates = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay usuario autenticado");

  try {
    console.log("FIREBASE UTILS: Actualizando perfil...", updates);

    // Actualizar en Firebase Auth
    await updateProfile(user, updates);
    console.log("FIREBASE UTILS: Perfil actualizado en Firebase Auth");

    // Actualizar en MongoDB Atlas
    await mongoService.updateUser(user.uid, updates);
    console.log("FIREBASE UTILS: Perfil actualizado en MongoDB Atlas");

  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR al actualizar perfil:", error);
    throw error;
  }
};

// --- Función para subir imágenes al Storage ---
/**
 * Sube una imagen al Storage y devuelve su URL pública.
 * @param {File} file Archivo de imagen
 * @param {string} path Ruta en el storage (por ejemplo 'profilePictures/uid')
 * @returns {Promise<string>} URL de descarga
 */
export const uploadImageAndGetURL = async (file, path) => {
  if (!file) throw new Error("No se seleccionó ningún archivo");

  try {
    console.log("FIREBASE UTILS: Subiendo imagen...", path);
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    console.log("FIREBASE UTILS: Imagen subida exitosamente. URL:", url);
    return url;
  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR subiendo imagen:", error);
    throw error;
  }
};

// --- Funciones específicas para logros ---

/**
 * Obtiene los logros del usuario desde MongoDB Atlas
 * @param {string} uid User ID
 * @returns {Promise<Array>} Array de logros
 */
export const getUserAchievements = async (uid) => {
  try {
    console.log("FIREBASE UTILS: Obteniendo logros del usuario...", uid);
    const achievements = await mongoService.getUserAchievements(uid);
    console.log("FIREBASE UTILS: Logros obtenidos exitosamente");
    return achievements;
  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR obteniendo logros:", error);
    throw error;
  }
};

/**
 * Agrega un nuevo logro al usuario en MongoDB Atlas
 * @param {string} uid User ID
 * @param {object} achievement Objeto del logro
 * @returns {Promise<object>} Usuario actualizado
 */
export const addUserAchievement = async (uid, achievement) => {
  try {
    console.log("FIREBASE UTILS: Agregando logro...", uid, achievement);
    const result = await mongoService.addAchievement(uid, {
      ...achievement,
      fechaObtencion: new Date().toISOString()
    });
    console.log("FIREBASE UTILS: Logro agregado exitosamente");
    return result;
  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR agregando logro:", error);
    throw error;
  }
};

/**
 * Actualiza todos los logros del usuario en MongoDB Atlas
 * @param {string} uid User ID
 * @param {Array} achievements Array completo de logros
 * @returns {Promise<object>} Usuario actualizado
 */
export const updateAllUserAchievements = async (uid, achievements) => {
  try {
    console.log("FIREBASE UTILS: Actualizando todos los logros...", uid);
    const result = await mongoService.updateUserAchievements(uid, achievements);
    console.log("FIREBASE UTILS: Logros actualizados exitosamente");
    return result;
  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR actualizando logros:", error);
    throw error;
  }
};

/**
 * Obtiene todos los datos del usuario desde MongoDB Atlas
 * @param {string} uid User ID
 * @returns {Promise<object>} Datos completos del usuario
 */
export const getUserData = async (uid) => {
  try {
    console.log("FIREBASE UTILS: Obteniendo datos completos del usuario...", uid);
    const userData = await mongoService.getUser(uid);
    console.log("FIREBASE UTILS: Datos del usuario obtenidos exitosamente");
    return userData;
  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR obteniendo datos del usuario:", error);
    throw error;
  }
};

// 🔥 NUEVO: Función de sincronización para AuthModal
export const syncUserWithBackend = async (user) => {
  try {
    console.log("FIREBASE UTILS: Sincronizando usuario con backend...");
    const result = await mongoService.syncUser(user);
    console.log("FIREBASE UTILS: Usuario sincronizado exitosamente");
    return result;
  } catch (error) {
    console.error("FIREBASE UTILS: 🚨 ERROR sincronizando usuario:", error);
    throw error;
  }
};

// --- Utilidades de autenticación básicas ---
export { onAuthStateChanged, signOut, getIdToken };

// Exporta todo por si se necesita en otros módulos
export {
  ref,
  uploadBytes,
  getDownloadURL,
  doc,
  setDoc,
  getDoc
};

// 🔚 Exporta la app principal por compatibilidad
export default app;