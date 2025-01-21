const { Connect } = require('../db');

// Obtener todos los lotes con conteo de cajas
exports.getLotes = async (req, res) => {
  try {
    const connection = await Connect();

    const [rows] = await connection.query(
      `
      SELECT 
        lote.id_lote, 
        lote.no_serial, 
        COUNT(cajas.id_caja) AS total_cajas
      FROM lote
      LEFT JOIN cajas ON lote.id_lote = cajas.fg_lote
      GROUP BY lote.id_lote, lote.no_serial
      `
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener lotes" });
  }
};

// Obtener un lote por ID con conteo de cajas
exports.getLoteById = async (req, res) => {
  try {
    const connection = await Connect();
    const { id } = req.params;

    const [rows] = await connection.query(
      `
      SELECT 
        lote.id_lote, 
        lote.no_serial, 
        COUNT(cajas.id_caja) AS total_cajas
      FROM lote
      LEFT JOIN cajas ON lote.id_lote = cajas.fg_lote
      WHERE lote.id_lote = ?
      GROUP BY lote.id_lote, lote.no_serial
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Lote no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el lote" });
  }
};

  
  // Crear un nuevo lote
  exports.createLote = async (req, res) => {
    try {
      const connection = await Connect();
      const { no_serial } = req.body;
  
      const [result] = await connection.query(
        `INSERT INTO lote (no_serial) VALUES (?)`,
        [no_serial]
      );
  
      res.status(201).json({
        message: "Lote creado con éxito",
        loteId: result.insertId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el lote" });
    }
  };
  
  // Actualizar un lote por ID
  exports.updateLote = async (req, res) => {
    try {
      const connection = await Connect();
      const { id } = req.params;
      const { no_serial } = req.body;
  
      const [result] = await connection.query(
        `UPDATE lote SET no_serial = ? WHERE id_lote = ?`,
        [no_serial, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Lote no encontrado" });
      }
  
      res.status(200).json({ message: "Lote actualizado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el lote" });
    }
  };
  
  // Eliminar un lote por ID
  exports.deleteLote = async (req, res) => {
    try {
      const connection = await Connect();
      const { id } = req.params;
  
      const [result] = await connection.query(
        `DELETE FROM lote WHERE id_lote = ?`,
        [id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Lote no encontrado" });
      }
  
      res.status(200).json({ message: "Lote eliminado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el lote" });
    }
  };