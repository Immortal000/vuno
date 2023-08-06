import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './src/lib/web_socket_v2';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
