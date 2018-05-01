import { get } from "request";
// Imgur config
import { setCredentials, uploadUrl } from "imgur";
setCredentials('kinhdomcom@gmail.com', 'matkhau12345', '238ff8a99cfcf80');
import { config } from "./config";
import mongojs from "mongojs";
import { vsbg, users } from "./db";

export async function crawl(group_id, access_token) {
    let query = 'https://graph.facebook.com/' + group_id + '/feed?format=json&fields=' + config.fieldsFeed + '&access_token=' + access_token + '&limit=25';
    let data = await fetchData(query, true)
    if (data) {
        if (data.data) {
            data.data.forEach(post => {
                if (post) {
                    addPostToDatabase(post, group_id);
                }
            });
        }
    }
}
export function fetchData(query, isFetchNext) {
    return new Promise((resolve, reject) => {
        get(query, (err, response, body) => {
            if (err) {
                reject(err)
            } else {
                let bodyJson = JSON.parse(body);
                let paging = bodyJson.paging;
                resolve(bodyJson);
                if (paging && isFetchNext) {
                    if (paging.next) {
                        let query = paging.next;
                        fetchData(query, true);
                    }
                }
            }
        });
    })

}
export function addPostToDatabase(post, group_id) {
    if (post.likes) {
        likes = post.likes.count;
    }
    else {
        likes = 0;
    }
    vsbg.insert({
        group_id: group_id,
        post_id: post.id,
        post_message: post.message,
        created_time: post.created_time,
        updated_time: post.updated_time,
        full_picture: post.full_picture,
        from_name: post.from.name,
        from_id: post.from.id,
        likes: likes
    }, (err, docInserted) => {
        console.log('Added ...' + docInserted.id);
    });
}
export function findAndModifyImage(full_picture, newImage) {
    vsbg.findAndModify({
        query: { full_picture: full_picture },
        update: { $set: { image: newImage } },
        new: true
    }, () => {
        console.log('Done');
    });
}
export function uploadToImgur(full_picture) {
    return new Promise((resolve, reject) => {
        uploadUrl(full_picture)
            .then(function (json) {
                resolve(json.data.link);
            })
            .catch(function (err) {
                reject(0);
            });
    })

}
export function getInfo(uid) {
    let query = 'https://graph.facebook.com/' + uid + '?format=json&fields=' + config.fieldsPeople + '&access_token=' + config.access_token + '&limit=25';
    return new Promise((resolve, reject) => {
        fetchData(query, true)
            .then(data => resolve(data))
            .catch(e => reject(e))
    })
}
export function getNewestPost(group_id) {
    return new Promise((resolve, reject) => {
        vsbg.find({ group_id: group_id }).limit(1).sort({ created_time: -1 }, (err, doc) => {
            if (!err) {
                resolve(doc);
            } else {
                reject(err)
            }
        });
    })

}
export async function updateDatabase(group_id, access_token) {
    console.log('Running function updateDatabase')
    let newestPost = await getNewestPost(group_id)
    if (newestPost[0]) {
        let query = 'https://graph.facebook.com/' + group_id + '/feed?format=json&fields=' + config.fieldsFeed + '&access_token=' + access_token + '&limit=100';
        let data100Post = await fetchData(query, false)
        if (data100Post) {
            console.log(data100Post)
            data100Post.data.forEach(post => {
                if (post.created_time > newestPost[0].created_time) {
                    addPostToDatabase(post, group_id)
                    console.log('Added to DB: ' + post.id)
                }
            });
        }
    }
}
export function getInfoGroup(group_id, access_token) {
    return new Promise((resolve, reject) => {
        getFieldsOfObject(group_id, config.fieldsGroup, access_token, 25)
            .then(info => { resolve(info) })
            .catch(e => { reject(e) })
    })
}
export function getMyGroups(access_token) {
    return new Promise((resolve, reject) => {
        getFieldsOfObject('me', 'groups{' + config.fieldsGroup + '}', access_token, 25)
            .then(info => { resolve(info.groups.data) })
            .catch(e => { reject(e) })
    })
}
export function getFieldsOfObject(uid, fields, access_token, limit) {
    let query = 'https://graph.facebook.com/' + uid + '?format=json&fields=' + fields + '&access_token=' + access_token + '&limit=' + limit;
    return new Promise((resolve, reject) => {
        fetchData(query, true)
            .then(data => { resolve(data) })
            .catch(e => { reject(e) })
    })

}
export function getInfoUser(user_id) {
    return new Promise((resolve, reject) => {
        users.find({ _id: mongojs.ObjectId(user_id) }, function (err, doc) {
            resolve(doc)
        })
    })
}