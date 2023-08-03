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

	socket.on('error', (message) => {
		alert('Room is full, cannot join!');
	});

	const member_join = () => {
		socket.emit('join room', $page.params.game_id, user_name, (rf: room_information) => {
			host = rf.member_array[rf.host] === user_name;
		});
	};

	const start_game = () => {
		socket.emit('start game', $page.params.game_id, (rf: room_information) => {
			console.log(rf);
		});
	};

	socket.on('game started', (rf: room_information) => {
		current_player_deck = rf.members[user_name].player_cards;
	});
</script>

{#if host}
	<button on:click={start_game}>Start game</button>
{/if}

<input type="text" placeholder="Enter username" bind:value={user_name} />
<button on:click={member_join}>Enter room</button>

<!-- {#each current_player_deck as card}
	<CardView
		suit={card.suit}
		value={card.value}
		wild={card.wild}
		background_string={card.background_string}
		z_index={card.z_index}
	/>
{/each} -->

<div class="w-full h-screen bg-gray-200 flex justify-center items-end pl-28 pb-10">
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-blue-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-red-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-blue-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-green-500`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-gray-800`} />
	<CardView suit={'sky'} value={'7'} wild={false} background_string={`bg-yellow-500`} />
</div>
