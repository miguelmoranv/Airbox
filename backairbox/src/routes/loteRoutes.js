const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController'); // Asegúrate de ajustar la ruta

// Rutas para la tabla "lote"
router.get('/', loteController.getLotes); // Obtener todos los lotes
router.get('/:id', loteController.getLoteById); // Obtener un lote por ID
router.post('/', loteController.createLote); // Crear un nuevo lote
router.put('/:id', loteController.updateLote); // Actualizar un lote por ID
router.delete('/:id', loteController.deleteLote); // Eliminar un lote por ID

module.exports = router;