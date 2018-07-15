var editop = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, user, option, values) {
        if(to.toLowerCase() == client.nick.toLowerCase()) {
            this.checkop(from, to, ".null " + from, function(op) {
                if (op) {
                    if(client.permittedUsers[from.toLowerCase()].perms.indexOf("-adu-") != -1) {
                        if(user && option && values) {
                            if(client.permittedUsers[user]) {
                                client.permittedUsers[user][option] = values;
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

exports.editop = editop;
