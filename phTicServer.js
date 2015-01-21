// ---- Tic tac toe game for CMG ------
// ---- Author: Prashant Hedaoo
// ---- Server code conforming to REST principles
// ---- Server does not keep track of previous states

var express = require("express");
var app = express();
var port = 3700;
 
// ---------------- Web server -----------------------
 
app.set('views', __dirname + '/public');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("tictactoe");
});

app.use(express.static( __dirname + '/public') );

var io = require('socket.io').listen(app.listen(port));

// Socket connection handler from front-end
io.sockets.on('connection', function (socket) {
	// message handler for 'board_data' from front-end
    socket.on('board_data', function (data) {
        console.log("From client: ", data);
        var move = game_processor(data.game);
        socket.emit( move.evt, move.data );
    });
});

console.log("Listening on port " + port);

// set game engine
var game_plugin;

try {
	game_plugin = require('./non_losing_tictactoe');
	console.log("Loaded Non losing TicTacToe game engine.")
}
catch (err) { // Can't load module; use default tic tac toe
	console.log("Can't load Non losing TicTacToe game engine. Using simple tictactoe engine.")
	game_plugin = simple_tictactoe_engine;

}

// ========================================================
// ------------------------ game framework ----------------

function game_processor(board) {
	// Check if player won
	if (isWin(board, 'X')) {
		console.log("Player wins!!!");
		return {  evt : 'game_over', data : { msg : 'You have won!!!', 'move' : board } };
	}
	// get next AI move
	var move = nextMove(board);
	// Check if AI won
	if (isWin(move, 'O')) {
		console.log("AI wins!!!", move);
		return {  evt : 'game_over', data : { msg : 'You have lost!!!', 'move' : move } };
	}
	// Check if we have a tie
	if (isTie(move)) {
		console.log("TIE!!!");
		return {  evt : 'game_over', data : { msg : 'Game is a tie!', 'move' : move } };
	}
	return {  evt : 'next_move', data : { 'move' : move } };
}

function isWin(board_data, mark) {
	var board = [];
    var tmp1 = board_data.split(',');
    for (var n=0; n < tmp1.length-1; ++n)
        board[n] = (tmp1[n].split(':')[1] === mark) ? 1 : 0;

    if (    // Rows
    	   (board[0] + board[1] + board[2] === 3)
    	|| (board[3] + board[4] + board[5] === 3)
    	|| (board[6] + board[7] + board[8] === 3)
    		// Columns
    	|| (board[0] + board[3] + board[6] === 3)
    	|| (board[1] + board[4] + board[7] === 3)
    	|| (board[2] + board[5] + board[8] === 3)
    		// Diagonals
    	|| (board[0] + board[4] + board[8] === 3)
    	|| (board[2] + board[4] + board[6] === 3) )
    	return true;
    return false;
}

function isTie(board_data) {
    return (board_data.indexOf(":E") === -1);
}

function nextMove(user_board) {
	var game = game_plugin(user_board);
	console.log("AI response:           " + game);
	return game;
}

//--------------------- game engine code below ---------

// simple_tictactoe_engine: Simply selects first empty cell as next move for AI
function simple_tictactoe_engine(game_board) {
	return game_board.replace(":E,", ":O,");
}

