
import { uploadToImgur, findAndModifyImage } from './src/server/routes/function';
import { vsbg } from './src/server/routes/db';

vsbg.find().toArray(async function (err, docs) {
    let random = Math.floor(Math.random() * docs.length) + 1
    for (let post of docs) {
        let full_picture = post.full_picture;
        let image = post.image
        if (full_picture && !image) {
            let image = await uploadToImgur(full_picture)
            if (image) {
                console.log('Added ' + image)
                findAndModifyImage(full_picture, image)
                break;
            }

        }
    }
})