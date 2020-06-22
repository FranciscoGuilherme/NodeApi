const fs = require('fs')
const aws = require('aws-sdk')

const logger = (file, callback) => {
    const name = new Date().toISOString()
    const path = process.cwd() + `/src/${name}`

    fs.writeFileSync(path, file.message, (err) => {
        if (err) {
            throw new Error({
                message: 'Ocorreu um erro ao criar o log para salvamento no s3',
                details: err
            })
        }
    })

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: file.folder + '/' + name,
        Body: fs.readFileSync(path)
    }

    const s3 = new aws.S3({
        Bucket: process.env.BUCKET_NAME,
        region: process.env.REGION_NAME,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    })

    s3.upload(params, (err, data) => {
        fs.unlinkSync(path)

        if (err) {
            return callback({
                message: 'Ocorreu um erro durante o salvamento no S3',
                details: err
            })
        }

        callback(null)
    })
}

module.exports = logger
