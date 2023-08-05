import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';
import type { room_information } from '../ambient';
import { Card, Deck } from './Deck';

let rooms: { [name: string]: room_information } = {};

const change_player = (num_players: number, room_id: string) => {
	if (rooms[room_id].reversed) {
		if (rooms[room_id].current !== 0) {
			rooms[room_id].current = (rooms[room_id].current - 1) % num_players;
		} else {
			rooms[room_id].current = rooms[room_id].member_array.length - 1;
		}
	} else {
		rooms[room_id].current = (rooms[room_id].current + 1) % num_players;
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
				} else {
					rooms[room_id] = {
						members: {},
						member_array: [],
						current: 0,
						deck: [],
						discard: [],
						available: true,
						host: 0,
						started: false,
						reversed: false
					};

					rooms[room_id].member_array.push(user_name);
					rooms[room_id].members[user_name] = {};
					rooms[room_id].members[user_name].player_cards = [];
					rooms[room_id].host = 0;
					call_back(rooms[room_id]);
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

					// let top_card: Card = rooms[room_id].deck.pop();
					while (!rooms[room_id].top) {
						let new_card: Card | undefined = rooms[room_id].deck.pop();
						if (
							!new_card?.wild &&
							!['skip', 'reverse', 'draw2'].includes(new_card?.value as string)
						) {
							rooms[room_id].top = new_card;
							break;
						}

						rooms[room_id].discard.push(new_card as Card);
					}

					if (room_id.top != undefined) {
						rooms[room_id].discard.push(rooms[room_id].top as Card);
					}

					io.to(room_id).emit('game started', rooms[room_id]);
				}
			});

			socket.on('played card', (room_id: string, played_card: Card) => {
				rooms[room_id].discard.push(played_card);
				rooms[room_id].top = played_card;

				let cp_cards: Card[] =
					rooms[room_id].members[rooms[room_id].member_array[rooms[room_id].current]].player_cards;

				const filtered: Card[] = cp_cards.filter((card: Card) => {
					return card.id != played_card.id;
				});

				rooms[room_id].members[rooms[room_id].member_array[rooms[room_id].current]].player_cards =
					filtered;

				// rooms[room_id].members[
				// 	rooms[room_id].member_array[rooms[room_id].current]
				// ].player_cards.splice(
				// 	rooms[room_id].members[
				// 		rooms[room_id].member_array[rooms[room_id].current]
				// 	].player_cards.indexOf(played_card),
				// 	1
				// );

				if (played_card.value === 'reverse') {
					rooms[room_id].reversed = !rooms[room_id].reversed;
				}

				change_player(rooms[room_id].member_array.length, room_id);

				if (played_card.value === 'skip') {
					change_player(rooms[room_id].member_array.length, room_id);
				}

				if (played_card.value === 'draw2') {
					let two_cards: Card[] = rooms[room_id].deck.splice(0, 2);
					rooms[room_id].members[
						rooms[room_id].member_array[rooms[room_id].current]
					].player_cards.push(...two_cards);

					rooms[room_id].discard.push(...two_cards);

					// rooms[room_id].top = rooms[room_id].deck[rooms[room_id].deck.length - 1];
				}

				if (played_card.wild) {
					if (played_card.value === 'draw4') {
						let four_cards: Card[] = rooms[room_id].deck.splice(0, 4);
						rooms[room_id].members[
							rooms[room_id].member_array[rooms[room_id].current]
						].player_cards.push(...four_cards);
						rooms[room_id].discard.push(...four_cards);
					}

					// rooms[room_id].top = rooms[room_id].deck[rooms[room_id].deck.length - 1];

					// if (played_card.value === 'wild') {
					// 	rooms[room_id].top!.suit = played_card.suit;
					// }

					rooms[room_id].top!.suit = played_card.suit;
					rooms[room_id].top!.wild = false;

					console.log(rooms[room_id].top);
				}

				io.to(room_id).emit('card played', rooms[room_id]);
			});

			socket.on('draw card', (room_id: string) => {
				rooms[room_id].members[
					rooms[room_id].member_array[rooms[room_id].current]
				].player_cards.push(rooms[room_id].deck.pop() as Card);

				change_player(rooms[room_id].member_array.length, room_id);

				io.to(room_id).emit('drew card', rooms[room_id]);
			});
		});
	}
};
