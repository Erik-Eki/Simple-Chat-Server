"use strict";
const net = require('net');

var connections = [];

net.createServer((socket) => {
    socket.setEncoding('utf8');

    socket.nick = "user" + (Math.random()*10000).toFixed();
    console.log(socket.nick, "connected");
    socket.write("Tervetuloa: " + socket.nick + "\r\n");
    connections.push(socket);

    socket.on('data', function(buffer){
        console.log("received data", buffer)

        var command = buffer.toString().trim().split(" ");
        
        switch(command[0]) {
            case 'HELP':
                console.log("komento", command[0], "tunnistettu");
                socket.write("Commands are: HELP, NICK, MSG, MSGALL, WHOIS, USERS" + "\r\n");
                break;
            case 'NICK':
                this.nick = command[1];
                socket.write("You are now known as: " + this.nick + "\r\n");
                break;

            case 'MSG':
                connections.forEach(function(node){
                    if(node.nick == command[1]) {
                        node.write(socket.nick + " DMs: " + command.slice(2).join(" ") + "\r\n");
                    }
                });
                break;

            case 'WHOIS':
                connections.forEach(function(node){
                    if(node.nick == command[1]){
                        socket.write("WHOIS: known as " + node.nick + " " + JSON.stringify(node.address()) + "\r\n" );
                    } 
                });
                break;
                
            case 'USERS':
                var users = [];
                connections.forEach(function(socket){
                    users.push(socket.nick)
                });
                socket.write(JSON.stringify(users) + "\r\n");
                break;
            case 'MSGALL':
                connections.forEach(function(client){
                    client.write(socket.nick + " says: " + command.slice(1).join(" ") + "\r\n")
                });
                break

            default:
                console.log("Command not found");
                break;
        }
    });
    socket.on('close', function() {
        console.log(socket.nick, "disconnected");
        connections = connections.filter((node) => {
            return node.nick != socket.nick;
        });
    });
    }).listen(8000, () => {
        console.log('server bound');
    });

    console.log("palvelin on nyt käynnistetty");
    console.log("yhteys telnetillä 'telnet localhost 8000'");


    
function broadcast(from, message) {

	// If there are no sockets, then don't broadcast any messages
	if (sockets.length === 0) {
		process.stdout.write('Everyone left the chat');
		return;
	}

	// If there are clients remaining then broadcast message
	sockets.forEach(function(socket, index, array){
		// Dont send any messages to the sender
		if(socket.nickname === from) return;
		
		socket.write(message);
	
	});
	
};
    
/*server.on('error', (err) => {
    throw err;
});
server.listen(8124, () => {
    console.log('server bound');
});*/