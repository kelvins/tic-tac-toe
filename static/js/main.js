
// ####################################################
// Define some global variables and constants
// Note: As we are providing the option to only play
// versus robot the player2 will be always the robot
// ####################################################

// Multidimensional array used to store the positions already selected
var positions = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

// Flag used to know when the game is finished
var gameFinished = false;

// The number to be used for the players
const nPlayer1 = 1;
const nPlayer2 = 2;

// Store the score of each player
var scorePlayer1 = 0;
var scorePlayer2 = 0;

var startingPlayer = nPlayer1;

// The path for the image for the players
const imgPlayer1 = 'url("static/img/p1.png")';
const imgPlayer2 = 'url("static/img/p2.png")';

var board = document.getElementById("board");
var scoreboard = document.getElementById("scoreboard");
var winnerMessageBox = document.getElementById("winnerMessageBox");
var playAgainButton  = document.getElementById("playAgainButton");
var selectDifficulty = document.getElementById("difficulty-select");

// Get the default selected difficulty
var difficulty = selectDifficulty.options[selectDifficulty.selectedIndex].value;

// Get the number of rows and columns from the board (table)
const rows = board.rows.length;
const cols = board.rows[0].cells.length;

// Register the onClick function for each cell in the table (board)
for (var row = 0; row < rows; row++) {
	for (var col = 0; col < cols; col++) {
		board.rows[row].cells[col].onclick = function () {
			onCellClicked(this);
		};
	}
}

// Function called when the user clicks on a cell in the table
function onCellClicked(tableCell) {
	if (gameFinished) {
		return;
	}
	if(selectDifficulty.disabled == false ) {
		difficulty = selectDifficulty.options[selectDifficulty.selectedIndex].value;
		selectDifficulty.disabled = true;
	}
	// Get the cell content and split it
	var content = tableCell.innerHTML.split(",");
	// Get the row and column numbers
	var row = content[0]
	var col = content[1]
	// If the position is still valid
	if (positions[row][col] == 0) {
		// Set the image
		tableCell.style.backgroundImage = imgPlayer1;
		// Register the selected position
		positions[row][col] = nPlayer1
		// Check if there is a winner already
		var winnerNumber = getTheWinner();
		if( winnerNumber != -1 ) {
			// If there is a winner show the winner message
			showWinner(winnerNumber);
		} else {
			robotTurn();
		}
	}
}

// Generate a random integer
function randomInt(min, max) {
	return Math.floor((Math.random() * max) + min);
}

// ####################################################
// Functions that make the robot play
// ####################################################

// Check the selected difficulty level and calls the correct function
function robotTurn() {
	if (difficulty == "easy") {
		robotEasy();
	} else if (difficulty == "hard") {
		robotHard();
	} else {
		robotNormal();
	}
}

// Register the row and column selected by the robot
// Load the board image and set the position into the positions 'matrix'
function makeRobotPlay(row, col) {
	if (row >= 0 && row < rows) {
		if (col >= 0 && col < cols) {
			// Set the image
			board.rows[row].cells[col].style.backgroundImage = imgPlayer2;
			// Register the selected position
			positions[row][col] = nPlayer2;
			// Check if there is a winner already
			var winnerNumber = getTheWinner();
			if( winnerNumber != -1 ) {
				showWinner(winnerNumber);
			}
		}
	}
}

// Robot easy - Pick a random position
function robotEasy() {
	if (gameFinished) {
		return;
	}
	var row = -1;
	var col = -1;
	var found = false;

	// Try a random position
	for (var index = 0; index < 10; index++) {
		var r = randomInt(0,2);
		var c = randomInt(0,2);
		if (positions[r][c] == 0) {
			row = r;
			col = c;
			found = true;
			break;
		}
	}

	// If could not find a valid random position get the first valid position from the table
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

	// If the position is valid
	if (found) {
		makeRobotPlay(row, col);
	}
}

