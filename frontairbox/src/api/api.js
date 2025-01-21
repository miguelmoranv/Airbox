import axios from "axios";

const API_URL = "https://airboxback.vercel.app/api/lotes";

// Obtener todos los lotes con conteo de cajas
export const fetchLotes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Aquí ya llega con el conteo de cajas
  } catch (error) {
    throw new Error("Error fetching lotes");
  }
};

// Crear un nuevo lote
export const createLote = async (no_serial) => {
  try {
    const response = await axios.post(API_URL, { no_serial });
    return response.data;
  } catch (error) {
    throw new Error("Error creating lote");
  }
};

// Eliminar un lote por ID
export const deleteLote = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error("Error deleting lote");
  }
};

// Obtener un lote por ID (para cuando sea necesario)
export const fetchLoteById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching lote by ID");
  }
};
