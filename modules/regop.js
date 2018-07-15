var regop = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, pass) {
        if(to.toLowerCase() == client.nick.toLowerCase()) {
            this.checkop(from, to, ".null " + from, function(op) {
                if (op) {
                    if(client.permittedUsers[from.toLowerCase()].perms.indexOf("-treg-") != -1) {
                        if(msg != "") {
                            db.regNick(from.toLowerCase(), pass).then(function(res) {
                                if(res) {
                                    client.say(from, JSON.stringify(res));
                                    client.permittedUsers[from].perms = res.perms;
                                }
                            })
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

exports.regop = regop;
