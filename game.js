
var Game = {
	createNew: function(agents, state, canvas, board){
		var game = {};
		var turn;
		var duration;
		var nextStep;
		var nowTile;
		var isEndArray = [0,0,0,0,0];
		var isPause;
		function nextTurn(){
			return (turn+1)%4;
		}
		function isAnimation(){
			return duration > 0 && isPause===false;
		}
		function pickUp() {
			//console.log("pickup");
			nowTile = state.pickUp(turn);
			if(isAnimation()) board.pickUp(nowTile, turn);
			var isSelfWin = state.isWin( turn );
			if(isSelfWin || state.isEndWallNum()){
				var text;
				if(isSelfWin) {
					isEndArray[turn] = 1;
					text = turn + " wins!! ";
				}
				else {
					isEndArray[4] = 1;
					text = "no one wins!!";
				}
				if(isAnimation()) window.alert(text);
				//else console.log(text);
				return;
			}
			nextStep = complement;
			if(isAnimation()) setTimeout(nextStep, duration);
		}
		function complement(){
			//console.log("complement");
			var isSelfKong = state.isSelfKong(nowTile, turn);
			if(isSelfKong && agents[turn].doKong()){
				state.doSelfKong(nowTile, turn);
				if(isAnimation()) board.kong(nowTile, turn);
				//console.log("&&&&&&&&&&&&&&&&&&&&&&&&& Kong!!", turn);
				nextStep = pickUp;
				if(isAnimation()) setTimeout(nextStep, duration);
				return;
			}
			nextStep = replace;
			if(isAnimation()) setTimeout(nextStep, duration*50);
		}
		function replace(){
			//console.log("replace");
			nowTile = agents[turn].getAction();
			state.discard(nowTile);
			if(isAnimation()) board.replace(nowTile, turn, state);
			nextStep = change;
			if(isAnimation()) setTimeout(nextStep, duration*50);
		}
		function change(){
			//console.log("change");
			var isHuArray = state.isSomebodyHu(nowTile);
			var text = "";
			for(var i=0; i<4; ++i) {
				if(isHuArray[i] && agents[i].doHu()) {
					isEndArray[i] = 1;
					text += (i + " wins!! ");
				}
			}
			if(text != ""){
				if(isAnimation()){
					board.discard(nowTile, turn);
					window.alert(text);
				}
				//else console.log(text);
				return;
			}
			var isPong = state.isSomebodyPong(nowTile);
			if(isPong != -1 && isPong != turn){
				if(agents[isPong].doPong()){
					state.somebodyDoPong(nowTile, isPong);
					if(isAnimation()) board.change(nowTile, turn, isPong);
					turn = isPong;
					//console.log("================================== Pong!!", turn);
					nextStep = replace;
					if(isAnimation()) setTimeout(nextStep, duration);
					return;
				}
			}
			var nextPlayerTurn = nextTurn();
			var isNextChew = state.isNextChew(nowTile, nextPlayerTurn);
			if(isNextChew === true){
				if(agents[nextPlayerTurn].doChew(nowTile)){
					if(isAnimation()) board.change(nowTile, turn, nextPlayerTurn);
					turn = nextPlayerTurn;
					//console.log("************** Chew!!", turn);
					nextStep = replace;
					if(isAnimation()) setTimeout(nextStep, duration);
					return;
				}
			}
			nextStep = discard;
			if(isAnimation()) setTimeout(nextStep, duration);
		}
		function discard() {
			//console.log("discard");
			state.discard(nowTile);
			if(isAnimation()) board.discard(nowTile, turn);
			turn = nextTurn();
			nextStep = pickUp;
			if(isAnimation()) setTimeout(nextStep, duration);
		}
		function initGame(){
			isPause = false;
			for(var i=0; i<5; ++i) isEndArray[i] = 0;
			turn = 0;
			state.init();
			if(isAnimation()) board.init(state);
			nextStep = pickUp;
		}
		game.start = function(d){
			duration = d;
			canvas.addEventListener("mousedown", function(event){
				isPause = (isPause) ? false : true;
				if(isAnimation()) setTimeout(nextStep, duration);
			}, false);
			initGame();
			if(isAnimation()) setTimeout(nextStep, duration);
		}
		function isEnd(){
			return !(isEndArray[0]===0 && isEndArray[1]===0 && isEndArray[2]===0 && isEndArray[3]===0 && isEndArray[4]===0);
		}
		game.simulate = function(){
			canvas.addEventListener("mousedown", function(event){
				duration = 0;
				var histogram = [0,0,0,0,0];
				var simuTimes = 1000;
				for(var time=0; time<simuTimes; ++time){
					initGame();
					var maxSteps = 10000;
					while(maxSteps-- && !isEnd()) {
						nextStep();
					}
					//console.log(isEndArray);
					for(var i=0; i<5; ++i) histogram[i] += isEndArray[i];
				}
				for(var i=0; i<5; ++i) histogram[i] /= simuTimes;
				console.log(histogram);
			}, false);
		}
		return game;
	}
}

