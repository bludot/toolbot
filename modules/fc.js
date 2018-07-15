Array.prototype.chunk = function(size) {
    var arr = this;
    return arr.map( function(e,i){
        return i%size===0 ? arr.slice(i,i+size).join("") : null;
    }).filter(function(e){ return e; })
}


var fc = function(client) {
    var client = client;
    var Sequelize = require('sequelize');
    var sequelize = new Sequelize('toolbot', 'toolbot', '@pfelor@nge1!', {
        host: 'localhost',
        dialect: 'mysql'
    })
    var Promise = require('bluebird');
    var bcrypt = Promise.promisifyAll(require('bcrypt'));



    var FC = sequelize.define('fc', {
        username: {
            type: Sequelize.STRING
        },
        fc: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });

    var cmds = {
        login: function(nick, password) {
            return FC.findOne({where:{'username': nick}}).then(function(user) {
                console.log(user.password);
                return bcrypt.compareAsync(password, user.password).then(function(tmp) {
                    console.log(tmp);
                    if(tmp) {
                        return user;
                    } else {
                        return false;
                    }
                });
            });
        },
        register: function(nick, password) {
            return FC.findOne({where: {'username': nick.toLowerCase()}}).then(function(result) {
                if(!result) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);
                    return FC.create({'username': nick.toLowerCase(), 'password': hash}).then(function(user) {
                        return true;
                    });
                } else {
                    return false;
                }
            })
        },
        changePass: function(nick, pass, newpass) {
            return this.login(nick, pass).then(function(res) {
                if(res) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(newpass, salt);
                    return FC.update({'password': hash}, {where: {username: nick}}).then(function(res) {
                        if(res) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                } else {
                    return false;
                }

            });
        },
        changeFC: function(nick, pass, FC_) {
            return this.login(nick.toLowerCase(), pass).then(function(res) {
                if(res) {
                    console.log("login success");
                    return FC.update({'fc': FC_}, {where: {username: nick.toLowerCase()}}).then(function(res) {
                        if(res) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                } else {
                    console.log("login failure");
                    return false;
                }

            });
        },
        getFC: function(nick) {
            return FC.findOne({where: {username: nick.toLowerCase()}}).then(function(res) {
                if(res) {
                    if(res.fc && res.fc.length > 0) {
                        return res.fc;
                    } else {
                        return "error";
                    }
                } else {
                    return "user not found";
                }

            });
        },
        addFC: function(nick, pass, FC_) {
            return this.login(nick, pass).then(function(res) {
                if(res) {
                    return FC.update({'fc': FC_}, {where: {username: nick}}).then(function(res) {
                        if(res) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                } else {
                    return false;
                }

            });
        }

    }
    var tmp_options = [];
    return function(from, to, cmd, arg1, arg2, arg3) {
    var args = Array.from(arguments);
        try {
            if (cmd == "register") {
                cmds.register(from.toLowerCase(), arg1).then(function(res) {
                    client.say(from, "success");
                })
            }
            if (cmd == "login") {
                cmds.login(from.toLowerCase(), arg1).then(function(res) {
                    if(res) {
                        client.say(from, "success");
                    } else {
                        client.say(from, "error try again");
                    }
                })
            }
            if (cmd == "change") {
                if(arg1 == "pass") {
                    cmds.changePass(from.toLowerCase(), arg2, arg3).then(function(res) {
                        if(res) {
                            client.say(from, "success");
                        } else {
                            client.say(from, "error");
                        }
                    })
                }
                if(arg1 == "fc") {
                    console.log(arg2, args.slice(4, e.length).join("").trim().split("").chunk(4).join("-"));
                    cmds.changeFC(from.toLowerCase(), arg2, args.slice(5, e.length).join("").trim().replace(/(<)|(>)/g, "").split("").chunk(4).join("-")).then(function(res) {
                        if(res) {
                            client.say(from, "success");
                        } else {
                            client.say(from, "error");
                        }
                    })
                }
            }
            if(cmd == "add") {
                cmds.addFC(from.toLowerCase(), arg1, args.slice(4, e.length).join("").trim().replace(/(<)|(>)/g, "").split("").chunk(4).join("-")).then(function(res) {
                    if(res) {
                        client.say(from, "success");
                    } else {
                        client.say(from, "error");
                    }
                })
            }
            if(!arg1) {
                cmds.getFC(from).then(function(res) {
                    client.say(to, "\u0002"+res+"\u0002");
                })
            }
            if(cmd == "help") {
                client.say(from, "Help:");
                client.say(from, "$fc register <password>");
                client.say(from, "$fc add <password> <fc>");
                client.say(from, "$fc change fc <password> <fc>");
                client.say(from, "$fc change pass <password> <new pass>");
            }
        } catch(e) {
            client.say(from, "there has been an error in your syntax!");
        }
    }
};

exports.fc = fc;
