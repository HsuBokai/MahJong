
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
		function traversal(func){
			for(var i in bamboos){
				for(var j in bamboos[i]){
					if(func(bamboos,i,j,"bamboos")===true) return;
				}
			}
			for(var i in stones){
				for(var j in stones[i]){
					if(func(stones,i,j,"stones")===true) return;
				}
			}
			for(var i in characters){
				for(var j in characters[i]){
					if(func(characters,i,j,"characters")===true) return;
				}
			}
			for(var i in winds){
				for(var j in winds[i]){
					if(func(winds,i,j,"winds")===true) return;
				}
			}
			for(var i in dragons){
				for(var j in dragons[i]){
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
		state.init = function(){
			traversal(function(tileStateArray, i, j, type){
				tileStateArray[i][j] = -1;
			});
			wallNum = 136;
			//for(var i=0; i<16; ++i) state.pickUp(0);
			bamboos[0][0]=0;
			bamboos[0][1]=0;
			bamboos[0][2]=0;

			bamboos[5][0]=0;
			bamboos[4][1]=0;
			bamboos[3][2]=0;

			bamboos[3][0]=0;
			bamboos[3][3]=0;
			//bamboos[2][2]=0;

			bamboos[4][0]=0;
			bamboos[3][1]=0;
			bamboos[5][2]=0;

			winds[0][0]=0;
			winds[0][1]=0;
			winds[0][2]=0;

			dragons[0][0]=0;
			dragons[0][1]=0;
			wallNum-=16;
			for(var i=0; i<16; ++i) state.pickUp(1);
			for(var i=0; i<16; ++i) state.pickUp(2);
			for(var i=0; i<16; ++i) state.pickUp(3);
		}
		state.getTiles = function(){
			var tiles = [[],[],[],[]];
			traversal(function(tileStateArray,i,j,type){
				var tileState = tileStateArray[i][j];
				if(0 <= tileState && tileState < 4) tiles[tileState].push([type, parseInt(i), parseInt(j)]);
			});
			return tiles;
		}
		state.pickUp = function(turn){
			/*if(turn===0) {
				dragons[0][3]=0;
				return ["dragons",0,3];
			}*/
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
			for(var turn=0; turn<4; ++turn) if(histogram[turn] >= 2) {
			setTileState(tile, turn);
			return turn;
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
				var initArr = [0,0,0,0,0,0,0,0,0]
				var typeSplit = [[0,0,0,0],[0,0,0]];
				typeSplit.push(initArr.slice());
				typeSplit.push(initArr.slice());
				typeSplit.push(initArr.slice());
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
				return typeSplit;
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
					var typeSplit = getTypeSplit(i-1,i);
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
		state.getScore = function(tile, turn){
			function countScore(tileStateArray,i,j){
				var score = 0;
				for(var jj=0; jj<4; ++jj) {
					if(jj!=j) if(tileStateArray[i][jj]===turn) score += 5;
				}
				if(tileStateArray.length < 9) return score;
				if(1<=i){
					var addScore = 0;
					for(var jj=0; jj<4; ++jj) {
						if(tileStateArray[i-1][jj]===turn) addScore = 3;
					}
					score += addScore;
				}
				if(i<=7){
					var addScore = 0;
					for(var jj=0; jj<4; ++jj) {
						if(tileStateArray[i+1][jj]===turn) addScore = 3;
					}
					score += addScore;
				}
				return score;
			}
			var type = tile[0];
			var tileStateArray = getTileStateArray(type);
			var i=tile[1];
			var j=tile[2];
			return countScore(tileStateArray,i,j);
		}
		return state;
	}
}

