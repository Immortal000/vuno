import type { Card } from '$lib/Deck';

export interface room_information {
	members: {
		[name: string]: {
			[name: string]: Array<any>;
		};
	};
	member_array: Array<string>;
	current: number;
	deck: Array<Card>;
	discard: Array<Card>;
	available: boolean;
	host: number;
	started: false;
	top?: Card;
	reversed: boolean;
}

export interface member_info {
	player_cards: Card[];
	user_name: string;
	won: boolean;
}

export interface room_info {
	members: {
		[name: number]: member_info;
	};
	member_array: string[] = [];
	current: number = 0;
	deck: Card[] = [];
	discard: Card[] = [];
	available: boolean = true;
	host: number = 0;
	started: boolean = false;
	top?: Card = undefined;
	reversed: boolean = false;
	total_players: number = 0;
}

export declare namespace card_type {
	let suit: String;
	let value: String;
}
