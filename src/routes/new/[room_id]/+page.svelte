<script lang="ts">
	import '$lib/styles/app.css';
	import { io } from 'socket.io-client';
	import type { Deck, Card } from '../../../lib/Deck';
	import { page } from '$app/stores';
	import type { room_information } from '../../../ambient';

	const socket = io();

	let user_name: string = '';
	let game_info: room_information;
	let entered_room: boolean = false;
	let player_cards: Card[] = [];

	socket.on('room update', (rf: room_information) => {
		game_info = rf;
		player_cards = rf.members[rf.member_array.indexOf(user_name)].player_cards;
	});

	const play_card = (e: Event) => {};
</script>

<div class="container lg:w-1/2 h-screen mx-auto flex">
	<!-- Username input -->
	{#if !entered_room}
		<div class="container w-3/4 m-auto flex">
			<input
				type="text"
				placeholder="Username"
				bind:value={user_name}
				class="m-auto w-2/3 p-3 rounded-l-xl"
			/>
			<button
				class="w-1/3 bg-[#5B9A8B] rounded-r-xl hover:bg-[#6A9A8B]"
				on:click={() => {
					socket.emit('join room', $page.params.room_id, user_name);
					entered_room = true;
					console.log('HUH');
				}}>Submit</button
			>
		</div>
	{/if}

	{#if !game_info?.started && entered_room}
		<div class="container w-3/4 m-auto h-1/2">
			<div class="w-full mx-auto p-2 flex bg-slate-300 rounded-t-xl">
				<p class="w-3/4 text-center text-xl">Waiting Room</p>
				{#if game_info?.member_array[game_info?.host] === user_name}
					<button
						class="bg-black text-white m-auto pl-5 pr-5 pt-3 pb-3 w-1/4"
						on:click={() => {
							socket.emit('start game', $page.params.room_id);
						}}>Start</button
					>
				{:else}
					<div
						class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
						role="status"
					/>
				{/if}
			</div>
			<div class="w-full bg-slate-400 h-3/4 rounded-b-xl">
				{#if game_info}
					{#each game_info?.member_array as user_name}
						<p class="text-2xl text-center">{user_name}</p>
					{/each}
				{/if}
			</div>
		</div>
	{/if}

	{#if game_info?.started}
		<div class="w-full h-screen p-2">
			<div class="text-white w-full h-1/2 flex">
				<div>
					{#if game_info?.member_array.indexOf(user_name) == 0}
						<p>{game_info?.member_array[game_info?.member_array.length - 1]}</p>
					{:else}
						<p>{game_info?.member_array[game_info?.member_array.indexOf(user_name) - 1]}</p>
					{/if}
				</div>
				<div class="w-1/2 bg-slate-400 h-5/6 m-auto relative overflow-hidden">
					<div
						class="w-3/4 h-2/3 ml-28 -rotate-[22deg] overflow-hidden absolute top-12 right-12 bg-gradient-to-b from-[#21232F] to-[#252B48] border-2 border-[#445069]"
					/>
					<div
						class="w-3/4 h-2/3 ml-28 -rotate-[32deg] overflow-hidden absolute top-14 right-12 bg-gradient-to-b from-[#21232F] to-[#252B48] border-2 border-[#445069]"
					/>
					<div
						class="w-3/4 h-2/3 rotate-[90deg] left-12 overflow-hidden absolute top-12 right-32 bg-gradient-to-b from-[#21232F] to-[#252B48] border-2 border-[#445069]"
					>
						<p class="transform -rotate-[90deg] w-full absolute">
							{game_info?.top?.value}
						</p>
					</div>
				</div>
				<div>
					{#if game_info?.member_array.indexOf(user_name) == game_info?.member_array.length - 1}
						<p>{game_info?.member_array[0]}</p>
					{:else}
						<p>{game_info?.member_array[game_info?.member_array.indexOf(user_name) + 1]}</p>
					{/if}
				</div>
			</div>
			<div class="w-3/4 h-1/2 bg-slate-400 m-auto flex relative">
				{#each player_cards as card}
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
						class={`w-48 h-64 rounded-2xl ${card.background_string} absolute bottom-0 -ml-32 hover:-translate-y-6 hover:z-50 transition-all`}
					>
						<h1>{card.value}</h1>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
