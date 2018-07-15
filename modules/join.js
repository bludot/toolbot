var join = function(client, db) {
    var client = client;
    return function(from, to, room) {
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
                if (room != "") {
                    client.join(room);
                    db.getModules().then(function(res) {
                        for(var i in res) {
                            if(res[i].type == "core") {
                                client.loadModule(room.trim(), res[i].name);
                            }
                        }

                    })

                }
            }
        });
    }
}

exports.join = join;
