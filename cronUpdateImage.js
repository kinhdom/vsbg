const mongojs = require('mongojs');
const db = mongojs('mongodb://kinhdomcom:kinhdomcom@ds141185.mlab.com:41185/vsbg', ['vsbg']);
const func = require('./src/server/routes/function')
db.on('error', function (err) {
    console.log('database error', err)
})





db.vsbg.find().toArray(function (err, docs) {
    let random = Math.floor(Math.random() * docs.length) + 1
    for (let post of docs) {
        let full_picture = post.full_picture;
        let image = post.image
        if (full_picture && !image) {
            func.uploadToImgur(full_picture, (image) => {
                if (image) {
                    console.log('Added ' + image)
                    func.findAndModifyImage(full_picture, image)
                }
            })
            break;
        }
    }
})