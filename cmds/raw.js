var raw = function(client) {
    var client = client;
    return function(from, to, message) {
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                var msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : "";
                console.log(msg);
                console.log(msg.split(','))
                    if (msg != "") {
                        try {
                            client.send.apply(client, msg.split(',').map(e => e.toString()));
                        } catch (e) {
                            client.say(to, "syntax error!");
                        }
                    }
            }
        });
    }
};

exports.raw = raw;
