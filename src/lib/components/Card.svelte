<script lang="ts">
	import '../styles/app.css';
	import { Card } from '$lib/Deck';

	export let suit: string | undefined;
	export let value: string | undefined;
	export let wild: boolean | undefined;
	export let background_string: string | undefined;
	// export let z_index: string;

	const this_card: Card = new Card(suit, value, wild);

	const handlePlay = () => {};
</script>

<div
	on:click={handlePlay}
	class={`w-48 h-64 shadow-lg rounded-2xl ${background_string} relative -ml-28 hover:-translate-y-6 hover:z-50 transition-all`}
>
	<h1>{value}</h1>
</div>
