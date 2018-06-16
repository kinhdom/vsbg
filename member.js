const request = require("request");
var prependFile = require('prepend-file');

let access_token = 'EAAAAUaZA8jlABALk1eH1awHh5mrVsbWeJ9gX6Lnw2KCOtPsBJ6QTt4ZCYPCJ3VQTnn3kSqeThPUTzGvePhuObZBFjlAP6kuprbCT1apvNwYwWeel5jdyuL4PygkFCxT7GYIukDLI1k5n0js0SgZByUUdjhlIFE8ZD'
let group_id = ['1398920373755995','']
let query = 'https://graph.facebook.com/' + group_id + '/members?access_token=' + access_token + '&limit=500'
let arrUID = []
let dem = 0
fetchData(query, (data) => {
    if (data) {
        data.forEach(member => {
            dem++
            arrUID.push(member.id)
        });
    } else {
        arrUID_string = arrUID.join('\n')
        prependFile('GROUP/' + group_id + '.txt', arrUID_string, function (err) {
            if (err) {
                console.log('Loi cmnr: '+err)
            }

            // Success
            console.log('Done ' + group_id);
        });

    }
})


function fetchData(query, callback) {
    request.get(query, (err, res, body) => {
        if (!err) {
            let bodyJson = JSON.parse(body);
            if (bodyJson) {
                callback(bodyJson.data)
                let paging = bodyJson.paging;
                if (paging) {
                    if (paging.next) {
                        let query = paging.next;
                        fetchData(query, callback);
                    } else {
                        callback(0)
                    }
                }
            }

        }
    })
}