import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
		/** 表示順（小さいほど前） */
		order: z.number().default(0),
	}),
});

export const collections = { works };
