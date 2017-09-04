var winston = require('winston');
var logger;


/**
 *	Logging
 *
 */
if (process.env.NODE_ENV == 'production') {
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: 'true',
                level: 'error'
            })
        ]
    });
    winston.level = 'error';
} else if (process.env.NODE_ENV == 'development') {
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: 'true',
                level: 'verbose'
            })
        ]
    });
    winston.level = 'verbose';
} else {
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: 'true',
                level: 'error'
            })
        ]
    });
    winston.level = 'error';
};


var net = require('net');
var Message = require('./message');
var EventEmitter = require('events').EventEmitter;
var util = require('util');


module.exports = (function(){


/**
 *
 *	Connection
 *
 * 	Creates a connection to irc
 *
 * @param {object}  opt             holds data for creating and connecting to irc
 * @param {string}  opt.server      irc server url
 * @param {integer} opt.port        irc server port
 * @param {array}   opt.channels    irc channels as strings
 * @param {string}  opt.nick        nick
 * @param {string}  opt.realName    realName
 * @param {bool}    opt.debug       Show debug
 *
 */
 var connection = function(opt) {
     var self = this;
     self.options = opt;
     self.gotPing = true;
     self.events = {
         'timeout': function() {
             self.gotPing = false;
             console.log('timeout');
             try {
                 self.send("PING","1");
                 setTimeout(function() {
                     if(!self.gotPing) {
                         for(var i in self.listeners) {
                             self.removeListener(i, self.listeners[i]);
                         }
                         logger.log("error", '########################################PING TIMEOUT!');
                         console.log('########################################PING TIMEOUT!');
                         self.conn.destroy();
                         connections.connect(self.options);
                     }
                 }, 8 * 1000);
             } catch(err) {
                 for(var i in self.listeners) {
                     self.removeListener(i, self.listeners[i]);
                 }
                 self.conn.destroy();
                 connections.connect(self.options);
             }
         },
         'error': function(err) {
             console.log(err);
             connection(self.options);
         },
         'data': function(data) {
             if(registered == false) {
                 self.conn.write("USER " + opt.nick + " 8 *  :" + opt.nick + "\r\n");
                 self.conn.write("NICK " + opt.nick + "\r\n");
                 registered = true;
             }
             if(opt.debug) {
                 logger.log("verbose", 'Received: ' + data);
             }
             var tmp = data.toString().split(/\r\n/gi).map(e => e + "\r\n").filter(e => e.toString() != "\r\n").map(e => {
                 try {
                     e = new Message(e);
                 } catch (error) {
                     e = undefined;
                 }
                 return e;
             });
             for (var i in tmp) {
                 var msg = tmp[i];
                 if (msg && msg.command) {
                     if(opt.debug) {
                         //logger.log("verbose", msg);
                     }
                     msg.data = {};
                     msg.data.server = self.server;
                     //msg.data.nick = self.nick;
                     self.emit('raw', msg);
                     if (msg.command() == "PRIVMSG" && msg.params()[0].substr(0,1) == "#") {
                         self.emit('msg#', msg.nickname(), msg.args()[0], msg.trailing());
                     }
                     if (msg.command() == "PRIVMSG") {
                         self.emit('msg', msg.nickname(), msg.args()[0], msg.trailing());
                     }
                     if (msg.command() == "PRIVMSG" && msg.params()[0].substr(0,1) != "#") {
                         self.emit('privmsg', msg.nickname(), msg.args()[0], msg.trailing());
                     }
                     if(msg.command() != 'PRIVMSG') {
                         self.emit(msg.command().toLowerCase(), msg);
                     }
                 }
             }
         },
         'close': function() {
             logger.log("verbose", 'Connection closed');
         }
     };
     self.listeners = {
         'raw': function(msg) {
             if((typeof msg.command).toLowerCase() != "function") {
                 return;
             }
             if (msg.command() == "MODE" || msg.command() == "rpl_endofmotd") {
                 logger.log("verbose", "attempt join");
                 for (var j in opt.channels) {
                     self.conn.write("JOIN " + opt.channels[j] + "\r\n");
                 }
             }
             if(msg.command() == "NOTICE") {
                 logger.log("verbose", "trailing: "+msg.trailing());
             }
             /*if(msg.command() == "NOTICE" && msg.trailing().toString().toLowerCase().indexOf("no ident response") != -1) {
             logger.log("verbose", "try nick again");
             self.conn.write("USER " + self.nick + " * *  :" + self.nick + "\r\n");
             self.conn.write("NICK " + self.nick + "\r\n");
         }*/
             if (msg.command() == "PONG") {
                 self.gotPing = true;
             }
             if (msg.command() == "PING") {
                 logger.log("verbose", "got ping: " + msg.trailing());
                 self.conn.write("PONG " + msg.trailing()+"\r\n");
             }
         }
     };
     var registered = false;
     self.conn = new net.Socket();
     self.server = opt.server;
     self.nick = opt.nick;
     self.conn.connect((opt.port || 6667), opt.server, function() {
         logger.log("verbose", 'Connected');
         self.conn.write("irc_api*vtest\r\n");
         self.emit('connect', {
             nick: opt.nick,
             server: opt.server
         });
     });
     self.conn.setKeepAlive(true);
     self.conn.setTimeout(8 * 1000);
     for(var i in self.listeners) {
         self.addListener(i, self.listeners[i]);
     }
     for(var j in self.events) {
         self.conn.on(j, self.events[j]);
     }
     EventEmitter.call(self);
 };
 util.inherits(connection, EventEmitter);
 connection.prototype.quit = function() {
     logger.log("verbose", "quiting in irc script");
     var self = this;
     self.conn.destroy();
 }
 connection.prototype.send = function(dead) {
     var args = Array.prototype.slice.call(arguments);
     if (args[args.length - 1].match(/\s/) || args[args.length - 1].match(/^:/) || args[args.length - 1] === '') {
         args[args.length - 1] = ':' + args[args.length - 1];
     }
     var self = this;
     self.conn.write(args.join(' ') + '\r\n');
     return true;
 };
 connection.prototype.say = function(dead) {
     var args = Array.prototype.slice.call(arguments);
     args = ["PRIVMSG"].concat(args);
     if (args[args.length - 1].match(/\s/) || args[args.length - 1].match(/^:/) || args[args.length - 1] === '') {
         args[args.length - 1] = ':' + args[args.length - 1];
     }
     var self = this;
     self.conn.write(args.join(' ') + '\r\n');
 }
 connection.prototype.raw = function(msg) {
     var self = this;
     self.conn.write(msg+"\r\n");
 }
 connection.prototype.join = function(msg) {
     var self = this;
     self.conn.write("JOIN " + msg + "\r\n");
 }
 connection.prototype.part = function(msg) {
     var self = this;
     self.conn.write("PART " + msg + "\r\n");
 }
 /*
 logger.log("verbose", msg);
 */
 var connections = {
     connections: {},
     connect: function(opt) {
         this.connections[opt.server] = new connection(opt);
     }
 };
 return connections;
})();
