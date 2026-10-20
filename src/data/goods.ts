import type { ImageMetadata } from "astro";
import pajamasImage from "../assets/goods/mokomoko-pajamas.jpg";
import cdImage from "../assets/goods/pupurie-cd.jpg";

export interface GoodsItem {
	title: string;
	description: string;
	category: string;
	image: ImageMetadata;
	url: string;
}

export const goods: GoodsItem[] = [
	{
		title: "なぞ？なぞ！ぷぷりえ☆大解決？",
		description: "私が歌った初のCDです!!少し高音だったけど頑張った!",
		category: "CD / ボーカル参加",
		image: cdImage,
		url: "https://pple.booth.pm/items/8648921",
	},
	{
		title: "もこもこぱじゃま",
		description: "初めて売った衣装。シュクレ(sucre)対応の、ふわふわなパジャマです！",
		category: "VRChat / 衣装",
		image: pajamasImage,
		url: "https://p-nasi.booth.pm/items/6763447",
	},
];
