import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { WORK_CATEGORIES } from "./consts/works";

// 作品: src/content/works/*.mdx
// frontmatter にカード・詳細ページの情報、本文に詳細ページの説明（Markdown / MDX）を書く
const works = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/works" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		/** 絶対URL or public/ 相対パス (/works/xxx.png)。未設定時は url の OGP 画像を使用 */
		image: z.string().optional(),
		url: z.string().url().optional(),
		/** GitHub リポジトリの URL（詳細ページに「GitHub でコードを見る」ボタンが出る） */
		github: z.string().url().optional(),
		tags: z.array(z.string()).default([]),
		/** 作品一覧の絞り込み用（BOOTH の商品は自動で「創作」に入る） */
		category: z.enum(Object.keys(WORK_CATEGORIES) as [keyof typeof WORK_CATEGORIES]).default("dev"),
		/** 表示順（小さいほど前） */
		order: z.number().default(0),
	}),
});

// BOOTH 商品の説明書・個別の規約: src/content/shop/{BOOTH の商品 ID}.mdx
// 商品情報そのものは BOOTH から取得する（src/lib/booth.ts）。本文が /shop/{ID} に載る
const shop = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/shop" }),
	schema: z.object({
		/** 物販カードの説明（未設定時は BOOTH の説明文の最初の段落） */
		summary: z.string().optional(),
		/**
		 * 配布ファイルの表示名（ファイル名 → 表示名）。
		 * ファイルは public/shop/{ID}/ に置けば自動で並ぶ。ここに無いものはファイル名で表示する
		 */
		labels: z.record(z.string(), z.string()).default({}),
	}),
});

export const collections = { works, shop };
