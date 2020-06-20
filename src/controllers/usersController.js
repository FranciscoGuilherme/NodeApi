const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const HttpStatus = require('http-status-codes')

const User = include('models/user')
const authorization = include('validators/authorization')

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
 *     loginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: email@email.com
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *     404:
 *       description: Usuário não encontrato
 *       schema:
 *         type: object
 *         properties:
 *           message:
 *             type: string
 *             example: Usuário não encontrato
 */

const configure = (router) => {
    /**
     * @swagger
     * /users/login:
     *   post:
     *     tags:
     *       - Users
     *     summary: Executa o login para um usuário
     *     description: Executa o login para um usuário.
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: body
     *         in: body
     *         description: Dados para o login de um usuário
     *         schema:
     *           $ref: '#/components/schemas/loginRequest'
     *     responses:
     *       200:
     *         description: Usuário logado com sucesso
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Logged in!
     *             details:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       400:
     *         description: Dados inválidos
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Senha inválida
     *       404:
     *         $ref: '#/components/schemas/404'
     */
    router.post('/users/login', async (req, res) => {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).send({ message: 'Usuário não encontrato' })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.password)

        if (!isValidPass) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Senha inválida' })
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)

        res.header('Authorization', token).status(HttpStatus.OK).send({
            message: 'Logged in!',
            details: {
                token: token
            }
        })
    })

    /**
     * @swagger
     * /users/create:
     *   post:
     *     tags:
     *       - Users
     *     summary: Cria um usuário
     *     description: Cria um usuário.
     *     consumes:
     *       - application/json
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
    router.post('/users/create', authorization, async (req, res) => {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt)
        const user = new User({
            age: req.body.age,
            name: req.body.name,
            email: req.body.email,
            password: hash
        })

        try {
            const saved = await user.save()

            res.status(HttpStatus.OK).send(saved)
        }
        catch (err) {
            res.status(HttpStatus.BAD_REQUEST).send(err)
        }
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
     *         description: List de usuários
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/User'
     */
    router.get('/users', authorization, async (req, res) => {
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
     *         description: Usuário
     *         schema:
     *           $ref: '#/definitions/User'
     *       404:
     *         $ref: '#/components/schemas/404'
     */
    router.get('/users/:id', authorization, async (req, res) => {
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
     *     consumes:
     *       - application/json
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
     *         description: Usuário atualizado
     *         schema:
     *           $ref: '#/definitions/User'
     *       404:
     *         $ref: '#/components/schemas/404'
     */
    router.patch('/users/:id', authorization, async (req, res) => {
        res.status(HttpStatus.OK).send({ message: '' })
    })

    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     tags:
     *       - Users
     *     summary: Atualiza um usuário pelo Id
     *     description: Atualiza um usuário pelo Id.
     *     consumes:
     *       - application/json
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
     *         description: Usuário atualizado
     *         schema:
     *           $ref: '#/definitions/User'
     *       404:
    *         $ref: '#/components/schemas/404'
     */
    router.put('/users/:id', authorization, async (req, res) => {
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
     *         description: Usuário removido da base de dados
     *         schema:
     *           $ref: '#/definitions/User'
     *       404:
     *         $ref: '#/components/schemas/404'
     */
    router.delete('/users/:id', authorization, async (req, res) => {
        res.status(HttpStatus.OK).send({ message: '' })
    })
}

exports.configure = configure
