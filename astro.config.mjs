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
	integrations: [
		mdx(),
		{
			// /misskey 配下を全てビルド時に生成する（画像最適化のため。src/pages/index.astro 参照）
			// .md ページは `export const prerender` を書けないため、ルート設定フックでまとめて指定する
			name: "prerender-misskey",
			hooks: {
				"astro:route:setup": ({ route }) => {
					if (route.component.startsWith("src/pages/misskey/")) route.prerender = true;
				},
			},
		},
	],
	image: {
		// リモート画像（pixiv の埋め込み画像・作品の OGP 画像など）をビルド時に取得して WebP 化する。
		// 作品を足すたびにドメインを書き足さなくて済むよう https はすべて許可し、
		// 実行時の /_image は src/middleware.ts で塞ぐ（オープンリダイレクト対策）
		remotePatterns: [{ protocol: "https" }],
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
