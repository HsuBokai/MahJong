
var Game = {
	createNew: function(agents, state, canvas, board){
		var game = {};
		var turn;
		var duration = 100;
		var nextStep;
		var nowTile;
		var isPause = false;
		game.takeTurn = function(){
			turn = (turn+1)%4;
		}
		function pickUp() {
			console.log("pickup");
			nowTile = state.pickUp(turn);
			board.pickUp(nowTile, turn);
			var isSelfWin = state.isWin( turn );
			if(isSelfWin || state.isEndWallNum()){
				var text;
				if(isSelfWin) text = turn + " wins!! ";
				else text = "no one wins!!";
				window.alert(text);
				return;
			}
			nextStep = complement;
			if(isPause===false) setTimeout(nextStep, duration);
		}
		function complement(){
			console.log("complement");
			var isSelfKong = state.isSelfKong(nowTile, turn);
			if(isSelfKong && agents[turn].doKong()){
				state.discard(nowTile);
				board.kong(nowTile, turn);
				console.log("%%%%%%%%%%%%%%%%%%%%%%%%% Kong!!", turn);
				nextStep = pickUp;
				if(isPause===false) setTimeout(nextStep, duration);
				return;
			}
			nextStep = replace;
			if(isPause===false) setTimeout(nextStep, duration);
		}
		function replace(){
			console.log("replace");
			var agent = agents[turn];
			if(agent.isManual()) return;
			nowTile = agent.getAction();
			
			console.log(nowTile, turn);
			
			state.discard(nowTile);
			board.replace(nowTile, turn, state);
			nextStep = change;
			if(isPause===false) setTimeout(nextStep, duration);
		}
		function change(){
			console.log("change");
			var isHuArray = state.isSomebodyHu(nowTile);
			var text = "";
			for(var i=0; i<4; ++i) if(isHuArray[i] && agents[i].doHu()) text += (i + " wins!! ");
			if(text != ""){
				board.discard(nowTile, turn);
				window.alert(text);
				return;
			}
			var isPong = state.isSomebodyPong(nowTile);
			if(isPong != -1 && isPong != turn && agents[isPong].doPong()){
				board.change(nowTile, turn, isPong);
				turn = isPong;
				console.log("============================ Pong!!", turn);
				nextStep = replace;
				if(isPause===false) setTimeout(nextStep, duration);
				return;
			}
			var nextTurn = (turn+1)%4;
			var isNextChew = state.isNextChew(nowTile, nextTurn);
			if(isNextChew === true && agents[nextTurn].doChew()){
				board.change(nowTile, turn, nextTurn);
				turn = nextTurn;
				console.log("************** Chew!!", turn);
				nextStep = replace;
				if(isPause===false) setTimeout(nextStep, duration);
				return;
			}
			nextStep = discard;
			if(isPause===false) setTimeout(nextStep, duration);
		}
		function discard() {
			console.log("discard");
			state.discard(nowTile);
			board.discard(nowTile, turn);
			game.takeTurn();
			nextStep = pickUp;
			if(isPause===false) setTimeout(nextStep, duration);
		}
		game.start = function(){
			canvas.addEventListener("mousedown", function(event){
				isPause = (isPause) ? false : true;
				if(isPause===false) setTimeout(nextStep, duration);
			}, false);
			turn = 0;
			state.init();
			board.init(state);
			nextStep = pickUp;
			if(isPause===false) setTimeout(nextStep, duration);
		}
		game.simulate = function(){
			setTimeout(function(){
				var histogram = [0,0,0,0,0];
				var simuTimes = 100;
				for(var i=0; i<simuTimes; ++i){
					turn = 0;
					state.init();
					var isEndWallNum = false;
					var isSelfWin = false;
					while(true){
						state.pickUp(turn);
						isEndWallNum = state.isEndWallNum();
						if(isEndWallNum) {
							histogram[4]++;
							break;
						}
						isSelfWin = state.isWin( turn );
						if(isSelfWin) {
							histogram[turn]++;
							break;
						}
						var agent = agents[turn];
						var tile = agent.getAction();
						state.discard(tile);
						game.takeTurn();
					}
				}
				for(var i=0; i<5; ++i) histogram[i] /= simuTimes;
				console.log(histogram);
			}, 1000);
		}
		return game;
	}
}

