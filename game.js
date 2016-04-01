
var Game = {
	createNew: function(agents, state, canvas, board){
		var game = {};
		var turn = 0;
		var duration = 100;
		var nextStep;
		var isPause = false;
		game.takeTurn = function(){
			turn = (turn+1)%4;
		}
		function pickUp() {
			//console.log("pickup");
			board.pickUp(state.pickUp(turn), turn);
			var isSelfWin = state.isWin( turn );
			if(isSelfWin || state.isEndWallNum()){
				var text;
				if(isSelfWin) text = turn + " wins!!";
				else text = "no one wins!!";
				window.alert(text);
			}
			else{
				nextStep = discard;
				if(isPause==false) setTimeout(nextStep, duration);
			}
		}
		function discard() {
			//console.log("discard");
			var agent = agents[turn];
			if(agent.isManual()) return;
			else tile = agent.getAction();
			//console.log(tile);
			//if(state.isActionLegal(tile) == false) return;
			state.takeAction(tile, turn);
			board.discard(tile, turn, state);
			game.takeTurn();
			nextStep = pickUp;
			if(isPause==false) setTimeout(nextStep, duration);
		}
		game.start = function(){
			canvas.addEventListener("mousedown", function(event){
				isPause = (isPause) ? false : true;
				if(isPause==false) setTimeout(nextStep, duration);
			}, false);
			nextStep = pickUp;
			if(isPause==false) setTimeout(nextStep, duration);
		}
		return game;
	}
}

