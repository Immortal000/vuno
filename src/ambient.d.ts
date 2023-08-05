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

export declare namespace card_type {
	let suit: String;
	let value: String;
}
