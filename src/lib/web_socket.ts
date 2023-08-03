import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';
import type { room_information } from '../ambient';
import { Deck } from './Deck';

let users: Array<Object> = [];
let rooms: { [name: string]: room_information } = {
	really: {
		members: {},
		member_array: [],
		current: 0,
		deck: [],
		discard: [],
		available: true,
		host: 0,
		started: false
	}
};

export const webSocketServer = {
	name: 'Vuno Web Socket Server',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hello, World 👋');

			socket.on('join room', (room_id, user_name, call_back) => {
				if (rooms[room_id]) {
					// check for room availability
					if (rooms[room_id].member_array.length < 2) {
						rooms[room_id].member_array.push(user_name);
						rooms[room_id].members[user_name] = {};
						rooms[room_id].members[user_name].player_cards = [];
						call_back(rooms[room_id]);
					} else {
						rooms[room_id].available = false;
						socket.emit('error', 'Room is full');
					}
				}

				socket.join(room_id);
			});

			socket.on('start game', (room_id, call_back) => {
				if (!rooms[room_id].started && rooms[room_id].member_array.length == 2) {
					const current_deck = new Deck();
					current_deck.generate_uno_deck();
					current_deck.shuffle_deck();

					rooms[room_id].deck = current_deck.cards;
					let distributed_cards = current_deck.distribute_deck(2);

					rooms[room_id].member_array.forEach((member: string, index: number) => {
						rooms[room_id].members[member].player_cards = distributed_cards[index];
					});

					io.to(room_id).emit('game started', rooms[room_id]);
				}
			});
		});
	}
};
