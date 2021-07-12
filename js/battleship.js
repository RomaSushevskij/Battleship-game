//Объект представления (вывод сообщений и обновление изображений промаха или попадания)
var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

//Объект модели для хранения состояния игры 
var model = {
	boardSize: 7, //размер сетки
	numShips: 3, //количество кораблей
	shipsLength: 3, //длина кораблей
	shipsSunk: 0, //количество потопленных кораблей
	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
	],
	//Метод создания массива со случайными позициями корабля
	generationShip: function() {
		var direction = Math.floor(Math.random() * 2); //Определение направления корабля (1 - гориз., 0 - вертик.)
		var row;
		var col;
		//Определение начальной позиции корабля в зависимости от направления его расположения
		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipsLength + 1));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipsLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		};

		//Создание массива позиций нового корабля
		var newShipLocations = [];
		for (var i = 0; i < this.shipsLength; i += 1) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + 1) + "" + col)
			}
		}
		return newShipLocations;
	},
	//метод проверки результата выстрела
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i += 1) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if(index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("Попадание!");
				
				if (this.isSunk(ship)) {
					view.displayMessage("Вы потопили корабль!");
					this.shipsSunk += 1;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Вы промазали");
		return false;
	},
	//метод проверки потопления коробля
	isSunk: function(ship) {	
		for (var i = 0; i < this.shipsLength; i += 1) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	}
};

//Функция преобразования введенных пользователем координат из типа "А0" в тип "00"
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	
	if (guess === null || guess.length !== 2) {
			alert("Пожалуйста, введите букву и номер ячейки игрового поля в формате 'A0'");
		} else {
			var firstChar = guess.charAt(0);
			var row = alphabet.indexOf(firstChar);
			var column = guess.charAt(1);
			
			if (isNaN(row) || isNaN(column)) {
				alert("К сожалению такой координаты не существует");
			} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
				alert("К сожалению такой координаты не существует");
				} else {
					return row + column;
				}
		}
		return null;
};

//Объект контроллера (получение и обработка координат выстрела, отслеживание количества выстрелов, запрос к модели на обновление в соответствии с последним выстрелом, проверка завершения игры)

var controller = {
	guesses: 0,
	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses += 1;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Вы потопили все корабли за " + this.guesses + " выстрелов");
			}
		}
	}
};

//Обработчик события для получения координат от формы и передачи их контроллеру
function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = hundleKeyPress;
};

//Обработчик события при нажантии по кнопке "Огонь!"
function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
};

//Обработчик события при нажантии по кнопке Enter
function hundleKeyPress(event) {
	var fireButton = document.getElementById("fireButton");
	if (event.keyCode === 13) {
		fireButton.click();
		return false;
	}
};


window.onload = init;




























