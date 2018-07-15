var nick = function(client, db) {
    var client = client;
    var db = db;
    return function(from, to, nick) {
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                if(nick && nick != "") {
                    client.send.apply(client, ["NICK", nick]);
                }
            }
        });
    }
};

exports.nick = nick;
