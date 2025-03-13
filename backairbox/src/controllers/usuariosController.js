require('dotenv').config()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Connect } = require("../db");
const saltRounds = 10;

 
const JWT_SECRET = process.env.JWT_SECRET ; 



exports.createUser = async (req, res) => {
    const {
      nombres_users,
      apellidos_users,
      no_empleado_users,
      contrasena,
      rol,
    } = req.body;
  
    try {
      const connection = await Connect();
  
      // Verificar si el no_empleado_users ya existe
      const [existingUser] = await connection.query(
        "SELECT * FROM users WHERE no_empleado_users = ?",
        [no_empleado_users]
      );
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "El numero de empleado ya está en uso" });
      }
  
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
  
      // Insertar el nuevo usuario
      const [result] = await connection.query(
        `INSERT INTO users 
        ( nombres_users, apellidos_users, no_empleado_users, contrasena, rol) 
        VALUES (?,?,?,?,?)`,
        [
          nombres_users,
          apellidos_users,
          no_empleado_users,
          hashedPassword,
          rol,
        ]
      );
  
      res.status(201).json({ message: "Usuario creado exitosamente"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  };
  
  
  // Obtener todos los usuarios
  exports.getUsers = async (req, res) => {
    try {
      const connection = await Connect();
  
      const [rows] = await connection.query(
        `SELECT id_user,  nombres_users, apellidos_users, no_empleado_users, contrasena, rol
        FROM users`
      );
  
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  };
  
  // Obtener un usuario por ID
  exports.getUserById = async (req, res) => {
    const { id_user } = req.params;
  
    try {
      const connection = await Connect();
  
      const [rows] = await connection.query(
        `SELECT id_user,  nombres_users, apellidos_users, no_empleado_users, contrasena, rol
        FROM usuarios WHERE id_user = ?`,
        [id_user]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  };
  
  // Actualizar un usuario
  exports.updateUser = async (req, res) => {
    const { id_user } = req.params;
    const {
      nombres_users,
      apellidos_users,
      no_empleado_users,
      contrasena,
      rol,
    } = req.body;
  
    try {
      const connection = await Connect();
  
      let hashedPassword = null;
      if (contrasena) {
        hashedPassword = await bcrypt.hash(contrasena, saltRounds);
      }
  
      // Actualizar usuario
      const query = `
        UPDATE users
        SET
          nombres_users = ?,
          apellidos_users = ?,
          no_empleado_users = ?,
          contrasena = COALESCE(?, contrasena),
          rol = ?
        WHERE id_user = ?
      `;
  
      const values = [
        nombres_users,
        apellidos_users,
        no_empleado_users,
        hashedPassword, // Aquí usamos la contraseña encriptada si existe
        rol,
        id_user,
      ];
  
      const [result] = await connection.query(query, values);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      res.status(200).json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  };
  
  
  // Eliminar un usuario
  exports.deleteUser = async (req, res) => {
    const { id_user } = req.params;
  
    try {
      const connection = await Connect();
  
      await connection.query("DELETE FROM usuarios WHERE id_user = ?", [id_user]);
  
      res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  };


  exports.loginUsuario = async (req, res) => {
    try {
      const { no_empleado_users, contrasena } = req.body;
  
      // Verificar que se proporcionaron ambos campos
      if (!no_empleado_users || !contrasena) {
        throw new Error("Por favor, ingresa el no empleado y la contraseña");
      }
  
      // Conexión a la base de datos
      const connection = await Connect();
  
      // Buscar al usuario por correo electrónico
      const [userRows] = await connection.query(
        "SELECT id_user, nombres_users, apellidos_users, no_empleado_users, contrasena, rol FROM users WHERE no_empleado_users = ?",
        [no_empleado_users]
      );
  
      // Si no se encuentra al usuario
      if (userRows.length === 0) {
        throw new Error("Usuario no encontrado");
      }
  
      const user = userRows[0];
  
      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
      if (!isPasswordValid) {
        throw new Error("Contraseña incorrecta");
      }
  
      // Crear token JWT con datos del usuario
      const token = jwt.sign(
        {
          id_user: user.id_user,
          no_empleado_users: user.no_empleado_users,
          rol: user.rol,
        },
        process.env.JWT_SECRET, // Asegúrate de usar una variable de entorno
        { expiresIn: "1m" } // Token válido por 1 año
      );
  
      // Enviar respuesta con el token y los datos del usuario
      res.status(200).json({
        token,
        id_user: user.id_user,
        nombre_users: user.nombres_users,
        apellidos_users: user.apellidos_users,
        no_empleado_users: user.no_empleado_users,
        rol: user.rol,
      });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  };
  
