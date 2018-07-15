var load = function(client) {
    var client = client;
    return function(from, to, msg, _to) {
        console.log("########################################")

        console.log(from,to);
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                console.log("VERIFIED OPS!");
                var to_ = to;
                if(client.nick == to_) {
                    to_ = from;
                }
                if (msg != "") {
                    if(_to) {
                        to = _to;//msg.split(" ")[1];
                        msg = msg;//msg.split(" ")[0];
                    }
                    try {
                        client.loadModule(to, msg).then(function(res) {
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

exports.load = load;
