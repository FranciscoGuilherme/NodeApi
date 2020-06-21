const User = include('models/user')

const identifyById = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(HttpStatus.BAD_REQUEST).send({
            message: 'Id do usuário não fornecido'
        })
    }

    next()
}

module.exports = identifyById
