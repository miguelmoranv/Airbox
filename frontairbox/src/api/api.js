import axios from "axios";

// Configuración de Axios
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Reemplaza con la URL de tu API
  headers: {
    'Content-Type': 'application/json', // Asegura que el contenido sea JSON
  },
});


// Función para manejar el inicio de sesión
export const login = async (no_empleado_users, contrasena) => {
  try {
    console.log('Enviando solicitud POST a /usuarios/login');
    console.log('Datos enviados:', { no_empleado_users, contrasena });
    
    const response = await api.post('/usuarios/login', {
      no_empleado_users,
      contrasena
    });

    return response.data; // Devuelve la respuesta de la API
  } catch (error) {
    console.error('Error en la solicitud:', error.response ? error.response.data : error.message);
    throw error; // Lanza el error para ser manejado por el componente
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