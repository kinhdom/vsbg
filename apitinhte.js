var request = require('request');
const mongojs = require('mongojs');
const db = mongojs('mongodb://kinhdomcom:kinhdomcom@ds141185.mlab.com:41185/vsbg', ['vsbg', 'vsbg_info_people', 'groups']);
db.on('error', function (err) {
    console.log('database error', err)
})

var headers = {
    'Origin': 'http://upanh.vforum.vn',
    'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': 'http://upanh.vforum.vn/',
    'X-Requested-With': 'XMLHttpRequest',
    'Connection': 'keep-alive',
    'Cookie': '_ga=GA1.2.267831932.1524536272; _gid=GA1.2.1868078917.1524976130; _gat=1'
};
let imageUrl = 'https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/29060379_901006156770684_7005707328203820116_o.jpg?_nc_cat=0&_nc_ad=z-m&_nc_cid=0&oh=83193a80a2bec0cc6796b3c61ab0eee9&oe=5B90A7CF'


// let imageUrl = "https%3A%2F%2Fscontent.fdad2-1.fna.fbcdn.net%2Fv%2Ft1.0-9%2F31381283_1045537598918912_7241927266221721049_n.jpg%3F_nc_cat%3D0%26oh%3Ddc8ee2179104a5a13833193b9b89a096%26oe%3D5B97DD78";
// let imageEncoded = encodeURIComponent(imageUrl)
// console.log(imageEncoded)
// function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(JSON.parse(body).url);
//     }
// }
// let dataString = 'url=' + imageEncoded + '&type=transload&server=imgur&watermark=0'
// var options = {
//     url: 'http://upanh.vforum.vn/upload.php',
//     method: 'POST',
//     headers: headers,
//     body: dataString
// };
// request(options, callback);

db.vsbg.find().toArray(function (err, docs) {
    docs.forEach(post => {
        if (post.full_picture) {
            let dataString = 'url=' + encodeURIComponent(post.full_picture) + '&type=transload&server=imgur&watermark=0'
            var options = {
                url: 'http://upanh.vforum.vn/upload.php',
                method: 'POST',
                headers: headers,
                body: dataString
            };
            request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    if (body) {
                        console.log('huy')
                        let bodyJson = JSON.parse(body)
                        if (bodyJson) {
                            if (!bodyJson.error) {
                                let image = (bodyJson.url)
                                db.vsbg.findAndModify({
                                    query: { full_picture: post.full_picture },
                                    update: { $set: { image: image } },
                                    new: true
                                }, function (err, doc, lastErrorObject) {
                                    // doc.tag === 'maintainer'
                                    console.log(post.full_picture)
                                    console.log('Fixed ...' + image)
                                })

                            }
                        }

                    }

                }
            })
        }
    });
})


