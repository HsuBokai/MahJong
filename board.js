var Board = {
	createNew: function(context){
		var board = {};
		var tileSize = 30;
		var winds = ["A","B","C","D"];
		var dragons = ["X","Y","Z"];
		var width = 600;
		var height = 500;
		var centerX = 0;
		var centerY = 0;
		function drawTile(tile,x,y){
			context.rect(x,y,tileSize,tileSize);
			context.strokeStyle = "black";
			context.stroke();
			
			var text;
			switch(tile[0]){
				case "winds": text = winds[ tile[1] ]; break;
				case "dragons": text = dragons[ tile[1] ]; break;
				case "bamboos": text = (tile[1] + 1) + 10; break;
				case "stones": text = (tile[1] + 1) + 20; break;
				case "characters": text = (tile[1] + 1) + 30; break;
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
			var len = tileSize*16;
			switch(turn){
				case 0:
					var left_ = 60;
					var top_ = height-50;
					drawRect(left_ ,top_ , len, tileSize);
					for(var i=0; i<16; ++i) drawTile(tiles[0][i], i*tileSize + left_, top_);
					break;
				case 1:
					var left_ = width-50;
					var top_ = 10;
					drawRect(left_ ,top_ , tileSize, len);
					for(var i=0; i<16; ++i) drawTile(tiles[1][i], left_, i*tileSize + top_);
					break;
				case 2:
					var left_ = 60;
					var top_ = 20;
					drawRect(left_ ,top_ , len, tileSize);
					for(var i=0; i<16; ++i) drawTile(tiles[2][i], i*tileSize + left_, top_);
					break;
				case 3:
					var left_ = 20;
					var top_ = 10;
					drawRect(left_ ,top_ , tileSize, len);
					for(var i=0; i<16; ++i) drawTile(tiles[3][i], left_, i*tileSize + top_);
					break;
			}
		}
		board.init = function(state){
			drawRect(0,0,width,height);
			var tiles = state.getTiles();
			drawPlayer(tiles,0);
			drawPlayer(tiles,1);
			drawPlayer(tiles,2);
			drawPlayer(tiles,3);
		}
		board.pickUp = function(tile, turn){
			switch(turn){
				case 0: drawTile(tile, 300, 400); break;
				case 1: drawTile(tile, 500, 250); break;
				case 2: drawTile(tile, 300, 100); break;
				case 3: drawTile(tile, 100, 250); break;
				default: console.log("board.pickUp error");
			}
		}
		board.discard = function(tile, turn, state){
			drawTile(tile, 150 + centerX * tileSize, 150 + centerY * tileSize);
			++centerX;
			if(centerX==10){
				centerX = 0;
				++centerY;
			}
			var size = tileSize;
			switch(turn){
				case 0: drawRect(300, 400, size, size); break;
				case 1: drawRect(500, 250, size, size); break;
				case 2: drawRect(300, 100, size, size); break;
				case 3: drawRect(100, 250, size, size); break;
				default: console.log("board.discard error");
			}
			var tiles = state.getTiles();
			drawPlayer(tiles,turn);
		}
		board.isInBoard = function(xx,yy){
			return 0<=xx && xx<width && 0<=yy && yy<height;
		}
		return board;
	}
}



