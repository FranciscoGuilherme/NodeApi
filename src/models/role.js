const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')

const Role = mongoose.Schema({
    name: {
        type: String,
        default: 'ROLE_GUEST',
        validate: {
            validator: (role) => {
                if (role) {
                    if (!role.includes('ROLE_')) {
                        throw new Error('All roles must have ROLE_ at the beginning. Example: ROLE_TEST')
                    }
                }
            }
        }
    }
})

Role.plugin(uniqueValidator)

module.exports = mongoose.model('Role', Role)
