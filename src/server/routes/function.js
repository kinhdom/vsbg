const request = require('request');
// Imgur config
const imgur = require('imgur');
imgur.setCredentials('kinhdomcom@gmail.com', 'matkhau12345', '238ff8a99cfcf80');
const config = require('./config');
const mongojs = require('mongojs');
const db = require('./db');

const func = {
    crawl: (group_id, access_token) => {
        let query = 'https://graph.facebook.com/' + group_id + '/feed?format=json&fields=' + config.fieldsFeed + '&access_token=' + access_token + '&limit=25';
        func.fetchData(query, (data) => {
            if (data) {
                if (data.data) {
                    data.data.forEach(post => {
                        if (post) {
                            func.addPostToDatabase(post, group_id)
                        }
                    });
                }
            }
        })
    },
    fetchData: (query, callback) => {
        request.get(query, (err, response, body) => {
            let bodyJson = JSON.parse(body)
            let paging = bodyJson.paging
            callback(bodyJson)

            if (paging) {
                if (paging.next) {
                    let query = paging.next
                    func.fetchData(query, callback)
                }
            }
        })

    },
    addPostToDatabase: (post, group_id) => {
        if (post.likes) {
            post.likes = post.likes.count
        }
        db.vsbg.insert(post)
        console.log('Added ...' + post.id)
    },
    findAndModifyImage: (id, newImage) => {
        db.vsbg.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { image: newImage } },
            new: true
        })
    },
    uploadToWordpress: (full_picture, callback) => {
        let headers = {
            'origin': 'https://public-api.wordpress.com',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
            'authorization': 'X-WPCOOKIE cdf7d09ca41a2efdb027a1821f54953b:1:https://wordpress.com',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryrSrafR72h5NIz9Ye',
            'accept': '*/*',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36',
            'referer': 'https://public-api.wordpress.com/wp-admin/rest-proxy/?v=2.0',
            'authority': 'public-api.wordpress.com',
            'Cookie': 'cookie: wp_api_sec=daylaitai%7C1619505255%7C01orySEYKsQ4299dNrrqYQOEtRvaz3l475fustOacs7%7C022b21b6f4579d26b8de13009eaa2bc5fda083591f8b5a434993aa81bf92f61c; _ga=GA1.2.1810458970.1524897240; _gid=GA1.2.138631153.1524897240; _wpndash=d168feb3118f8c9b82442e0b; G_AUTHUSER_H=1; G_ENABLED_IDPS=google; wordpress_logged_in=daylaitai%7C1619505255%7C01orySEYKsQ4299dNrrqYQOEtRvaz3l475fustOacs7%7Cdc39c9634ae2db799802a8681c5d554fa192d656fc9a17db758198de59e3b061; wordpress_test_cookie=WP+Cookie+check; wordpress_eli=1; tk_tc=OcQl4%2FM80HsD28SC; _gat=1; wpc_wpc=account=daylaitai&avatar=https%3A%2F%2F2.gravatar.com%2Favatar%2F510f30f27c021f55850dc684e400235a%3Fs%3D25%26amp%3Bd%3Dhttps%253A%252F%252Fs2.wp.com%252Fwp-content%252Fmu-plugins%252Fhighlander-comments%252Fimages%252Fwplogo.png&email=daylaitai%40gmail.com&link=http%3A%2F%2Ffood403494205.wordpress.com&name=day%20lai&uid=137147815&access_token=4f350e056b6b085cab9431980a940c989efb7cea'
        };



        let data = { media_urls: [full_picture] }
        let dataString = JSON.stringify(data).toString()
        let uploadImageEndPoint = 'https://public-api.wordpress.com/rest/v1.1/sites/' + config.blog_id + '/media/new?http_envelope=1';
        let options = {
            url: uploadImageEndPoint,
            method: 'POST',
            headers: headers,
            body: dataString
        };
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                callback(true)
            } else {
                callback(false)
            }
        });
    },
    generateLinkImageWordpress(full_picture) {
        let indexOfJpg = full_picture.indexOf(".jpg")
        let arr_temp = full_picture.slice(0, indexOfJpg).split("/")
        let image_name = arr_temp[arr_temp.length - 1]
        let year = new Date().getFullYear().toString()
        let month = (new Date().getMonth() + 1).toString()
        let newImage = 'https://' + config.blog_name + '.files.wordpress.com/' + year + '/0' + month + '/' + image_name + '.jpg?w=450'
        return newImage
    },
    getInfo: (uid, callback) => {
        let query = 'https://graph.facebook.com/' + uid + '?format=json&fields=' + config.fieldsPeople + '&access_token=' + config.access_token + '&limit=25';
        func.fetchData(query, (data) => {
            callback(data)
        })
    },
    getNewestPost: (group_id, callback) => {
        db.vsbg.find({ group_id: group_id }).limit(1).sort({ created_time: -1 }, (err, doc) => {
            if (!err) {
                callback(doc)
            }
        })
    },
    getInfoGroup: (group_id, access_token, callback) => {
        func.getFieldsOfObject(group_id, config.fieldsGroup, access_token, (info) => {
            callback(info)
        })
    },
    getMyGroups: (access_token, callback) => {
        func.getFieldsOfObject('me', 'groups{' + config.fieldsGroup + '}', access_token, (info) => {
            callback(info.groups.data)
        })
    },
    getFieldsOfObject: (uid, fields, access_token, callback) => {
        let query = 'https://graph.facebook.com/' + uid + '?format=json&fields=' + fields + '&access_token=' + access_token + '&limit=25';
        func.fetchData(query, (data) => {
            callback(data)
        })
    }
}

module.exports = func