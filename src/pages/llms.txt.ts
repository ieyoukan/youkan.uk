import { getCollection } from "astro:content";
import { socialLinks } from "@consts/links";
import type { APIRoute } from "astro";

// https://llmstxt.org/ 形式（H1 → 要約の引用 → H2 ごとのリンク一覧）。
// 作品・リンクは content / consts から組み立てるので、追加すれば自動で反映される。
export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
	const origin = site?.origin ?? "https://youkan.uk";
	const works = (await getCollection("works")).sort((a, b) => a.data.order - b.data.order);

	const lines = [
		"# ようかんのホームページ",
		"",
		"> 家猫ようかん（Dev & VTuber / House Cat）の個人サイト。SNS リンク、作品、自宅サーバーの紹介を置いています。",
		"",
		"Web・インフラ・VR トラッカーなどの技術の話から、声や服の話までなんでもやっています。",
		"サイトは Astro + PandaCSS で作り、Cloudflare Pages でホスティングしています。",
		"",
		"## ページ",
		"",
		`- [ホーム](${origin}/): 自己紹介・リンク・作品・自宅サーバーの紹介`,
		`- [作品一覧](${origin}/works): 作ったものの一覧`,
		`- [ようかんのみすきー](${origin}/misskey): 自宅サーバーで運営している Misskey サーバーの紹介`,
		"",
		"## 作品",
		"",
		...works.map((work) => `- [${work.data.title}](${origin}/works/${work.id}): ${work.data.description}`),
		"",
		"## リンク",
		"",
		...socialLinks.map((link) => `- [${link.label}](${link.url})${link.description ? `: ${link.description}` : ""}`),
		"",
	];

	return new Response(lines.join("\n"), {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
