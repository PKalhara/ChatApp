var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	nicknames = [];
	
	server.listen(3000);
	app.get('/',function(req,res){
		res.sendFile(__dirname + '/index.html');
	});
	
	io.sockets.on('connection' , function(socket){
		socket.on('new_user', function(data, callback){
			if(nicknames.indexOf(data) != -1 ){
				callback(false);
			}else{
				
				callback(true);
				socket.nickname = data;
				nicknames.push(socket.nickname);
				updateNicknames();
			}
		});
		
		function updateNicknames(){
			io.sockets.emit('usernames', nicknames);
		}
		
		socket.on('send_message',function(data){
		io.sockets.emit('new_message', {msg: data, nick: socket.nickname});
			//socket.broadcast.emit('new_message',data);
		});
		
		socket.on('disconnect', function(data){
			
			if(!socket.nickname) return;
			nicknames.splice(nicknames.indexOf(socket.nickname), 1);
			updateNicknames();
		});
	});