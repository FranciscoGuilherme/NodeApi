const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')

const User = mongoose.Schema({
    age: {
        type: Number,
        default: 1,
        validate: {
            validator: (value) => {
                if (value <= 0) {
                    throw new Error('Idade nao pode ser menor ou igual a zero')
                }
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        maxlength: 255,
        minlength: 6,
        validate: {
            validator: (value) => {
                if (!validator.isEmail(value)) {
                    throw new Error('E-mail invalido')
                }
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1024,
        minlength: 7,
        validate: {
            validator: (value) => {
                if (value.toLowerCase().includes('password') ||
                    value.toLowerCase().includes('senha')
                ) {
                    throw new Error('Senha nao pode conter senha ou password como conteudo')
                }
            }
        }
    },
    roles: {
        type: Array,
        required: true,
        default: ['ROLE_GUEST']
    }
})

User.plugin(uniqueValidator)

module.exports = mongoose.model('User', User)
