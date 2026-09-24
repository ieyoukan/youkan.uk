// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	// prerender ページの Astro.url.origin（canonical / OGP の絶対 URL）に使われる
	site: "https://youkan.uk",
	output: "server",
	adapter: cloudflare(),
	integrations: [mdx()],
	image: {
		// 絵セクション: pixiv の埋め込み用画像をビルド時に取得して WebP 化する
		domains: ["embed.pixiv.net"],
	},
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
