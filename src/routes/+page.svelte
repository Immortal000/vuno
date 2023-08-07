<script lang="ts">
	import { goto } from '$app/navigation';
	import '$lib/styles/app.css';
	import { io } from 'socket.io-client';
	import type { room_info } from '../ambient';

	const socket = io();
	let code: string = '';

	let rooms_info: { [name: string]: room_info };

	socket.on('eventFromServer', (rooms) => {
		rooms_info = rooms;
	});
</script>

<div class="container lg:w-1/2 m-auto h-screen flex">
	<div class="container w-3/4 m-auto h-3/4 text-center">
		<p class="text-lg align-text-middle bg-slate-300 leading-[4rem] rounded-t-xl">
			Valorant + Uno = more fun
		</p>
		<div class="bg-slate-400 rounded-b-xl h-1/2 overflow-hidden relative align-bottom">
			<div
				class="w-1/3 h-3/4 ml-28 -rotate-[22deg] overflow-hidden absolute -bottom-12 -left-12 bg-gradient-to-b from-[#21232F] to-[#252B48] border-2 border-[#445069]"
			/>
			<div
				class="w-1/3 h-3/4 ml-45 absolute bottom-0 left-48 bg-gradient-to-b from-[#21232F] to-[#252B48] border-2 border-[#445069]"
			/>
			<div
				class="w-1/3 h-3/4 -ml-28 absolute -bottom-8 right-12 rotate-[13deg] bg-gradient-to-b from-[#21232F] to-[#252B48] border-2 border-[#445069]"
			/>
		</div>
		<div class="flex flex-col mt-12">
			<div class="w-full flex mb-8">
				<input
					type="text"
					class="w-1/4 rounded-l-md text-center text-2xl"
					placeholder="0000"
					bind:value={code}
				/>
				<button
					class="w-3/4 bg-slate-400 rounded-r-md p-2 hover:bg-slate-300"
					on:click={() => {
						socket.emit('create room', code);
						goto(`/new/${code}`);
					}}>Create a Room</button
				>
			</div>
			<div class="w-full flex">
				<input
					type="text"
					class="w-1/4 rounded-l-md text-center text-2xl"
					placeholder="0000"
					bind:value={code}
				/>
				<button
					class="w-3/4 bg-slate-400 rounded-r-md p-2 hover:bg-slate-300"
					on:click={() => {
						if (code in rooms_info) {
							goto(`/new/${code}`);
						} else {
							alert('Room does not exist');
						}
					}}>Join a Friend</button
				>
			</div>
		</div>
	</div>
</div>
