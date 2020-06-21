const HttpStatus = require('http-status-codes')

const User = include('models/user')
const responses = include('helpers/responses')

const identifyByEmail = async (req, res, next) => {
    if (!req.body || !req.body.email) {
        return res.status(HttpStatus.BAD_REQUEST).send({
            message: 'Email do usuário não fornecido'
        })
    }

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(HttpStatus.NOT_FOUND).send(responses.userNotFound)
    }

    req.userOnPath = user

    next()
}

module.exports = identifyByEmail
