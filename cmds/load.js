var load = function(client) {
    var client = client;
    return function(from, to, message) {
        console.log("########################################")

            console.log(from,to);
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                console.log("VERIFIED OPS!");
                var msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : "";
                console.log(msg);
                console.log(msg.split(','))
                    var to_ = to;
                if(client.nick == to_) {
                    to_ = from;
                }
                if (msg != "") {
                    if(msg.split(" ").length > 1) {
                        to = msg.split(" ")[0];
                        msg = msg.split(" ")[1];
                    }
                    try {
                        client.loadModule(to, msg).then(function(res) {
                            client.say(to_, res);
                        });
                    } catch (e) {
                        client.say(to_, "syntax error!");
                    }
                }
            }
        });
    }
}

exports.load = load;