// Robot normal - Try to finish the game or block the other player
// If there is no way to do this just pick a random position
function robotNormal() {
	if (gameFinished) {
		return;
	}
	var row = -1;
	var col = -1;
	var found = false;
	// Check all rows
	for (var r = 0; r < positions.length; r++) {
		if (positions[r][0] != 0 &&
			positions[r][2] == 0 &&
			positions[r][0] == positions[r][1]) {
			row = r;
			col = 2;
			found = true;
			break;
		}
		if (positions[r][1] != 0 &&
			positions[r][0] == 0 &&
			positions[r][1] == positions[r][2]) {
			row = r;
			col = 0;
			found = true;
			break;
		}
		if (positions[r][0] != 0 &&
			positions[r][1] == 0 &&
			positions[r][0] == positions[r][2]) {
			row = r;
			col = 1;
			found = true;
			break;
		}
	}
	// Check all columns
	if (!found) {
		for (var c = 0; c < positions[0].length; c++) {
			if (positions[0][c] != 0 &&
				positions[2][c] == 0 &&
				positions[0][c] == positions[1][c]) {
				row = 2;
				col = c;
				found = true;
				break;
			}
			if (positions[1][c] != 0 && 
				positions[0][c] == 0 &&
				positions[1][c] == positions[2][c]) {
				row = 0;
				col = c;
				found = true;
				break;
			}
			if (positions[0][c] != 0 &&
				positions[1][c] == 0 &&
				positions[0][c] == positions[2][c]) {
				row = 1;
				col = c;
				found = true;
				break;
			}
		}
	}
	if (!found) {
		if (positions[0][0] != 0 &&
			positions[2][2] == 0 &&
			positions[0][0] == positions[1][1]) {
			row = 2;
			col = 2;
			found = true;
		} else if (positions[0][0] != 0 &&
				   positions[1][1] == 0 &&
				   positions[0][0] == positions[2][2]) {
			row = 1;
			col = 1;
			found = true;
		} else if (positions[1][1] != 0 &&
				   positions[0][0] == 0 &&
				   positions[1][1] == positions[2][2]) {
			row = 0;
			col = 0;
			found = true;
		} else if (positions[0][2] != 0 &&
				   positions[2][0] == 0 &&
				   positions[0][2] == positions[1][1]) {
			row = 2;
			col = 0;
			found = true;
		} else if (positions[0][2] != 0 &&
				   positions[1][1] == 0 &&
				   positions[0][2] == positions[2][0]) {
			row = 1;
			col = 1;
			found = true;
		} else if (positions[1][1] != 0 &&
				   positions[0][2] == 0 &&
				   positions[1][1] == positions[2][0]) {
			row = 0;
			col = 2;
			found = true;
		}
	}
	if (!found) {
		robotEasy();
	} else if (found) {
		makeRobotPlay(row, col);
	}
}

// Robot hard
function robotHard() {
	robotNormal();
}

// ######################################################
// Check if there is a winner
// Check all possible moves (rows, columns and diagonals)
// ######################################################

// Check if the row passed by parameter is completely filled with valid values (!= 0)
function isRowFilled(row) {
	if (positions[row][0] != 0 && 
		positions[row][0] == positions[row][1] && 
		positions[row][1] == positions[row][2]) {
		return true;
	}
	return false;
}

// Check if the column passed by parameter is completely filled with valid values (!= 0)
function isColumnFilled(col) {
	if (positions[0][col] != 0 &&
		positions[0][col] == positions[1][col] &&
		positions[1][col] == positions[2][col]) {
		return true;
	}
	return false;
}

// Check if the diagonal (0 - main, 2 - secondary) passed by parameter is completely filled with valid values (!= 0)
function isDiagonalFilled(diag) {
	if (diag == 1) {
		if (positions[0][0] != 0 &&
			positions[0][0] == positions[1][1] &&
			positions[1][1] == positions[2][2]) { // Main diagonal
			return true;
		}
	} else if (diag == 2) {
		if (positions[2][0] != 0 &&
			positions[2][0] == positions[1][1] &&
			positions[1][1] == positions[0][2]) { // Secondary diagonal
			return true;
		}
	}
	return false;
}

