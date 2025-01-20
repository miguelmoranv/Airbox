const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const usuarios_routes = require('./routes/usuariosRoutes')

const app = express()


app.use(cors());
app.use(morgan("dev"))
app.use(express.json())

//rutas
app.use('/img', express.static(path.join(__dirname, './img')))
app.use('/api/usuarios', usuarios_routes)

module.exports = app