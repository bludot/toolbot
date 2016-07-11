module.exports = function(client, db) {
    var client = client;
    var db = db;
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


// parse application/json
app.use(bodyParser.json())

app.get('/toolbot/verify/:nick/:token', function(req, res) {
    db.compareToken(req.params.nick, req.params.token).then(function(result) {
        if(result) {
            client.permittedUsers[result.nick] = {
                perms: result.perms
            };
            client.say(result.nick, JSON.stringify(client.permittedUsers));
            return res.json(result);
        }
    })
});

app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
});

//console.log(client);
}
