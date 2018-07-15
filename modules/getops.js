var getops = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, message) {
        if(to.toLowerCase() == client.nick.toLowerCase()) {
            this.checkop(from, to, ".null " + from, function(op) {
                if (op) {
                    if(client.permittedUsers[from.toLowerCase()].perms.indexOf("-adu-") != -1) {
                        var msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : "";
                        console.log(msg);
                        console.log(msg.split(" "))
                        if(msg) {
                            /*if(client.permittedUsers[msg.split(" ")[0]]) {
                                                                                                                                                                                        delete(client.permittedUsers[msg.split(" ")[0]]);
                                                                                                                                                                                                                }*/
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

exports.getops = getops;var getops = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, msg) {
        if(to.toLowerCase() == client.nick.toLowerCase()) {
            this.checkop(from, to, ".null " + from, function(op) {
                if (op) {
                    if(client.permittedUsers[from.toLowerCase()].perms.indexOf("-adu-") != -1) {
                        client.say(from, JSON.stringify(client.permittedUsers));
                    }
                }
            });
        } else {
            client.say(to, "only login through pm please!");
        }
    }
};

exports.getops = getops;
