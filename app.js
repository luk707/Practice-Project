var express = require('express');
var app = express();
var path = require('path');

var leaderboard = require('./api/leaderboard');

let production = process.argv[2] == "-p";

console.log(process.argv);

app.use('/api/:service', function(req, res, next) {
    switch(req.params.service) {
        default:
            next();
            break;
        case "leaderboard":
            res.send(leaderboard(production));
            break;
    }
});

if (production) {
    app.use(express.static('dist'));

    app.get('*', function(req, res) {
        res.redirect('/');
    });
}

let port = production ? 80 : parseInt(process.argv[2], 10);

app.listen(port, function() {
    console.log("----STACK----");
    console.log("Server started on port: " + port);
    console.log("Ctrl + C to terminate");
});
