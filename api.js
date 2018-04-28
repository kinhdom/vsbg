var request = require('request');

var headers = {
    'origin': 'https://public-api.wordpress.com',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
    'authorization': 'X-WPCOOKIE f7ccfac5a52fe5cd838de5affec9c555:1:https://wordpress.com',
    'content-type': 'application/json',
    'accept': '*/*',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36',
    'referer': 'https://public-api.wordpress.com/wp-admin/rest-proxy/?v=2.0',
    'authority': 'public-api.wordpress.com',
    'Cookie': 'cookie: __utmc=11735858; __utmz=11735858.1524573607.3.3.utmcsr=facebook.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utma=11735858.393632156.1524566511.1524573607.1524645022.4; ad_details=utm_source%3Dadwords%26utm_campaign%3DGoogle_WPcom_Search_Brand_Desktop_RoW_en%26utm_medium%3Dcpc%26keyword%3Dwordpress%26campaignid%3D655562327%26adgroupid%3D55312602867%26matchtype%3De%26device%3Dc%26network%3Dg%26targetid%3Dkwd-313411415%26locationid%3D9040370%26gclid%3DCj0KCQjw8YXXBRDXARIsAMzsQuWZ79CZ4zKfZqdxxtyqjWPkV7qDm8AZCbw6L_jhXaGIaleGDi77NWUaArlIEALw_wcB; landingpage_currency=USD; _ga=GA1.2.393632156.1524566511; _gid=GA1.2.282705691.1524799625; __qca=P0-1578407173-1524799624843; wordpress_test_cookie=WP+Cookie+check; G_ENABLED_IDPS=google; G_AUTHUSER_H=1; _wpndash=d168feb3118f8c9b82442e0b; wordpress_eli=1; ad_timestamp=1524799679; _gac_UA-10673494-4=1.1524799681.Cj0KCQjw8YXXBRDXARIsAMzsQuWZ79CZ4zKfZqdxxtyqjWPkV7qDm8AZCbw6L_jhXaGIaleGDi77NWUaArlIEALw_wcB; _gac_UA-10673494-10=1.1524799681.Cj0KCQjw8YXXBRDXARIsAMzsQuWZ79CZ4zKfZqdxxtyqjWPkV7qDm8AZCbw6L_jhXaGIaleGDi77NWUaArlIEALw_wcB; __ssid=b4227881-138e-4ca7-8e7e-31613ae9c694; wordpress_logged_in=daylaitai%7C1619426986%7CcJIwlY5iecBj4H7KnAW7LlcwElKxOeJLRGHSjZ9FPnp%7C6d45182840431419a3aa390ad2bcf87698593d88711d8e6301f3cdcb809f35b8; wp_api_sec=daylaitai%7C1619426986%7CcJIwlY5iecBj4H7KnAW7LlcwElKxOeJLRGHSjZ9FPnp%7C50944deb08aa9b29d9eb102772656175f28a6ec3e7a0888480e41adf1ae6a730; tk_tc=OqMb9LwT6%2FbK65BS; wpc_wpc=account=daylaitai&avatar=https%3A%2F%2F2.gravatar.com%2Favatar%2F510f30f27c021f55850dc684e400235a%3Fs%3D25%26amp%3Bd%3Dhttps%253A%252F%252Fs2.wp.com%252Fwp-content%252Fmu-plugins%252Fhighlander-comments%252Fimages%252Fwplogo.png&email=daylaitai%40gmail.com&link=http%3A%2F%2Ffood403494205.wordpress.com&name=day%20lai&uid=137147815&access_token=4f350e056b6b085cab9431980a940c989efb7cea'
};




var dataString = '{"blog_name":"haivai4","blog_title":"haivai4","options":{"designType":"blog","theme":"pub/independent-publisher-2","vertical":"haivai4","siteGoals":"share"},"validate":false,"find_available_url":false,"client_id":"39911","client_secret":"cOaYKdrkgXz8xY7aysv4fU6wL6sK5J8a6ojReEIAPwggsznj4Cb6mW0nffTxtYT8","lang_id":1,"locale":"en"}';

var options = {
    url: 'https://public-api.wordpress.com/rest/v1.1/sites/new?http_envelope=1',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('OK');
    }
}

request(options, callback);
