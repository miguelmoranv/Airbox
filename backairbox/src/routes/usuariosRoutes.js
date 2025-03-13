const express = require("express");
const userController = require("../controllers/usuariosController");
const verifyToken = require("../middlewares/verifyToken")
const router = express.Router();

// Rutas CRUD
router.post("/", userController.createUser); // Crear usuario
router.get("/", verifyToken, userController.getUsers); // Obtener todos los usuarios
router.get("/:id_user", verifyToken, userController.getUserById); // Obtener un usuario por ID
router.put("/:id_user", verifyToken, userController.updateUser); // Actualizar usuario
router.delete("/:id_user", verifyToken, userController.deleteUser); // Eliminar usuario
    

router.post("/login", userController.loginUsuario)

module.exports = router;

