
var ReflexAgent = {
	createNew: function(state, myTurn){
		var agent = {};
		agent.doChew = function(){
			return true;
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
			var tiles = state.getTiles();
			var myTiles = tiles[myTurn];
			console.log(myTiles.length);
			var minScore = 9999;
			var i=17;
			while(i--){
			//for(var i=0; i<17; ++i) { 
				var tile = myTiles[i];
				var s = state.getScore(tile, myTurn);
				//console.log(tile,s);
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
