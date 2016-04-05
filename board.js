var Board = {
	createNew: function(context){
		var board = {};
		var tileSize = 30;
		var winds = ["A","B","C","D"];
		var dragons = ["X","Y","Z"];
		var width = 600;
		var height = 500;
		var centerX;
		var centerY;

		var pick02x;
		var pick0y;
		var pick1x;
		var pick13y;
		var pick2y;
		var pick3x;
		var playerHand = [[60,height-50],[width-50,10],[60,20],[20,10]];
		function drawTile(tile,x,y){
			context.fillStyle = (tile[3]) ? "green" : "white";
			context.fillRect(x+1,y+1,tileSize-2,tileSize-2);
			
			context.rect(x,y,tileSize,tileSize);
			context.strokeStyle = "black";
			context.stroke();
			
			var text;
			switch(tile[0]){
				case "winds": text = winds[ tile[1] ]; break;
				case "dragons": text = dragons[ tile[1] ]; break;
				case "bamboos": text = (tile[1] + 1) + 10; break;
				case "stones": text = (tile[1] + 1); break;
				case "characters": text = (tile[1] + 1) + 20; break;
				default: console.log("drawTile error!");
			}
			context.fillStyle = "black";
			context.font = "18pt Arial";
			context.fillText(text,x+3,y+tileSize-3);
		}
		function drawRect(x,y,w,h){
			context.fillStyle = "green";
			context.fillRect(x,y,w,h);
		}
		function drawPlayer(tiles, turn){
			var len = tileSize * 16;
			var left_ = playerHand[turn][0];
			var top_ = playerHand[turn][1];
			switch(turn){
				case 0:
				case 2:
					drawRect(left_ ,top_ , len, tileSize);
					for(var i=0; i<16; ++i) drawTile(tiles[turn][i], i*tileSize + left_, top_);
					break;
				case 1:
				case 3:
					drawRect(left_ ,top_ , tileSize, len);
					for(var i=0; i<16; ++i) drawTile(tiles[turn][i], left_, i*tileSize + top_);
					break;
			}
		}
		function cleanTile(turn){
			var size = tileSize;
			switch(turn){
				case 0: drawRect(pick02x, pick0y, size, size); break;
				case 1: drawRect(pick1x, pick13y, size, size); break;
				case 2: drawRect(pick02x, pick2y, size, size); break;
				case 3: drawRect(pick3x, pick13y, size, size); break;
				default: console.log("cleanTile error");
			}
		}
		board.init = function(state){
			centerX = 0;
			centerY = 0;
			
			pick02x = 300;
			pick0y = 400;
			pick1x = 500;
			pick13y = 250;
			pick2y = 100;
			pick3x = 100;

			drawRect(0,0,width,height);
			var tiles = state.getTiles(true);
			drawPlayer(tiles,0);
			drawPlayer(tiles,1);
			drawPlayer(tiles,2);
			drawPlayer(tiles,3);
		}
		board.pickUp = function(tile, turn){
			switch(turn){
				case 0: drawTile(tile, pick02x, pick0y); break;
				case 1: drawTile(tile, pick1x, pick13y); break;
				case 2: drawTile(tile, pick02x, pick2y); break;
				case 3: drawTile(tile, pick3x, pick13y); break;
				default: console.log("board.pickUp error");
			}
		}
		board.change = function(tile, turnFrom, turnTo){
			cleanTile(turnFrom);
			board.pickUp(tile, turnTo);
		}
		board.replace = function(tile, turn, state){
			cleanTile(turn);
			board.pickUp(tile, turn);
			var tiles = state.getTiles(true);
			drawPlayer(tiles, turn);
		}
		board.discard = function(tile, turn){
			cleanTile(turn);
			drawTile(tile, 150 + centerX * tileSize, 150 + centerY * tileSize);
			++centerX;
			if(centerX==10){
				centerX = 0;
				++centerY;
			}
		}
		board.kong = function(tile, turn){
			cleanTile(turn);
			switch(turn){
				case 0: drawTile(tile, pick02x + tileSize, pick0y); break;
				case 1: drawTile(tile, pick1x, pick13y + tileSize); break;
				case 2: drawTile(tile, pick02x + tileSize, pick2y); break;
				case 3: drawTile(tile, pick3x, pick13y + tileSize); break;
				default: console.log("board.pickUp error");
			}
		}
		board.isInBoard = function(xx,yy){
			return 0<=xx && xx<width && 0<=yy && yy<height;
		}
		board.clickTile = function(x,y){
			function isInTile(l,t){
				var diffx = x-l;
				var diffy = y-t;
				return 0 <=  diffx && diffx < tileSize && 0 <= diffy && diffy < tileSize;
			}
			if(isInTile(pick02x, pick0y)) return [0,16];
			if(isInTile(pick1x, pick13y)) return [1,16];
			if(isInTile(pick02x, pick2y)) return [2,16];
			if(isInTile(pick3x, pick13y)) return [3,16];
			var left_ = playerHand[0][0];
			var top_ = playerHand[0][1];
			for(var i=0; i<16; ++i) if(isInTile(i*tileSize + left_, top_)) return [0,i];
			left_ = playerHand[1][0];
			top_ = playerHand[1][1];
			for(var i=0; i<16; ++i) if(isInTile(left_, i*tileSize + top_)) return [1,i];
			left_ = playerHand[2][0];
			top_ = playerHand[2][1];
			for(var i=0; i<16; ++i) if(isInTile(i*tileSize + left_, top_)) return [2,i];
			left_ = playerHand[3][0];
			top_ = playerHand[3][1];
			for(var i=0; i<16; ++i) if(isInTile(left_, i*tileSize + top_)) return [3,i];
			return [-1,-1];
		}
		return board;
	}
}



