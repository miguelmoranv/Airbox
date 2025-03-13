const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController'); // Asegúrate de ajustar la ruta
const verifyToken = require('../middlewares/verifyToken');
// Rutas para la tabla "lote"
router.get('/', verifyToken, loteController.getLotes); // Obtener todos los lotes
router.get('/:id', verifyToken, loteController.getLoteById); // Obtener un lote por ID
router.post('/', verifyToken, loteController.createLote); // Crear un nuevo lote
router.put('/:id', verifyToken, loteController.updateLote); // Actualizar un lote por ID
router.delete('/:id', verifyToken, loteController.deleteLote); // Eliminar un lote por ID

module.exports = router;