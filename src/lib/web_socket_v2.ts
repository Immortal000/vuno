import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';
import type { room_info } from '../ambient';
import { Deck, type Card } from './Deck';

let ROOMS: { [name: string]: room_info } = {};
const NUM_PLAYERS: number = 2;

export const webSocketServer = {
	name: 'Vuno Web Socket Server',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);
		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hello, World 👋');

			socket.on('join room', (room_id: string, user_name: string) => {
				join_room(room_id, user_name);
				socket.join(room_id);
				io.to(room_id).emit('room update', ROOMS[room_id]);
			});

			socket.on('start game', (room_id: string) => {
				start_game(room_id);
				io.to(room_id).emit('room update', ROOMS[room_id]);
			});

			socket.on('draw card', (room_id: string) => {
				draw_card(room_id);
				io.to(room_id).emit('room update', ROOMS[room_id]);
			});

			socket.on('play card', (room_id: string, card: Card, selected_suit: string = '') => {
				play_card(room_id, card, selected_suit);
				io.to(room_id).emit('room update', ROOMS[room_id]);
			});
		});
	}
};

const join_room = (room_id: string, user_name: string) => {
	// check if the room exists already and add the player if the room isnt full already
	if (!!ROOMS[room_id]) {
		if (ROOMS[room_id].member_array.length < NUM_PLAYERS) {
			ROOMS[room_id].member_array.push(user_name);
			// Add the new user to the room
			ROOMS[room_id].members[ROOMS[room_id].total_players] = {
				user_name: user_name,
				won: false,
				player_cards: []
			};

			ROOMS[room_id].total_players++;
		}
	} else {
		create_room(room_id);
		ROOMS[room_id].member_array.push(user_name);
		// Add the new user to the room
		ROOMS[room_id].members[ROOMS[room_id].total_players] = {
			user_name: user_name,
			won: false,
			player_cards: []
		};

		ROOMS[room_id].total_players++;
	}
};

const create_room = (room_id: string) => {
	ROOMS[room_id] = {
		members: {},
		member_array: [],
		current: 0,
		deck: [],
		discard: [],
		available: true,
		host: 0,
		started: false,
		reversed: false,
		total_players: 0
	};
};

const draw_card = (room_id: string) => {
	if (ROOMS[room_id].deck.length === 0) {
		discard_pile_to_deck(room_id);
	}

	const card: Card = ROOMS[room_id].deck.pop() as Card;
	ROOMS[room_id].members[ROOMS[room_id].current].player_cards.push(card);

	change_player(room_id);
};

const play_card = (room_id: string, played_card: Card, selected_suit: string = '') => {
	// Add played card to the discard pile
	ROOMS[room_id].discard.push(played_card);
	ROOMS[room_id].top = played_card;

	// Remove the played card from the users hand
	const player_hand: Card[] = ROOMS[room_id].members[ROOMS[room_id].current].player_cards;
	const filtered: Card[] = player_hand.filter((card: Card) => {
		return card.id != played_card.id;
	});

	console.log(filtered);

	ROOMS[room_id].members[ROOMS[room_id].current].player_cards = filtered;

	// Check for reverse & skip cards
	if (played_card.value === 'reverse') {
		ROOMS[room_id].reversed = !ROOMS[room_id].reversed;
	}

	if (played_card.value === 'skip') {
		change_player(room_id);
	}

	change_player(room_id); // change player

	// check for draw two
	if (played_card.value === 'draw2') {
		let two_cards: Card[] = ROOMS[room_id].deck.splice(0, 2);
		ROOMS[room_id].members[ROOMS[room_id].current].player_cards.push(...two_cards);
	}

	// Check for any wild cards
	if (played_card.wild) {
		// check for draw four
		if (played_card.value === 'draw4') {
			let four_cards: Card[] = ROOMS[room_id].deck.splice(0, 4);
			ROOMS[room_id].members[ROOMS[room_id].current].player_cards.push(...four_cards);
		}

		// Change the top card
		ROOMS[room_id].top!.suit = selected_suit as string;
		ROOMS[room_id].top!.wild = false;
		ROOMS[room_id].top!.background_string = `bg-${selected_suit}-500`;
	}
};

const start_game = (room_id: string) => {
	if (ROOMS[room_id].total_players == NUM_PLAYERS) {
		ROOMS[room_id].started = true;
	}

	if (ROOMS[room_id].started) {
		const current_deck: Deck = new Deck();
		current_deck.generate_uno_deck();
		current_deck.shuffle_deck();

		ROOMS[room_id].deck = current_deck.cards;

		const distributed_deck: Card[][] = current_deck.distribute_deck(
			ROOMS[room_id].member_array.length
		);

		distributed_deck.forEach((deck: Card[], index: number) => {
			ROOMS[room_id].members[index].player_cards = deck;
		});

		// Draw a good card to start the game
		while (!ROOMS[room_id].top) {
			const card: Card = ROOMS[room_id].deck.pop() as Card;
			if (!card?.wild && !['skip', 'reverse', 'draw2'].includes(card?.value as string)) {
				ROOMS[room_id].top = card;
				break;
			}

			ROOMS[room_id].discard.push(card);
		}
	}
};

const discard_pile_to_deck = (room_id: string) => {
	const shuffled_discard: Card[] = [];
	const deck_length: number = ROOMS[room_id].discard.length - 1;

	for (let i: number = 0; i < deck_length; i++) {
		let random_index: number = Math.floor(Math.random() * ROOMS[room_id].discard.length);
		shuffled_discard.push(ROOMS[room_id].discard[random_index]);
		ROOMS[room_id].discard.splice(random_index, 1);
	}

	ROOMS[room_id].discard = [];
	ROOMS[room_id].deck = [...shuffled_discard, ...ROOMS[room_id].deck];
};

/**
 * Change the current player based on if the game is heading in counter clockwise or clockwise direction
 * @param room_id
 */
const change_player = (room_id: string) => {
	if (ROOMS[room_id].reversed) {
		if (ROOMS[room_id].current !== 0) {
			ROOMS[room_id].current = (ROOMS[room_id].current - 1) % ROOMS[room_id].member_array.length;
		} else {
			ROOMS[room_id].current = ROOMS[room_id].member_array.length - 1;
		}
	} else {
		ROOMS[room_id].current = (ROOMS[room_id].current + 1) % ROOMS[room_id].member_array.length;
	}
};