// Check all valid positions combinations and return the number of the winner
// Return 0 if there was a draw. Return -1 if the game has not finished.
function getTheWinner() {
	if (isRowFilled(0)) { // First row
		applyOpacityRow(0);
		return positions[0][0];
	} 
	if (isRowFilled(1)) { // Middle row
		applyOpacityRow(1);
		return positions[1][0];
	} 
	if (isRowFilled(2)) { // Last row
		applyOpacityRow(2);
		return positions[2][0];
	} 
	if (isColumnFilled(0)) { // First column
		applyOpacityColumn(0);
		return positions[0][0];
	} 
	if (isColumnFilled(1)) { // Middle column
		applyOpacityColumn(1);
		return positions[0][1];
	}
	if (isColumnFilled(2)) { // Last column
		applyOpacityColumn(2);
		return positions[0][2];
	} 
	if (isDiagonalFilled(1)) { // Main diagonal
		applyOpacityDiagonal(1);
		return positions[0][0];
	} 
	if (isDiagonalFilled(2)) { // Secondary diagonal
		applyOpacityDiagonal(2);
		return positions[2][0];
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

// Apply an opacity value to all cells in the board (table)
function applyOpacity() {
	for (var row = 0; row < rows; row++) {
		for (var col = 0; col < cols; col++) {
			board.rows[row].cells[col].style.opacity = 0.5;
		}
	}
}

// Remove opacity from the selected row
function applyOpacityRow(row) {
	applyOpacity();
	for (var col = 0; col < cols; col++) {
		board.rows[row].cells[col].style.opacity = 1.0;
	}
}

// Remove opacity from the selected col
function applyOpacityColumn(col) {
	applyOpacity();
	for (var row = 0; row < rows; row++) {
		board.rows[row].cells[col].style.opacity = 1.0;
	}
}

// Remove opacity from the selected diagonal
function applyOpacityDiagonal(diag) {
	applyOpacity();
	if (diag == 1) {
		board.rows[0].cells[0].style.opacity = 1.0;
		board.rows[1].cells[1].style.opacity = 1.0;
		board.rows[2].cells[2].style.opacity = 1.0;
	} else {
		board.rows[0].cells[2].style.opacity = 1.0;
		board.rows[1].cells[1].style.opacity = 1.0;
		board.rows[2].cells[0].style.opacity = 1.0;
	}
}

// Show the winner message
function showWinner(winnerNumber) {
	// Set the gameFinished flag to true (it will block new moves)
	gameFinished = true;
	// Check what player has won, increase the score and set the correct message
	if (winnerNumber == nPlayer1) {
		scorePlayer1 += 1;
		scoreboard.rows[1].cells[0].innerHTML = scorePlayer1;
		winnerMessageBox.innerHTML = "YOU WIN!";
	} else if (winnerNumber == nPlayer2) {
		scorePlayer2 += 1;
		scoreboard.rows[1].cells[1].innerHTML = scorePlayer2;
		winnerMessageBox.innerHTML = "YOU LOSE!";
	} else if (winnerNumber == 0) {
		winnerMessageBox.innerHTML = "DRAW!";
	}
	// Show the winner message box and the play again button
	winnerMessageBox.style.display = 'block';
	playAgainButton.style.display  = 'block';
	selectDifficulty.disabled = false;
}

// Reset the game
function reset() {
	// Reset all positions
	positions = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	// Remove all images and reset the opacity
	for (var row = 0; row < rows; row++) {
		for (var col = 0; col < cols; col++) {
			board.rows[row].cells[col].style.backgroundImage = '';
			board.rows[row].cells[col].style.opacity = 1.0;
		}
	}

	// Remove the winner message box
	winnerMessageBox.innerHTML = "";
	// Hide the winner message box and the play again button
	winnerMessageBox.style.display = 'none';
	playAgainButton.style.display  = 'none';

	// Set the gameFinished flag to false (it is a new game)
	gameFinished = false;

	// Get the selected difficulty
	difficulty = selectDifficulty.options[selectDifficulty.selectedIndex].value;
	selectDifficulty.disabled = true;

	// Set the correct startingPlayer based on the last match 
	if (startingPlayer == nPlayer1) {
		startingPlayer = nPlayer2;
		robotTurn();
	} else {
		startingPlayer = nPlayer1;
	}
}
