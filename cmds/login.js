var login = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, message) {
        if(to.toLowerCase() == client.nick.toLowerCase()) {
            var msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : "";
            console.log(msg);
            console.log(msg.split(" "))
                if(msg != "") {
                    db.login(from.toLowerCase(), msg.split(" ")[0]).then(function(res) {
                        if(res) {
                            client.permittedUsers[res.nick] = {
                                perms: res.perms,
                                channel: msg.split(" ")[1]
                            };
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
