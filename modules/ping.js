var ping = function(client) {
    var client = client;

    var tmp_options = [];
    return function(from, to, message) {
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                if (!message) {
                    client.say(to, "PONG!");//stupid video doesnt do ctrl+s shortcut
                }
            }
        });
    }
};

exports.ping = ping;
