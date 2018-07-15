var Sequelize = require('sequelize');


var sequelize = new Sequelize('toolbot', 'toolbot', '@pfelor@nge1!', {
    host: 'localhost',
    dialect: 'mysql'
})



var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));


var crypto = require('crypto');

var User = sequelize.define('user', {
    nick: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    token: {
        type: Sequelize.STRING
    },
    perms: {
        type: Sequelize.STRING
    }
});

var CMDS = sequelize.define('cmds', {
    cmd: {
        type: Sequelize.STRING
    },
    source: {
        type: Sequelize.STRING
    },
    nick: {
        type: Sequelize.STRING
    }
});

var Modules = sequelize.define('modules', {
    name: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    }
});

var Config = sequelize.define('configs', {
    name: {
        type: Sequelize.STRING,
    },
    modules: {
        type: Sequelize.STRING
    }
});

module.exports = {
    login: function(nick, password) {
        return User.findOne({'where': {'nick': nick}}).then(function(user) {
            console.log(user.password);
            return bcrypt.compareAsync(password, user.password).then(function(tmp) {
                    console.log(tmp);
                    if(tmp) {
                        user.token = crypto.randomBytes(64).toString('hex');
                        user.save();
                        return {
                            nick: user.nick,
                            perms: user.perms,
                            token: user.token.substr(0, 60)
                        };
                      //return user;
                    } else {
                      return false;
                    }
                });
        });
    },
    compareToken: function(nick, token) {
        return User.findOne({'where': {'nick':nick, 'token': token}}).then(function(res) {
           console.log(res);
          return res.toJSON();
        })
    },
    regNick:function(nick, password) {
        return User.findOne({where: {'nick': nick.toLowerCase()}}).then(function(result) {
                if(!result) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);
                    return User.create({'nick': nick.toLowerCase(), 'password': hash, 'perms': 'o-adu-'}).then(function(user) {
                        return true;
                    });
                } else {
                return false;
                }
            })
    },
    add_cmd: function(name, cmd) {

    },

    getCmd: function(cmd) {
        return CMDS.findOne({where: {
    cmd: cmd,
  }}).then(function(cmd_) {
    if(cmd_) {
            return {
                source: cmd_.source,
                cmd: cmd
            }
        } else {
            return null;
        }
        });
    },
    getModules: function() {
        return Modules.findAll().then(function(res) {
            return res.map(e => e.dataValues);
        });
    },
    loadConfig: function(config) {
        return Config.findOne({where: {name: config.toLowerCase()}}).then(function(result) {
            return JSON.parse(result.toJSON().modules);
        });
    }


    //login("admin@bludotos.com", "@pfelor@nge1!");
}
