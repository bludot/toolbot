var args = {};

//
// <net> <name> <port> <debug> <username> <realname> <channels ...>
//
var tmp = process.argv;
tmp.splice(0, 2);
console.log(tmp);
args = {
    server: tmp[0],
    nick: tmp[1],
    port: tmp[2],
    debug: tmp[3],
    username: tmp[4],
    realname: tmp[5],
    config: tmp[6],
    channels: tmp.slice(7)
};


function requireFromString(src, filename) {
    var m = new module.constructor();
    m.paths = module.paths;
    m._compile(src, filename);
    return m.exports;
}

var db = require('./db');
var irc = require('irc')

//const client = new irc.Client('irc.freenode.net', 'blubot_', {
/*var client = new irc.Client('irc.systemnet.info', 'toolbot', {
    port: 6667,
    debug: true,
    channels: ['#test_irc'],
    userName: 'toolbot',
    realName: 'toolbot'
});*/



var client = new irc.Client(args.server, args.nick, {
    port: args.port,
    debug: args.debug,
    channels: args.channels,
    userName: args.username,
    realName: args.realname
});
client.net = args.server.split(".")[1];

client.permittedUsers = {};

client.loadModule = function(channel, module_) {
    var result = module_+" has been loaded!";
    var error = false;
    var channel = channel.toLowerCase();
        return  db.getCmd(module_).then(function(cmd) {
            console.log("got module?");
            console.log(cmd);
            if(!cmd) {
                console.log("no cmd");
                result = module_+" doesn't exist or has failed to laod!";
                return result;
            }
            try {
                var tmp = requireFromString(cmd.source);
                if(cmd.cmd != "cmd_data") {
                    if(!cmds[channel]) {
                        cmds[channel] = {
                            cmd_data: {
                                channel: channel
                            }
                        };
                    }
                if(cmds[channel]) {
                    if(cmds[channel][cmd.cmd]) {
                        delete cmds[channel][cmd.cmd];
                    }
                
                    cmds[channel][cmd.cmd] = tmp[cmd.cmd](client, db, channel);
                }
                }
            } catch(e) {
                result = module_+" doesn't exist or has failed to laod!";

            }
            return result;
        });
}

client.unloadModule = function(from, to, module_) {
    var result = module_+" has been unloaded!";
    var error = false;
    var to = to.toLowerCase();
    if(cmds[to]) {
        if(cmds[to][module_]) {
            if(module_ != "cmd_data") {
                client.say(to, "$"+module_+" quit");
                delete cmds[to][module_];
            }
            return result;
        }
    } else {
        client.say(to, "this is not available in this channel");
    }
}

//client.addListener('join', (from, to, message) => {
setTimeout(function() {	
    client.say('nickserv', 'identify @pfelor@nge1!');
    if(args.config != "NULL") {
        db.loadConfig(args.config).then(function(res) {
            for(var i in res) {
                for(var j in cmds) {
                    client.loadModule(j, res[i]);
                }
            }
        });
    }
}, 10000);
//});

client.addListener('error', function(message) {
    console.log('error: ', message);
});

/*client.addListener('whois', function(message) {
    console.log('whois: ', message);
});*/
/*client.addListener('raw', function(message) {
    console.log('RAW: ', message);
});*/



client.addListener('pm', (from, to, message) => {
    console.log(message);
})



client.addListener('message', (from, to, message) => {
    console.log(message);
    var cmd = message.match(/^\$([a-z][a-z0-9_\-]*)/);
    
    cmd = cmd && cmd[1] && (cmd[1]+'').toLowerCase();
    var to = to.toLowerCase();
    if(cmd) {
        if (cmds[to]) {
            if(cmds[to][cmd]) {
                client.say(to, cmds[to][cmd](from, to, message));
            } else {
                client.say(to, "this module is not loaded!");
            }
        }
    }
});

