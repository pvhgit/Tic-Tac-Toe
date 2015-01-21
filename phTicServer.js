// ---- Tic tac toe gane for CMG ------
// ---- Author: Prashant Hedaoo
// ---- Server code conforming to REST principles
// ---- Server does not keep track of previous states

var express = require("express");
var app = express();
var port = 3700;
 
app.get("/", function(req, res){
    res.send("Hello world!");
});
 
app.listen(port);
console.log("Listening on port " + port);