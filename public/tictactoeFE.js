// ---- Tic tac toe game for CMG ------
// ---- Author: Prashant Hedaoo
// ---- client code


var positions = [ '0_0', '0_1', '0_2',
                  '1_0', '1_1', '1_2',
                  '2_0', '2_1', '2_2'  ];
var board;
var socket;
var blinker_id;

// debug vars
var debug = false;  // Set true for message log on page
var messages = [];

// main code
window.onload = function() {
    
    // connect to server
    socket = io.connect('http://localhost:3700');

    // Set 'next_move' message handler
    socket.on('next_move', function (data) {
        if(data && data.move) {
            logg( null, "from server: " + data.move);
            renderBoard(data.move);
        }
    });

    // Set 'game_over' message handler
    socket.on('game_over', function (data) {
        if(data) {
            if (data.move) {
                logg( null, "from server: " + data.move);
                renderBoard(data.move);
            }
            logg( null, data.msg );
            $("#status").css('color','yellow').css('background-color','black')
                .html('<br>' + data.msg);
        }
        disableBoard();
    });

    // Start the game and initialize the page
    renderBoard(null);
    blinker_id = setInterval(blinker, 500); // start blinking text loop
 }

function renderBoard(board_data) {
    board = {};
    if (board_data) {
        deSerializeBoard(board_data);
        $("#status").css('color','black').html("<br>Your turn....");
    }
    else { // set all cells as empty
        for( var n=0; n < positions.length; ++n)
            board[positions[n]] = 'E';
        $("#status").show().css('color','blue').addClass('blink_text')
            .html("Welcome!<br> Let's play. Your turn...");
    }

    drawCells();

    if (!debug)
       $("#content").hide(); // debug activity messages
};

// render board based on values from server
function drawCells() {
    $("#game_layout").empty();
    for(var i=0; i<positions.length;++i) {
        var label = positions[i], div = '<div/>', cls = "cell " + label, clr = 'black';
        if (board[label] === 'E') // empty cells
            cls += " on"; // mark empty cells
        else
            div = "<div>" + board[label] + "</div>";
        if (board[label] === 'O') clr = 'blue';
        var cell = $(div).addClass(cls).appendTo("#game_layout").css('color',clr);
        if ( i % 3 === 0 ) // insert row separarors
            cell.before('<div class="clear"></div>');
    }

    // activate clicks and hover for all empty cells
    $("#game_layout .on").bind('mouseover', hoverCell).bind('mouseout', leaveCell)
        .bind("click", processClick);
    $("#reset").bind("click", reset);
}

function reset() {
    disableBoard();
    $("#status").hide().css('color','black').css('background-color','white');
    renderBoard(null);
}

function disableBoard() {
    $("#game_layout .cell").unbind("click").unbind("mouseover").unbind("mouseout");
};

function processClick(ev) {
    // mark clicked cell with X
    $(this).trigger("mouseout").unbind("click mouseover mouseout").text('X');
    board[$(this).attr('class').split(' ')[1]] = 'X';
    logg($(this), 'processClick');

    // send board data to server ###################################
    socket.emit('board_data', { game : serializeBoard() });

    $("#status").css('color','blue').html("<br>Thinking.....  wait");
    disableBoard(); // disable board till next move from server
    return false;
};

function hoverCell(ev) {
    $(this).addClass("hover");
    return false;
};

function leaveCell(ev) {
    $(this).removeClass("hover");
    return false;
};

function serializeBoard() {
    var ot = '';
    for(var b=0; b<positions.length; ++b)
        ot += positions[b] + ":" + board[positions[b]] + ",";
    return ot;
}

function deSerializeBoard(data) {
    // Deserialize board data
    var tmp1 = data.split(',');
    for (var n=0; n < tmp1.length-1; ++n) {
        var tmp2 = tmp1[n].split(':');
        board[tmp2[0]] = tmp2[1];
    }
}

function logg(msg, str) {
    if (!debug)
        return;

    if (msg)
        str += ": " + msg.attr('class');
    messages.push(str);

    str = '';
    for(var i=0; i<messages.length; i++)
        str += messages[i] + '<br/>';
    $("#content").html(str);
}

// text blinker
function blinker() {
    $('.blink_text').fadeOut(500);
    $('.blink_text').fadeIn(500);
}