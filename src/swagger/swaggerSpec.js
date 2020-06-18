const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const options = {
    swaggerDefinition: {
        swagger: '2.0',
        components: {},
        info: {
            title: 'Node API',
            version: '1.0.0',
            description: 'CRUD de usuários com MongoDB',
        },
        host: 'localhost:3000',
        basePath: '/',
        securityDefinitions: {
            bearerAuth: {
                in: 'header',
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer'
            }
        }
    },
    apis: [
        './src/controllers/*.js'
    ]
}

const swaggerSpec = swaggerJsDoc(options)

module.exports = (app) => {
    app.use('/doc/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.get('/doc/api.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}
