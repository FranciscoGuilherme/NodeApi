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
 *     400:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Usuário não encontrato
 */

const configure = (router) => {
    /**
     * @swagger
     * /users/create:
     *   post:
     *     tags:
     *       - Users
     *     summary: Cria um usuário
     *     description: Cria um usuário.
     *     produces:
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

    /**
     * @swagger
     * /users:
     *   get:
     *     tags:
     *       - Users
     *     summary: Resgata todos os usuários
     *     description: Resgata todos os usuários.
     *     produces:
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
     *           type: array
     *           items:
     *             $ref: '#/definitions/User'
     */
    router.get('/users', (req, res) => {
        res.status(HttpStatus.OK).send({ message: '' })
    })

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     tags:
     *       - Users
     *     summary: Resgata um usuário pelo id
     *     description: Resgata um usuário pelo id.
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: path
     *         in: path
     *         description: Id do usuário
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Created
     *         schema:
     *           $ref: '#/definitions/User'
     *       400:
     *         description: Not Found
     *         schema:
     *           $ref: '#/components/schemas/400'
     */
    router.get('/users/:id', (req, res) => {
        res.status(HttpStatus.OK).send({ message: '' })
    })

    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Atualiza um usuário pelo Id
     *     description: Atualiza um usuário pelo Id.
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: path
     *         in: path
     *         description: Id do usuário
     *         schema:
     *           type: string
     *       - name: body
     *         in: body
     *         description: Dados para atualizar um usuário
     *         schema:
     *           $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: Created
     *         schema:
     *           $ref: '#/definitions/User'
     *       400:
     *         description: Not Found
     *         schema:
     *           $ref: '#/components/schemas/400'
     */
    router.patch('/users/:id', (req, res) => {
        res.status(HttpStatus.OK).send({ message: '' })
    })

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     tags:
     *       - Users
     *     summary: Deleta um usuário pelo Id
     *     description: Deleta um usuário pelo Id.
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: path
     *         in: path
     *         description: Id do usuário
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Created
     *         schema:
     *           $ref: '#/definitions/User'
     *       400:
     *         description: Not Found
     *         schema:
     *           $ref: '#/components/schemas/400'
     */
    router.delete('/users/:id', (req, res) => {
        res.status(HttpStatus.OK).send({ message: '' })
    })
}

exports.configure = configure
