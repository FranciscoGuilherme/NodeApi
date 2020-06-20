const express = require('express')
const globals = require('./src/config/globals')
const mongoose = require('./src/config/mongoose')

const app = express()
const router = express.Router()
const routes = include('controllers/routes.js')(router)
const swaggerSpec = include('swagger/swaggerSpec')(app)

app.use(express.json())
app.use('', router)

app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is up on port: ${process.env.PORT || '3000'}`)
})
