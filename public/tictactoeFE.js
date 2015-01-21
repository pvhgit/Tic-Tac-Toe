// ---- Tic tac toe game for CMG ------
// ---- Author: Prashant Hedaoo
// ---- client code


window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:3700');
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            $("#content").html(html);
        } else {
            console.log("There is a problem:", data);
        }
    });

    // test msg out
    socket.emit('send', { 'message' : 'Hi there! msg from Front end' } );
}
