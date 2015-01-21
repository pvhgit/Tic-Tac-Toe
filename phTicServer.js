// ---- Tic tac toe gane for CMG ------
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
    socket.emit('message', { message: "Welcome to Prashant Hedaoo's TicTacToe" });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);