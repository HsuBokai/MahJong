
var State = {
	createNew: function(){
		var state = {};
		function array1d(len1){
			var row = [];
			for(var j=0;j<len1;++j) row.push(-1);
			return row;
		}
		function array2d(len1, len2){
			var row = array1d(len2);
			var table = [];
			for(var i=0;i<len1;++i) table.push(row.slice());
			return table;
		}
		var bamboos = array2d(9, 4);
		var stones = array2d(9, 4);
		var characters = array2d(9, 4);
		var winds = array2d(4,4);
		var dragons = array2d(3,4);
		var wallNum;

		function isBelongTo(state, turn) {
			return state === turn || (state - 10) === turn;
		}
		function traversal(func){
			for(var i=0; i<9; ++i){
				for(var j=0; j<4; ++j){
					if(func(bamboos,i,j,"bamboos")===true) return;
				}
			}
			for(var i=0; i<9; ++i){
				for(var j=0; j<4; ++j){
					if(func(stones,i,j,"stones")===true) return;
				}
			}
			for(var i=0; i<9; ++i){
				for(var j=0; j<4; ++j){
					if(func(characters,i,j,"characters")===true) return;
				}
			}
			for(var i=0; i<4; ++i){
				for(var j=0; j<4; ++j){
					if(func(winds,i,j,"winds")===true) return;
				}
			}
			for(var i=0; i<3; ++i){
				for(var j=0; j<4; ++j){
					if(func(dragons,i,j,"dragons")===true) return;
				}
			}
		}
		function getTileStateArray(type){
			switch(type){
				case "winds": return winds
				case "dragons": return dragons
				case "bamboos": return bamboos
				case "stones": return stones
				case "characters": return characters
				default: console.log("getTileState error!");
			}
		}
		function setTileState(tile, value){
			var type = tile[0];
			var i=tile[1];
			var j=tile[2];
			var tileStateArray = getTileStateArray(type);
			tileStateArray[i][j] = value;
		}
		function isOneHandHasPos(tileStateArray, pos, turn){
			if(tileStateArray.length != 9) return false;
			if(pos<0 || pos>=9) return false;
			for(var jj=0; jj<4; ++jj) {
				if(tileStateArray[pos][jj] === turn) return true;
			}
			return false;
		}
		state.init = function(){
			function n_choose_m(n,m){
				var arr = array1d(n);
				var pn = n;
				var pm = m;
				for(var i=0; i<n; ++i){
					if(Math.random()*pn < pm){
						arr[i] = true;
						--pm;
					}
					else arr[i] = false;
					--pn;
				}
				return arr;
			}
			function issue(turn){
				var count = 0;
				var arr = n_choose_m(wallNum, 16);
				traversal(function(tileStateArray, i, j, type){
					if(tileStateArray[i][j]===-1) if(arr[count++]) tileStateArray[i][j] = turn;
				});
				wallNum -= 16;
			}
			wallNum = 136;
			traversal(function(tileStateArray, i, j, type){
				tileStateArray[i][j] = -1;
			});
			issue(0);
			issue(1);
			issue(2);
			issue(3);
		}
		state.getTiles = function(isShowing){
			var tiles = [[],[],[],[]];
			traversal(function(tileStateArray,i,j,type){
				var tileState = tileStateArray[i][j];
				if(0 <= tileState && tileState < 4) tiles[tileState].push([type,i,j,false]);
				if(isShowing) if(10 <= tileState && tileState < 14) tiles[tileState-10].push([type,i,j,true]);
			});
			return tiles;
		}
		state.pickUp = function(turn){
			var num = Math.floor(Math.random() * (wallNum));
			var finalTile;
			traversal(function(tileStateArray, i, j, type){
				if(tileStateArray[i][j] === -1){
					if(num==0) {
						finalTile = [type, parseInt(i), parseInt(j)];
						tileStateArray[i][j] = turn;
						--wallNum;
						return true;
					}
					--num;
				}
			});
			return finalTile;
		}
		state.isNextChew = function(tile, nextTurn){
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			if(tileStateArray.length != 9) return false;
			var i=tile[1];
			var histogram = [isOneHandHasPos(tileStateArray,i-2,nextTurn),
				isOneHandHasPos(tileStateArray,i-1,nextTurn),
				false,
				isOneHandHasPos(tileStateArray,i+1,nextTurn),
				isOneHandHasPos(tileStateArray,i+2,nextTurn)];
			return (histogram[0]===true && histogram[1]===true) ||
				(histogram[1]===true && histogram[3]===true) ||
				(histogram[3]===true && histogram[4]===true);
		}
		state.doNextChew = function(tile, i1, i2, nextTurn){
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			if(tileStateArray.length != 9) return;
			function updateState(i){
				for(var jj=0; jj<4; ++jj){
					if(tileStateArray[i][jj]===nextTurn) {
						tileStateArray[i][jj] = (nextTurn + 10);
						return;
					}
				}
			}
			updateState(i1);
			updateState(i2);
			var i = tile[1];
			var j = tile[2];
			tileStateArray[i][j] = (nextTurn + 10);
		}
		state.isSelfKong = function(tile, turn){
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			var i=tile[1];
			var j=tile[2];
			for(var jj=0; jj<4; ++jj) {
				if(tileStateArray[i][jj] != turn) return false;;
			}
			return true;
		}
		state.doSelfKong = function(tile, turn){
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			var i=tile[1];
			var j=tile[2];
			for(var jj=0; jj<4; ++jj) {
				if(jj===j) tileStateArray[i][jj] = -2;
				else tileStateArray[i][jj] = (turn + 10);
			}
		}
		state.isSomebodyPong = function(tile){
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			var i=tile[1];
			var j=tile[2];
			var histogram = [0,0,0,0];
			for(var jj=0; jj<4; ++jj) {
				if(jj != j) {
					var state = tileStateArray[i][jj];
					if(0<=state && state<4) histogram[state]++;
				}
			}
			for(var turn=0; turn<4; ++turn) {
				if(histogram[turn] === 2) {
					return turn;
				}
			}
			return -1;
		}
		state.somebodyDoPong = function(tile, turn){
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			var i=tile[1];
			var j=tile[2];
			for(var jj=0; jj<4; ++jj) {
				if(j===jj || tileStateArray[i][jj]===turn){
					tileStateArray[i][jj] = (turn + 10);
				}
			}
		}
		state.isSomebodyHu = function(tile){
			var isHuArray = [false, false, false, false];
			for(var turn=0; turn<4; ++turn){
				setTileState(tile, turn);
				isHuArray[turn] = state.isWin(turn);
			}
			setTileState(tile, -2);
			return isHuArray;
		}
		state.isWin = function(turn){
			var tiles = state.getTiles(false);
			return state.isHu(tiles[turn]);
		}
		state.isHu = function(myTiles) {
			var tilesLen = myTiles.length;
			function isTheSame(tile1, tile2){
				return tile1[0]===tile2[0] && tile1[1]===tile2[1];
			}
			var win_ok_num = (tilesLen-2)/3;
			for(var i=1; i<tilesLen; ++i) {
				if(isTheSame(myTiles[i-1], myTiles[i])) {
					if(state.ok_num(myTiles, i-1, i) === win_ok_num) return true;
				}
			}
			return false;
		}
		state.isEndWallNum = function(){ return wallNum <= 8; }
		state.discard = function(tile){
			setTileState(tile, -2);
		}
		state.getScore = function(tile, turn, s0, s1, s2){
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			var i=tile[1];
			var j=tile[2];
			var score = 0;
			for(var jj=0; jj<4; ++jj) {
				if(jj!=j) if(tileStateArray[i][jj]===turn) score += s0;
			}
			if(tileStateArray.length != 9) return score;
			if(isOneHandHasPos(tileStateArray, i-1, turn)) score += s1;
			if(isOneHandHasPos(tileStateArray, i+1, turn)) score += s1;
			if(isOneHandHasPos(tileStateArray, i-2, turn)) score += s2;
			if(isOneHandHasPos(tileStateArray, i+2, turn)) score += s2;
			return score;
		}
		state.getScoreByRemain = function(tile, turn){
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			var i=tile[1];
			var j=tile[2];
			var score = 0;
			
			function sameNum(pos){
				if(pos<0 || pos>=tileStateArray.length) return 0;
				var num = 0;
				for(var jj=0; jj<4; ++jj) {
					if(tileStateArray[pos][jj] === turn) ++num;
				}
				return num;
			}

			function isStraight(pos){
				return (( sameNum(pos-1) > 0 ) && ( sameNum(pos-2) > 0 )) ||
					(( sameNum(pos-1) > 0 ) && ( sameNum(pos+1) > 0 )) ||
					(( sameNum(pos+1) > 0 ) && ( sameNum(pos+2) > 0 ));
			}
			
			var pongNum = sameNum(i)
			if(pongNum === 2) {
				if( isStraight(i) ){
					score += 0;
				}else {
					var waitingNum = state.remainTileNum(type,i,turn);
					//console.log(waitingNum);
					score += (waitingNum * 45);
				}
				//score += 60;
			}
			else if(pongNum === 3) score += 120;
			else if(pongNum === 4) score += 0;
			//console.log(tile, "pongScore: ", score);
			
			if(tileStateArray.length != 9) return score;

			function chewScore(other, wait){
				var otherNum = sameNum(other);
				if(otherNum === 0 || otherNum === 3){
					score += 0;
				}
				else {
					//score += 20;
					var waitNum = sameNum(wait);
					if(waitNum === 0 || waitNum === 3){
						var waitingNum = state.remainTileNum(type, wait, turn);
						//console.log(tile);
						//console.log(type, wait, waitingNum);
						score += (waitingNum * 4);
					}
					else{
					   score += 20;
					}
				}
				//console.log(tile, "chewScore: ", score);
			}
			chewScore(i-1,i-2);
			chewScore(i-1,i+1);
			chewScore(i+1,i+2);
			chewScore(i+1,i-1);
			chewScore(i-2,i-1);
			chewScore(i+2,i+1);
			return score;
		}
		state.remainTileNum = function(type, i, turn){
			if(i<0 || i>=9) return 0;
			var tileStateArray = getTileStateArray(type);
			var sum = 0;
			for(var jj=0; jj<4; ++jj) if(tileStateArray[i][jj] === turn || tileStateArray[i][jj]===-2 || tileStateArray[i][jj] >= 10) ++sum;
			return 4-sum;
		}
		state.getHeuristic = function(tiles, index1, index2){
			return state.ok_num(tiles, index1, index2);
		}
		state.ok_num = function(tiles, index1, index2){
			var len = tiles.length;
			var valueArr = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
			if(index1 >= 0) valueArr[index1] = 0;
			if(index2 >= 0) valueArr[index2] = 0;
			function count_ok_num(){
				var sum = 0;
				var end = -1;
				for(var i=0; i<len; ++i) {
					var v = valueArr[i];
					if(v === 1) end = i;
					sum += v;
				}
				if(sum < 3) return 0;

				var max_num = 0;
				valueArr[end] = 0;
				max_num = Math.max(max_num, count_ok_num());
				valueArr[end] = 1;
				var count = [[],[],[]];
				var type = tiles[end][0];
				for(var i=end; i>=0; --i) {
					if(valueArr[i]===1 && tiles[i][0]===type){
						var iii = tiles[end][1] - tiles[i][1];
						if(0 <= iii && iii < 3) count[iii].push(i);
					}
				}

				if(count[0].length >= 3) {
					valueArr[count[0][0]] = 0;
					valueArr[count[0][1]] = 0;
					valueArr[count[0][2]] = 0;
					max_num = Math.max(max_num, count_ok_num()+1);
					valueArr[count[0][0]] = 1;
					valueArr[count[0][1]] = 1;
					valueArr[count[0][2]] = 1;
				}
				if(getTileStateArray(type).length != 9) return max_num;
				if(count[0].length > 0 && count[1].length > 0 && count[2].length > 0){
					valueArr[count[0][0]] = 0;
					valueArr[count[1][0]] = 0;
					valueArr[count[2][0]] = 0;
					max_num = Math.max(max_num, count_ok_num()+1);
					valueArr[count[0][0]] = 1;
					valueArr[count[1][0]] = 1;
					valueArr[count[2][0]] = 1;
				}
				return max_num;
			}
			return count_ok_num();
		}
		return state;
	}
}

