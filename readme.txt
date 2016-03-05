To test this directive, you should create and start a small REST server to make http to the server and get response from it.

Before start of server, you must to add those libs^
  https://www.npmjs.com/package/express
  https://www.npmjs.com/package/multer
To start js server execute following code in command line of server.js folder:
node server.js

After that, just execute, in command line of gulpfile.js folder, the following code:
gulp serve

Server code

var express = require('express');
var app = express();
var server = require('http').createServer(app);
server.listen(8282);

var multer  = require('multer');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

app.use(allowCrossDomain);

var upload = multer();
app.post('/upload-file', upload.fields([
    { name: 'file', maxCount: 1},
    { name: 'comment', maxCount: 1}
]), function (req, resp) {
    var currentDate = new Date();
    resp.json({currentDate:currentDate});
});
