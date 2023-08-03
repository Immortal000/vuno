export class Card {
	suit: string;
	value: string;
	wild: boolean;
	background_string: string;

	constructor(suit: string, value: string, wild: boolean = false) {
		this.suit = suit;
		this.value = value;
		this.wild = wild;
		this.background_string = `bg-${suit}-500`;
	}
}

export class Deck {
	cards: Array<Card>;

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

		// Generate normal numbers
		for (let i: number = 0; i < 10; i++) {
			suits.forEach((suit) => {
				this.cards.push(new Card(suit, i.toString()));
			});

			if (i != 0) {
				suits.forEach((suit) => {
					this.cards.push(new Card(suit, i.toString()));
				});
			}
		}

		// Generate special cards
		for (let i: number = 0; i < 2; i++) {
			suits.forEach((suit) => {
				suits_specials.forEach((value) => {
					this.cards.push(new Card(suit, value));
				});
			});
		}

		// Generate wild cards
		for (let i: number = 0; i < 4; i++) {
			suits_wild.forEach((value) => {
				this.cards.push(new Card('wild', value, true));
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
