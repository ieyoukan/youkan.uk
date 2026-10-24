import type { ImageMetadata } from "astro";
import cdImage from "../assets/goods/pupurie-cd.jpg";

/**
 * 他のショップの物販（手で書く）。
 * 自分のショップ（p-nasi.booth.pm）の商品は BOOTH から自動で取得するのでここには書かない（src/lib/goods.ts）。
 */
export interface ExternalGoods {
	title: string;
	description: string;
	category: string;
	image: ImageMetadata;
	url: string;
}

export const externalGoods: ExternalGoods[] = [
	{
		title: "なぞ？なぞ！ぷぷりえ☆大解決？",
		description: "私が歌った初のCDです!!少し高音だったけど頑張った!",
		category: "CD / ボーカル参加",
		image: cdImage,
		url: "https://pple.booth.pm/items/8648921",
	},
];
