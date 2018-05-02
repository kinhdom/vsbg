const request = require("request");
let access_token = 'EAAAAUaZA8jlABABy9k8jMiagmlCwyjEzz49HVJvoQAC7SPpdyOrWjBxWH5N0o9LEPGzaEMZAq5QtjCaARtfPMXHusdScbb6lpa5vNNr3w8UsoNgrFOk3bpkr4BY0P1f8f4wE9NHMxDslFFvhEf6SowDfM4tzEZD'
let query = 'https://graph.facebook.com/1416109728606342/feed?access_token=' + access_token
let queryMember = 'https://graph.facebook.com/1416109728606342/members?access_token=' + access_token

var dem = 0;
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
                    }
                }
            }

        }
    })
}

// fetchData(queryMember, (data) => {
//     for (let member of data) {
//         let member_id = member.id
//         getGroupsOfUID(member_id, (count) => {
//             if (count < 12) {

//             }

//         })
//     }
// })
getGroupsOfUID('100003973367950', (c) => {
    console.log(c)
})
function getGroupsOfUID(member_id, callback) {
    let queryGroupsOfUID = query = 'https://graph.facebook.com/' + member_id + '/groups?access_token=' + access_token
    fetchData(queryGroupsOfUID, (data) => {
        callback(data.length)
    })
}


var headers = {
    'origin': 'https://www.facebook.com',
    'accept-language': 'en-US,en;q=0.9',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': '*/*',
    'referer': 'https://www.facebook.com/groups/gaixinhcolink/',
    'authority': 'www.facebook.com',
    'cookie': 'sb=tHPoWizMTqusrsz3hSsOE_u5; datr=tHPoWtnyYQKIVFX9fcRyODMw; c_user=100006844653943; xs=212%3AgIMxWJu4DAaT2w%3A2%3A1525183426%3A2407%3A15647; pl=n; fr=09osLgdtS16fRR0XY.AWW6-MSBETvEUQ3l5MT6N9phamY.Ba6HO0.lw.Fro.0.0.Ba6Jaa.AWUAzGFp; m_pixel_ratio=1; x-referer=eyJyIjoiL2dyb3Vwcy9nYWl4aW5oY29saW5rL3Blcm1hbGluay8xNDU1NzYzNTUxMzA3NjI2LyIsImgiOiIvZ3JvdXBzL2dhaXhpbmhjb2xpbmsvcGVybWFsaW5rLzE0NTU3NjM1NTEzMDc2MjYvIiwicyI6Im0ifQ%3D%3D; wd=980x761; presence=EDvF3EtimeF1525194191EuserFA21B06844653943A2EstateFDutF1525194191411CEchFDp_5f1B06844653943F2CC; act=1525194200341%2F3'
};
deletePost('1678978195484632')
function deletePost(post_id) {
    var dataString = 'fb_dtsg=AQGXsv_0aprb%3AAQEO-FBxpXWd&group_id=1416109728606342&message_id=' + post_id + '&confirmed=1&pending=&source=&story_dom_id=u_0_1p&revision_id=&inner_tab=&surface=group_post_chevron&location=3&__user=100006844653943&__a=1&__dyn=7AgNe-4amaxx2u6aJGeFxqewRyWzEy4aheC267Uqzob4q2i5U4e1Fx-K9wPG2OUG4XzEeUF0Tz8S2S4o57Dxicxu5o6uidwBx61zwxUfovG0HFVo7G2i6pHxC68nxK1Iwgovy8nyES3m2GdzEjG48y684ecGbQu4e4oC2biAx-lxdwzBAyEiyo8U-4Kq3C58bEWGDwUzo&__req=t&__be=1&__pc=PHASED%3ADEFAULT&__rev=3865284&jazoest=2658171881151189548971121149858658169794570661201128887100&__spin_r=3865284&__spin_b=trunk&__spin_t=1525194188';
    var options = {
        url: 'https://www.facebook.com/ajax/groups/mall/delete.php?dpr=1',
        method: 'POST',
        headers: headers,
        body: dataString
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('Delete ' + post_id)
        }
    });
}


function removeMember(member_id) {

    let dataString = 'fb_dtsg=AQH5VMSrtPgp%3AAQFuzOOjS72c&confirm=true&__user=100006844653943&__a=1&__dyn=7AgNe-4am2d2u6aJGeFxqeCwKyaGey8gFLFwxx-6ES2N6wAxu13wqpUKbnyorxuEbbyEjKewXGt0TyKdwJyFEgUC78pDAzUO5U7e9Azo9ohwoUS4-i4EG6EvG7Elxa3e3au3e2G262i6rGUpxy5Urx6fjG12wRyUG58y2a1KUK8Bx7G48yawnGyZ7x3x69ww-V8my9m4S3C4ECmUpwyVEtyEnzo4KcwHCBw&__req=1i&__be=1&__pc=PHASED%3ADEFAULT&__rev=3865485&jazoest=2658172538677831141168010311258658170117122797910683555099&__spin_r=3865485&__spin_b=trunk&__spin_t=1525197762';

    let options = {
        url: 'https://www.facebook.com/ajax/groups/members/remove.php?group_id=1416109728606342&user_id=' + member_id + '&is_undo=0&source=profile_browser&dpr=1',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            dem++;
            console.log(dem + ' Removed ' + member_id)
        }
    }

    request(options, callback);
}

