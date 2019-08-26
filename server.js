var http = require('http'),
  fs = require('fs'),
  url = require('url'),
  port = 8080;

/* Global variables */
var listingData, server;

var requestHandler = function (request, response) {

  var parsedUrl = url.parse(request.url);

  if (request.method !== "GET") {
    const methodNotAllowed = "Method Not Allowed";
    response
      .writeHead(405, {
        'Content-Length': Buffer.byteLength(methodNotAllowed),
        'Content-Type': 'text/plain'
      })
      .end(methodNotAllowed);
    return;
  }

  if (parsedUrl.pathname == "/listings") {
    const listingString = JSON.stringify(listingData);
    response
      .writeHead(200, {
        'Content-Length': Buffer.byteLength(listingString),
        'Content-Type': 'application/json'
      })
      .end(listingString);
      return;
  }
  else {
    const badGateway = "Bad gateway error";
    response
      .writeHead(404, {
        'Content-Length': Buffer.byteLength(badGateway),
        'Content-Type': 'text/plain'
      })
      .end(badGateway);
      return;
  }

};

fs.readFile('listings.json', 'utf8', function (err, data) {

  //Check for errors
  if (err) {
    console.log(`${err.name}: ${err.message}`);
    return;
  }

  //Save the sate in the listingData variable already defined
  listingData = JSON.parse(data);

  //Create the server
  var server = http.createServer(requestHandler);

  //Start the server
  server.listen(port, function () {
    console.log('Server listening on: http://127.0.0.1:' + port);
  });

});
