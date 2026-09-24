import { getImage } from "astro:assets";
import videomockSrc from "../assets/hero/videomock.png";
import { fetchOgpImage } from "./ogp";

/**
 * 作品の表示用画像 URL を返す。指定あり → url の OGP → フォールバック の順。
 * ビルド時に WebP 化・リサイズする。
 * original は最適化前の URL（OGP メタ用。未設定・フォールバック時は undefined）。
 */
export async function getWorkImage(
	{ image, url }: { image?: string; url?: string },
	width: number,
): Promise<{ src: string; original?: string }> {
	const original = image ?? (url ? await fetchOgpImage(url) : undefined);
	if (original) {
		try {
			const { src } = await getImage({ src: original, inferSize: true, width, format: "webp", quality: 85 });
			return { src, original };
		} catch {
			// 取得・変換に失敗したときは元の URL をそのまま使う
			return { src: original, original };
		}
	}
	const { src } = await getImage({ src: videomockSrc, width, format: "webp", quality: 85 });
	return { src };
}
