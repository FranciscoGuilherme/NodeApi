const roles = include('controllers/roles')
const users = include('controllers/users')

const configure = (router) => {
    roles.configure(router)
    users.configure(router)
}

module.exports = configure
