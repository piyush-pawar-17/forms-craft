import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@ui': path.resolve(__dirname, 'src/ui'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@assets': path.resolve(__dirname, 'src/assets')
		}
	}
});
