var say = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, message) {

        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                if(client.permittedUsers[from.toLowerCase()].perms.indexOf("o") != -1 || client.permittedUsers[from.toLowerCase()].perms.indexOf("s") != -1) {
                    var msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : "";
                    console.log(msg);
                    console.log(msg.split(" "))
                        if(msg != "") {
                            if(msg.indexOf(":") == -1) {
                                client.say(to, msg);
                            } else {
                                client.say(msg.split(":")[0], msg.split(":")[1]);
                            }
                        }
                }
            }
        });
    }
};

exports.say = say;
