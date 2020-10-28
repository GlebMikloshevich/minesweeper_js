class Tile{
	value = 0;
	isFlag = false;
	isOpen = false;
	isBomb = false;
}


class Game{
	starGame = true;
	isDead = false;
	gameWon = false;
	gameStart = false;
	time = 0;
	timerId = 0;

	constructor(x, y, bombs){
        this.x = x;
        this.y = y;
        this.bombs = bombs;
        this.bomb_counter = bombs;
        this.tiles_to_open = x*y-bombs;
        this.generate_field();
        
        //this.set_weights();
	}


	//генерация поля
	generate_field(){
		this.field = []
		for (let i = 0; i < this.x; i++){
			this.field.push([]);
		for (let j = 0; j < this.y; j++){
				this.field[i].push(new Tile());
				//window.console.log(i, j);
			}
		}	

		//первичная отрисова
		
		let wrapper = document.getElementsByClassName("game-wrapper")[0];
		wrapper.innerHTML="";
		//очистить wrapper
		for (let i = 0; i < this.x; i++){
			let row = document.createElement('div');
			row.className = "field-row";
			for (let i = 0; i < this.y; i++)
				row.innerHTML += "<div class=\"field-cell\"> </div>";
			wrapper.appendChild(row);
        }
        this.update_counter();


    }

    generate_bombs(x, y){
    	let free_tiles = 0;
		//массив для поиска бомб
		let tempArray = new Array();
		for (let i = 0; i < this.x; i++)
			for (let j = 0; j < this.y; j++){
				//console.log(i, j);
				if ((Math.abs(x-i) <= 1 && Math.abs(y-j) <= 1)){
					free_tiles += 1;	
				}
				else{
					tempArray.push([i, j]);
				}
			}
       
		//генерация бомб
		for (let i = 0; i < this.bombs; i++){
			let bomb_index = Math.floor(Math.random() * (this.x*this.y-2-i- free_tiles)); 
			let bomb_x = tempArray[bomb_index][0]; 
			
			let bomb_y = tempArray[bomb_index][1];
			//console.log("bomb index is", tempArray[bomb_index]);
			this.field[bomb_x][bomb_y].isBomb = true;
			tempArray.splice(bomb_index, 1)
        }
        this.gameStart = true;

	}


	paint(){
		let div = document.getElementsByClassName("field-cell");

		for (let i = 0; i < div.length; i++){
			div[i].innerHTML = "";
			//window.console.log(div[i]);
			let x = Math.floor((i) /this.x);
			let y = (i) % this.x;
			//console.log(x, y);
			//paint
			if (this.field[x][y].isOpen){
				div[i].style.borderStyle="solid";
				div[i].style.borderColor="grey";
				div[i].style.borderWidth="1px";


			}
			if (this.field[x][y].isFlag && this.field[x][y].isBomb && this.isDead){
				div[i].innerHTML = "<img class =\"bomb-flag\" src=\"./img/bomb.png\"> <img class =\"flag\" src=\"./img/flag.png\">";
				console.log(div[i].innerHTML);
			} else if (this.field[x][y].isFlag){
				div[i].innerHTML = "<img src=\"./img/flag.png\"> ";
			} else if (this.field[x][y].isBomb && this.isDead){
				div[i].innerHTML = "<img src=\"./img/bomb.png\"> ";
			} else if (this.field[x][y].isOpen && this.field[x][y].value != 0){
				div[i].innerHTML = this.field[x][y].value;
				div[i].borderStyle="solid";
				switch (this.field[x][y].value){
					case 1:
						div[i].style.color="blue";
					break;
					case 2:
						div[i].style.color="green";
					break;
					case 3:
						div[i].style.color="red";
					break;
					case 4:
						div[i].style.color="#00008b";
					break;
					case 5:
						div[i].style.color="#8b0000 ";
					break;
					case 6:
						div[i].style.color="purple";
					break;
					case 7:
						div[i].style.color="brown";
					break;
					case 8:
						div[i].style.color="yellow";
					break;
				}
			} 
			


		}

	}

	set_weights(){
		for (let i = 0; i < this.x; i++){
			for (let j = 0; j < this.y; j++){
				let weight = 0;
				//крайнее левое положение
				if (i != 0)
					if (this.field[i-1][j].isBomb)
						weight += 1;
				//крайнее правое
				if (i != this.x-1)
					if (this.field[i+1][j].isBomb)
						weight += 1;
				//крайнее верхнее
				if (j != 0)
					if (this.field[i][j-1].isBomb)
						weight += 1;
				//крайнее нижнее
				if (j != this.y-1)
					if (this.field[i][j+1].isBomb)
						weight += 1;
				//верхнее левое
				if (i != 0 && j != 0)
					if (this.field[i-1][j-1].isBomb)
						weight += 1;
				//верхнее правое
				if (i != this.x-1 && j != 0)
					if (this.field[i+1][j-1].isBomb)
						weight += 1;
				//нижнее правое
				if (i != this.x-1 && j != this.y-1)
					if (this.field[i+1][j+1].isBomb)
						weight += 1;
				//нижнее левое
				if (i != 0 && j != this.y-1)
					if (this.field[i-1][j+1].isBomb)
						weight += 1;
				this.field[i][j].value = weight;
			}
		}
	}

