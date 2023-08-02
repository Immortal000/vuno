import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './src/lib/web_socket';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
