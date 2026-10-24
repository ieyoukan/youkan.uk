/**
 * BOOTH ショップの商品を取得する（公式 API はないため、ショップページの埋め込みデータと商品 JSON を使う）。
 *
 * - 一覧: https://{shop}.booth.pm/items?page=N の各カードにある data-item 属性（JSON）
 * - 詳細: https://booth.pm/ja/items/{id}.json（説明文・全画像・タグ）
 *
 * Node の型ストリップで scripts/update-booth-fallback.mjs からも直接読み込むため、
 * 他モジュールを import せず、TS 固有の構文（enum など）も使わない。
 */

export const BOOTH_SHOP_URL = "https://p-nasi.booth.pm/";

export type BoothItem = {
	id: string;
	name: string;
	/** 表示用の価格（例: "¥ 500"） */
	price: string;
	category: string;
	/** ショップ内の商品ページ */
	url: string;
	/** 元サイズの画像（1 枚目がサムネイル） */
	images: string[];
	description: string;
	tags: string[];
	publishedAt: string;
};

const HEADERS = { "User-Agent": "Mozilla/5.0 (youkan.uk build)" };
const MAX_PAGES = 10;

function decodeEntities(s: string): string {
	return s
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&");
}

async function fetchItemIds(shopUrl: string): Promise<string[]> {
	const ids: string[] = [];
	for (let page = 1; page <= MAX_PAGES; page++) {
		const res = await fetch(new URL(`items?page=${page}`, shopUrl), {
			headers: HEADERS,
			signal: AbortSignal.timeout(8000),
		});
		if (!res.ok) throw new Error(`BOOTH shop page responded ${res.status}`);
		const html = await res.text();
		const found = [...html.matchAll(/data-item="([^"]+)"/g)]
			.map((m) => JSON.parse(decodeEntities(m[1])) as { id: number; is_adult: boolean })
			.filter((item) => !item.is_adult)
			.map((item) => String(item.id));
		if (found.length === 0) break;
		ids.push(...found.filter((id) => !ids.includes(id)));
	}
	return ids;
}

type ItemJson = {
	id: number;
	name: string;
	price: string;
	url: string;
	description: string;
	published_at: string;
	category: { name: string };
	images: { original: string }[];
	tags: { name: string }[];
};

async function fetchItem(id: string): Promise<BoothItem> {
	const res = await fetch(`https://booth.pm/ja/items/${id}.json`, {
		headers: HEADERS,
		signal: AbortSignal.timeout(8000),
	});
	if (!res.ok) throw new Error(`BOOTH item ${id} responded ${res.status}`);
	const json = (await res.json()) as ItemJson;
	return {
		id,
		name: json.name,
		price: json.price,
		category: json.category.name,
		url: json.url,
		images: json.images.map((img) => img.original),
		description: json.description.trim(),
		tags: json.tags.map((t) => t.name),
		publishedAt: json.published_at,
	};
}

/** 新しい順（ショップページの並び）。失敗時は例外を投げる */
export async function fetchBoothItemsFromApi(shopUrl = BOOTH_SHOP_URL): Promise<BoothItem[]> {
	const ids = await fetchItemIds(shopUrl);
	return Promise.all(ids.map(fetchItem));
}
