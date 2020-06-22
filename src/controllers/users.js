const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const HttpStatus = require('http-status-codes')

const Role = include('models/role')
const User = include('models/user')
const logger = include('services/logger')
const responses = include('helpers/responses')
const authorization = include('middlewares/authorization')
const identifyById = include('middlewares/identifiers/identifyById')
const identifyByEmail = include('middlewares/identifiers/identifyByEmail')

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
 *       roles:
 *         type: array
 *         items:
 *           type: string
 *       __v:
 *         type: integer
 *     required:
 *       - _id
 *       - name
 *       - email
 *       - password
 *       - roles
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
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - name
 *         - email
 *         - password
 *         - roles
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
 *     401:
 *       description: Acesso negado
 *       schema:
 *         type: object
 *         properties:
 *           message:
 *             type: string
 *             example: Acesso negado
 *     404:
 *       description: Usuário não encontrato
 *       schema:
 *         type: object
 *         properties:
 *           message:
 *             type: string
 *             example: Usuário não encontrato no sistema
 */

const configure = (router) => {
    /**
     * @swagger
     * /users/login:
     *   post:
     *     tags:
     *       - Users
     *     summary: Rota para autenticação de usuários no sistema
     *     description: Rota para autenticação de usuários no sistema.
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
     *               example: Login realizado com sucesso!
     *             details:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       400:
     *         description: Credenciais invalidas
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Credenciais invalidas
     *       404:
     *         $ref: '#/components/schemas/404'
     */
    router.post('/users/login', identifyByEmail, async (req, res) => {
        const isValidPass = await bcrypt.compare(req.body.password, req.userOnPath.password)

        if (!isValidPass) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                message: 'Credenciais invalidas'
            })
        }

        const token = jwt.sign({ _id: req.userOnPath._id, roles: req.userOnPath.roles }, process.env.JWT_SECRET)

        res.header('Authorization', token).status(HttpStatus.OK).send({
            message: 'Login realizado com sucesso!',
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
     *     summary: Rota para criação de um usuário
     *     description: Rota para criação de um usuário.
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
     *         description: Usuário criado com sucesso
     *         schema:
     *           $ref: '#/definitions/User'
     *       400:
     *         description: Dados inválidos
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: 'User validation failed: roles: roles e um parametro obrigatorio'
     *       401:
     *         $ref: '#/components/schemas/401'
     *       500:
     *         description: Erro durante a criação do usuário
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Ocorreu um erro durante a criação do usuário
     */
    router.post('/users/create', authorization, (req, res) => {
        const userSchema = {
            age: req.body.age,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            roles: req.body.roles
        }

        User(userSchema).validate(async (err) => {
            if (err) {
                logger({ folder: 'users/create', message: JSON.stringify(err) }, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })

                return res.status(HttpStatus.BAD_REQUEST).send({ message: err.message })
            }

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(req.body.password, salt)
            const user = new User({
                age: req.body.age,
                name: req.body.name,
                email: req.body.email,
                password: hash,
                roles: req.body.roles
            })

            try {
                const saved = await user.save()

                res.status(HttpStatus.OK).send(saved)
            }
            catch (err) {
                logger({ folder: 'users/create', message: JSON.stringify(err) }, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })

                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                    message: 'Ocorreu um erro durante a criação do usuário'
                })
            }
        })

    })

    /**
     * @swagger
     * /users:
     *   get:
     *     tags:
     *       - Users
     *     summary: Rota para listagem de todos os usuários do sistema
     *     description: Rota para listagem de todos os usuários do sistema.
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List de usuários
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/User'
     *       401:
     *         $ref: '#/components/schemas/401'
     */
    router.get('/users', authorization, async (req, res) => {
        const users = await User.find({})

        res.status(HttpStatus.OK).send(users)
    })

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     tags:
     *       - Users
     *     summary: Rota para resgate de um usuário pelo id
     *     description: Rota para resgate de um usuário pelo id.
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
     *       401:
     *         $ref: '#/components/schemas/401'
     *       404:
     *         $ref: '#/components/schemas/404'
     */
    router.get('/users/:id', authorization, identifyById, async (req, res) => {
        const user = await User.findOne({ _id: req.params.id })

        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).send(responses.userNotFound)
        }

        res.status(HttpStatus.OK).send(user)
    })

    /**
     * @swagger
     * /users/roles/{id}:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Rota para atualização de um usuário pelo Id
     *     description: Rota para atualização de um usuário pelo Id.
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
     *         description: Dados para atualizar a role de um usuário
     *         schema:
     *           type: object
     *           properties:
     *             roles:
     *               type: array
     *               items:
     *                 type: string
     *     responses:
     *       200:
     *         description: Usuário atualizado
     *         schema:
     *           $ref: '#/definitions/User'
     *       400:
     *         description: Parâmetros faltantes
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Parâmetros faltantes
     *       401:
     *         $ref: '#/components/schemas/401'
     *       404:
     *         $ref: '#/components/schemas/404'
     *       500:
     *         description: Erro de salvamento
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Erro durante o salvamento do usuário
     */
    router.patch('/users/roles/:id', authorization, identifyById, async (req, res) => {
        if (!req.body || !req.body.roles) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                message: 'Parâmetros faltantes'
            })
        }

        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { roles: req.body.roles },
                {
                    new: true,
                    runValidators: true
                }
            )

            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).send(responses.userNotFound)
            }

            res.status(HttpStatus.OK).send(user)
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Erro durante o salvamento do usuário'
            })
        }
    })

    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     tags:
     *       - Users
     *     summary: Rota para atualização de um usuário pelo Id
     *     description: Rota para atualização de um usuário pelo Id.
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
     *       400:
     *         description: Parâmetros faltantes
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Parâmetros faltantes
     *       401:
     *         $ref: '#/components/schemas/401'
     *       404:
     *         $ref: '#/components/schemas/404'
     *       500:
     *         description: Erro de salvamento
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Erro durante o salvamento do usuário
     */
    router.put('/users/:id', authorization, identifyById, async (req, res) => {
        const updates = Object.keys(req.body)
        const isValid = updates.every((update) => [ 'age', 'name', 'password', 'roles' ].includes(update))

        if (!isValid) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                message: 'Campos nao permitidos enviados para atualizacao'
            })
        }

        try {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(req.body.password, salt)
            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    age: req.body.age,
                    name: req.body.name,
                    password: hash,
                    roles: req.body.roles
                },
                {
                    new: true,
                    runValidators: true
                }
            )

            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).send(responses.userNotFound)
            }

            res.status(HttpStatus.OK).send(user)
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Erro durante o salvamento do usuário'
            })
        }
    })

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     tags:
     *       - Users
     *     summary: Rota para remoção de um usuário pelo Id
     *     description: Rota para remoção de um usuário pelo Id.
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
     *       401:
     *         $ref: '#/components/schemas/401'
     *       404:
     *         $ref: '#/components/schemas/404'
     *       500:
     *         description: Erro de salvamento
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Erro durante a remoção do usuário
     */
    router.delete('/users/:id', authorization, identifyById, async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id)

            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).send(responses.userNotFound)
            }

            res.status(HttpStatus.OK).send(user)
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Erro durante a remoção do usuário'
            })
        }
    })
}

exports.configure = configure
