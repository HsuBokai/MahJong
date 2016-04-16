

var ManualAgent = {
	createNew: function(state, myTurn){
		var agent = {};
		agent.doHu = function(){
			return true;
		}
		agent.doKong = function(){
			return true;
		}
		agent.isManual = function(){ return true;}
		agent.getName = function(){ return "manual";}
		return agent;
	}
}

var DesignAgent = {
	createNew: function(state, myTurn){
		var agent = {};
		agent.doChew = function(chewTile){
			var type = chewTile[0];
			var i0 = chewTile[1];
			var tiles = state.getTiles(false);
			var myTiles = tiles[myTurn];
			var i = myTiles.length;
			var histogram = [0,0,0,0,0];
			while(i--){
				var tile = myTiles[i];
				if(tile[0]===type){
					var diff = tile[1]-i0;
					if(diff===-2) ++histogram[0];
					if(diff===-1) ++histogram[1];
					if(diff===0) ++histogram[2];
					if(diff===1) ++histogram[3];
					if(diff===2) ++histogram[4];
				}
			}
			if(histogram[2] != 0 && histogram[2] != 3) return false;
			if(histogram[0] > 0 && histogram[1] > 0) {
				state.doNextChew(chewTile, i0-2, i0-1, myTurn);
				return true;
			}
			if(histogram[1] > 0 && histogram[3] > 0) {
				state.doNextChew(chewTile, i0-1, i0+1, myTurn);
				return true;
			}
			if(histogram[3] > 0 && histogram[4] > 0) {
				state.doNextChew(chewTile, i0+1, i0+2, myTurn);
				return true;
			}
			return false;
		}
		agent.doPong = function(tile){
			var type = tile[0];
			var i0 = tile[1];
			var tiles = state.getTiles(false);
			var myTiles = tiles[myTurn];
			var len = myTiles.length;
			var end = 0;
			var sum = 0;
			for(var i=0; i<len; ++i){
				if(myTiles[i][0]===type && myTiles[i][1]===i0) {
					end = i;
					++sum;
				}
			}
			if(sum===2){
				var now_ok_num = state.getHeuristic(myTiles, -1, -1);
				var pong_ok_num = state.getHeuristic(myTiles, end, end-1);
				if(now_ok_num > pong_ok_num) return false;
			}
			return true;
		}
		agent.doKong = function(){
			return true;
		}
		agent.doHu = function(){
			return true;
		}
		agent.getAction = function(){
			var tiles = state.getTiles(false);
			var myTiles = tiles[myTurn];
			var i = myTiles.length;
			var minScore = 9999;
			var finalTileIndex = i-1;
			while(i--){
				var s1 = state.getScoreByRemain(myTiles[i], myTurn);
				//var s1 = state.getScore(myTiles[i], myTurn, 5, 3, 1);
				var s2 = (10 - state.getHeuristic(myTiles, i, i))*100;
				var s = s1 + s2;
				//console.log(s);
				if(s < minScore){
					minScore = s;
					finalTileIndex = i;
				}
			}
			return myTiles[finalTileIndex];
		}
		agent.isManual = function(){ return false;}
		agent.getName = function(){ return "design";}
		return agent;
	}
}

var ReflexAgent = {
	createNew: function(state, myTurn){
		var agent = {};
		agent.doChew = function(chewTile){
			var type = chewTile[0];
			var i0 = chewTile[1];
			var tiles = state.getTiles(false);
			var myTiles = tiles[myTurn];
			var i = myTiles.length;
			var histogram = [0,0,0,0,0];
			while(i--){
				var tile = myTiles[i];
				if(tile[0]===type){
					var diff = tile[1]-i0;
					if(diff===-2) ++histogram[0];
					if(diff===-1) ++histogram[1];
					if(diff===0) ++histogram[2];
					if(diff===1) ++histogram[3];
					if(diff===2) ++histogram[4];
				}
			}
			if(histogram[2] > 0) return false;
			if(histogram[0] > 0 && histogram[1] > 0) {
				state.doNextChew(chewTile, i0-2, i0-1, myTurn);
				return true;
			}
			if(histogram[1] > 0 && histogram[3] > 0) {
				state.doNextChew(chewTile, i0-1, i0+1, myTurn);
				return true;
			}
			if(histogram[3] > 0 && histogram[4] > 0) {
				state.doNextChew(chewTile, i0+1, i0+2, myTurn);
				return true;
			}
			return false;
		}
		agent.doPong = function(tile){
			return true;
		}
		agent.doKong = function(){
			return true;
		}
		agent.doHu = function(){
			return true;
		}
		agent.getAction = function(){
			var tiles = state.getTiles(false);
			var myTiles = tiles[myTurn];
			var i = myTiles.length;
			var minScore = 9999;
			var finalTileIndex = i-1;
			while(i--){
				var tile = myTiles[i];
				var s = state.getScore(tile, myTurn, 5, 4, 2);
				if(s < minScore){
					minScore = s;
					finalTileIndex = i;
				}
			}
			return myTiles[finalTileIndex];
		}
		agent.isManual = function(){ return false;}
		agent.getName = function(){ return "reflex";}
		return agent;
	}
}
