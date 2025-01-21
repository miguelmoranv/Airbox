const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const usuarios_routes = require('./routes/usuariosRoutes')
const lotes_routes = require('./routes/loteRoutes')
const cajas_routes = require('./routes/cajasRoutes')
const auxiliares_routes = require('./routes/auxiliaresRoutes')

const app = express()


app.use(cors());
app.use(morgan("dev"))
app.use(express.json())

//rutas
app.use('/img', express.static(path.join(__dirname, './img')))
app.use('/api/usuarios', usuarios_routes)
app.use('/api/lotes', lotes_routes )
app.use('/api/cajas', cajas_routes )
app.use('/api/auxliares', auxiliares_routes)

module.exports = app