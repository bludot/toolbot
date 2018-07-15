var unload = function(client, db, channel) {
    var client = client;
    var channel = channel;
    return function(from, to, module) {
        var that = this;
        console.log("########################################")
        console.log(channel);
        console.log(from,to);
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                console.log("VERIFIED OPS!");
                var to_ = to;
                if(client.nick == to_) {
                    to_ = from;
                    client.say(to_, "same nick?");
                }
                if (!module || module != "") {
                    try {
                        that[module](from, to, "$"+module+" quit");
                        client.unloadModule(from, channel, module).then(function(res) {
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
