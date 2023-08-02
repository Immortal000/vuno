<script lang="ts">
	import { io } from 'socket.io-client';

	const socket = io();

	socket.on('eventFromServer', (message: String) => {
		console.log(message);
	});
</script>
