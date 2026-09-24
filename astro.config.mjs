// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";
import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	// prerender ページの Astro.url.origin（canonical / OGP の絶対 URL）に使われる
	site: "https://youkan.uk",
	output: "server",
	adapter: cloudflare(),
	session: {
		// unstorage memory driver: prevents @astrojs/cloudflare from
		// auto-injecting a "SESSION" KV binding that we don't use.
		driver: "memory",
	},
	vite: {
		resolve: {
			alias: {
				"@styled": path.resolve(__dirname, "styled-system"),
				"@consts": path.resolve(__dirname, "src/consts"),
			},
		},
	},
});
