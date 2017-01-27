const irc = require('./../irc');

// Set up the defaults
let options = {
   server:      "irc.systemnet.info",   // irc server url
   port:        6667,                   // server port (could be 6697
   channels:    ["#test_irc", "#test_ircc"],          // Channels (multiple allowed)
   nick:        "Test_irc",             // nick
   realName:    "test_irc",             // realName
   debug:       true                    // show all logs from code
};

// connect using the options given
irc.connect(options);

// listen to the one you are connected to. (could be multiple)
irc.connections[options.server].addListener('raw', function(msg) {
//   console.log(msg);
});

irc.connections[options.server].addListener('msg', function(msg) {
   console.log(msg);
   if(msg.msg == "ping") {
      irc.connections[options.server].raw("PRIVMSG #test_irc PONG!");
   }
});

irc.connections[options.server].addListener('privmsg', function(msg) {
   console.log(msg);
});

irc.connections[options.server].addListener('msg#test_ircc', function(msg) {
   console.log("CHANNEL MESSAGE");
   console.log(msg);
});


irc.connections[options.server].addListener('notice', function(msg) {
   console.log("Notice message");
   console.log(msg);
});
