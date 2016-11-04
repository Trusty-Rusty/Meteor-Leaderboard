PlayersList = new Mongo.Collection('players');

//This code runs on client and server

if(Meteor.isClient){					//This code only runs on the client
	Template.leaderboard.helpers({
		'player': function(){ //players list sorted by score, then name
			return PlayersList.find({}, { sort: {score: -1, name: 1} });
		},
		'selectedClass': function(){
        	var playerId = this._id; //
        	var selectedPlayer = Session.get('selectedPlayer');
        	if(playerId == selectedPlayer){
        		return "selected";		
        	}
		},
		'selectedPlayer': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			return PlayersList.findOne({ _id: selectedPlayer });
		}
	});
	Template.leaderboard.events({
		'click .player': function(){
			var playerId = this._id; //"this" is clicked player, "_id" is db id value
			Session.set('selectedPlayer', playerId);  //creates a session 		 	
		},
		'click .increment': function(){			
			var selectedPlayer = Session.get('selectedPlayer'); 
			PlayersList.update({_id: selectedPlayer}, { $inc: {score: 5}});
		},
		'click .decrement': function(){			
			var selectedPlayer = Session.get('selectedPlayer'); 
			PlayersList.update({_id: selectedPlayer}, { $inc: {score: -5}});
		},
		'click .remove': function(){
			var r = confirm("Are you certain you want to delete this player?  Their score will be lost")
			if (r == true) {
				var selectedPlayer = Session.get('selectedPlayer');
				PlayersList.remove({ _id: selectedPlayer }); //remove item with id from db
			}
		}
	});
	Template.addPlayerForm.events({
		'submit form': function(event){
			event.preventDefault(); //prevent some default js behavior
			var playerNameVar = event.target.playerName.value; //retrieve value of html attribut named "playerNameVar"
			console.log(playerNameVar);
			PlayersList.insert({
				name: playerNameVar, //On form submit add PlayersList doc with submitted name 
				score: 0			//...with a score of 0
			});
			event.target.playerName.value = ""; //clear form after submit
		}
	});
}

if(Meteor.isServer){
	//This code only runs on the server

}

