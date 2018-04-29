var request = require('request');

var headers = {
    'origin': 'https://wordpress.com',
    'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': 'application/json',
    'referer': 'https://wordpress.com/',
    'authority': 'wordpress.com',
};

var dataString = 'username=kinhdomcom%40gmail.com&password=matkhau!%40%23%24%25&remember_me=true&redirect_to=https%3A%2F%2Fwordpress.com%2F&client_id=39911&client_secret=cOaYKdrkgXz8xY7aysv4fU6wL6sK5J8a6ojReEIAPwggsznj4Cb6mW0nffTxtYT8';

var options = {
    url: 'https://wordpress.com/wp-login.php?action=login-endpoint',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    console.log(error)
    if (!error && response.statusCode == 200) {
        let upload_headers = response.headers;
        console.log(upload_headers.vary)
        let upload_dataString = '{"media_urls":["https://images.viblo.asia/avatar/c505e683-1056-4c18-9f2f-24a9d691588b.jpg"]}';

        let upload_options = {
            url: 'https://public-api.wordpress.com/rest/v1.1/sites/122206303/media/new?http_envelope=1',
            method: 'POST',
            headers: upload_headers,
            body: upload_dataString
        };

        function upload_callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }

        request(upload_options, upload_callback);

    }
}

request(options, callback);
