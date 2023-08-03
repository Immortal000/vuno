<script lang="ts">
	import { io } from 'socket.io-client';
	import { page } from '$app/stores';
	import type { room_information } from '../../ambient.d.ts';
	import { redirect } from '@sveltejs/kit';

	const socket = io();

	let user_name: string = '';
	let host: boolean;
	let current_player_deck = [];

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
		console.log(rf.members[user_name].player_cards);
	});
</script>

{#if host}
	<button on:click={start_game}>Start game</button>
{/if}

<input type="text" placeholder="Enter username" bind:value={user_name} />
<button on:click={member_join}>Enter room</button>