	game_won(){
		if (!this.gameWon){

			let div = document.getElementsByClassName("victory")[0];
			div.style.display="block";
			this.delete_timer();
			this.gameWon = true;
		}
	}
	game_lost(){
			let div = document.getElementsByClassName("defeat")[0];
			div.style.display="block";
			this.delete_timer();
			this.draw_field();
	}

	delete_timer(){
		clearInterval(this.timerId);
	}

	print(){
		for (let i = 0; i < this.x; i++)
			for (let  j = 0; j < this.y; j++)
			{
				window.console.log(i, j, this.field[i][j], ' ');
			}
	}

	draw_field(){
		return 0; //todo
	}
	update_counter(){
		let bomb_div = document.getElementsByClassName("bombs")[0];
		bomb_div.innerHTML = this.bomb_counter;
	}

	open_tile(i, j){

		if (this.starGame){
			this.generate_bombs(i, j);
			this.set_weights();
			let timeDiv = document.getElementsByClassName("time")[0];
			timeDiv.innerHTML = "0";
			let chb = document.getElementsByClassName("no-flag")[0];
			this.noFlag = chb.checked;
			this.timerId = setInterval(() => game_set_time(), 1000);
			this.starGame = false;
		}

		if (this.gameWon){
			this.game_won();
			return 0;
		}

		if (this.field[i][j].isFlag)
			return 0;

		if (this.field[i][j].isBomb && !this.isDead){
			this.field[i][j].isOpen = true;
			this.isDead = true;
		}

		if (this.isDead){
			this.paint();
			this.game_lost();
			return 0;
		}

		if (!this.field[i][j].isOpen)
			this.tiles_to_open -= 1;
		

		this.field[i][j].isOpen = true;
			//крайнее левое положение
		if (this.field[i][j].value == 0 && !this.field[i][j].isBomb && this.field[i][j].isOpen){
			//console.log('x', this.x, 'j', j);
			//console.log('y', this.y, 'i', i)
			if (i != 0)
				if (!(this.field[i-1][j].isBomb || this.field[i-1][j].isOpen))
					this.open_tile(i-1, j)
					//крайнее правое
			if (i != this.x-1)
				if (!(this.field[i+1][j].isBomb || this.field[i+1][j].isOpen))
					this.open_tile(i+1, j)
					//крайнее верхнее
			if (j != 0)
				if (!(this.field[i][j-1].isBomb || this.field[i][j-1].isOpen))
					this.open_tile(i, j-1)
					//крайнее нижнее
			if (j != this.y-1)
				if (!(this.field[i][j+1].isBomb || this.field[i][j+1].isOpen))
					this.open_tile(i, j+1)
					//верхнее левое
			if (i != 0 && j != 0)
				if (!(this.field[i-1][j-1].isBomb || this.field[i-1][j-1].isOpen))
					this.open_tile(i-1, j-1)
					//верхнее правое
			if (i != this.x-1 && j != 0)
				if (!(this.field[i+1][j-1].isBomb || this.field[i+1][j-1].isOpen))
					this.open_tile(i+1, j-1)
					//нижнее правое
			if (i != this.x-1 && j != this.y-1)
				if (!(this.field[i+1][j+1].isBomb || this.field[i+1][j+1].isOpen))
					this.open_tile(i+1, j+1)
					//нижнее левое
			if (i != 0 && j != this.y-1)
				if (!(this.field[i-1][j+1].isBomb || this.field[i-1][j+1].isOpen))
					this.open_tile(i-1, j+1)
		}
		this.paint();
		if (this.tiles_to_open == 0){
			this.game_won();
		}
	}
	open_around(i, j){
		//крайнее левое положение
		if (i != 0)
			this.open_tile(i-1, j)
		//крайнее правое
		if (i != this.x-1)
			this.open_tile(i+1, j)
		//крайнее верхнее
		if (j != 0)
			this.open_tile(i, j-1)
		//крайнее нижнее
		if (j != this.y-1)
			this.open_tile(i, j+1)
		//верхнее левое
		if (i != 0 && j != 0)
			this.open_tile(i-1, j-1)
		//верхнее правое
		if (i != this.x-1 && j != 0)
			this.open_tile(i+1, j-1)
		//нижнее правое
		if (i != this.x-1 && j != this.y-1)
			this.open_tile(i+1, j+1)
		//нижнее левое
		if (i != 0 && j != this.y-1)
			this.open_tile(i-1, j+1)

		this.paint();
		if (this.tiles_to_open == 0){
			this.game_won();
		}
	}

	set_flag(x, y){
		if (this.gameWon || !this.gameStart || this.noFlag){
			//console.log("game is won");
			return 0;
		}
		console.log(x, y);
		if (!this.field[x][y].isOpen && !this.isDead){
			if (this.field[x][y].isFlag){
				this.bomb_counter += 1;
				this.field[x][y].isFlag = false;
				//console.log("flag was set");
			} else {
				this.bomb_counter -= 1;
				this.field[x][y].isFlag = true;
			}
		}
		this.paint();
		this.update_counter();
	}

