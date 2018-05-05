import { get, post } from "request";
// Imgur config
import { setCredentials, uploadUrl } from "imgur";
setCredentials('kinhdomcom@gmail.com', 'matkhau12345', '238ff8a99cfcf80');
import { config } from "./config";
import mongojs from "mongojs";
import { vsbg, users } from "./db";
var dem = 0;
export async function crawl(group_id, access_token) {
    let deleted = await deleteFeed(group_id)
    console.log(deleted)
    console.log('Running function crawl ...')
    let query = 'https://graph.facebook.com/' + group_id + '/feed?format=json&fields=' + config.fieldsFeed + '&access_token=' + access_token + '&limit=100';
    fetchData(query, true, (data) => {
        if (data) {
            data.forEach(post => {
                addPostToDatabase(post, group_id)
            });
        }
    })
}
export function deleteFeed(group_id) {
    return new Promise((resolve, reject) => {
        vsbg.remove({ group_id: group_id }, function (err, docs) {
            resolve(docs)
        })
    })
}
export function fetchData(query, isFetchNext, callback) {
    get(query, (err, response, body) => {
        if (err) {
            callback(false)
        } else {
            let bodyJson = JSON.parse(body);
            if (bodyJson) {
                let data = bodyJson.data
                callback(data)
                let paging = bodyJson.paging
                if (paging && isFetchNext) {
                    if (paging.next) {
                        let newQuery = paging.next;
                        fetchData(newQuery, true, callback);
                    }
                }
            }
        }
    });


}
export function addPostToDatabase(post, group_id) {
    let likes_count;
    let comments_count;
    let shares_count;
    post.likes ? likes_count = post.likes.count : likes_count = 0;
    post.comments ? comments_count = post.comments.count : comments_count = 0;
    post.shares ? shares_count = post.shares.count : shares_count = 0;
    let created_timestamp = new Date(post.created_time).getTime();
    let updated_timestamp = new Date(post.updated_time).getTime();
    let now_timestamp = new Date().getTime()
    let score = (likes_count + 1) * (comments_count + 1) * (shares_count + 1) * (updated_timestamp - created_timestamp + 1) / (now_timestamp - created_timestamp) / (now_timestamp - updated_timestamp)
    vsbg.insert({
        group_id: group_id,
        post_id: post.id,
        post_message: post.message,
        created_time: post.created_time,
        updated_time: post.updated_time,
        full_picture: post.full_picture,
        from_name: post.from.name,
        from_id: post.from.id,
        likes_count: likes_count,
        comments_count: comments_count,
        shares_count: shares_count,
        score: score,
        isPosted: false
    }, (err, docInserted) => {
        dem++;
        console.log('Added ' + dem + ' - ' + docInserted.post_id);
    });

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
        let data100Post = await getFieldsOfObject(group_id, 'feed', config.fieldsFeed, access_token, 100, false)
        if (data100Post) {
            data100Post.forEach(post => {
                if (post.created_time > newestPost[0].created_time) {
                    addPostToDatabase(post, group_id)
                }
            });
        }
    }
}
export function getInfoGroup(group_id, access_token) {
    return new Promise((resolve, reject) => {
        getFieldsOfObject(group_id, '', config.fieldsGroup, access_token, 25, true)
            .then(info => { resolve(info) })
            .catch(e => { reject(e) })
    })
}
export function getMyGroups(access_token) {
    return new Promise((resolve, reject) => {
        getFieldsOfObject('me', 'groups', config.fieldsGroup, access_token, 25, true)
            .then(info => { resolve(info.groups.data) })
            .catch(e => { reject(e) })
    })
}
export function getFieldsOfObject(uid, object, fields, access_token, limit, isFetchNext) {
    let query = 'https://graph.facebook.com/' + uid + '/' + object + '?format=json&fields=' + fields + '&access_token=' + access_token + '&limit=' + limit;
    return new Promise((resolve, reject) => {
        console.log(query)
        fetchData(query, isFetchNext, (data) => {
            resolve(data)
        })
    })

}
export function getInfoUser(user_id) {
    return new Promise((resolve, reject) => {
        users.find({ _id: mongojs.ObjectId(user_id) }, function (err, doc) {
            if (err) {
                reject(err)
            } else {
                resolve(doc[0])
            }

        })
    })
}
export function postPhoto(photo, caption, UID, access_token) {
    let endpoint = 'https://graph.facebook.com/' + UID + '/photos'
    let data = {
        access_token: access_token,
        url: photo,
        caption: caption
    }
    return new Promise((resolve, reject) => {
        post(endpoint, { form: data }, (err, response, body) => {
            if (!err) {
                let bodyJson = JSON.parse(body)
                let post_id = bodyJson.post_id
                resolve(post_id)
            } else {
                reject(err)
            }
        })
    })

}
export async function getUserName(uid, access_token) {
    let query = 'https://graph.facebook.com/' + uid + '/?fields=username&access_token=' + access_token
    get(query, (err, response, body) => {

        if (err) {
            return uid
        }
        let bodyJson = JSON.parse(body)
        if (bodyJson) {
            return bodyJson.username
        }
    })
    return uid
}