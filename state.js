
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

		var typeSplit = [[0,0,0,0],[0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
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
		function isOneHasPos(tileStateArray, pos, turn){
			if(tileStateArray.length != 9) return false;
			if(pos<0 || pos>=9) return false;
			for(var jj=0; jj<4; ++jj) {
				if(tileStateArray[pos][jj]===turn) return true;
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
		state.getTiles = function(){
			var tiles = [[],[],[],[]];
			traversal(function(tileStateArray,i,j,type){
				var tileState = tileStateArray[i][j];
				if(0 <= tileState && tileState < 4) tiles[tileState].push([type,i,j]);
			});
			return tiles;
		}
		state.pickUp = function(turn){
			var num = Math.floor(Math.random() * (wallNum));
			var finalTile;
			traversal(function(tileStateArray, i, j, type){
				if(tileStateArray[i][j]==-1){
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
			var histogram = [isOneHasPos(tileStateArray,i-2,nextTurn),
				isOneHasPos(tileStateArray,i-1,nextTurn),
				false,
				isOneHasPos(tileStateArray,i+1,nextTurn),
				isOneHasPos(tileStateArray,i+2,nextTurn)];
			if(	(histogram[0]===true && histogram[1]===true) ||
				(histogram[1]===true && histogram[3]===true) ||
				(histogram[3]===true && histogram[4]===true) ){
				setTileState(tile, nextTurn);
				return true;
			}
			return false;
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
					setTileState(tile, turn);
					return turn;
				}
			}
			return -1;
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
			var tiles = state.getTiles();
			return state.isHu(tiles[turn]);
		}
		state.isHu = function(myTiles) {
			function isTheSame(tile1, tile2){
				return tile1[0]===tile2[0] && tile1[1]===tile2[1];
			}
			function getTypeSplit(eye1, eye2){
				for(var ii=0; ii<5; ++ii) {
					var len = typeSplit[ii].length;
					for(var i=0; i<len; ++i) typeSplit[ii][i]=0;
				}
				for(var j=0; j<17; ++j){
					if(j!=eye1 && j!=eye2){
						var type = myTiles[j][0];
						var value = myTiles[j][1];
						switch(type){
							case "winds": typeSplit[0][value]++; break;
							case "dragons": typeSplit[1][value]++; break;
							case "bamboos": typeSplit[2][value]++; break;
							case "stones": typeSplit[3][value]++; break;
							case "characters": typeSplit[4][value]++; break;
							default: console.log("getTypeSplit error!!");
						}
					}
				}
			}
			function is_winds_dragons_ok(valueArr){
				var len = valueArr.length;
				for(var i=0; i<len; ++i) if(valueArr[i]%3 != 0) return false;
				return true;
			}
			function is_123456789_ok(valueArr){
				var len = valueArr.length;
				var k;
				var sum = 0;
				for(var i=0; i<len; ++i) {
					var v = valueArr[i];
					if(v<0) return false;
					if(v!=0) k=i;
					sum += v;
				}
				if(sum == 0) return true;
				if(sum % 3 != 0) return false;
				if(valueArr[k] >= 3) {
					valueArr[k]-=3;
					var check = is_123456789_ok(valueArr);
					valueArr[k]+=3;
					if(check===true) return true;
				}
				if(k<=6){ //0~6
					valueArr[k]	-=1;
					valueArr[k+1]	-=1;
					valueArr[k+2]	-=1;
					var check = is_123456789_ok(valueArr);
					valueArr[k]	+=1;
					valueArr[k+1]	+=1;
					valueArr[k+2]	+=1;
					if(check===true) return true;
				}
				if(2<=k){ // 2~8
					valueArr[k]	-=1;
					valueArr[k-1]	-=1;
					valueArr[k-2]	-=1;
					var check = is_123456789_ok(valueArr);
					valueArr[k]	+=1;
					valueArr[k-1]	+=1;
					valueArr[k-2]	+=1;
					if(check===true) return true;
				}
				if(1<=k && k<=7){ // 1~7
					valueArr[k-1]	-=1;
					valueArr[k]	-=1;
					valueArr[k+1]	-=1;
					var check = is_123456789_ok(valueArr);
					valueArr[k-1]	+=1;
					valueArr[k]	+=1;
					valueArr[k+1]	+=1;
					if(check===true) return true;
				}
				return false;
			}
			for(var i=1; i<17; ++i) {
				if(isTheSame(myTiles[i-1], myTiles[i])) {
					getTypeSplit(i-1,i);
					if( is_winds_dragons_ok(typeSplit[0])===true &&
					is_winds_dragons_ok(typeSplit[1])===true &&
					is_123456789_ok(typeSplit[2])===true &&
					is_123456789_ok(typeSplit[3])===true &&
					is_123456789_ok(typeSplit[4])===true) return true;
				}
			}
			return false;
		}
		state.isEndWallNum = function(){ return wallNum <= 8; }
		state.discard = function(tile){
			setTileState(tile, -2);
		}
		state.getScore = function(tile, turn, s0, s1, s2){
			function countScore(tileStateArray,i,j){
				var score = 0;
				for(var jj=0; jj<4; ++jj) {
					if(jj!=j) if(tileStateArray[i][jj]===turn) score += s0;
				}
				if(tileStateArray.length != 9) return score;
				if(isOneHasPos(tileStateArray, i-1, turn)) score += s1;
				if(isOneHasPos(tileStateArray, i+1, turn)) score += s1;
				if(isOneHasPos(tileStateArray, i-2, turn)) score += s2;
				if(isOneHasPos(tileStateArray, i+2, turn)) score += s2;
				return score;
			}
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			var i=tile[1];
			var j=tile[2];
			return countScore(tileStateArray,i,j);
		}
		state.getScoreByRemain = function(tile, turn){
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			var i=tile[1];
			var j=tile[2];
			var score = 0;
			
			var pongNum = 0;
			for(var jj=0; jj<4; ++jj) {
				if(tileStateArray[i][jj]===turn) ++pongNum;
			}
			if(pongNum === 2) score += ((state.remainTileNum(type,i,turn) * 35) );
			//if(pongNum === 2) score += 60;
			else if(pongNum === 3) score += 120;
			else if(pongNum === 4) score += 140;
			//score += ((pongNum-1)*5);
			
			if(tileStateArray.length != 9) return score;

			function chewScore(other, wait){
				if(isOneHasPos(tileStateArray, other, turn)) {
					//score += 20;
					if(isOneHasPos(tileStateArray, wait, turn)) score += 25;
					else {
						var waitingNum = state.remainTileNum(type, wait, turn);
						//console.log(tile);
						//console.log(type, wait, waitingNum);
						score += (waitingNum * 4);
					}
				}
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
			for(var jj=0; jj<4; ++jj) if(tileStateArray[i][jj]===turn || tileStateArray[i][jj]===-2) ++sum;
			return 4-sum;
		}
		return state;
	}
}

