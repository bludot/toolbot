var irc = require('../irc/irc.js');
var expect = require('chai').expect;

var opt = {
    server: "irc.freenode.net",
    port: 6667,
    channels: ["#blubot_test"],
    nick: "Nyanko_pureirc" + new Date().getUTCMilliseconds() + "",
    realName: "Nyanko_pureirc" + new Date().getUTCMilliseconds() + "",
    debug: false
};

describe('irc connection', () => {
    before(() => {
        irc.connect(opt)
    });
    after(() => {
        irc.connections["irc.freenode.net"].quit();
    });
    it('run with out error', done => {
        irc.connections[opt.server].addListener('connect', () => {
            done();
        })


    });
    it('joined a channel', done => {
        irc.connections[opt.server].addListener('raw', msg => {
            if(msg.command() == "JOIN") {
                done();
            }
        })
    })
    it('Send a message', done => {
                irc.connections[opt.server].send("PRIVMSG "+opt.channels[0]+" :Hello World\r\n");
                done();
    })

});
