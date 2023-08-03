export interface room_information {
	members: {
		[name: string]: {
			[name: string]: Array<any>;
		};
	};
	member_array: Array<string>;
	current: number;
	deck: Array<any>;
	discard: Array<any>;
	available: boolean;
	host: number;
	started: false;
}

export declare namespace card_type {
	let suit: String;
	let value: String;
}
