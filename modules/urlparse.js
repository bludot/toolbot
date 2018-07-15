var urlparse = function(client, db, channel) {
    var client = client;
    var pageInfo = require('page-info');
    var uu = require('url-unshort')();
    console.log(this);
    var channel = channel;
    //var cmd_data = this.cmd_data;

    var checkshortner = function(url, callback) {
        //var uu = require("url-unshort")
        var tmp_url = url;
        uu.expand(url, function (err, url) {
            // connection error or similar
            if (err) throw err;

            if (url) {
                //console.log('Original url is: '+url);
                callback(true, url);
            } else {
                // no shortening service or an unknown one is used
                //console.log('This url can\'t be expanded');
                callback(false, tmp_url);
            }
        });
        //http://tinyurl.com/zo6l78f
    }
    var parseme = function(url, callback) {
        pageInfo(url, function (page) {
            console.log(page.favicon());
            console.log(page.icon());
            console.log(page.bodyText());
            if(page.title() == "Floret OS" && url.indexOf('floretos.com') == -1) {
                callback(null);
            } else {
            //console.log(page.title())
            //console.log(page.description())
            callback(page);
            }
        }, function(err) {
            console.log("error!");
            callback(null);
        });
    }
    var listener = function(nick, text, message) {
        var msg = text;
        console.log(msg);
        if (msg.match(/(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/)) {
            checkshortner(msg.match(/(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/)[0], function(shortened, url) {
                if(shortened) {
                    client.say(channel, "\u0002Full URL\u0002: "+url);
                }
                if(url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                    client.say(channel, "from "+nick+": \u0002Title\u0002: Image,     \u0002Desc\u0002: "+url.match(/[^/]+$/g)[0]);
                } else {
                    parseme(url, function(data) {
                        if(data) {
                            var data = data;
                            if((data.title().toString().trim()).length < 1) {
                                data.title = data.firstDivText();
                            } else {
                                data.title = data.title().toString().trim();
                            }
                            client.say(channel, ("from "+nick+": \u0002Title\u0002: "+data.title.toString().trim().replace(/\n/gmi, " ").substr(0,100) || ""+",     \u0002Desc\u0002: "+data.description().toString().trim().replace(/\n/gmi, " ").substr(0,100)).replace(/\n|\r/gmi, ' '));
                        }
                    })
                }
            })
        }
    }
    console.log(channel);
    client.addHook(channel, listener);
    var tmp_options = [];
    return function(from, to, cmd) {
        if(cmd == "quit") {
            console.log("quit initiated");
            console.log(channel);
            client.removeHook(channel, listener);
            //client.removeListener("message"+channel, listener);
        }
    }
};

exports.urlparse = urlparse;
