var cmds = {
  'vote': function(from, to, message) {
    vote.set("channel", to);
    vote.set("from", from);
    var msg = message.match(/\[.+/) != null ? message.match(/\[.+/)[0] : "[0]";
    try {
        vote[message.match(/^\..+?(?=\s).(.+?)(\s|$)/)[1]].apply(vote, JSON.parse(msg));
    } catch(e) {
        client.say(to, "syntax error!");
    }
  },
  'raw': function(from, to, message) {
    var msg = message.match(/\[.+/) != null ? message.match(/\[.+/)[0] : "[0]";
    client.send(msg);
  },
  "help": function(from, to, message) {
    for(var i in cmds) {
      client.say(to, i);
    }
  }
}
var vote = (function(client) {
  var vote = {
    polls: [],
    vote: function(id, vote) {
      if(!this.polls[id]) {
        client.say(this.channel, "Invalid Poll!");
        return;
      }
      //if(!this.polls[id].votes[this.from]) {
        this.polls[id].votes[this.from] = vote;
      //} else {
      //  this.polls[id].votes[this.from] = vote;
      //}
      //console.log(this.polls[id].votes);
      this.display(id);
    },
    create: function(topic, selections, options) {
      var poll = {
        topic: topic,
        selections: selections,
        options: options,
        votes: {},
        creator: this.from
      };
      this.polls.push(poll);
      this.display(this.polls.length-1);
    },
    display: function(id, private) {

      var room = this.channel;
      if(private) {
        room = this.from;
      }
      if(!this.polls[id]) {
        client.say(room, "Invalid Poll!");
        return;
      }
      var tmp = this.polls[id].selections.map((e) => {
        var tmp = {};
        tmp.name = e[0];
        tmp.count = 0;
        tmp.code = e[1];
        return tmp;
      });
      var tmp_ = {};
      for(var i in tmp) {
        //console.log(tmp[i]);
        tmp_[tmp[i].code] = tmp[i];
      }
      for(var i in this.polls[id].votes) {
        
        tmp_[this.polls[id].votes[i]].count++;
      }
      client.say(room, "id: "+id);
      client.say(room, "topic: "+this.polls[id].topic);
      for(var i in tmp_) {
        client.say(room, tmp_[i].name+"("+tmp_[i].code+"): "+tmp_[i].count);
      }
    },
    close: function(id) {
      if(!this.polls[id]) {
        client.say(this.channel, "Invalid Poll!");
        return;
      }
      if(this.from == this.polls[id].creator) {
        this.display(id);
        this.polls.splice(id, 1);
      }
    },
    list: function() {
      for(var i in this.polls) {
        this.display(i, true)
      }
    },
    set: function(key, val) {
      this[key] = val;
    },
    help: function() {
      client.say(this.from, ".vote create [<topic>, <selections: [<selection>, <easy code>]>], <options>]|  ex: ' .vote create [\"Do you like this bot?\", [[\"yes\", \"y\"], [\"No\", \"n\"], [\"I don't Know\", \"o\"]], null]'");
      client.say(this.from, ".vote vote [<poll id>, <easy code>]");
      client.say(this.from, ".vote list | display polls");
      client.say(this.from, ".vote display [<poll id>] | display poll with the given id");
      client.say(this.from, ".close close [<id>] | only the creator can close");
    }
    
  };
  return vote;
})(client);


module.exports = cmds;