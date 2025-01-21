import axios from "axios";

// Configuración de Axios
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Reemplaza con la URL de tu API
  headers: {
    'Content-Type': 'application/json', // Asegura que el contenido sea JSON
  },
});

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
