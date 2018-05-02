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
    getInfoUser,
    postPhoto,
    getUserName
} from "./function";
import { groups, users, vsbg, vsbg_info_people } from "./db";
import { getAccessTokenFromUserId } from './asyncFunc';


router.post('/postPhoto2Group', async (req, res) => {
    let from_id = req.body.from_id
    let access_token = req.body.access_token
    let username = await getUserName(from_id, access_token)
    let moreCaption = 'Facebook: https://www.facebook.com/' + username + '\n' + ' #VSBG #VSBGME\nJoin group: https://www.facebook.com/groups/vsbg.me'
    let photo_url = req.body.photo_url
    let caption = req.body.caption + '\n' + moreCaption
    let group_id = req.body.group_id


    let post_id = await postPhoto(photo_url, caption, group_id, access_token)
    res.json({ msg: post_id })
})

router.post('/userinfo', (req, res) => {
    let user_id = req.body.user_id
    getInfoUser(user_id)
        .then(info => {
            res.json({
                user_fb_uid: info.user_fb_uid,
                user_fb_access_token: info.user_fb_access_token
            })
        })
        .catch(e => console.log(e))
})
router.post('/adduser', (req, res) => {
    let user_fb_id = req.body.user_fb_id
    let user_access_token = req.body.user_access_token
    getMyGroups(user_access_token)
        .then(groups_info => {
            users.insert({
                user_fb_uid: user_fb_id,
                user_fb_access_token: user_access_token,
                user_groups: groups_info
            })
            res.json({
                user_fb_uid: user_fb_id,
                user_fb_access_token: user_access_token,
                user_groups: groups_info
            })
        })
        .catch(e => res.json(e))

})

router.post('/mygroups', (req, res) => {
    let user_id = req.body.user_id;
    users.find({ _id: mongojs.ObjectId(user_id) }, function (err, docs) {
        res.json(docs[0].user_groups)
    })
})
router.post('/updataDatabase', (req, res) => {
    let group_id = req.body.group_id;
    let user_fb_access_token = req.body.user_fb_access_token
    updateDatabase(group_id, user_fb_access_token)
    res.json({ msg: 'ok' })

})

router.post('/newpost', (req, res) => {
    let group_id = req.body.group_id;
    let page = req.body.page
    let limit = 12;
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
        res.json(docs[0])
    })
})
router.post('/crawl', function (req, res) {
    let group_id = req.body.group_id;
    let user_fb_access_token = req.body.user_fb_access_token
    crawl(group_id, user_fb_access_token)
    res.json({ msg: 'Crawling ...' })
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
    vsbg.find({ group_id: group_id }).limit(limit).skip(skip).sort({ likes_count: -1 }, (err, data) => {
        if (err) {
            res.json({ message: err, success: false })
        } else {
            res.json({ message: data, success: true })
        }
    })
})


export default router;