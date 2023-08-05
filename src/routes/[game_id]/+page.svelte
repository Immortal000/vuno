<script lang="ts">
	import '$lib/styles/app.css';
	import { io } from 'socket.io-client';
	import { Deck, Card } from '../../lib/Deck';
	import { page } from '$app/stores';
	import type { room_information } from '../../ambient.d.ts';

	const socket = io();

	let user_name: string = '';
	let host: boolean;
	let current_player_deck: Card[] = [];
	let game_started: boolean = false;
	let joined_room: boolean = false;
	let game_info: room_information;
	let choose_suit: boolean = false;
	let selected_suit: string;
	let played_card: Card | undefined;

	socket.on('error', (message) => {
		alert('Room is full, cannot join!');
	});

	const member_join = () => {
		socket.emit('join room', $page.params.game_id, user_name, (rf: room_information) => {
			host = rf.member_array[rf.host] === user_name;
		});

		joined_room = true;
	};

	const start_game = () => {
		socket.emit('start game', $page.params.game_id, (rf: room_information) => {
			game_info = rf;
		});
	};

	const draw_card = () => {
		if (user_name === game_info.member_array[game_info.current]) {
			socket.emit('draw card', $page.params.game_id);
		} else {
			alert('Not your turn bro 💀');
		}
	};

	const played_wild = () => {
		socket.emit('played card', $page.params.game_id, played_card, selected_suit);
		choose_suit = false;
	};

	const play_card = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		played_card = new Card(
			target?.dataset.suit,
			target?.dataset.value,
			target?.dataset.index,
			target?.dataset.wild == 'true'
		);

		console.log(played_card.suit);

		if (user_name === game_info.member_array[game_info.current]) {
			let current_top_card: Card | undefined = game_info.top;
			if (played_card.wild) {
				choose_suit = true;
				alert('pick color!');
			} else {
				if (
					played_card.suit === current_top_card?.suit ||
					played_card.value === current_top_card?.value
				) {
					socket.emit('played card', $page.params.game_id, played_card);
				} else {
					alert('Invalid card bro 💀');
				}
			}
		} else {
			alert('Not your turn bro 💀');
		}
	};

	socket.on('card played', (rf: room_information) => {
		game_info = rf;
		current_player_deck = rf.members[user_name].player_cards;
		console.log(game_info);
	});

	socket.on('game started', (rf: room_information) => {
		current_player_deck = rf.members[user_name].player_cards;
		game_info = rf;
		game_started = true;
		console.log(current_player_deck);
	});

	socket.on('drew card', (rf: room_information) => {
		game_info = rf;
		current_player_deck = rf.members[user_name].player_cards;
	});
</script>

{#if host}
	<button on:click={start_game}>Start game</button>
{/if}

{#if choose_suit}
	<select name="suit" id="suit" bind:value={selected_suit}>
		<option value="red">Red</option>
		<option value="blue">Blue</option>
		<option value="green">Green</option>
		<option value="yellow">Yellow</option>
	</select>
	<button on:click={played_wild}>Change Color</button>
{/if}

{#if !joined_room}
	<input type="text" placeholder="Enter username" bind:value={user_name} />
	<button on:click={member_join}>Enter room</button>
{/if}

{#if game_started}
	<button on:click={draw_card}>Draw Card</button>
	<div class="w-full bg-gray-200 flex justify-center items-end pl-28 pb-10 relative">
		<div
			data-value={game_info.top?.value}
			data-wild={game_info.top?.wild}
			data-suit={game_info.top?.suit}
			data-index={game_info.top?.id}
			class={`w-48 h-64 shadow-lg rounded-2xl ${game_info.top?.background_string} relative -ml-28`}
		>
			<h1>{game_info.top?.value}</h1>
		</div>
	</div>
	<div class="w-full h-screen bg-gray-200 flex justify-center items-end pl-28 pb-10">
		{#each current_player_deck as card}
			<div
				tabindex="0"
				role="button"
				aria-pressed="false"
				on:click={(e) => play_card(e)}
				on:keydown={() => console.log('clicked')}
				data-value={card.value}
				data-wild={card.wild}
				data-suit={card.suit}
				data-index={card.id}
				class={`w-48 h-64 shadow-lg rounded-2xl ${card.background_string} relative -ml-28 hover:-translate-y-6 hover:z-50 transition-all`}
			>
				<h1>{card.value}</h1>
			</div>
		{/each}
	</div>
{/if}

<!-- <div class="w-full h-screen bg-gray-200 flex justify-center items-end pl-28 pb-10">
	<div
		tabindex="0"
		role="button"
		aria-pressed="false"
		on:click={(e) => play_card(e)}
		on:keydown={() => console.log('clicked')}
		data-value={'7'}
		data-wild={false}
		data-suit={'gray'}
		class={`w-48 h-64 shadow-lg rounded-2xl bg-red-500 relative -ml-28 hover:-translate-y-6 hover:z-50 transition-all`}
	>
		<h1>{7}</h1>
	</div>
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-red-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-blue-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-green-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-gray-800`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-yellow-500`} />
</div> -->
