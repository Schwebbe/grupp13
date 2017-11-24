// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.

// Creating an express server

var express = require('express'),
    app = express();

var port = process.env.PORT || 1337;

var io = require('socket.io').listen(app.listen(port));

//This is the app configuration

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));

// This is a secret key that prevents others from opening your presentation
// and controlling it. 

var pwd = 'janne';

// Initialize a new socket.io application

var presentation = io.on('connection', function (socket) {
    socket.on('load', function (data) {
        
        socket.emit('access', {
            access: (data.key === pwd ? "granted" : "denied")
        });
    });
    // Clients send the 'slide-changed' message whenever they navigate to a new slide.
    socket.on('slide-changed', function (data) {
        // Check the secret key again
        if (data.key === pwd) {
            // Tell all connected clients to navigate to the new slide
            presentation.emit('navigate', {
                hash: data.hash
            });
        }
    });


});
console.log('The server is running on port ' + port);
