import react from "@vitejs/plugin-react";
import ssr from "vike/plugin";
import { UserConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const config: UserConfig = {
	plugins: [react(), tailwindcss(), ssr({ prerender: true })],
	server: {
		watch: {
			usePolling: true,
		},
	},
};

export default config;