	count_bombs_and_flags(i, j){
		let bombs = this.field[i][j].value;

		if (i != 0)
				if (this.field[i-1][j].isFlag)
					bombs -= 1;
					//крайнее правое
			if (i != this.x-1)
				if (this.field[i+1][j].isFlag)
					bombs -= 1;
					//крайнее верхнее
			if (j != 0)
				if (this.field[i][j-1].isFlag)
					bombs -= 1;
					//крайнее нижнее
			if (j != this.y-1)
				if (this.field[i][j+1].isFlag)
					bombs -= 1;
					//верхнее левое
			if (i != 0 && j != 0)
				if (this.field[i-1][j-1].isFlag)
					bombs -= 1;
					//верхнее правое
			if (i != this.x-1 && j != 0)
				if (this.field[i+1][j-1].isFlag)
					bombs -= 1;
					//нижнее правое
			if (i != this.x-1 && j != this.y-1)
				if (this.field[i+1][j+1].isFlag)
					bombs -= 1;
					//нижнее левое
			if (i != 0 && j != this.y-1)
				if (this.field[i-1][j+1].isFlag)
					bombs -= 1;

		return bombs;
	}
};


var a = new Game(16, 16, 40);


var game_wr = document.getElementsByClassName("game-wrapper")[0];
game_wr.addEventListener("mouseup", (e) => {
		if (e.which === 1 && e.target.className == "field-cell"){ //лкм
		    for (let i = 0; i < e.target.parentNode.parentNode.childNodes.length; i++)
		    	if (e.target.parentNode == e.target.parentNode.parentNode.childNodes[i])
		    		var x = i; //строка от (1 до this.x)
		    for (let i = 0; i < e.target.parentNode.childNodes.length; i++)
		    	if (e.target == e.target.parentNode.childNodes[i])
		    		var y = i;

		    a.open_tile(x, y); //field - экземпляр класса Game
			//console.log("row ", x, "\n column ", y);
		}
		
});
	//двойной клик по клетке, чтобы открыть все вокруг.
game_wr.addEventListener("dblclick", (e) =>{ 
		for (let i = 0; i < e.target.parentNode.parentNode.childNodes.length; i++)
		    	if (e.target.parentNode == e.target.parentNode.parentNode.childNodes[i])
		    		var x = i; //строка от (1 до this.x)
		for (let i = 0; i < e.target.parentNode.childNodes.length; i++)
		    if (e.target == e.target.parentNode.childNodes[i])
		    	var y = i;

		if (a.count_bombs_and_flags(x, y) == 0)
			a.open_around(x, y);
		
});

game_wr.oncontextmenu = (function(e){
	e.preventDefault();
	//console.log(e.target.tagName);
	//console.log(e.target);
	//console.log(e.target.parentNode);
	//console.log(e.target.parentNode.parentNode);
	//console.log(e.target.parentNode.parentNode.parentNode);

	if (e.target.tagName === "IMG"){
		for (let i = 0; i < e.target.parentNode.parentNode.parentNode.childNodes.length; i++)
		    	if (e.target.parentNode.parentNode == e.target.parentNode.parentNode.parentNode.childNodes[i])
		    		var x = i; //строка от (1 до this.x)
		    for (let i = 0; i < e.target.parentNode.parentNode.childNodes.length; i++)
		    	if (e.target.parentNode == e.target.parentNode.parentNode.childNodes[i])
		    		var y = i;
		//console.log("flag to", x, y);
	} else {
	   for (let i = 0; i < e.target.parentNode.parentNode.childNodes.length; i++)
		    	if (e.target.parentNode == e.target.parentNode.parentNode.childNodes[i])
		    		var x = i; //строка от (1 до this.x)
		    for (let i = 0; i < e.target.parentNode.childNodes.length; i++)
		    	if (e.target == e.target.parentNode.childNodes[i])
		    		var y = i;
		//console.log("flag to", x, y);
	}
		a.set_flag(x, y);
});

function hide(){
	let div =document.getElementsByClassName("victory");
	div[0].style.display = "none";
	div =document.getElementsByClassName("defeat");
	div[0].style.display = "none";
}

document.addEventListener("load", remake());

//new Game(3, 3, 1)
function remake(){
	hide();
	radio = document.getElementsByName("difficulty");
	a.delete_timer();
		//a = new Game(10, 4, 4);
	div = getStyleSheet("field-cell");
	if (radio[0].checked){
		a = new Game(8, 8, 15);
	} else if (radio[1].checked){
		a = new Game(16, 16, 40);
	} else {
		a = new Game(20, 20, 90);
	}
}

function getStyleSheet(unique_title) {
  for(var i=0; i<document.styleSheets.length; i++) {
    var sheet = document.styleSheets[i];
    if(sheet.title == unique_title) {
      return sheet;
    }
  }
}

//счетчик времени


function game_set_time(){
	let timeDiv = document.getElementsByClassName("time")[0];
	let time = Number(timeDiv.innerHTML);
	if (time < 999) 
		timeDiv.innerHTML = Number(timeDiv.innerHTML) + 1;
}