export class Card {
	suit: string | undefined;
	value: string | undefined;
	wild: boolean | undefined;
	background_string: string;
	id: string | undefined;

	constructor(
		suit: string | undefined,
		value: string | undefined,
		id: string | undefined,
		wild: boolean | undefined = false
	) {
		this.suit = suit;
		this.value = value;
		this.wild = wild;
		this.background_string = wild ? `bg-gray-500` : `bg-${suit}-500`;
		this.id = id?.toString();
	}

	change_bg_color() {
		this.background_string = `bg-${this.suit}-500`;
	}
}

export class Deck {
	cards: Card[];

	constructor() {
		this.cards = [];
	}

	shuffle_deck() {
		let new_deck: Array<Card> = [];
		let deck_length: number = this.cards.length;

		for (let i: number = 0; i < deck_length; i++) {
			let random_index: number = Math.floor(Math.random() * this.cards.length);
			new_deck.push(this.cards[random_index]);
			this.cards.splice(random_index, 1);
		}

		this.cards = new_deck;
	}

	generate_uno_deck() {
		const suits = ['red', 'blue', 'yellow', 'green'];
		const suits_specials = ['skip', 'reverse', 'draw2'];
		const suits_wild = ['wild', 'draw4'];
		let index: number = 0;

		// Generate normal numbers
		for (let i: number = 0; i < 10; i++) {
			suits.forEach((suit) => {
				this.cards.push(new Card(suit, i.toString(), index.toString()));
				index++;
			});

			if (i != 0) {
				suits.forEach((suit) => {
					this.cards.push(new Card(suit, i.toString(), index.toString()));
					index++;
				});
			}
		}

		// Generate special cards
		for (let i: number = 0; i < 2; i++) {
			suits.forEach((suit) => {
				suits_specials.forEach((value) => {
					this.cards.push(new Card(suit, value, index.toString()));
					index++;
				});
			});
		}

		// Generate wild cards
		for (let i: number = 0; i < 4; i++) {
			suits_wild.forEach((value) => {
				this.cards.push(new Card('wild', value, index.toString(), true));
				index++;
			});
		}
	}

	distribute_deck(num_players: number) {
		let all_cards: Card[][] = [];

		for (let i: number = 0; i < num_players; i++) {
			let player_cards: Array<Card> = [];

			for (let i: number = 0; i < 7; i++) {
				player_cards.push(this.cards.pop()!);
			}

			all_cards.push(player_cards);
		}

		return all_cards;
	}

	draw_card() {
		return this.cards.pop();
	}
}
