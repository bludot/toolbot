var unload = function(client, db, channel) {
    var client = client;
    var channel = channel;
    return function(from, to, message) {
        var that = this;
        console.log("########################################")
            console.log(channel);
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
                    client.say(to_, "same nick?");
                }
                if (msg != "") {
                    try {
                        that[msg](from, to, "$"+msg+" quit");
                        client.unloadModule(from, channel, msg).then(function(res) {
                            client.say(to_, res);
                        });

                        //client.send.apply(client, msg.split(',').map(e => e.toString()));
                    } catch (e) {
                        client.say(to_, "syntax error!");
                    }
                }
            }
        });
    }
}

exports.unload = unload;
