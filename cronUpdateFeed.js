const request = require('request')
const db = require('./src/server/routes/db');
const func = require('./src/server/routes/function');
const config = require('./src/server/routes/config')


db.groups.find({}, function (err, docs) {
    docs.forEach(group => {
        let group_id = group.id
        func.getNewestPost(group_id, (doc) => {
            if (doc[0]) {
                let newestPostTime = doc[0].created_time
                let query = 'https://graph.facebook.com/' + group_id + '/feed?format=json&fields=' + config.fieldsFeed + '&access_token=' + config.access_token + '&limit=100';
                request(query, (err, response, body) => {
                    let bodyJson = JSON.parse(body)
                    if (bodyJson) {
                        if (bodyJson.data) {
                            bodyJson.data.forEach(post => {
                                if (post) {
                                    let created_time = post.created_time
                                    if (new Date(created_time) > new Date(newestPostTime)) {
                                        console.log(post)
                                        func.addPostToDatabase(post, group_id)
                                    }
                                }
                            });
                        }
                    }

                })
            }
        })
    });
})
