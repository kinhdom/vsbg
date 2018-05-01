import request from "request";
import { Router } from "express";
const router = Router();
import mongojs from "mongojs";
import { config } from "./config";
import {
    getNewestPost,
    updateDatabase,
    getMyGroups,
    crawl,
    getInfoGroup,
    uploadToWordpress,
    fetchData,
    addPostToDatabase,
    getInfo,
    getInfoUser
} from "./function";
import { groups, users, vsbg, vsbg_info_people } from "./db";
import { getAccessTokenFromUserId } from './asyncFunc';

router.post('/userinfo', (req, res) => {
    let user_id = req.body.user_id
    getInfoUser(user_id)
        .then(info => {
            res.json({
                user_fb_uid: info.user_fb_uid,
                user_fb_access_token: info.user_fb_access_token
            })
        })
})

router.get('/groups', (req, res) => {
    groups.find({}).toArray(function (err, docs) {
    })
})
router.get('/mygroups', (req, res) => {
    let user_id = _user_id;
    groups.find({ user_id: user_id }).sort({ member_count: -1 }).toArray(function (err, docs) {
        res.json(docs)
    })
})
router.post('/updataDatabase', (req, res) => {
    console.log('posted to /updataDatabase')
    let group_id = req.body.group_id;
    let access_token = req.body.access_token
    updateDatabase(group_id, access_token)
    res.json({ msg: 'ok' })

})
router.post('/initmygroups', (req, res) => {
    // let user_id = req.body.user_id;
    // Get access_token from user_id, find on database
    let user_id = _user_id
    let access_token = _access_token
    getMyGroups(access_token, (groups_info) => {
        users.insert({
            user_fb_uid: user_id,
            user_fb_access_token: access_token,
            user_groups: groups_info
        })
        res.json({
            user_fb_uid: user_id,
            user_fb_access_token: access_token,
            user_groups: groups_info
        })
    })
})
router.post('/addgroup', (req, res) => {
    let group_id = req.body.group_id;
    let access_token = req.body.access_token;
    crawl(group_id, access_token);
    getInfoGroup(group_id, access_token, (err, res) => {
        groups.insert(res)
    })
})
router.get('/:group_id/newpost/:page', (req, res) => {
    let group_id = req.params.group_id;
    let limit = 12;
    let page = req.params.page
    page >= 1 ? page = page : page = 1
    let skip = (page - 1) * limit
    vsbg.find({ group_id: group_id }).limit(limit).skip(skip).sort({ created_time: -1 }, (err, data) => {
        if (err) {
            res.json({ message: err, success: false })
        } else {
            res.json({ message: data, success: true })
        }
    })
})
router.get('/detail/:post_id', (req, res) => {
    let post_id = req.params.post_id
    vsbg.find({ post_id: post_id }, (err, docs) => {
        res.json(docs)
    })
})
router.get('/:group_id/addnew', (req, res) => {
    let group_id = req.params.group_id
    crawl(group_id, _access_token)
    res.json({ message: 'Updated' })

})
router.get('/convert', function (req, res) {
    vsbg.find({}).toArray(function (err, docs) {
        let dem = 0;
        docs.forEach(post => {
            let full_picture = post.full_picture
            let id = post._id
            if (full_picture) {
                uploadToWordpress(full_picture, (success) => {
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
    let query = 'https://graph.facebook.com/' + group_id + '/feed?format=json&fields=' + fieldsFeed + '&access_token=' + _access_token + '&limit=25';
    fetchData(query, (data) => {
        if (data) {
            if (data.data) {
                data.data.forEach(post => {
                    if (post) {
                        addPostToDatabase(post, group_id)
                    }
                });
            }
        }
    })
    res.json({ a: 3 })
})
router.get('/info', (req, res) => {
    let deminfo = 0;
    vsbg.find({}, (err, people) => {
        people.forEach(user => {
            getInfo(user.id, (data) => {
                vsbg_info_people.insert(data)
                deminfo++;
                console.log(deminfo + 'user.id')
            })
        });
    })
    res.send('ok')
})
router.get('/delete/:post_id', (req, res) => {
    let post_id = req.params.post_id
    vsbg.remove({ post_id: post_id }, (err, docs) => {
        res.json(docs)
    })
})
router.get('/:group_id/top/:page', (req, res) => {
    let group_id = req.params.group_id;
    let limit = 50;
    let page = req.params.page
    page >= 1 ? page = page : page = 1
    let skip = (page - 1) * 10
    vsbg.find({ group_id: group_id }).limit(limit).skip(skip).sort({ likes: -1 }, (err, data) => {
        if (err) {
            res.json({ message: err, success: false })
        } else {
            res.json({ message: data, success: true })
        }
    })
})


export default router;