import fs from "node:fs";

// pixiv のピックアップ作品のスナップショットを src/data/pixiv-fallback.json に書き出す。
//
// なぜ必要か: IllustSection はビルド時に pixiv の ajax API を叩いて絵を表示するが、
// Cloudflare Pages のビルド環境からのアクセスが pixiv 側にブロック/レート制限される
// ことがあり、失敗すると catch で握りつぶされてセクションごと静かに消えてしまう
// （src/lib/pixiv.ts 参照）。その保険として、取得に成功したときのスナップショットを
// リポジトリにコミットしておき、ビルド時の取得が失敗したらこちらにフォールバックする。
//
// GitHub Actions（.github/workflows/update-pixiv-fallback.yml）が定期実行する。手動で更新するなら:
//   node scripts/update-pixiv-fallback.mjs

const PIXIV_USER_ID = "36804964";
const OUT_PATH = new URL("../src/data/pixiv-fallback.json", import.meta.url);

async function main() {
	const res = await fetch(`https://www.pixiv.net/ajax/user/${PIXIV_USER_ID}/profile/all?lang=ja`, {
		headers: { "User-Agent": "Mozilla/5.0 (youkan.uk build)" },
		signal: AbortSignal.timeout(8000),
	});
	if (!res.ok) throw new Error(`pixiv API responded ${res.status}`);
	const json = await res.json();
	if (json.error) throw new Error("pixiv API returned an error");

	const artworks = (json.body?.pickup ?? [])
		.filter((item) => item.type === "illust" && item.xRestrict === 0)
		.map((item) => ({
			id: item.id,
			title: item.title,
			url: `https://www.pixiv.net/artworks/${item.id}`,
			image: `https://embed.pixiv.net/artwork.php?illust_id=${item.id}`,
		}));

	if (artworks.length === 0) {
		console.warn("[pixiv-fallback] pickup が空でした。既存のスナップショットは上書きしません。");
		return;
	}

	fs.writeFileSync(OUT_PATH, `${JSON.stringify(artworks, null, "\t")}\n`);
	console.log(`[pixiv-fallback] ${artworks.length} 件を書き出しました: ${OUT_PATH.pathname}`);
}

main().catch((err) => {
	console.error("[pixiv-fallback] 更新に失敗しました:", err.message);
	process.exitCode = 1;
});
