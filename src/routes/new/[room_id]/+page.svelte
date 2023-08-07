<script lang="ts">
	import '$lib/styles/app.css';
	import { io } from 'socket.io-client';
	import { page } from '$app/stores';
	import type { room_info } from '../../../ambient';
	import { Card } from '../../../lib/Deck';

	const socket = io();

	let user_name: string = '';
	let game_info: room_info;
	let entered_room: boolean = false;
	let player_cards: Card[] = [];
	let choose_suit: boolean = false;
	let selected_suit: string;
	let won: boolean = false;
	let winner: string = '';

	let played_card: Card;

	socket.on('room update', (rf: room_info) => {
		game_info = rf;
		player_cards = rf.members[rf.member_array.indexOf(user_name)].player_cards;

		console.log(game_info);

		if (game_info?.finished) {
			for (let index in game_info?.members) {
				if (game_info?.members[index].won) {
					if (user_name == game_info?.member_array[index]) {
						won = true;
						winner = game_info?.member_array[index];
					}
				}
			}
		}
	});

	const draw_card = () => {
		if (user_name === game_info.member_array[game_info.current]) {
			socket.emit('draw card', $page.params.room_id);
		} else {
			alert('Not your turn bro 💀');
		}
	};

	const played_wild = () => {
		socket.emit('play card', $page.params.room_id, played_card, selected_suit);
		choose_suit = false;
	};

	const play_card = (e: Event) => {
		const target = e.target as HTMLButtonElement;
		played_card = new Card(
			target?.dataset.suit,
			target?.dataset.value,
			target?.dataset.index,
			target?.dataset.wild == 'true'
		);

		if (user_name === game_info.member_array[game_info.current]) {
			let current_top_card: Card = game_info.top as Card;
			if (played_card.wild) {
				choose_suit = true;
			} else {
				if (
					played_card.suit === current_top_card?.suit ||
					played_card.value === current_top_card?.value
				) {
					socket.emit('play card', $page.params.room_id, played_card, '');
				} else {
					alert('Invalid card bro 💀');
				}
			}
		} else {
			alert('Not your turn bro 💀');
		}
	};
</script>

<div class="container md:w-3/4 h-screen mx-auto flex">
	{#if won && game_info?.finished}
		<div
			class="absolute top-0 right-0 bg-black w-screen h-screen flex justify-center items-center text-white z-1000"
		>
			<p class="text-3xl">🥳🎉 You won!! 🎉🥳</p>
		</div>
	{/if}
	{#if !won && game_info?.finished}
		<div
			class="absolute top-0 right-0 bg-black w-screen h-screen flex justify-center items-center text-white z-1000"
		>
			<p class="text-3xl">👎⬇️ You lost!! ⬇️👎</p>
			<p class="text-lg">{winner} won the game :D</p>
		</div>
	{/if}
	<!-- Username input -->
	{#if choose_suit}
		<div
			class="absolute top-0 right-0 bg-black bg-opacity-80 w-screen h-screen z-10 flex justify-center items-center"
		>
			<div class="z-100">
				<p class="text-3xl text-white mb-5">Choose your suit:</p>
				<div class="w-full">
					<select name="" id="" class="w-full" bind:value={selected_suit} on:change={played_wild}>
						<option value="yellow">Yellow</option>
						<option value="blue">Blue</option>
						<option value="green">Green</option>
						<option value="red">Red</option>
					</select>
				</div>
			</div>
		</div>
	{/if}

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

	{#if game_info?.started && !game_info?.finished}
		<div class="w-full h-screen p-2">
			<div class="text-white w-full h-1/2 flex justify-between">
				<div class="h-full">
					{#if game_info?.member_array.indexOf(user_name) == 0}
						<p class="mx-auto">{game_info?.member_array[game_info?.member_array.length - 1]}</p>
					{:else}
						<p class="mx-auto">
							{game_info?.member_array[game_info?.member_array.indexOf(user_name) - 1]}
						</p>
					{/if}
				</div>
				<div class="w-1/2 h-5/6 m-auto relative">
					<div
						class="w-48 h-64 absolute top-0 bottom-0 left-0 right-0 m-auto bg-gradient-to-b from-[#21232F] to-[#252B48] border-2 border-[#445069] rotate-[45deg]"
					/>
					<div
						class="w-48 h-64 absolute top-0 bottom-0 left-0 right-0 m-auto bg-gradient-to-b from-[#21232F] to-[#252B48] border-2 border-[#445069] -rotate-[45deg]"
					/>
					<div
						style={`background-color: ${game_info?.top?.suit}`}
						class={`w-48 h-64 absolute top-0 bottom-0 left-0 right-0 ${game_info?.top?.background_string} m-auto border-2 border-[#445069]`}
					>
						<p class={`transform w-full h-full align-middle text-center text-3xl text-white`}>
							{game_info?.top?.value}
						</p>
					</div>
				</div>
				<div class="h-full">
					{#if game_info?.member_array.indexOf(user_name) == game_info?.member_array.length - 1}
						<p class="mx-auto">{game_info?.member_array[0]}</p>
					{:else}
						<p class="mx-auto">
							{game_info?.member_array[game_info?.member_array.indexOf(user_name) + 1]}
						</p>
					{/if}
				</div>
			</div>
			<div class={`h-1/2 w-full m-auto table`}>
				<div class="w-full flex justify-evenly p-4">
					<button class="w-1/6 bg-[#5B9A8B] rounded-md hover:bg-[#6A9A8B]" on:click={draw_card}
						>Draw Card</button
					>
					{#if game_info?.member_array[game_info?.host] === user_name}
						<button class="w-1/6 bg-[#5B9A8B] rounded-md hover:bg-[#6A9A8B]">Quit Room</button>
					{:else}
						<button class="w-1/6 bg-[#5B9A8B] rounded-md hover:bg-[#6A9A8B]">Quit</button>
					{/if}
				</div>
				<div class="w-full grid-flow-col auto-cols-fr grid">
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
							style={`background-color: ${card.suit}`}
							class={`w-48 h-64 border-2 rounded-md relative border-2 border-[#445069] hover:z-50 hover:-translate-y-6`}
						>
							<p class="text-3xl text-center w-full text-white">{card.value}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
