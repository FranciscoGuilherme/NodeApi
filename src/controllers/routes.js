const usersController = include('controllers/usersController')

const configure = (router) => {
    usersController.configure(router)
}

module.exports = configure
