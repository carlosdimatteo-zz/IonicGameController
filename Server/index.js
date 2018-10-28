const express = require('express');
const app = express();
const config = require('./helpers/config');
let connections = {
	availableGames: [],
	controllers: []
}
app.use('/views', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', (req, res) => {
	// res.sendFile(__dirname + '/index.html');
	res.redirect('views/index.html');
});

const server = app.listen(config.port);
const io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
	io.emit('connected');

	socket.on('press', function (object) {
		let controller = connections.controllers.find((controller) => {
			return controller.id == socket.id
		})
		console.log(JSON.stringify(controller))
		io.to(controller.game.id).emit('press', object);
	});
	socket.on('release', function (object) {
		let controller = connections.controllers.find((controller) => {
			return controller.id == socket.id
		})
		io.to(controller.game.id).emit('release', object);
	});
	socket.on('disconnected', function (type) {

		if (type == 'game') {
			let game = connections.availableGames.find((game) => {
				return game.id == socket.id
			}) ? connections.availableGames.find((game) => {
				return game.id == socket.id
			}).id : connections.controllers.find((controller) => {
				controller.game.id == socket.id
			}).game.id

		}

		socket.broadcast.emit('disconnected', type);

	});
	socket.on('identify', (idObj) => {
		if (idObj.type === 'game') {
			idObj.id = socket.id
			if (connections.availableGames.findIndex((game) => {
					return game.id == socket.id
				}) == -1) {

				let unassignedController = connections.controllers.findIndex((controller) => {
					return !controller.game || controller.game == 'undefined'
				})
				if (unassignedController >= 0) {
					connections.controllers[unassignedController].game = socket.id

				} else {

					connections.availableGames.push(idObj)
				}
				console.log('Added game ' + socket.id)
			}

		} else {
			if (connections.availableGames.length > 0) {
				idObj.id = socket.id
				idObj.game = connections.availableGames.pop()
				connections.controllers.push(idObj)
				console.log(`Added game : ${JSON.stringify(idObj.game)} to controller : ${socket.id}`)
			} else {

				io.to(socket.id).emit('message', 'No Games Available at the moment')
				socket.disconnect()

			}
		}
		console.log(`Available games  = ${connections.availableGames.length} 
	controllers connected : ${connections.controllers.length} 
	controllers with no games assigned : ${connections.controllers.find((controller)=>{return !controller.game || controller.game == 'undefined' }) ? connections.controllers.find((controller)=>{return !controller.game || controller.game == 'undefined' }) : 0}
	`)
	})
});