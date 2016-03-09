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
    var newId = Math.round(Math.random()*10000);
    resp.json({currentDate:currentDate, id: newId});
});

app.post('/delete-file', function (req, resp) {
    resp.status(200).send("file deleted successfully");
});

