
var irc = require('./irc');

/*var options = {
	server: "irc.systemnet.info",
	port: 6667,
	channels: ["#test_irc"],
	nick: "Nyanko_pureirc"+new Date().getUTCMilliseconds()+"",
	realName: "Nyanko_pureirc"+new Date().getUTCMilliseconds()+"",
	debug: true
};*/

/*var options = {
	server: "irc.freenode.net",
	port: 6667,
	channels: ["#blubot_test"],
	nick: "Nyanko_pureirc"+new Date().getUTCMilliseconds()+"",
	realName: "Nyanko_pureirc"+new Date().getUTCMilliseconds()+"",
	debug: true
};*/
var options = {
	server: "irc.synirc.net",
	port: 6667,
	channels: ["#spp"],
	nick: "Nyanko_pureirc"+new Date().getUTCMilliseconds()+"",
	realName: "Nyanko_pureirc"+new Date().getUTCMilliseconds()+"",
	debug: true
};

irc.connect(options);
irc.connections[options.server].addListener('raw', function(msg) {
	console.log(msg)
})
