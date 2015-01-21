// ---- Tic tac toe game for CMG ------
// ---- Author: Prashant Hedaoo
// ---- Non losing Tic Tac Toe plugin module
// ---- Stateless; does not keep track of previous states

var positions = [ '0_0', '0_1', '0_2',
                  '1_0', '1_1', '1_2',
                  '2_0', '2_1', '2_2'  ];

module.exports = non_losing_tictactoe_engine;  // export module

// non_losing_tictactoe_engine: my attempt yo code game strategies available on the net
function non_losing_tictactoe_engine(game_board) {
	var board = deSerializeBoard(game_board);
	var x=0, o=0, X=[], O=[], next_move_idx = -1;
	 // Mark X = 1; O = -1 & E = 0 to detect blocking moves in blockOpponent() function
	 // if sum of row, column & diagonals is 2 then it must be blocked
	for (var b=0; b < board.length; ++b)
		if (board[b] === 'X')
			X[x] = b, ++x, board[b] = 1;
		else if (board[b] === 'O')
			O[o] = b, ++o, board[b] = -1;
		else
			board[b] = 0;

	switch(x) {
		case 1:
			// console.log('Turn 1 ' + X[0]);
			if (X[0] % 2) // side game -> AI move = mark adjscent corner
				next_move_idx = X[0] < 4 ? 0 : 8;
			else // corner or center game -> AI move = mark corner or center
				next_move_idx = X[0] === 4 ? 0 : 4;
			break;

		case 2:
			// console.log('Turn 3');
			next_move_idx = blockOpponent(board); // return -1 if no block needed; index otherwise
			if (next_move_idx === -1) {  // Decide next move
				// console.log('Non block turn');
				if (O[0] === 4) { // AI has center marked
					if (board[0]+board[2]+board[6]+board[8] === 2) // both player marks are in opposite corners
						next_move_idx = 1;
					else {
						if (board[0]+board[2]+board[6]+board[8] === 1) { // only one player mark in corner
							next_move_idx = (board[5] !== 1 && board[3] === 0) ? 3 : 
								(board[1] !== 1 && board[7] === 0) ? 7 : 1;
						}
					}
				}
				else
					next_move_idx = board[4] ? 2 : 4; // get center cell in not taken

				if (next_move_idx === -1) // get first empty
					next_move_idx = getFirstEmpty(board);
			}
			break;

		default:
			console.log('Turn >= 5');
			next_move_idx = blockOpponent(board); // return -1 if no block needed; index otherwise
			if (next_move_idx === -1) {  // Decide next move
				console.log('Non block turn');
				if (board[0]+board[2]+board[6]+board[8] === 0)
					next_move_idx = board[0] || board[8] ? 2 : 0;
			}
			if (board[next_move_idx]) // already taken
				next_move_idx = -1;
			if (next_move_idx === -1) // get first empty
				next_move_idx = getFirstEmpty(board);
	}

	if (board[next_move_idx])
		console.log("ERROR in logic! Attempt to over-write selected cell.");
	
	board[next_move_idx] = -1; // this is next move for AI

	return serializeBoard(board);
}

function getFirstEmpty(board) {
	var v = 0;
	for(; v < board.length; ++v)
		if (board[v] === 0)
			break;
	return v;
}

// ----- Check if we meed to block opponents move
function blockOpponent(board) {
	var idx = -1;
	// Check rows
	for(var n=0; n<3; ++n) {
		if (board[n*3] + board[n*3+1] + board[n*3+2] === 2) {
			idx = board[n*3] ^ board[n*3+1] ? (board[n*3] ? n*3+1 : n*3 ) : n*3+2;
			break;
		}
	}
	// Check columns
	for(var n=0; idx === -1 && n<3; ++n) {
		if (board[n] + board[n+3] + board[n+6] === 2) {
			idx = board[n] ^ board[n+3] ? (board[n] ? n+3 : n ) : n+6;
			break;
		}
	}
	// Diagonals
	if (idx === -1 && board[0] + board[4] + board[8] === 2)
		idx = board[0] ^ board[4] ? (board[0] ? 4 : 0 ) : 8;

	if (idx === -1 && board[2] + board[4] + board[6] === 2)
		idx = board[2] ^ board[4] ? (board[2] ? 4 : 2 ) : 6;

	console.log('Block = ' + idx);
	return idx;
}

function serializeBoard(board) {
    var ot = '';
    for(var b=0; b<board.length; ++b)
        ot += positions[b] + ":" + (board[b] ? (board[b] === 1 ? 'X' : 'O') : 'E') + ",";
    return ot;
}

function deSerializeBoard(data) {
    // Deserialize board data
    var board = [];
    var tmp1 = data.split(',');
    for (var n=0; n < tmp1.length-1; ++n)
        board[n] = tmp1[n].split(':')[1];
    return board;
}

