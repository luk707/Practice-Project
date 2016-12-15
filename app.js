var express = require('express');
var app = express();
var path = require('path');

var leaderboard = require('./api/leaderboard');

app.use('/api/:service', function(req, res, next) {
    switch(req.params.service) {
        default:
            next();
            break;
        case "leaderboard":
            res.send(leaderboard());
    }
});

app.use(express.static('dist'));

app.get('*', function(req, res) {
    res.redirect('/');
});

app.listen(80, function() {
    console.log("----STACK----");
    console.log("Server started on port: 80");
    console.log("Ctrl + C to terminate");
});
