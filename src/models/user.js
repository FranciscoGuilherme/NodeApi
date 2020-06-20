const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')

const User = mongoose.Schema({
    age: {
        type: Number,
        default: 1,
        validate: {
            validator: (value) => {
                if (value < 0) {
                    throw new Error('Age cannot be lower then or equal to zero')
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
                    throw new Error('E-mail cannot be accepted')
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
                    throw new Error('Password cannot have this content, it is very obvious')
                }
            }
        }
    }
})

User.plugin(uniqueValidator)

module.exports = mongoose.model('User', User)
