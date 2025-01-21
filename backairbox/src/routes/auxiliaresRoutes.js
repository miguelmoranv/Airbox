const express = require('express');
const router = express.Router();
const auxiliaresController = require('../controllers/auxiliaresController'); // Ajusta la ruta según tu estructura

// Rutas para la tabla "auxiliares"
router.get('/', auxiliaresController.getAuxiliares); // Obtener todos los auxiliares
router.get('/:id', auxiliaresController.getAuxiliarById); // Obtener un auxiliar por ID
router.post('/', auxiliaresController.createAuxiliar); // Crear un nuevo auxiliar
router.put('/:id', auxiliaresController.updateAuxiliar); // Actualizar un auxiliar por ID
router.delete('/:id', auxiliaresController.deleteAuxiliar); // Eliminar un auxiliar por ID


router.get('/users/:fg_users', auxiliaresController.getAuxiliarByFgUser)

module.exports = router;