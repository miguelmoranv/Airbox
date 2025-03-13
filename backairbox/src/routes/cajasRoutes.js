const express = require('express');
const router = express.Router();
const cajasController = require('../controllers/cajasController'); // Ajusta la ruta según tu estructura
const verifyToken = require('../middlewares/verifyToken');
// Rutas para la tabla "cajas"
router.get('/', verifyToken, cajasController.getCajas); // Obtener todas las cajas
router.get('/:id', verifyToken, cajasController.getCajaById); // Obtener una caja por ID
router.post('/', verifyToken, cajasController.createCaja); // Crear una nueva caja
router.put('/:id', verifyToken, cajasController.updateCaja); // Actualizar una caja por ID
router.delete('/:id', verifyToken, cajasController.deleteCaja); // Eliminar una caja por ID

router.get('/lote/:id', verifyToken, cajasController.getCajaByLote )
module.exports = router;
