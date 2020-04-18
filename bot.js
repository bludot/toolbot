var args = {};

//
// <net> <name> <port> <debug> <username> <realname> <channels ...>
//
var tmp = process.argv;
tmp.splice(0, 2);
//console.log(tmp);
if (process.env.SERVER) {
  args = {
    server: process.env.SERVER,
    nick: process.env.NICK,
    port: process.env.PORT,
    debug: process.env.DEBUG,
    username: process.env.USERNAME,
    realname: process.env.REALNAME,
    config: process.env.CONFIG || "NULL",
    channels: process.env.CHANNELS.split(',')
  };
} else {
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
}

if (args.port.substr(0,1) === "+") {
  args.port = args.port.substr(1);
  args.secure = true;
}
console.log('args', args);



var db = require('./db');
var irc = require('irc');
var Parser = require('./parser.js');
var path = require('path');
var fs = require('fs');

function requireFromString(src, filename) {
  var m = new module.constructor();
  m.paths = module.paths;
  m._compile(src, filename);
  return m.exports;
}
//const client = new irc.Client('irc.freenode.net', 'blubot_', {
/*var client = new irc.Client('irc.systemnet.info', 'toolbot', {
    port: 6667,
    debug: true,
    channels: ['#test_irc'],
    userName: 'toolbot',
    realName: 'toolbot'
});*/


/*irc.connect({
  server: args.server,
  port: args.port,
  channels: args.channels,
  nick: args.nick,
  realname: args.realname,
  debug: args.debug
});*/
//var client = irc.connections[args.server];

var client = new irc.Client(args.server, args.nick, {
  port: args.port,
  debug: args.debug,
  channels: args.channels,
  userName: args.username,
  realName: args.realname,
  secure: args.secure
});
client.net = args.server.split(".")[1];
client.nick = args.nick;
client.permittedUsers = {};

client.getIrc = function() {
  return irc;
}


var msgHooks = {};
client.addHook = function(channel, listener) {
  if(!msgHooks[channel]) {
    msgHooks[channel] = [];
  }
    msgHooks[channel].push(listener);
};

client.removeHook = function(channel, listener) {
  if(msgHooks[channel]) {
    if(msgHooks[channel].indexOf(listener) !== -1) {
      msgHooks[channel].splice(msgHooks[channel].indexOf(listener), 1);
    }
  };
}
client.loadModule = function(channel, module_) {
  var result = module_+" has been loaded! in "+channel;
  var error = false;
  var channel = channel.toLowerCase();
  var promise = new Promise(function(resolve, reject) {
    fs.exists(__dirname+'/modules/'+module_+'.js', function(exists) {
      if (exists) {
        // do something
        console.log("file exists");
        fs.readFile(__dirname+'/modules/'+module_+'.js', 'utf8', function (err,data) {
          if (err) {

            //return console.log(err);
            console.log("couldnt read file: "+module_+"\n at: "+__dirname+'/modules/'+module_+'.js');
            resolve(result);
          }
          try {
            var tmp = requireFromString(data, module_+'.js');
            if(!cmds[channel]) {
              cmds[channel] = {
                cmd_data: {
                  channel: channel
                }
              };
            }
            if(cmds[channel]) {
              if(cmds[channel][module_]) {
                delete cmds[channel][module_];
              }

              cmds[channel][module_] = tmp[module_](client, db, channel);
            }
            console.log("module loaded ["+module_+"]");
            resolve(result);
          } catch(e) {
            result = module_+" doesn't exist or has failed to laod!";
            resolve(result);

          }


        });
      } else {
        console.log("file doesnt exists: "+module_);
        result = "File does not exist! ("+module_+")";
        resolve(result);
      }
    });
  });
  //console.log(cmds);
  return promise;
  /*return  db.getCmd(module_).then(function(cmd) {
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
        });*/
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

  
  console.log("ATTEMPT TO LOGIN!!!");
  client.send.apply(client, 'PRIVMSG nickserv identify somepass'.split(' '));
  //client.send.apply(client, 'JOIN #lovescience'.split(' '));
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
  return true;
});

/*client.addListener('whois', function(message) {
    console.log('whois: ', message);
});*/
/*client.addListener('raw', function(message) {
    console.log('RAW: ', message);
});*/



client.addListener('privmsg', (from, to, message) => {
  console.log("PRIV MSG", message);
  //if (message.)
})

client.addListener('message#', (nick, to, text, message) => {
  var to = to.toLowerCase();
  for(var i in msgHooks[to]) {
    if(msgHooks[to]) {
      if(msgHooks[to][i]) {
    msgHooks[to][i](nick, text, message);
      }
    }
  }
});
client.addListener('raw', (data) => {
  console.log('something');
  console.log(data);
  // handle ping request
  if (data.command === "NOTICE" && data.args[1].substr(0, 75) === "*** If you are having problems connecting due to registration timeouts type") {
    console.log("I GOT SOMETHING!");
    const msg = data.args[1].match(/\/raw\sPONG\s.+?(?=\s)/g)[0].substr(5).replace(/\r\n/gi, '');
    console.log("THE MSG", msg)
    client.send.apply(client, msg.split(' '));
  }
if(data.command == "513") {
  var msg = data.message.args[1].split('/QUOTE')[1].replace(/\r\n/gi, '');
  client.send.apply(client, msg.split(' '));
}
});
client.addListener('message', (from, to, message) => {
  console.log('got a message!');
  console.log(message);
  var msg;
  try {
    msg = Parser.parse(message);
  } catch(err) {
    msg = {};
  }
  console.log("message raw?", msg);
  var to = to.toLowerCase();
  if(!msg.name) {
    return;
  }
  if(msg.name == "$" || msg.name.toLowerCase()  == client.nick.toLowerCase()) {
    if (cmds[to]) {
      if(cmds[to][msg.function]) {
        console.log(msg);

        cmds[to][msg.function].apply(cmds[to], [from, to].concat(msg.args));
      } else {
        console.log(msg);
        //client.say(to, "this module is not loaded! ("+msg.function+")");
      }
    }
  }
});

client.addListener('pm', (from, to, message) => {
  console.log('got a message!');
  console.log(message);
  var msg;
  try {
    msg = Parser.parse(message);
  } catch(err) {
    msg = {};
  }
  console.log("message raw?", msg);
  console.log(cmds[to]);
  var to = to.toLowerCase();
  if(!msg.name) {
    return;
  }
  if(msg.name == "$" || msg.name.toLowerCase()  == client.nick.toLowerCase()) {
    if (cmds[to]) {
      if(cmds[to][msg.function]) {
        console.log(msg);

        cmds[to][msg.function].apply(cmds[to], [from, to].concat(msg.args));
      } else {
        console.log(msg);
        //client.say(to, "this module is not loaded! ("+msg.function+")");
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
  for(var i in res) {
    if(res[i].type == "core") {
      console.log("loading module ["+res[i].name+"]");
      console.log(res[i].name);
      for(var j in cmds) {
        if(j.substr(0,1) == "#") {
          client.loadModule(j, res[i].name);
        }
      }
      client.loadModule(client.nick.toLowerCase(), res[i].name);

      /*db.getCmd(res[i].name).then(function(cmd) {
        var tmp = requireFromString(cmd.source);
        for(var i in cmds) {
          cmds[i][cmd.cmd] = tmp[cmd.cmd](client, db, i);
        }
      })*/
    }
  }
})

var web = require('./web')(client, db);


