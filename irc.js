var winston = require('winston');
var logger;
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

    var connection = function(opt) {
        var self = this;
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

        self.conn.on('data', function(data) {
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

                if (msg) {
                    if(opt.debug) {
                        //logger.log("verbose", msg);
                    }
                    msg.data = {};
                    msg.data.server = self.server;
                    //msg.data.nick = self.nick;
                    self.emit('raw', msg);
                    if (msg.command() == "PRIVMSG" && msg.params()[0].substr(0,1) == "#") {
                        self.emit('msg', {from: msg.nickname(), msg: msg.trailing(), to: msg.args()[0]});
                        self.emit('msg'+msg.params()[0], {from: msg.nickname(), msg: msg.trailing(), to: msg.args()[0]});
                    }
                    if (msg.command() == "PRIVMSG" && msg.params()[0].substr(0,1) != "#") {
                        self.emit('privmsg', {from: msg.nickname(), to: msg.args()[0], msg: msg.trailing()});
                    }
                    if(msg.command() != 'PRIVMSG') {
                        self.emit(msg.command().toLowerCase(), msg);
                    }
                }
            }
        });

        self.conn.on('close', function() {
            logger.log("verbose", 'Connection closed');
        });
        EventEmitter.call(self);
        self.addListener('raw', function(msg) {
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
            if (msg.command() == "PING") {
                logger.log("verbose", "got ping: " + msg.trailing());
                self.conn.write("PONG " + msg.trailing()+"\r\n");
            }
        });
    };
    util.inherits(connection, EventEmitter);
    connection.prototype.quit = function() {
        logger.log("verbose", "quiting in irc script");
        var self = this;
        self.conn.destroy();
    }
    connection.prototype.send = function(text) {
        var self = this;
        self.conn.write(text);
        return true;
    };
    connection.prototype.say = function(to, msg) {
        var self = this;
        self.conn.write("PRIVMSG "+to+" "+msg+"\r\n");
    }

    connection.prototype.raw = function(msg) {
        var self = this;
        self.conn.write(msg+"\r\n");
    }
    /*

    logger.log("verbose", msg);
    */


    return {
        connections: {},
        connect: function(opt) {
            this.connections[opt.server] = new connection(opt);
        }
    };
})();