var cmds = {};
for(var i in args.channels) {
    cmds[args.channels[i].toLowerCase()] = {
        cmd_data: {
            channel: args.channels[i].toLowerCase()
        }
    };
}
cmds[args.nick.toLowerCase()] = {
    cmd_data: {
        channel:args.nick.toLowerCase()
    }
};
db.getModules().then(function(res) {
    console.log(res);
    for(var i in res) {
        if(res[i].type == "core") {
            console.log("loading module");
            console.log(res[i].name);
            db.getCmd(res[i].name).then(function(cmd) {
                var tmp = requireFromString(cmd.source);
                for(var i in cmds) {
                    cmds[i][cmd.cmd] = tmp[cmd.cmd](client, db, i);
                }
            })
        }
    }
})
/*db.getCmd("vote").then(function(cmd) {
    var tmp = requireFromString(cmd.source);
    
    cmds[cmd.cmd] = tmp[cmd.cmd](client);
})*/
/*var cmds = {
    'vote': function(from, to, message) {
        this.checkop(from, to, ".null " + from, function(op) {
            if (op) {

                vote.set("channel", to);
                vote.set("from", from);
                var msg = message.match(/\[.+/) != null ? message.match(/\[.+/)[0] : "[0]";
                try {
                    vote[message.match(/^\..+?(?=\s).(.+?)(\s|$)/)[1]].apply(vote, JSON.parse(msg));
                } catch (e) {
                    client.say(to, "syntax error!");
                }
            }
        })
    },
    'raw': function(from, to, message) {
      this.checkop(from, to, ".null " + from, function(op) {
            if (op) {
        var msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : "";
        console.log(msg);
        console.log(msg.split(','))
        if (msg != "") {
            try {
                client.send.apply(client, msg.split(',').map(e => e.toString()));
            } catch (e) {
                client.say(to, "syntax error!");
            }
        }
      }
    });
    },
    "help": function(from, to, message) {
        for (var i in cmds) {
            client.say(to, i);
        }
    },
    'checkop': function(from, to, message, callback) {
        console.log("run whois");

        var callback = callback;
        var listener = function(message) {
            console.log(message);
            //console.log('raw: ', message.);
            var op = false;
            if (parseInt(message.rawCommand) == 379) {
                if (message.args[2].indexOf("+o") != -1) {
                    console.log("is an operator");
                    op = true;
                    client.removeListener('raw', listener);
                    callback(op);
                }
            }
            if (message.command == 'rpl_whoisoperator') {
                console.log(message.args)
                if (message.args[2].indexOf("is a Network Operator") != -1) {
                    console.log("is an operator");
                    op = true;
                } else {
                    console.log("is NOT an operator");
                }
                client.removeListener('raw', listener);
                if (callback) {
                    callback(op);
                }
            }
            if (message.command == 'rpl_endofwhowas') {
                console.log("is NOT an operator");
                client.removeListener('raw', listener);
            }
        };
        client.addListener('raw', listener);
        var msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : "";
        client.send("WHOIS", msg);
    },
    'names': function(from, to, message) {
        console.log(client.chanData(to))
    }
}
var vote = (function(client) {
    var vote = {
        polls: [],
        vote: function(id, vote) {
            if (!this.polls[id]) {
                client.say(this.channel, "Invalid Poll!");
                return;
            }
            //if(!this.polls[id].votes[this.from]) {
            this.polls[id].votes[this.from] = vote;
            //} else {
            //  this.polls[id].votes[this.from] = vote;
            //}
            //console.log(this.polls[id].votes);
            this.display(id);
        },
        create: function(topic, selections, options) {
            var poll = {
                topic: topic,
                selections: selections,
                options: options,
                votes: {},
                creator: this.from
            };
            this.polls.push(poll);
            this.display(this.polls.length - 1);
        },
        display: function(id, private) {

            var room = this.channel;
            if (private) {
                room = this.from;
            }
            if (!this.polls[id]) {
                client.say(room, "Invalid Poll!");
                return;
            }
            var tmp = this.polls[id].selections.map((e) => {
                var tmp = {};
                tmp.name = e[0];
                tmp.count = 0;
                tmp.code = e[1];
                return tmp;
            });
            var tmp_ = {};
            for (var i in tmp) {
                //console.log(tmp[i]);
                tmp_[tmp[i].code] = tmp[i];
            }
            for (var i in this.polls[id].votes) {

                tmp_[this.polls[id].votes[i]].count++;
            }
            client.say(room, "id: " + id);
            client.say(room, "topic: " + this.polls[id].topic);
            for (var i in tmp_) {
                client.say(room, tmp_[i].name + "(" + tmp_[i].code + "): " + tmp_[i].count);
            }
        },
        close: function(id) {
            if (!this.polls[id]) {
                client.say(this.channel, "Invalid Poll!");
                return;
            }
            if (this.from == this.polls[id].creator) {
                this.display(id);
                this.polls.splice(id, 1);
            }
        },
        list: function() {
            for (var i in this.polls) {
                this.display(i, true)
            }
        },
        set: function(key, val) {
            this[key] = val;
        },
        help: function() {
            client.say(this.from, ".vote create [<topic>, <selections: [<selection>, <easy code>]>], <options>]|  ex: ' .vote create [\"Do you like this bot?\", [[\"yes\", \"y\"], [\"No\", \"n\"], [\"I don't Know\", \"o\"]], null]'");
            client.say(this.from, ".vote vote [<poll id>, <easy code>]");
            client.say(this.from, ".vote list | display polls");
            client.say(this.from, ".vote display [<poll id>] | display poll with the given id");
            client.say(this.from, ".close close [<id>] | only the creator can close");
        }

    };
    return vote;
})(client);*/


var web = require('./web')(client, db);


