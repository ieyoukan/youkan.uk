import fs from "node:fs";
import { fetchBoothItemsFromApi } from "../src/lib/boothApi.ts";

// BOOTH の商品のスナップショットを src/data/booth-fallback.json に書き出す。
// ビルド環境から BOOTH が取得できなかったときの保険（src/lib/booth.ts 参照）。
// GitHub Actions（.github/workflows/update-fallbacks.yml）が定期実行する。手動で更新するなら:
//   node scripts/update-booth-fallback.mjs

const OUT_PATH = new URL("../src/data/booth-fallback.json", import.meta.url);

async function main() {
	const items = await fetchBoothItemsFromApi();
	if (items.length === 0) {
		console.warn("[booth-fallback] 商品が 0 件でした。既存のスナップショットは上書きしません。");
		return;
	}
	fs.writeFileSync(OUT_PATH, `${JSON.stringify(items, null, "\t")}\n`);
	console.log(`[booth-fallback] ${items.length} 件を書き出しました`);
}

main().catch((err) => {
	console.error("[booth-fallback] 更新に失敗しました:", err.message);
	process.exitCode = 1;
});
