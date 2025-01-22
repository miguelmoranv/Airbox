const express = require('express');
const router = express.Router();
const cajasController = require('../controllers/cajasController'); // Ajusta la ruta según tu estructura

// Rutas para la tabla "cajas"
router.get('/', cajasController.getCajas); // Obtener todas las cajas
router.get('/:id', cajasController.getCajaById); // Obtener una caja por ID
router.post('/', cajasController.createCaja); // Crear una nueva caja
router.put('/:id', cajasController.updateCaja); // Actualizar una caja por ID
router.delete('/:id', cajasController.deleteCaja); // Eliminar una caja por ID

router.get('/lote/:id', cajasController.getCajaByLote )
module.exports = router;
