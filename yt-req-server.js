var https = require('https');
var http = require('http');

var ytServer = http.createServer(function (request, response) {
    
    let url = require('url');
    let reqUrl = url.parse(request.url, true);
    let path = reqUrl.pathname; //Retrieves the path after 138.68.243.184:8080
    let queries = reqUrl.query; //Retrieves an object containing the queries provided.    
    console.log(new Date().toUTCString() + "> Request made from origin " + request.headers.origin + " with request path " + path);
    switch (path) {
        case '/ytThumbnail':
        //TODO: Generalize the makeRequest function if I end up wanting to request other things from Youtube
	console.log("Video ID requested: ", queries.id);
            makeRequest({
                id: queries.id,
                part: 'snippet',
                key: require('./environment').getYTKey(),
                fields: 'items(id,snippet/thumbnails)'
            }, function(result) {
                response.writeHead(200, {
                    'Access-Control-Allow-Origin': '*'
                });
                response.write(result);
                response.end();
            });
	break;
    default:
	response.writeHead(201, {
	    'Access-Control-Allow-Origin': '*'
	});
	response.write('Server request could not be processed.');
	response.end();
    }
});
ytServer.listen(8080, function() {
    console.log(new Date().toUTCString() + "> ytServer listening on port 8080.");
});
ytServer.on('error', function(err) {
    console.log(new Date().toUTCString() + "> ytServer encountered the following error: ", err.message);
});

function retrieveVideoThumbnail(id) {
    
}

function makeRequest(queries, callback) {
    
    let queryString = '/youtube/v3/videos?';
    for (let i = 0; i < Object.keys(queries).length; i++)
    {
	let key = Object.keys(queries)[i];
        let value = queries[key];
        queryString += key + "=" + value;
        if (i != Object.keys(queries).length - 1) {
            queryString += '&';
        }
    }
    
    let options = {
        'method': 'GET',
        'host': 'www.googleapis.com',
        'path': queryString,
        'headers': {}
    };

    let request = https.request(options, function (response) {
        response.setEncoding('utf8');
        if (response.statusCode == 200) {
            let result = '';
            response.on('data', function(chunk) {
                result += chunk;
            });
            response.on('end', function() {
		callback(result);
            });
        } else {
            callback('The following status code was received from Youtube: ' + response.statusCode);
        }
    });
    request.on('error', function(err) {
	callback('Request to Youtube received the following response: ' + err.message);
    });
    request.end();

}
