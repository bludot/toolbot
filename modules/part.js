var part = function(client) {
    var client = client;
    return function(from, to, room) {
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {

                client.part(room);

            }
        });
    }
}

exports.part = part;
