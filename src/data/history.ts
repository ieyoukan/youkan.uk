export interface HistoryEntry {
	date: string;
	dateLabel: string;
	endDate?: string;
	endDateLabel?: string;
	title: string;
	description?: string;
	link?: { url: string; label: string };
}

// 古い順に並べる。日付は月単位でも記録できる。
export const history: HistoryEntry[] = [
	{
		date: "2018-12",
		dateLabel: "2018.12",
		title: "VRChatに登録",
	},
	{
		date: "2024-08",
		dateLabel: "2024.08",
		title: "VRChatを再開！",
	},
	{
		date: "2025-04",
		dateLabel: "2025.04",
		title: "ぷぷりえ店員配属",
	},
	{
		date: "2025-04-22",
		dateLabel: "2025.04.22",
		title: "ぷぷりえーるのWebサイト制作を開始！",
		description: "ブラウザでデッキを組んだり、2pickで遊ぶ準備ができるサイトを作りはじめました。",
		link: {
			url: "https://pplale.vercel.app/",
			label: "ぷぷりえーるのサイトを見る",
		},
	},
	{
		date: "2026-03-24",
		dateLabel: "2026.03.24",
		title: "MisskeyのHDDが死んだけど、なんとかなった話",
		link: {
			url: "https://zenn.dev/yokan/articles/kubernetes-misskey-recovery",
			label: "復旧の記録を読む",
		},
	},
	{
		date: "2026-08-04",
		dateLabel: "2026.08.04",
		title: "おうちのサーバーにUPSを導入",
		description: "ここからMisskeyなどの自宅サーバーは落ちてません！（2026年10月時点）",
	},
	{
		date: "2026-09-02",
		endDate: "2026-09-11",
		dateLabel: "2026.09.02",
		endDateLabel: "09.11",
		title: "PIXIV SUMMER BOOT CAMP 2026に参加！",
		description: "pixivの夏インターンで、プレビュー環境を作りました。",
		link: {
			url: "https://zenn.dev/yokan/articles/pixiv-summer-intern-2026",
			label: "インターンのふりかえりを読む",
		},
	},
	{
		date: "2026-10-05",
		dateLabel: "2026.10.05",
		title: "ぷぷりえーるに対戦機能を追加！",
		description: "デッキ構築だけでなく、CPU対戦・ルーム対戦・観戦もブラウザでできるようになりました。",
		link: {
			url: "https://pplale.vercel.app/game/",
			label: "対戦ページを見る",
		},
	},
	{
		date: "2026-10-19",
		dateLabel: "2026.10.19",
		title: "ぷぷりえとして記事に登場！",
		description: "出張版！VRCくりえいてぃ部のレポートに、私が接客している様子も載っています！",
		link: {
			url: "https://metacul-frontier.com/?p=38424",
			label: "メタカル最前線で読む",
		},
	},
];
