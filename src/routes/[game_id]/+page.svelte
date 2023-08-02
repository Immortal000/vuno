<script lang="ts">
	import { io } from 'socket.io-client';
	import { page } from '$app/stores';

	const socket = io();

	socket.emit('join room', $page.params.game_id);
</script>
