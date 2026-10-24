import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";
import { externalGoods } from "../data/goods";
import { boothPriceLabel, boothSummary, fetchBoothItems } from "./booth";

/** 物販カード 1 枚ぶん（自分のショップ・他のショップ共通） */
export type Goods = {
	title: string;
	description: string;
	category: string;
	image: ImageMetadata | string;
	href: string;
	/** 他サイト（BOOTH）へ直接飛ぶか。自分のショップの商品は /shop/{ID} に飛ぶ */
	external: boolean;
	price?: string;
};

/** 自分のショップの商品（新しい順）→ 他のショップの商品 の順 */
export async function getGoods(): Promise<Goods[]> {
	const docs = await getCollection("shop");
	const own = (await fetchBoothItems()).map((item) => ({
		title: item.name,
		description: docs.find((d) => d.id === item.id)?.data.summary ?? boothSummary(item),
		category: item.category,
		image: item.images[0],
		href: `/shop/${item.id}`,
		external: false,
		price: boothPriceLabel(item.price),
	}));
	const external = externalGoods.map((g) => ({
		title: g.title,
		description: g.description,
		category: g.category,
		image: g.image,
		href: g.url,
		external: true,
	}));
	return [...own, ...external];
}
