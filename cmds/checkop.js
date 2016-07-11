var checkop = function(client) {
    var client = client;
    return function(from, to, message, callback) {
        if(client.sendMessage) {
            if(from.toLowerCase() == "Nyanko".toLowerCase() || from.toLowerCase() == "Nyanko_Nyanko".toLowerCase()) {
                callback(true);
                return;
            }
        }

        if(client.permittedUsers[from.toLowerCase()]) {
            if(client.permittedUsers[from.toLowerCase()].perms.indexOf("o") != -1) {
                callback(true);
                return;
            } else {
                callback(false);
                return;
            }
        }
        var msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : "";
        client.send("WHOIS", msg);
    }
}
exports.checkop = checkop;
