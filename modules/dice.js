//var dnd = require('./dndice.js');
var dice = function(client, db) {
    var client = client;
    var db = db;
    var default_ = 1;
    var isInt = function (value) {
        var x = parseFloat(value);
        return !isNaN(value) && (x | 0) === x;
    };
    var rand = function (num) {return Math.floor(Math.random() * ((num - 1) + 1) + 1);};
    var roll = function(dice) {
        return (new Array(parseInt(dice))).fill(0).map(e => rand())
    }
    return function(from, to, ...args) {

        if(args.length == 0) {
            var result = roll(default_);
            result.forEach(function(e, i) {
                client.say(to, "Dice "+(i+1)+": "+e);
            });
            client.say(to, "total: "+result.reduce(function(prev, curr) { prev+=curr; return prev;}, 0));
        } else {
            if(args[0] == 'set') {
                default_ = parseInt(args[1]);
                client.say(to, "The number of die is: "+default_);
            } else if(isInt(args[0])) {
                console.log("is an integer");
                client.say(to, "Dice result: "+rand(parseInt(args[0])));
            }
        }
    }
};

exports.dice = dice;
