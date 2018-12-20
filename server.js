var DEV = (process.argv[2] == "dev" ? true : false);
module.exports.DEV = DEV;

var path = require("path");
var express = require("express");
var body_parser = require("body-parser");
var fs = require("fs");
var _ = require("underscore");
var os = require("os");

if (DEV) {
    var PORT = 8000;
    var htmlFile2 = __dirname + "/index_2.html";
    console.log(htmlFile2);
} else {
    var PORT = 80;
    var htmlFile2 = __dirname + "/index_2.html";
}

const app = express();
app.use(express.static(__dirname + '/public/'));
app.use(body_parser.urlencoded());

// Listen on Port
var server = app.listen(PORT, function(error) {
    if (error) {
        return console.log("server unable to listen on port");
    } else {
        console.log(`server is listening on ${PORT}`);
    }
});
server.timeout = 600000;

// Add headers
app.use(function (req, res, next) {
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type');
    // Pass to next layer of middleware
    next();
});

var json_parser = body_parser.json();

app.get("/", function(request, response) {
    response.sendFile(htmlFile2);
});

app.get("/test", json_parser, function(request, response) {
    response.status(200).send("success");
});
