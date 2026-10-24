import boothFallback from "../data/booth-fallback.json";
import { type BoothItem, fetchBoothItemsFromApi } from "./boothApi";

export { BOOTH_SHOP_URL, type BoothItem } from "./boothApi";

let cache: Promise<BoothItem[]> | undefined;

/**
 * BOOTH の商品一覧（ビルド時に実行。複数ページから呼ばれるので 1 回だけ取得する）。
 * pixiv と同じく、ビルド環境から取得できないときは src/data/booth-fallback.json を使う
 * （GitHub Actions が scripts/update-booth-fallback.mjs で定期更新する。src/lib/pixiv.ts 参照）。
 */
export function fetchBoothItems(): Promise<BoothItem[]> {
	cache ??= fetchBoothItemsFromApi().catch((err) => {
		console.warn("[booth] 取得に失敗したためフォールバックを使用します:", err);
		return boothFallback;
	});
	return cache;
}

/** カード用の短い説明（説明文の最初の段落） */
export function boothSummary(item: BoothItem): string {
	return item.description.split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim();
}

export function boothPriceLabel(price: string): string {
	return /^¥\s*0$/.test(price) ? "無料" : price;
}
