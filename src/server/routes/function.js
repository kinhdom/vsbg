import { get, post } from "request";
// Imgur config
import { setCredentials, uploadUrl } from "imgur";
setCredentials('kinhdomcom@gmail.com', 'matkhau12345', '238ff8a99cfcf80');
import { config } from "./config";
import mongojs from "mongojs";
import { vsbg, users } from "./db";
var dem = 0;
export async function crawl(group_id, access_token) {
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
    let likes;
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
        likes: likes,
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
        // let query = 'https://graph.facebook.com/' + group_id + '/feed?format=json&fields=' + config.fieldsFeed + '&access_token=' + access_token + '&limit=100';
        // let data100Post = await fetchData(query, false)
        let data100Post = await getFieldsOfObject(group_id, 'feed', config.fieldsFeed, access_token, 5, false)
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