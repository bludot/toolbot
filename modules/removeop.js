var removeop = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, user) {
        if(to.toLowerCase() == client.nick.toLowerCase()) {
            this.checkop(from, to, ".null " + from, function(op) {
                if (op) {
                    if(client.permittedUsers[from.toLowerCase()].perms.indexOf("-adu-") != -1) {
                        if(user && user != "") {
                            if(client.permittedUsers[user]) {
                                delete(client.permittedUsers[user]);
                            }
                            client.say(from, JSON.stringify(client.permittedUsers));
                        }
                    }
                }
            });
        } else {
            client.say(to, "only login through pm please!");
        }
    }
};

exports.removeop = removeop;
