const { Connect } = require('../db'); // Ajusta la ruta según tu estructura

// Obtener todos los auxiliares
exports.getAuxiliares = async (req, res) => {
  try {
    const connection = await Connect();

    const [rows] = await connection.query(
      `SELECT id_auxiliar, nombre_auxiliar, apellidos_auxiliar, no_empleado_auxiliar, fg_users 
       FROM auxiliares`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los auxiliares" });
  }
};

// Obtener un auxiliar por ID
exports.getAuxiliarById = async (req, res) => {
  try {
    const connection = await Connect();
    const { id } = req.params;

    const [rows] = await connection.query(
      `SELECT id_auxiliar, nombre_auxiliar, apellidos_auxiliar, no_empleado_auxiliar, fg_users 
       FROM auxiliares
       WHERE id_auxiliar = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Auxiliar no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el auxiliar" });
  }
};


// Obtener un auxiliar por ID
exports.getAuxiliarByFgUser = async (req, res) => {
    try {
      const connection = await Connect();
      const { fg_users } = req.params;
  
      const [rows] = await connection.query(
        `SELECT id_auxiliar, nombre_auxiliar, apellidos_auxiliar, no_empleado_auxiliar, fg_users 
         FROM auxiliares
         WHERE fg_users = ?`,
        [fg_users]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Auxiliar no encontrado" });
      }
  
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el auxiliar" });
    }
  };

// Crear un nuevo auxiliar
exports.createAuxiliar = async (req, res) => {
  try {
    const connection = await Connect();
    const { nombre_auxiliar, apellidos_auxiliar, no_empleado_auxiliar, fg_users } = req.body;

    const [result] = await connection.query(
      `INSERT INTO auxiliares (nombre_auxiliar, apellidos_auxiliar, no_empleado_auxiliar, fg_users)
       VALUES (?, ?, ?, ?)`,
      [nombre_auxiliar, apellidos_auxiliar, no_empleado_auxiliar, fg_users]
    );

    res.status(201).json({
      message: "Auxiliar creado con éxito",
      auxiliarId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el auxiliar" });
  }
};

// Actualizar un auxiliar por ID
exports.updateAuxiliar = async (req, res) => {
  try {
    const connection = await Connect();
    const { id } = req.params;
    const { nombre_auxiliar, apellidos_auxiliar, no_empleado_auxiliar, fg_users } = req.body;

    const [result] = await connection.query(
      `UPDATE auxiliares
       SET nombre_auxiliar = ?, apellidos_auxiliar = ?, no_empleado_auxiliar = ?, fg_users = ?
       WHERE id_auxiliar = ?`,
      [nombre_auxiliar, apellidos_auxiliar, no_empleado_auxiliar, fg_users, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Auxiliar no encontrado" });
    }

    res.status(200).json({ message: "Auxiliar actualizado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el auxiliar" });
  }
};

// Eliminar un auxiliar por ID
exports.deleteAuxiliar = async (req, res) => {
  try {
    const connection = await Connect();
    const { id } = req.params;

    const [result] = await connection.query(
      `DELETE FROM auxiliares WHERE id_auxiliar = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Auxiliar no encontrado" });
    }

    res.status(200).json({ message: "Auxiliar eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el auxiliar" });
  }
};
