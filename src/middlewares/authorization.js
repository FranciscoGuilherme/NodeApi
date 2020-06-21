const jwt = require('jsonwebtoken')
const HttpStatus = require('http-status-codes')

const responses = include('helpers/responses')

const auth = (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).send(responses.accessDenied)
    }

    try {
        req.user = jwt.verify(token, process.env.TOKEN_SECRET)

        if (!req.user.roles.includes('ROLE_ADMIN')) {
            return res.status(HttpStatus.UNAUTHORIZED).send(responses.accessDenied)
        }

        next()
    }
    catch (err) {
        res.status(HttpStatus.BAD_REQUEST).send({
            message: 'Falha na autenticação: token inválido'
        })
    }
}

module.exports = auth
