var identify = function(client, db, channel) {

    var password = "";

    return function(from, to, message) {
        var args = Array.prototype.slice.call(arguments);
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                //var msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : "";
                args = args.slice(2);
                //if(msg.split(" ")[0] == "add") {
                if(args[0] == "add") {
                    password = args[1];
                    console.log("Added!");
                    client.say(from, "added");
                }
                if(args[0] == "get") {
                    client.say(from, "pass: "+password);
                }
                console.log(args);
                if(args.length == 0) {
                    client.send("PRIVMSG", "nickserv", "identify "+password);
                    client.say(to, "attempted login");
                }
            }
        })
    }
}

exports.identify = identify;
