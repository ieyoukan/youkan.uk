import pixivFallback from "../data/pixiv-fallback.json";

/**
 * pixiv のピックアップ作品を取得するユーティリティ（ビルド時に実行）。
 *
 * - 一覧: pixiv 公式 API はないため、プロフィールページが使う /ajax/user/{id}/profile/all の pickup を使う
 * - 画像: i.pximg.net は Referer 必須で直接埋め込めないため、SNS 埋め込み用の
 *   embed.pixiv.net/artwork.php（1200×630 にトリミング済み）を使う
 * - 失敗時（pixiv 側の仕様変更・Cloudflare Pages のビルド環境が pixiv にブロックされる等）は
 *   ビルドを落とさず、src/data/pixiv-fallback.json のスナップショットにフォールバックする。
 *   IllustSection は結果が空だとセクションごと非表示にするため、素の空配列を返すと
 *   ビルドログにも残らないまま絵のセクションが消えてしまう（実際に起きた）。
 *   フォールバックは GitHub Actions が scripts/update-pixiv-fallback.mjs で定期更新する。
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
			signal: AbortSignal.timeout(8000),
		});
		if (!res.ok) {
			console.warn(`[pixiv] profile/all が ${res.status} を返したためフォールバックを使用します`);
			return pixivFallback;
		}
		const json = (await res.json()) as { error: boolean; body?: { pickup?: PickupItem[] } };
		if (json.error) {
			console.warn("[pixiv] profile/all がエラーを返したためフォールバックを使用します");
			return pixivFallback;
		}

		// イラストのみ・全年齢のみ。取得自体は成功していても、その時点で本当に
		// ピックアップが空という可能性もあるため、この場合はフォールバックしない。
		return (json.body?.pickup ?? [])
			.filter((item) => item.type === "illust" && item.xRestrict === 0)
			.map((item) => ({
				id: item.id,
				title: item.title,
				url: `https://www.pixiv.net/artworks/${item.id}`,
				image: `https://embed.pixiv.net/artwork.php?illust_id=${item.id}`,
			}));
	} catch (err) {
		// Cloudflare Pages のビルド環境が pixiv にブロック/タイムアウトされるケースを含む。
		// ここで空配列を返すと IllustSection ごと静かに消えるため、必ずログを残す。
		console.warn("[pixiv] 取得に失敗したためフォールバックを使用します:", err);
		return pixivFallback;
	}
}
