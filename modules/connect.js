var connect = function(client) {
    var client = client;
    var connection_;
    return function(from, to) {
        console.log("########################################")

        console.log(from,to);

        var args = Array.prototype.slice.call(arguments);
        this.checkop(from, to, ".null " + from, function(op) {
            if (op && op.indexOf('-dev-') != -1) {
                console.log("VERIFIED OPS!");
                var to_ = to;
                if(client.nick == to_) {
                    to_ = from;
                }
                args = args.slice(2);
                if(args[0] != "quit") {
                    try {

                        client.getIrc().connect({
                            server: args[0],
                            port: args[1],
                            channels: JSON.parse(args[2]),
                            nick: args[3],
                            realname: args[4],
                            debug: false
                        });
                        connection_ = client.getIrc().connections[args[0]];
                        //client.send.apply(client, msg.split(',').map(e => e.toString()));
                    } catch (err) {
                        console.log(err);
                        client.say(to_, "syntax error!");
                    }
                } else {
                    connection_.quit();

                }
            }
        });
    }
}

exports.connect = connect;
