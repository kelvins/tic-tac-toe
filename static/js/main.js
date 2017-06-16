
var positions = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

const nPlayer1 = 1;
const nPlayer2 = 2;

const imgPlayer1 = 'url("static/img/p1.png")';
const imgPlayer2 = 'url("static/img/p2.png")';

var table = document.getElementById("board");
for (var row = 0; row < table.rows.length; row++) {
	for (var col = 0; col < table.rows[row].cells.length; col++) {
		table.rows[row].cells[col].onclick = function () {
			onCellClicked(this);
		};
	}
}

function onCellClicked(tableCell) {
	var content = tableCell.innerHTML.split(",");
	var row = content[0]
	var col = content[1]
	if (positions[row][col] == 0) {
		tableCell.style.backgroundImage = imgPlayer1;
		positions[row][col] = nPlayer1
		var winnerNumber = getTheWinner();
		if( winnerNumber != -1 ) {
			showWinner(winnerNumber);
		} else {
			cpuEasy();
		}
	}
}

function randomInt(min, max) {
	return Math.floor((Math.random() * max) + min);
}

function cpuEasy() {
	var row = -1;
	var col = -1;
	var found = false;

	for (var index = 0; index < 5; index++) {
		var r = randomInt(0,2);
		var c = randomInt(0,2);
		if (positions[r][c] == 0) {
			row = r;
			col = c;
			found = true;
			break;
		}
	}

	if (!found) {
		for (var r = 0; r < positions.length; r++) {
			for (var c = 0; c < positions[r].length; c++) {
				if (positions[r][c] == 0) {
					row = r;
					col = c;
					found = true;
					break;
				}
			}
			if (found == true) {
				break;
			}
		}
	}

	if (row < 3 && row >= 0 && col < 3 && col >= 0 ) {
		table.rows[row].cells[col].style.backgroundImage = imgPlayer2;
		positions[row][col] = nPlayer2;
		var winnerNumber = getTheWinner();
		if( winnerNumber != -1 ) {
			showWinner(winnerNumber);
		}
	}
}

function getTheWinner() {
	if (positions[0][0] != 0 && positions[0][0] == positions[0][1] && positions[0][1] == positions[0][2]) { // First row
		return positions[0][0];
	} 
	if (positions[0][0] != 0 && positions[0][0] == positions[1][0] && positions[1][0] == positions[2][0]) { // First column
		return positions[0][0];
	} 
	if (positions[0][0] != 0 && positions[0][0] == positions[1][1] && positions[1][1] == positions[2][2]) { // Main diagonal
		return positions[0][0];
	} 
	if (positions[2][0] != 0 && positions[2][0] == positions[2][1] && positions[2][1] == positions[2][2]) { // Last row
		return positions[2][0];
	} 
	if (positions[0][2] != 0 && positions[0][2] == positions[1][2] && positions[1][2] == positions[2][2]) { // Last column
		return positions[0][2];
	} 
	if (positions[1][0] != 0 && positions[1][0] == positions[1][1] && positions[1][1] == positions[1][2]) { // Middle row
		return positions[1][0];
	} 
	if (positions[2][0] != 0 && positions[2][0] == positions[1][1] && positions[1][1] == positions[0][2]) { // Second diagonal
		return positions[2][0];
	} 
	if (positions[0][1] != 0 && positions[0][1] == positions[1][1] && positions[1][1] == positions[2][1]) { // Middle column
		return positions[0][1];
	}

	for (var row = 0; row < positions.length; row++) {
		for (var col = 0; col < positions[row].length; col++) {
			if (positions[row][col] == 0) {
				return -1;
			}
		}
	}
	
	return 0;
}

function showWinner(winnerNumber) {
	if (winnerNumber == nPlayer1) {
		alert("Player 1 WIN!");
	} else if (winnerNumber == nPlayer2) {
		alert("Player 2 WIN!");
	} else if (winnerNumber == 0) {
		alert("TIE!");
	}
	reset();
}

function reset() {
	positions = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	for (var row = 0; row < table.rows.length; row++) {
		for (var col = 0; col < table.rows[row].cells.length; col++) {
			table.rows[row].cells[col].style.backgroundImage = '';
		}
	}
}
