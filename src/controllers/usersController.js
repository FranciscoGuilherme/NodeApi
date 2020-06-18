const HttpStatus = require('http-status-codes')

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: integer
 *       age:
 *         type: integer
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       __v:
 *         type: integer
 *     required:
 *       - _id
 *       - name
 *       - email
 *       - password
 *       - __v
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         age:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - password
 */

const configure = (router) => {
    /**
     * @swagger
     * users/create:
     *   post:
     *     tags:
     *       - Users
     *     summary: Cria um usuário
     *     description: Cria um usuário.
     *     produces:
     *       - application/json
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: body
     *         in: body
     *         description: Dados para a criação de um novo usuário
     *         schema:
     *           $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: Created
     *         schema:
     *           $ref: '#/definitions/User'
     */
    router.post('/users/create', (req, res) => {
        res.status(HttpStatus.CREATED).send({ message: 'Created' })
    })
}

exports.configure = configure
