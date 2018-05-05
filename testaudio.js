var request = require('request');
var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');


http.createServer(function (request, response) {
    var filePath = 'test.mp3';
    var stat = fileSystem.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to util.pump()
    readStream.pipe(response)
    console.log('Hello')
})
    .listen(3000);




let headers = {

    'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36',
    'accept': '*/*',
    'referer': 'https://www.bing.com/',
    'authority': 'www.bing.com',
    'range': 'bytes=0-'
};

let options = {
    url: 'https://www.bing.com/tspeak?&format=audio%2Fmp3&language=vi&IG=CE9F86DC1F4B45058FC7B0264343A50F&IID=translator.5034.3&text=hai',
    headers: headers
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);
