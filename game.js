
var Game = {
	createNew: function(agents, state, canvas, board){
		var game = {};
		var turn;
		var duration;
		var nextStep;
		var nowTile;
		var isEndArray = [0,0,0,0,0];
		var isPause;
		var isDecide;
		var isAction;
		var chew_click_count;
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
			if(isAnimation()) setTimeout(nextStep, duration);
		}
		function replace(){
			//console.log("replace");
			var agent = agents[turn];
			if(isDecide === false) {
				if(agent.isManual()){
					board.highlight(nowTile, turn, 2);
					//window.alert("please discard a tile!!");
					return;
				}
				else nowTile = agent.getAction();
			}
			else isDecide = false;
			state.discard(nowTile);
			if(isAnimation()) board.replace(nowTile, turn, state);
			nextStep = change_hu;
			if(isAnimation()) setTimeout(nextStep, duration);
		}
		function change_hu(){
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
					nowTile[3] = 3;
					board.discard(nowTile, turn);
					window.alert(text);
				}
				//else console.log(text);
				return;
			}
			nextStep = change_pong;
			if(isAnimation()) setTimeout(nextStep, duration);
		}
		function change_pong(){
			var isPong = state.isSomebodyPong(nowTile);
			if(isPong != -1 && isPong != turn){
				var agent = agents[isPong];
				if(isDecide === false) {
					if(agent.isManual()){
						board.highlight(nowTile, turn, 2);
						//window.alert("do you pong ?");
						return;
					}
					else isAction = agent.doPong(nowTile);
				}
				else isDecide = false;
				if(isAction){
					state.somebodyDoPong(nowTile, isPong);
					if(isAnimation()) board.change(nowTile, turn, isPong);
					turn = isPong;
					//console.log("================================== Pong!!", turn);
					nextStep = replace;
					if(isAnimation()) setTimeout(nextStep, duration);
					return;
				}
			}
			nextStep = change_chew;
			if(isAnimation()) setTimeout(nextStep, duration);
		}
		function change_chew(){
			var nextPlayerTurn = nextTurn();
			var isNextChew = state.isNextChew(nowTile, nextPlayerTurn);
			if(isNextChew === true){
				var agent = agents[nextPlayerTurn];
				if(isDecide === false) {
					if(agent.isManual()){
						board.highlight(nowTile, turn, 3);
						//window.alert("do you chew ?");
						return;
					}
					else {
						isAction = agent.doChew(nowTile);
					}
				}
				else isDecide = false;
				if(isAction){
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
			isDecide = false;
			chew_click_count = 0;
			for(var i=0; i<5; ++i) isEndArray[i] = 0;
			turn = 1;
			state.init();
			if(isAnimation()) board.init(state);
			nextStep = pickUp;
		}
		game.start = function(d){
			duration = d;
			canvas.addEventListener("mousedown", function(e){
				var x = e.pageX;
				var y = e.pageY;
				if(nextStep === replace){
					var ret = board.clickTile(x,y);
					if(ret[0] != turn) return;
					var index = ret[1];
					if(0<=index && index<17){
						isDecide = true;
						if(index != 16){
							var originalState = state.getTileState(nowTile);
							state.discard(nowTile);
							var tiles = state.getTiles(true);
							state.setTileState(nowTile, originalState);
							nowTile = tiles[turn][index];
						}
						if(isAnimation()) setTimeout(nextStep, duration);
					}
				}
				else if(nextStep === change_pong){
					isAction = board.isInBoard(x,y);
					console.log("isAction: " + isAction);
					isDecide = true;
					if(isAnimation()) setTimeout(nextStep, duration);
				}
				else if(nextStep === change_chew){
					console.log(chew_click_count);
					var nextPlayerTurn = nextTurn();
					var chewState = nextPlayerTurn + 10;
					if(chew_click_count === 0){
						isAction = board.isInBoard(x,y);
						console.log("isAction: " + isAction);
						isDecide = true;
						if(isAction === true){
							state.discard(nowTile);
							chew_click_count = 1;
							if(isAnimation()) board.change(nowTile, turn, nextPlayerTurn);
							window.alert("please choose 2 tiles with chew!!");
						}
						else if(isAnimation()) setTimeout(nextStep, duration);
					}
					else if(chew_click_count === 1 || chew_click_count === 2){
						var ret = board.clickTile(x,y);
						if(ret[0] != nextPlayerTurn) return;
						var index = ret[1];
						if(0<=index && index<16){
							var tiles = state.getTiles(true);
							state.setTileState(tiles[nextPlayerTurn][index], chewState);
							board.redrawPlayer(nextPlayerTurn);
						}
						chew_click_count = (chew_click_count+1) % 3;
						if(chew_click_count === 0){
							state.setTileState(nowTile, chewState);
							isDecide = false;
							turn = nextPlayerTurn;
							nextStep = replace;
							if(isAnimation()) setTimeout(nextStep, duration);
						}
					}
					else{
						console.log("chew_click_count error!!");
					}
				}
				//isPause = (isPause) ? false : true;
				//if(isAnimation()) setTimeout(nextStep, duration);
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

