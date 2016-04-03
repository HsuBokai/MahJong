

var ManualAgent = {
	createNew: function(state, myTurn){
		var agent = {};
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
			var num = chewTile[1];
			var tiles = state.getTiles(false);
			var myTiles = tiles[myTurn];
			var i = myTiles.length;
			var histogram = [0,0,0,0,0];
			while(i--){
				var tile = myTiles[i];
				if(tile[0]===type){
					var diff = tile[1]-num;
					if(diff===-2) ++histogram[0];
					if(diff===-1) ++histogram[1];
					if(diff===0) ++histogram[2];
					if(diff===1) ++histogram[3];
					if(diff===2) ++histogram[4];
				}
			}
			if(histogram[2] > 0) return false;
			if(histogram[0] > 0 && histogram[1] > 0) {
				state.doNextChew(chewTile, num-2, num-1, myTurn);
				return true;
			}
			if(histogram[1] > 0 && histogram[3] > 0) {
				state.doNextChew(chewTile, num-1, num+1, myTurn);
				return true;
			}
			if(histogram[3] > 0 && histogram[4] > 0) {
				state.doNextChew(chewTile, num+1, num+2, myTurn);
				return true;
			}
			return false;
		}
		agent.doPong = function(){
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
				var s = state.getScoreByRemain(tile, myTurn);
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
			var num = chewTile[1];
			var tiles = state.getTiles(false);
			var myTiles = tiles[myTurn];
			var i = myTiles.length;
			var histogram = [0,0,0,0,0];
			while(i--){
				var tile = myTiles[i];
				if(tile[0]===type){
					var diff = tile[1]-num;
					if(diff===-2) ++histogram[0];
					if(diff===-1) ++histogram[1];
					if(diff===0) ++histogram[2];
					if(diff===1) ++histogram[3];
					if(diff===2) ++histogram[4];
				}
			}
			if(histogram[2] > 0) return false;
			if(histogram[0] > 0 && histogram[1] > 0) {
				state.doNextChew(chewTile, num-2, num-1, myTurn);
				return true;
			}
			if(histogram[1] > 0 && histogram[3] > 0) {
				state.doNextChew(chewTile, num-1, num+1, myTurn);
				return true;
			}
			if(histogram[3] > 0 && histogram[4] > 0) {
				state.doNextChew(chewTile, num+1, num+2, myTurn);
				return true;
			}
			return false;
		}
		agent.doPong = function(){
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
				var s = state.getScore(tile, myTurn, 5, 3, 1);
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
