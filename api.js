var request = require('request');

var headers = {
    'origin': 'https://public-api.wordpress.com',
    'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
    'authorization': 'X-WPCOOKIE cdf7d09ca41a2efdb027a1821f54953b:1:https://wordpress.com',
    'content-type': 'application/json',
    'accept': '*/*',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36',
    'referer': 'https://public-api.wordpress.com/wp-admin/rest-proxy/?v=2.0',
    'authority': 'public-api.wordpress.com',
    'Cookie': 'cookie: wp_api_sec=daylaitai%7C1619505255%7C01orySEYKsQ4299dNrrqYQOEtRvaz3l475fustOacs7%7C022b21b6f4579d26b8de13009eaa2bc5fda083591f8b5a434993aa81bf92f61c; _ga=GA1.2.1810458970.1524897240; _gid=GA1.2.138631153.1524897240; _wpndash=d168feb3118f8c9b82442e0b; G_AUTHUSER_H=1; G_ENABLED_IDPS=google; wordpress_logged_in=daylaitai%7C1619505255%7C01orySEYKsQ4299dNrrqYQOEtRvaz3l475fustOacs7%7Cdc39c9634ae2db799802a8681c5d554fa192d656fc9a17db758198de59e3b061; wordpress_test_cookie=WP+Cookie+check; wordpress_eli=1; tk_tc=FzXctG%2F0UjU%2FMd9D; _gat=1; wpc_wpc=account=daylaitai&avatar=https%3A%2F%2F2.gravatar.com%2Favatar%2F510f30f27c021f55850dc684e400235a%3Fs%3D25%26amp%3Bd%3Dhttps%253A%252F%252Fs2.wp.com%252Fwp-content%252Fmu-plugins%252Fhighlander-comments%252Fimages%252Fwplogo.png&email=daylaitai%40gmail.com&link=http%3A%2F%2Ffood403494205.wordpress.com&name=day%20lai&uid=137147815&access_token=4f350e056b6b085cab9431980a940c989efb7cea'
};

var dataString = '{"media_urls":["https://techtalk.vn/wp-content/uploads/2017/03/how-big-is-china-social-media-696x385.jpg"]}';

var options = {
    url: 'https://public-api.wordpress.com/rest/v1.1/sites/145814600/media/new?http_envelope=1',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);
