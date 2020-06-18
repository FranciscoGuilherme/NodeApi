const path = require('path')

global.include = (name) => {
    return require(path.join(__dirname, `../${name}`))
}
