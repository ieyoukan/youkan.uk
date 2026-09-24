import fs from 'fs';
import sharp from 'sharp';

// 元画像は src/assets/misskey/ の 1 か所だけで管理する。
// サイト内では astro:assets が WebP 化するが、Misskey 本体（mi.youkan.uk）は
// youkan.uk/misskey/assets/*.png を直接参照するため、ここで PNG を書き出す。
const srcDir = 'src/assets/misskey';
const outDir = 'public/misskey/assets';

async function main() {
    const icon = `${srcDir}/icon.png`;
    const banner = `${srcDir}/banner.png`;
    if (!fs.existsSync(icon) || !fs.existsSync(banner)) {
        console.warn(`[Icons] Source images in ${srcDir} not found! Skipping generation.`);
        return;
    }
    fs.mkdirSync(outDir, { recursive: true });

    // PWAやアプリアイコン用に、白背景で余白を持たせてリサイズする設定
    const bg = { r: 255, g: 255, b: 255, alpha: 1 };

    console.log(`[Icons] Generating 192x192 / 512x512 icons...`);
    await sharp(icon).resize({ width: 192, height: 192, fit: 'contain', background: bg }).toFile(`${outDir}/icon-192.png`);
    await sharp(icon).resize({ width: 512, height: 512, fit: 'contain', background: bg }).toFile(`${outDir}/icon-512.png`);

    // Misskey のアイコン・バナー（元画像が大きすぎるので表示に足りるサイズまで縮める）
    console.log(`[Icons] Generating icon.png / banner.png...`);
    await sharp(icon).resize({ width: 512, height: 512, fit: 'cover' }).png({ compressionLevel: 9 }).toFile(`${outDir}/icon.png`);
    await sharp(banner).resize({ width: 1920, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(`${outDir}/banner.png`);

    console.log("[Icons] Successfully generated misskey assets!");
}

main().catch(err => {
    console.error(`[Icons] Failed to generate icons:`, err);
    process.exit(1);
});
