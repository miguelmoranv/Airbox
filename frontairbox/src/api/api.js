import axios from "axios";

const API_URL = "https://airboxback.vercel.app/api/lotes";

// Obtener todos los lotes
export const fetchLotes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
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

// Eliminar un lote
export const deleteLote = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error("Error deleting lote");
  }
};
