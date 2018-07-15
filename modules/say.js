var say = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, _to, msg) {

        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                if(client.permittedUsers[from.toLowerCase()].perms.indexOf("o") != -1 || client.permittedUsers[from.toLowerCase()].perms.indexOf("s") != -1) {
                    if(_to) {
                        if(!msg) {
                            client.say(to, _to);
                        } else {
                            client.say(_to, msg);
                        }
                    }
                }
            }
        });
    }
};

exports.say = say;
