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
            console.log('Connected');
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
                console.log('Received: ' + data);
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
                        //console.log(msg);
                    }
                    msg.data = {};
                    msg.data.server = self.server;
                    //msg.data.nick = self.nick;
                    self.emit('raw', msg);
                }
            }
        });

        self.conn.on('close', function() {
            console.log('Connection closed');
        });
        EventEmitter.call(self);
        self.addListener('raw', function(msg) {
            if (msg.command() == "MODE" || msg.command() == "rpl_endofmotd") {
                console.log("attempt join");
                for (var j in opt.channels) {
                    self.conn.write("JOIN " + opt.channels[j] + "\r\n");
                }
            }
            if(msg.command() == "NOTICE") {
                console.log("trailing: "+msg.trailing());
            }
            /*if(msg.command() == "NOTICE" && msg.trailing().toString().toLowerCase().indexOf("no ident response") != -1) {
                console.log("try nick again");
                self.conn.write("USER " + self.nick + " * *  :" + self.nick + "\r\n");
                self.conn.write("NICK " + self.nick + "\r\n");
            }*/
            if (msg.command() == "PING") {
                console.log("got ping: " + msg.trailing());
                self.conn.write("PONG " + msg.trailing()+"\r\n");
            }
        });
    };
    util.inherits(connection, EventEmitter);
    connection.prototype.quit = function() {
        console.log("quiting in irc script");
        var self = this;
        self.conn.destroy();
    }
    connection.prototype.send = function(text) {
        var self = this;
        self.conn.write(text);
        return true;
    };
    /*

    console.log(msg);
    */


        return {
            connections: {},
            connect: function(opt) {
                this.connections[opt.server] = new connection(opt);
            }
        };
})();
