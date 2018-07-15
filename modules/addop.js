var addop = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, user, perms) {
        if(to.toLowerCase() == client.nick.toLowerCase()) {
            this.checkop(from, to, ".null " + from, function(op) {
                if (op) {
                    if(user) {
                        client.permittedUsers[user] = {
                            perms: perms
                            //channel: msg.split(" ")[1]
                        };
                        client.say(from, JSON.stringify(client.permittedUsers));
                    }
                }
            });
        } else {
            client.say(to, "only login through pm please!");
        }
    }
};

exports.addop = addop;
