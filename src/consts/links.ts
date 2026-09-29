export type IconType = "twitter" | "github" | "misskey" | "bluesky" | "zenn" | "ogp";

export type SocialLink = {
	label: string;
	url: string;
	color: string;
	rotate: string;
	description?: string;
	isHomeServer?: boolean;
	icon: IconType;
};

export const socialLinks: SocialLink[] = [
	{
		label: "Twitter",
		url: "https://x.com/youkan0124",
		color: "#1da1f2",
		rotate: "-10deg",
		description: "@youkan0124",
		icon: "twitter",
	},
	{
		label: "GitHub",
		url: "https://github.com/ieyoukan",
		color: "#333",
		rotate: "5deg",
		description: "ieyoukan",
		icon: "github",
	},
	{
		label: "Misskey",
		url: "https://mi.youkan.uk/@youkan",
		color: "#54b468",
		rotate: "5deg",
		description: "@youkan@mi.youkan.uk",
		isHomeServer: true,
		icon: "misskey",
	},
	{
		label: "Bluesky",
		url: "https://bsky.app/profile/youkan.uk",
		color: "#0085ff",
		rotate: "-5deg",
		description: "@youkan.uk",
		icon: "bluesky",
	},
	{
		label: "Zenn",
		url: "https://zenn.dev/yokan",
		color: "#3ea8ff",
		rotate: "-4deg",
		description: "@yokan",
		icon: "zenn",
	},
	{
		label: "ぷぷりえ",
		url: "https://pple.vr2.info/casts/%E3%82%88%E3%81%86%E3%81%8B%E3%82%93/",
		color: "#ff6b9d",
		rotate: "3deg",
		description: "VRChatキャスト",
		icon: "ogp",
	},
];
