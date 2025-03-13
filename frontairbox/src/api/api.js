import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const URLLOCAL = "http://localhost:4000/api";
const URLVERCEL = "https://airboxback.vercel.app/api";

const URLPRO = `${URLVERCEL}`;

// Configuración de Axios
const api = axios.create({
  baseURL: URLPRO, // Reemplaza con la URL de tu API
  headers: {
    'Content-Type': 'application/json', // Asegura que el contenido sea JSON
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funcion para el inicio de sesión
export const login = async (no_empleado_users, contrasena) => {
  if (!no_empleado_users || !contrasena) {
    throw new Error('Número de empleado y contraseña son requeridos');
  }

  try {
    console.log("Datos enviados:", { no_empleado_users, contrasena });
    const response = await api.post('/usuarios/login', { no_empleado_users, contrasena });
    localStorage.setItem('token', response.data.token);
    console.log('Token guardado en localStorage:', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);

    if (error.response) {
      // Error de respuesta del servidor (por ejemplo, credenciales incorrectas)
      throw new Error(error.response.data.message || 'Error en el servidor');
    } else if (error.request) {
      // Error de red (no se recibió respuesta)
      throw new Error('Error de red. Por favor, verifica tu conexión a internet.');
    } else {
      // Otros errores
      throw new Error('Error inesperado al iniciar sesión');
    }
  }
};

// Función para obtener los lotes
export const fetchLotes = async () => {
  try {
    const response = await api.get('/lotes');
    return response.data; // En Axios, el cuerpo de la respuesta está en `response.data`
  } catch (error) {
    console.error("Error fetching lotes:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para crear un nuevo lote
export const createLote = async (noSerial) => {
  try {
    const response = await api.post('/lotes', { no_serial: noSerial });
    return response.data;
  } catch (error) {
    console.error('Error creando el lote:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para eliminar un lote
export const deleteLote = async (id) => {
  try {
    const response = await api.delete(`/lotes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando el lote:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para actualizar un lote
export const updateLote = async (id, noSerial) => {
  try {
    const response = await api.put(`/lotes/${id}`, { no_serial: noSerial });
    return response.data;
  } catch (error) {
    console.error("Error actualizando el lote:", error.response ? error.response.data : error.message);
    throw error;
  }
};


export const fetchCajas = async (id_lote) => {
  if (!id_lote) {
    console.error("ID de lote no definido.");
    return; // Salir si id_lote no está disponible
  }

  try {
    const response = await api.get(`/cajas/lote/${id_lote}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cajas:", error.response ? error.response.data : error.message);
    throw error;
  }
};


// Función para obtener una caja por ID
export const fetchCajaById = async (id) => {
  try {
    const response = await api.get(`/cajas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching caja by ID:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para crear una nueva caja para un lote específico
export const createCaja = async ( cajaData, id_lote) => {
  try {
    // Asegúrate de enviar solo el id_lote como string o número
    console.log('Datos de la caja que se enviarán:', { ...cajaData, fg_lote: id_lote });

    const response = await api.post('/cajas', {
      ...cajaData,
      fg_lote: id_lote, // Aquí asegúrate de que solo se pase el valor de id_lote
    });

    console.log('Caja creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creando la caja:', error.response ? error.response.data : error.message);
    throw error;
  }
};




// Función para eliminar una caja
export const deleteCaja = async (id) => {
  try {
    const response = await api.delete(`/cajas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando la caja:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para actualizar una caja
export const updateCaja = async (id, cajaData) => {
  try {
    const response = await api.put(`/cajas/${id}`, cajaData);
    return response.data;
  } catch (error) {
    console.error("Error actualizando la caja:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Obtener todos los auxiliares
export const getAuxiliares = async () => {
  const response = await api.get('/auxiliares');
  return response.data;
};

// Obtener un auxiliar por ID
export const getAuxiliarById = async (id) => {
  const response = await api.get(`${'/auxiliares'}/${id}`);
  return response.data;
};

// Auxiliares por usuarios
export const getAuxiliarByFgUser = async (id) => {
  const response = await api.get (`${'/auxiliares/users'}/${id}`)
  return response.data;
}

// Crear un nuevo auxiliar
export const createAuxiliar = async (auxiliar) => {
  const response = await api.post('/auxiliares', auxiliar);
  return response.data;
};

// Actualizar un auxiliar por ID
export const updateAuxiliar = async (id, auxiliar) => {
  const response = await api.put(`${'/auxiliares'}/${id}`, auxiliar);
  return response.data;
};

// Eliminar un auxiliar por ID
export const deleteAuxiliar = async (id) => {
  const response = await api.delete(`${'/auxiliares'}/${id}`);
  return response.data;
};

export const fetchUserById = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data; // Asegúrate de que tu API devuelve un objeto con el campo "nombre"
  } catch (error) {
    console.error("Error al obtener el usuario:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error) {
    console.error("Error fetching usuarios:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching usuario by ID:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Crear un nuevo usuario
export const createUsuario = async (usuario) => {
  try {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  } catch (error) {
    console.error("Error creating usuario:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Actualizar un usuario por ID
export const updateUsuario = async (id, usuario) => {
  try {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  } catch (error) {
    console.error("Error updating usuario:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Eliminar un usuario por ID
export const deleteUsuario = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting usuario:", error.response ? error.response.data : error.message);
    throw error;
  }
};