
// Multidimensional array used to store the positions already selected
var positions = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

// Note: As we are providing the option to only play
// versus robot the player2 will be always the robot

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
var playAgainButton = document.getElementById("playAgainButton");

// Register the onClick function for each cell in the table (board)
for (var row = 0; row < board.rows.length; row++) {
	for (var col = 0; col < board.rows[row].cells.length; col++) {
		board.rows[row].cells[col].onclick = function () {
			onCellClicked(this);
		};
	}
}

// Function called when the user clicks on a cell in the table
function onCellClicked(tableCell) {
	if (!gameFinished) {
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
			// Get the number of the winner
			var winnerNumber = getTheWinner();
			// If there is a winner show the winner message
			if( winnerNumber != -1 ) {
				showWinner(winnerNumber);
			} else {
				robotEasy();
			}
		}
	}
}

// Generate a random integer
function randomInt(min, max) {
	return Math.floor((Math.random() * max) + min);
}

// Robot easy
function robotEasy() {
	if (!gameFinished) {
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
		if (found == true) {
			// Set the image
			board.rows[row].cells[col].style.backgroundImage = imgPlayer2;
			// Register the selected position
			positions[row][col] = nPlayer2;
			var winnerNumber = getTheWinner();
			if( winnerNumber != -1 ) {
				showWinner(winnerNumber);
			}
		}
	}
}

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

// Check if the diagonal (1 - main, 2 - secondary) passed by parameter is completely filled with valid values (!= 0)
function isDiagonalFilled(diag) {
	if (diag == 1) {
		if (positions[0][0] != 0 && positions[0][0] == positions[1][1] && positions[1][1] == positions[2][2]) { // Main diagonal
			return true;
		}
	} else if (diag == 2) {
		if (positions[2][0] != 0 && positions[2][0] == positions[1][1] && positions[1][1] == positions[0][2]) { // Secondary diagonal
			return true;
		}
	}
	return false;
}

// Check all valid positions combinations and return the number of the winner
// Return 0 if there was a draw. Return -1 if the game has not finished.
function getTheWinner() {
	if (isRowFilled(0)) { // First row
		applyOpacity(0,0,0,1,0,2);
		return positions[0][0];
	} 
	if (isRowFilled(1)) { // Middle row
		applyOpacity(1,0,1,1,1,2);
		return positions[1][0];
	} 
	if (isRowFilled(2)) { // Last row
		applyOpacity(2,0,2,1,2,2);
		return positions[2][0];
	} 
	if (isColumnFilled(0)) { // First column
		applyOpacity(0,0,1,0,2,0);
		return positions[0][0];
	} 
	if (isColumnFilled(1)) { // Middle column
		applyOpacity(0,1,1,1,2,1);
		return positions[0][1];
	}
	if (isColumnFilled(2)) { // Last column
		applyOpacity(0,2,1,2,2,2);
		return positions[0][2];
	} 
	if (isDiagonalFilled(1)) { // Main diagonal
		applyOpacity(0,0,1,1,2,2);
		return positions[0][0];
	} 
	if (isDiagonalFilled(2)) { // Secondary diagonal
		applyOpacity(2,0,1,1,0,2);
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

function applyOpacity(row1, col1, row2, col2, row3, col3) {
	for (var row = 0; row < board.rows.length; row++) {
		for (var col = 0; col < board.rows[row].cells.length; col++) {
			board.rows[row].cells[col].style.opacity = 0.5;
			if ((row == row1 && col == col1) ||
				(row == row2 && col == col2) ||
				(row == row3 && col == col3)) {
				board.rows[row].cells[col].style.opacity = 1.0;
			}
		}
	}
}

// Show the winner message
function showWinner(winnerNumber) {
	gameFinished = true;
	if (winnerNumber == nPlayer1) {
		scorePlayer1 += 1;
		scoreboard.rows[1].cells[0].innerHTML = scorePlayer1;
		winnerMessageBox.innerHTML = "YOU WIN!";
	} else if (winnerNumber == nPlayer2) {
		scorePlayer2 += 1;
		scoreboard.rows[1].cells[1].innerHTML = scorePlayer2;
		winnerMessageBox.innerHTML = "ROBOT WIN!";
	} else if (winnerNumber == 0) {
		winnerMessageBox.innerHTML = "DRAW!";
	}
	winnerMessageBox.style.display = 'block';
	playAgainButton.style.display  = 'block';
}

// Reset the game
function reset() {
	positions = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	// Remove all images
	for (var row = 0; row < board.rows.length; row++) {
		for (var col = 0; col < board.rows[row].cells.length; col++) {
			board.rows[row].cells[col].style.backgroundImage = '';
			board.rows[row].cells[col].style.opacity = 1.0;
		}
	}

	// Remove the winner message box
	winnerMessageBox.innerHTML = "";
	winnerMessageBox.style.display = 'none';
	playAgainButton.style.display  = 'none';

	gameFinished = false;

	if (startingPlayer == nPlayer1) {
		startingPlayer = nPlayer2;
		robotEasy();
	} else {
		startingPlayer = nPlayer1;
	}
}
