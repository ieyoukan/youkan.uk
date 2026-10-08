/**
 * URL から og:image を取得するユーティリティ（ビルド時に使う）。
 * タイムアウト 3 秒、失敗時は undefined を返す。相対 URL は絶対 URL に直して返す。
 */
export async function fetchOgpImage(url: string): Promise<string | undefined> {
	try {
		const res = await fetch(url, {
			signal: AbortSignal.timeout(3000),
			// SNS のクローラーとして名乗らないと og:image を返さないサイトがある
			headers: { "User-Agent": "facebookexternalhit/1.1" },
		});
		const html = await res.text();
		const m =
			html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
			html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
		return m?.[1] ? new URL(m[1], url).href : undefined;
	} catch {
		return undefined;
	}
}
