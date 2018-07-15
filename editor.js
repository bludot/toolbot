var express = require('express');
var app = express();
var auth = require('./db').login;
var Sequelize = require('sequelize');
var crypto = require('crypto');


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


var users = {

};

var tokenCheck = function(req, res, next) {
	if(users[req.body.nick].token == req.body.token) {

		return crypto.randomBytes(48, function(err, buffer) {
			users[req.body.nick].token = buffer.toString('hex');
			//					return res.json({
			//						nick: result.nick,
			//						token: users[result.nick].token
			//					});
			return next();
		});
	} else {
		return res.json({
			error: true
		});
	}
};

app.use(express.static(__dirname+'/dist'));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));


/*app.get('/', function (req, res) {
  res.send('Hello World!');
  });*/

app.post('/open', tokenCheck, function(req, res) {
	CMDS.findOne({where: {
		cmd: req.body.cmd,
	}}).then(function(cmd_) {
		if(cmd_) {
			return res.json({
				source: cmd_.source,
				cmd: req.body.cmd,
				token: users[req.body.nick].token
			});
		} else {
			return res.send("not found")
		}
	});
});

app.post('/login', function(req, res) {
	auth(req.body.user, req.body.pass).then((result) => {
		console.log(result);
		if(result) {
			if(result.perms.indexOf('o') != -1 || result.perms.indexOf('-rwe-') != -1) {
				users[result.nick] = result;
				users[result.nick].createdAt = new Date().getTime();
				crypto.randomBytes(48, function(err, buffer) {
					users[result.nick].token = buffer.toString('hex');
					return res.json({
						nick: result.nick,
						token: users[result.nick].token
					});
				});
				//	return res;
			} else {
				return res.json({
					error: "permissions"
				});
			}
		} else {
			return res.json({
				error: "true"
			});
		}
	});
});

app.post('/new', tokenCheck, function(req, res) {
var source = "var "+req.body.cmd+" = function(client, db, channel) {\n\n\treturn function(from, to, message) {\n\t\tvar msg = message.match(/\s(.+?$)/) != null ? message.match(/\s(.+?$)/)[1] : \"\";\n\t}\n}\n\nexports."+req.body.cmd+" = "+req.body.cmd+";"
	CMDS.create({cmd: req.body.cmd, nick: req.body.nick, source: source}).then((e) => {
		e.save().then((e) => {
		return res.json({
			token: users[req.body.nick].token,
			source: source
		});
		})
	});
});

app.post('/delete', tokenCheck, function(req, res) {
//	CMDS.findOne(
	return res.json({
		token: users[req.body.nick].token
	});

});

app.post('/save', tokenCheck, function(req, res) {
	CMDS.findOne({where: {
		cmd: req.body.cmd,
	}}).then(function(cmd_) {
		if(cmd_) {
			/*return res.json({
			  source: cmd_.source,
			  cmd: req.body.cmd
			  });*/
			cmd_.source = req.body.source;
			cmd_.save().then((e) => {
				return res.json({
					error: false,
					token: users[req.body.nick].token
				});
			});
		} else {
			return res.send("not found")
		}

	});

});

app.listen(3378, function () {
	console.log('Example app listening on port 3000!');
});