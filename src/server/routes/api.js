const request = require('request');
const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const config = require('./config')
const func = require('./function')
const db = require('./db');

router.get('/groups', (req, res) => {
    db.groups.find({}).toArray(function (err, docs) {
    })
})
router.get('/mygroups', (req, res) => {
    let user_id = config.user_id;
    db.groups.find({ user_id: user_id }).toArray(function (err, docs) {
        res.json(docs)
    })
})
router.post('/initmygroups', (req, res) => {
    // let user_id = req.body.user_id;
    // Get access_token from user_id, find on database
    let user_id = config.user_id
    let access_token = config.access_token
    func.getMyGroups(access_token, (groups_info) => {
        groups_info.forEach(group_info => {
            group_info.user_id = user_id
            db.groups.insert(group_info, (err, docs) => {
                console.log('Adding ...' + group_info.name)
            })
        });
        res.json(groups_info)
    })
})
router.post('/addgroup', (req, res) => {
    let group_id = req.body.group_id;
    let access_token = req.body.access_token;
    func.crawl(group_id, access_token);
    func.getInfoGroup(group_id, access_token, (err, res) => {
        db.groups.insert(res)
    })
})
router.get('/:group_id/newpost/:page', (req, res) => {
    let group_id = req.params.group_id;
    let limit = 12;
    let page = req.params.page
    page >= 1 ? page = page : page = 1
    let skip = (page - 1) * limit
    db.vsbg.find({ group_id: group_id }).limit(limit).skip(skip).sort({ created_time: -1 }, (err, data) => {
        if (err) {
            res.json({ message: err, success: false })
        } else {
            res.json({ message: data, success: true })
        }
    })
})
router.get('/:group_id/addnew', (req, res) => {
    let group_id = req.params.group_id
    func.getNewestPost(group_id, (doc) => {
        if (doc[0]) {
            let newestPostTime = doc[0].created_time
            let query = 'https://graph.facebook.com/' + config.group_id + '/feed?format=json&fields=' + config.fieldsFeed + '&access_token=' + config.access_token + '&limit=100';
            request(query, (err, response, body) => {
                let bodyJson = JSON.parse(body)
                if (bodyJson) {
                    if (bodyJson.data) {
                        bodyJson.data.forEach(post => {
                            if (post) {
                                let created_time = post.created_time
                                if (new Date(created_time) > new Date(newestPostTime)) {
                                    func.addPostToDatabase(post, group_id)
                                }
                            }
                        });
                        res.json({ message: 'Updated' })
                    }
                }

            })
        }else{
            res.json({message:'Crawl...'})
            console.log('Crawl...')
            // Crawl
        }
    })

})
router.get('/convert', function (req, res) {
    db.vsbg.find({}).toArray(function (err, docs) {
        let dem = 0;
        docs.forEach(post => {
            let full_picture = post.full_picture
            let id = post._id
            if (full_picture) {
                func.uploadToWordpress(full_picture, (success) => {
                    if (success) {
                        dem++;
                        console.log('Uploaded ' + dem)
                    }
                })
            }
        });
        res.json({ a: 3 })
    })
})
router.get('/:group_id/crawl', function (req, res) {
    let group_id = req.params.group_id;
    let query = 'https://graph.facebook.com/' + config.group_id + '/feed?format=json&fields=' + config.fieldsFeed + '&access_token=' + config.access_token + '&limit=25';
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
    res.json({ a: 3 })
})
router.get('/info', (req, res) => {
    let deminfo = 0;
    db.vsbg.find({}, (err, people) => {
        people.forEach(user => {
            func.getInfo(user.id, (data) => {
                db.vsbg_info_people.insert(data)
                deminfo++;
                console.log(deminfo + 'user.id')
            })
        });
    })
    res.send('ok')
})
router.get('/test/:id/:yd', (req, res) => {
    let id = req.params.id
    console.log(id)
    res.json({ a: 3 })
})
router.get('/:group_id/top/:page', (req, res) => {
    let group_id = req.params.group_id;
    let limit = 50;
    let page = req.params.page
    page >= 1 ? page = page : page = 1
    let skip = (page - 1) * 10
    db.vsbg.find({ group_id: group_id }).limit(limit).skip(skip).sort({ likes: -1 }, (err, data) => {
        if (err) {
            res.json({ message: err, success: false })
        } else {
            res.json({ message: data, success: true })
        }
    })
})
router.get('/hot', (req, res) => {

})


module.exports = router;