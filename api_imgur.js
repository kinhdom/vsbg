

var imgur = require('imgur');
imgur.setCredentials('kinhdomcom@gmail.com', 'matkhau12345', '238ff8a99cfcf80');
let arrImage = 'http://img.khoahoc.tv/photos/image/2014/10/11/autumn.jpg'



// db.vsbg.find({}).toArray(function (err, docs) {
//     docs.forEach(element => {
//         setTimeout(async () => {
//             if (element.full_picture) {
//                 let full_picture = (element.full_picture)
//                 let img = await uploadImgur(full_picture)
//                 if (img) {
//                     db.vsbg.findAndModify({
//                         query: { full_picture: full_picture },
//                         update: { $set: { img: img } },
//                         new: true
//                     }, function (err, doc, lastErrorObject) {
//                         // doc.tag === 'maintainer'
//                         console.log('Done ' + img)
//                     })
//                 }

//             }

//         });
//     }, 1000);


// })
imgur.uploadUrl(arrImage)
    .then(function (json) {
        console.log(json)
        resolve(json.data.link)
    })
    .catch(function (err) {
        console.log(err.message)
        reject(err.message);
    });
function upload(image) {
    setTimeout(async () => {
        console.log('Begin ')
        let img = await uploadImgur(image)
        console.log(img)
        console.log('Done ')
    }, 1000);

}
function uploadImgur(image) {
    console.log('uploading ...')
    return new Promise((resolve, reject) => {
        imgur.uploadUrl(image)
            .then(function (json) {
                console.log(json)
                resolve(json.data.link)
            })
            .catch(function (err) {
                console.log(err.message)
                reject(err.message);
            });
    })
}