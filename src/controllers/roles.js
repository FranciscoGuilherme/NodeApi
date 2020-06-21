const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const HttpStatus = require('http-status-codes')

const Role = include('models/role')
const authorization = include('middlewares/authorization')

/**
 * @swagger
 * definitions:
 *   Role:
 *     type: object
 *     properties:
 *       _id:
 *         type: integer
 *       name:
 *         type: string
 *       __v:
 *         type: integer
 *     required:
 *       - _id
 *       - name
 *       - __v
 */

const configure = (router) => {
    /**
     * @swagger
     * /roles/create:
     *   post:
     *     tags:
     *       - Roles
     *     summary: Rota para criação de roles do sistema
     *     description: Rota para criação de roles do sistema.
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
     *           type: object
     *           properties:
     *             name:
     *               type: string
     *               example: ROLE_TEST
     *     responses:
     *       200:
     *         description: Usuário logado com sucesso
     *         schema:
     *           $ref: '#/definitions/Role'
     *       401:
     *         $ref: '#/components/schemas/401'
     *       500:
     *         description: Erro durante a criação da role
     *         schema:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     *               example: Ocorreu um erro durante a criação da role
     */
    router.post('/roles/create', authorization, async (req, res) => {
        const role = await Role.findOne({ name: req.body.name })

        if (role) {
            return res.status(HttpStatus.OK).send({
                message: 'Role ja cadastrada no sistema'
            })
        }

        try {
            const role = Role(req.body)
            const saved = await role.save()

            res.status(HttpStatus.CREATED).send(saved)
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Ocorreu um erro durante a criação da role'
            })
        }
    })

    router.get('/roles', async (req, res) => {})
    router.get('/roles/{id}', async (req, res) => {})
    router.patch('/roles/{id}', async (req, res) => {})
    router.put('/roles/{id}', async (req, res) => {})
    router.delete('/roles/{id}', async (req, res) => {})
}

exports.configure = configure
