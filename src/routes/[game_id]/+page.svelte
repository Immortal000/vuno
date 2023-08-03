<script lang="ts">
	import { io } from 'socket.io-client';
	import CardView from '../../lib/components/Card.svelte';
	import type { Card } from '../../lib/Deck';
	import { page } from '$app/stores';
	import type { room_information } from '../../ambient.d.ts';

	const socket = io();

	let user_name: string = '';
	let host: boolean;
	let current_player_deck: Card[] = [];
	let game_started: boolean = false;
	let joined_room: boolean = false;
	let game_info: room_information;

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

{#if !joined_room}
	<input type="text" placeholder="Enter username" bind:value={user_name} />
	<button on:click={member_join}>Enter room</button>
{/if}

{#if game_started}
	<button on:click={draw_card}>Draw Card</button>
	<div class="w-full h-screen bg-gray-200 flex justify-center items-end pl-28 pb-10">
		{#each current_player_deck as card}
			<CardView
				suit={card.suit}
				value={card.value}
				wild={card.wild}
				background_string={card.background_string}
			/>
		{/each}
	</div>
{/if}

<!-- <div class="w-full h-screen bg-gray-200 flex justify-center items-end pl-28 pb-10">
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-blue-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-red-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-blue-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-green-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-gray-800`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-yellow-500`} />
</div> -->
