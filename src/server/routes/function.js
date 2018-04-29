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
        post.group_id = group_id
        if (post.likes) {
            post.likes = post.likes.count
        }
        db.vsbg.insert({
            group_id: group_id,
            post_id: post.id,
            post_message: post.message,
            created_time: post.created_time,
            updated_time: post.updated_time,
            full_picture: post.full_picture,
            from_name: post.from.name,
            from_id: post.from.id
        })
        console.log('Added ...' + post.id)
    },
    findAndModifyImage: (full_picture, newImage) => {
        db.vsbg.findAndModify({
            query: { full_picture: full_picture },
            update: { $set: { image: newImage } },
            new: true
        }, () => {
            console.log('Done')
        })
    },
    uploadToImgur: (full_picture, callback) => {
        imgur.uploadUrl(full_picture)
            .then(function (json) {
                callback(json.data.link)
            })
            .catch(function (err) {
                callback(0)
            });
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