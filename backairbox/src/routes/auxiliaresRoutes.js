const express = require('express');
const router = express.Router();
const auxiliaresController = require('../controllers/auxiliaresController'); // Ajusta la ruta según tu estructura
const verifyToken = require("../middlewares/verifyToken")
// Rutas para la tabla "auxiliares"
router.get('/', verifyToken, auxiliaresController.getAuxiliares); // Obtener todos los auxiliares
router.get('/:id', verifyToken, auxiliaresController.getAuxiliarById); // Obtener un auxiliar por ID
router.post('/', verifyToken, auxiliaresController.createAuxiliar); // Crear un nuevo auxiliar
router.put('/:id', verifyToken, auxiliaresController.updateAuxiliar); // Actualizar un auxiliar por ID
router.delete('/:id', verifyToken, auxiliaresController.deleteAuxiliar); // Eliminar un auxiliar por ID
 

router.get('/users/:fg_users', verifyToken, auxiliaresController.getAuxiliarByFgUser)

module.exports = router;