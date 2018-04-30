const db = require('./src/server/routes/db')



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