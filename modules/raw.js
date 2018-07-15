var raw = function(client) {
    var client = client;
    return function(from, to, args) {
        var args = Array.prototype.slice.call(arguments);
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                if (args.slice(2).length > 1) {
                    try {
                        client.send.apply(client, args.slice(2));
                    } catch (e) {
                        client.say(to, "syntax error!");
                    }
                }
            }
        });
    }
};

exports.raw = raw;
