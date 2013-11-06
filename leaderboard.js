// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {

  Template.leaderboard.players = function () {  
    if (Session.get("sort_name")) {
      return Players.find({}, {
        sort: {name: 1}
      }); 
    } else {
      return Players.find({}, {
        sort: {score: -1}
      });
    }      
  };    

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () { 
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click input.sort_name': function () { 
      Session.set("sort_name", true); 
    },
    'click input.sort_score': function () { 
      Session.set("sort_name", false); 
    },
    'click input.reset_score': function () { 
      Players.find({}).forEach(function(each) { 
        Players.update(each._id, {name: each.name, score: randn});
      }); 
    },
    'click .player .delete': function () {
      Players.remove(this._id);
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    } 
  });

} 

function randn () {
  return Math.floor(Random.fraction()*10)*5;
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {

  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: randn()});
    }
  });

}
