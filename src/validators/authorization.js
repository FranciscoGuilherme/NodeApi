const jwt = require('jsonwebtoken')
const HttpStatus = require('http-status-codes')

const auth = (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).send({
            message: 'Access Denied!'
        })
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)

        req.user = verified

        next()
    }
    catch (err) {
        res.status(HttpStatus.BAD_REQUEST).send({
            message: 'Invalid Token'
        })
    }
}

module.exports = auth
