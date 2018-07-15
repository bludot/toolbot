var badwords = function (client, db, channel) {
    console.log('channel is: '+channel);
    var channel = channel;
    var Sequelize = require('sequelize');
    var sequelize = new Sequelize('toolbot', 'toolbot', '@pfelor@nge1!', {
        host: 'localhost',
        dialect: 'mysql'
    });
    var Promise = require('bluebird');
    var words = sequelize.define('badwords', {
        server: {
            type: Sequelize.STRING
        },
        channel: {
            type: Sequelize.STRING
        },
        badwords: {
            type: Sequelize.STRING
        }
    });

    var cmds = {
        add: function (channel_, badwords_) {
            console.log(badwords_);
            return words.findOne({where: {server: client.server.split('.').slice(1).join('.'), channel: channel_}}).then(function (result) {
                if(!result) {
                    return words.create({'server': client.server.split('.').slice(1).join('.'), 'channel': channel_, badwords: badwords_}).then(function(data) {
                        return true;
                    });
                } else {
                    var tmp = JSON.parse(result.badwords);
                    tmp = tmp.concat(badwords_);
                    result.badwords = JSON.stringify(tmp);
                    badwords = tmp;
                   return result.save();
                }
            });
        },
        get: function(channel_) {
            return words.findOne({where: {server: client.server.split('.').slice(1).join('.'), channel: channel_}}).then(function (result) {
                if(!result) {
                    return 'no words';
                } else {
                    return JSON.parse(result.badwords);
                }
            });
        },
        remove: function (channel_, word) {
            return words.findOne({where: {server: client.server.split('.').slice(1).join('.'), channel: channel_}}).then(function (result) {
                var tmp = JSON.parse(result.badwords);
                var index = tmp.indexOf(word);
                if (index !== -1) {
                    tmp.splice(index, 1);
                    result.badwords = JSON.stringify(tmp);
                    badwords = tmp;
                    return result.save();
                }
                return true;
            });

        },
        setupWords: function(_channel) {
            cmds.get(_channel).then(function (res) {
                badwords = res;
            });
        }
    };

    var badwords = [];
    var listener = function (nick, text, message) {
            console.log(badwords);
        var instances = badwords.filter(function(word) {
            var exp = new RegExp(word, 'gi');
            console.log(exp);
            return (text.match(exp) ? text.match(exp).length : 0) > 0;
        });
        console.log(instances);
        console.log('got msg: '+text);
        if(instances.length > 0) {
            client.say(channel, "from: "+nick+" | "+JSON.stringify(instances));
            client.say(channel, "!kick "+nick);
        }
    };

    return function (from, to, args) {
        var that = this;
        var args = Array.prototype.slice.call(arguments).slice(2);
        console.log(client.server);
        console.log(args);
        if(args[0] === 'get') {

            cmds.get(args[1]).then(function(res) {
                console.log(res);
                if(Array.isArray(res)) {
                    console.log('res is array');
                    client.say(that.channel, JSON.stringify(res));
                } else {
                    console.log('res is not array');
                    client.say(that.channel, 'no badwords');
                }
            });
        }
        if(args[0] === 'test') {
            if(that.channel) {
                client.say(to, that.channel);
            } else {
                client.say(to, to);
            }
        }
        if(args[0] === 'remove') {
            cmds.remove(args[1], args[2]).then(function () {
                client.say(to, 'done');
            });
        }
        if(args[0] === 'add') {
            var _channel = args[1];
            var _badwords = args.slice(2);
            cmds.add(_channel, _badwords).then(function() {
                client.say(that.channel, 'words added');
            });
        }
        if(args[0] === 'enable') {
            console.log('channel is? '+that.channel);
            cmds.setupWords(that.channel);
            client.addHook(that.channel, listener);
        }
    }.bind({ channel: channel });


};

exports.badwords = badwords;
