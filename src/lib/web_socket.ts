import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';

let users: Array<Object> = [];
let rooms: { [name: string]: Object } = {};

export const webSocketServer = {
	name: 'Vuno Web Socket Server',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hello, World 👋');

			socket.on('join room', (room_id, user_name, call_back) => {
				socket.join(room_id);

				if (!rooms[room_id]) {
				}
			});
		});
	}
};
