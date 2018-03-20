//This collection of functions will retrieve the highest-quality thumbnail for a Youtube video 
//without having to pass the request through the pixelstomp web server.

function makeRequest(videoID, callback) {
    // Call this function from your own code. 
    // You only need to provide the videoID and the callback function, and the other methods will retrieve the highest quality URl
    let request = new XMLHttpRequest();
    request.open('GET',
        'https://www.googleapis.com/youtube/v3/videos?id=' +
        videoID +
        '&key=AIzaSyC8r6PGt2XEE_ltwCxgGTpYHEc0bHea70I&part=snippet&fields=items(id,snippet/thumbnails)');   //use the pixelstomp app key responsibly
    request.onload = handleRequestResponse;
    request.callback = callback;
    request.send();
}

function handleRequestResponse() {
    if (this.status == 200) {
        let hqUrl = findHighestQuality(this.response);
        this.callback(hqUrl);   //The callback is triggered here, and the url is passed in.
    }
}

function findHighestQuality(stringResult) {
    try {
        let result = JSON.parse(stringResult);
        let thumbnails = result.items[0].snippet.thumbnails;
        if (thumbnails.maxres) {
            return thumbnails.maxres.url;
        }
        if (thumbnails.standard) {
            return thumbnails.standard.url;
        }
        if (thumbnails.high) {
            return thumbnails.high.url;
        }
        if (thumbnails.medium) {
            return thumbnails.medium.url;
        }
        if (thumbnails.default) {
            return thumbnails.default.url;
        }
    }
    catch (e) {
        console.log('The following error was encountered: ' + e.message + '\n' +
            'The result received from the request server was: ', result.toString());
    }
}