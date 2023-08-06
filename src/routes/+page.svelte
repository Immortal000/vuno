<script lang="ts">
	import '$lib/styles/app.css';
	import { io } from 'socket.io-client';

	const socket = io();

	socket.on('eventFromServer', (message: String) => {
		console.log(message);
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
			<button class="w-full bg-slate-400 rounded-md p-2 mb-8 hover:bg-slate-300"
				>Create a Room</button
			>
			<button class="w-full bg-slate-400 rounded-md p-2 hover:bg-slate-300">Join a Friend</button>
		</div>
	</div>
</div>
