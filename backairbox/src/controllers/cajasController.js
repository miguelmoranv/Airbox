const { Connect } = require('../db'); // Ajusta la ruta según tu estructura de archivos

// Obtener todas las cajas con datos de users y auxiliares
exports.getCajas = async (req, res) => {
    try {
      const connection = await Connect();
  
      const [rows] = await connection.query(
        `
        SELECT 
          cajas.id_caja, 
          cajas.no_parte, 
          cajas.no_piezas, 
          cajas.piezas_mal, 
          cajas.piezas_bien, 
          cajas.comentarios, 
          cajas.fecha_hora, 
          cajas.fg_user, 
          cajas.fg_auxiliares, 
          cajas.fg_lote,
          cajas.caja_serie,
          users.nombres_users AS user_nombre, 
          users.apellidos_users AS user_apellido, 
          users.no_empleado_users AS user_no_empleado,
          auxiliares.nombre_auxiliar AS auxiliar_nombre, 
          auxiliares.apellidos_auxiliar AS auxiliar_apellido, 
          auxiliares.no_empleado_auxiliar AS auxiliar_no_empleado,
          lote.no_serial AS lote_no_serial
        FROM cajas
        LEFT JOIN users ON cajas.fg_user = users.id_user
        LEFT JOIN auxiliares ON cajas.fg_auxiliares = auxiliares.id_auxiliar
        LEFT JOIN lote ON cajas.fg_lote = lote.id_lote
        `
      );
  
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener las cajas" });
    }
  };
  
// Obtener una caja por ID con datos de users y auxiliares
exports.getCajaById = async (req, res) => {
    try {
      const connection = await Connect();
      const { id } = req.params;
  
      const [rows] = await connection.query(
        `
        SELECT 
          cajas.id_caja, 
          cajas.no_parte, 
          cajas.no_piezas, 
          cajas.piezas_mal, 
          cajas.piezas_bien, 
          cajas.comentarios, 
          cajas.fecha_hora, 
          cajas.fg_user, 
          cajas.fg_auxiliares, 
          cajas.fg_lote,
          cajas.caja_serie,
          users.nombres_users AS user_nombre, 
          users.apellidos_users AS user_apellido, 
          users.no_empleado_users AS user_no_empleado,
          auxiliares.nombre_auxiliar AS auxiliar_nombre, 
          auxiliares.apellidos_auxiliar AS auxiliar_apellido, 
          auxiliares.no_empleado_auxiliar AS auxiliar_no_empleado,
          lote.no_serial AS lote_no_serial
        FROM cajas
        LEFT JOIN users ON cajas.fg_user = users.id_user
        LEFT JOIN auxiliares ON cajas.fg_auxiliares = auxiliares.id_auxiliar
        LEFT JOIN lote ON cajas.fg_lote = lote.id_lote
        WHERE cajas.id_caja = ?
        `,
        [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Caja no encontrada" });
      }
  
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener la caja" });
    }
  };



  exports.getCajaByLote = async (req, res) => {
    try {
      const connection = await Connect();
      const { id } = req.params;
  
      const [rows] = await connection.query(
        `
        SELECT 
          cajas.id_caja, 
          cajas.no_parte, 
          cajas.no_piezas, 
          cajas.piezas_mal, 
          cajas.piezas_bien, 
          cajas.comentarios, 
          cajas.fecha_hora, 
          cajas.fg_user, 
          cajas.fg_auxiliares, 
          cajas.fg_lote,
          cajas.caja_serie,
          users.nombres_users AS user_nombre, 
          users.apellidos_users AS user_apellido, 
          users.no_empleado_users AS user_no_empleado,
          auxiliares.nombre_auxiliar AS auxiliar_nombre, 
          auxiliares.apellidos_auxiliar AS auxiliar_apellido, 
          auxiliares.no_empleado_auxiliar AS auxiliar_no_empleado,
          lote.no_serial AS lote_no_serial
        FROM cajas
        LEFT JOIN users ON cajas.fg_user = users.id_user
        LEFT JOIN auxiliares ON cajas.fg_auxiliares = auxiliares.id_auxiliar
        LEFT JOIN lote ON cajas.fg_lote = lote.id_lote
        WHERE lote.id_lote = ?
        `,
        [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Caja no encontrada" });
      }
  
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener la caja" });
    }
  };
  

// Crear una nueva caja
exports.createCaja = async (req, res) => {
  try {
    const connection = await Connect();
    const { no_parte, no_piezas, piezas_mal, piezas_bien, comentarios, fecha_hora, fg_user, fg_auxiliares, fg_lote } =
      req.body;

    const [result] = await connection.query(
      `INSERT INTO cajas (no_parte, no_piezas, piezas_mal, piezas_bien, comentarios, fecha_hora, fg_user, fg_auxiliares, fg_lote, caja_serie)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [no_parte, no_piezas, piezas_mal, piezas_bien, comentarios, fecha_hora, fg_user, fg_auxiliares, fg_lote]
    );

    res.status(201).json({
      message: "Caja creada con éxito",
      cajaId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la caja" });
  }
};

// Actualizar una caja por ID
exports.updateCaja = async (req, res) => {
  try {
    const connection = await Connect();
    const { id } = req.params;
    const { no_parte, no_piezas, piezas_mal, piezas_bien, comentarios, fecha_hora, fg_user, fg_auxiliares, fg_lote } =
      req.body;

    const [result] = await connection.query(
      `UPDATE cajas
       SET no_parte = ?, no_piezas = ?, piezas_mal = ?, piezas_bien = ?, comentarios = ?, fecha_hora = ?, fg_user = ?, fg_auxiliares = ?, fg_lote = ?, caja_serie = ?
       WHERE id_caja = ?`,
      [no_parte, no_piezas, piezas_mal, piezas_bien, comentarios, fecha_hora, fg_user, fg_auxiliares, fg_lote, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Caja no encontrada" });
    }

    res.status(200).json({ message: "Caja actualizada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la caja" });
  }
};

// Eliminar una caja por ID
exports.deleteCaja = async (req, res) => {
  try {
    const connection = await Connect();
    const { id } = req.params;

    const [result] = await connection.query(
      `DELETE FROM cajas WHERE id_caja = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Caja no encontrada" });
    }

    res.status(200).json({ message: "Caja eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la caja" });
  }
};
