var login = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, pass) {
        console.log('running func!');
        if(to.toLowerCase() == client.nick.toLowerCase()) {
            if(pass != "") {
                db.login(from.toLowerCase(), pass).then(function(res) {
                    if(res) {
                        client.permittedUsers[res.nick] = {
                            perms: res.perms,
                            channel: client.channel
                        };
                        //client.say(from, "http://ts.floretos.com:3000/toolbot/verify/"+from.toLowerCase()+"/"+res.token);
                    }
                    client.say(from, JSON.stringify(client.permittedUsers));
                });
            }
        } else {
            client.say(to, "only login through pm please!");
        }
    }
};

exports.login = login;
