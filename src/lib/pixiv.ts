/**
 * pixiv のピックアップ作品を取得するユーティリティ（ビルド時に実行）。
 *
 * - 一覧: pixiv 公式 API はないため、プロフィールページが使う /ajax/user/{id}/profile/all の pickup を使う
 * - 画像: i.pximg.net は Referer 必須で直接埋め込めないため、SNS 埋め込み用の
 *   embed.pixiv.net/artwork.php（1200×630 にトリミング済み）を使う
 * 失敗時は空配列を返す（pixiv 側の仕様変更でビルドが落ちないように）。
 */

export const PIXIV_USER_ID = "36804964";
export const PIXIV_PROFILE_URL = `https://www.pixiv.net/users/${PIXIV_USER_ID}`;

export type PixivArtwork = {
	id: string;
	title: string;
	/** 作品ページ */
	url: string;
	/** 埋め込み用画像（1200×630） */
	image: string;
};

type PickupItem = {
	type: string;
	id: string;
	title: string;
	xRestrict: number;
};

export async function fetchPixivPickup(userId = PIXIV_USER_ID): Promise<PixivArtwork[]> {
	try {
		const res = await fetch(`https://www.pixiv.net/ajax/user/${userId}/profile/all?lang=ja`, {
			headers: { "User-Agent": "Mozilla/5.0 (youkan.uk build)" },
			signal: AbortSignal.timeout(5000),
		});
		if (!res.ok) return [];
		const json = (await res.json()) as { error: boolean; body?: { pickup?: PickupItem[] } };
		if (json.error) return [];

		return (json.body?.pickup ?? [])
			// イラストのみ・全年齢のみ
			.filter((item) => item.type === "illust" && item.xRestrict === 0)
			.map((item) => ({
				id: item.id,
				title: item.title,
				url: `https://www.pixiv.net/artworks/${item.id}`,
				image: `https://embed.pixiv.net/artwork.php?illust_id=${item.id}`,
			}));
	} catch {
		return [];
	}
}
