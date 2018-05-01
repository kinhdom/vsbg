import { get } from "request";
import { fieldsFeed, fieldsPeople, access_token as _access_token, fieldsGroup } from "./config";
import mongojs from "mongojs";
import { users } from "./db";



export function getAccessTokenFromUserId(user_id) {
    return new Promise((resolve, reject) => {
        users.find({
            _id: mongojs.ObjectId(user_id)
        }, function (err, docs) {
            resolve(docs.length)
        })
    })
}