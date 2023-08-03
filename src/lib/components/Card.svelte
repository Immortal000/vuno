<script lang="ts">
	import '../styles/app.css';

	export let suit: string;
	export let value: string;
	export let wild: boolean;
	export let background_string: string;
	// export let z_index: string;
</script>

<div
	class={`w-48 h-64 shadow-lg rounded-2xl ${background_string} relative -ml-28 hover:-translate-y-6 hover:z-50 transition-all`}
>
	<h1>{value}</h1>
</div>
