import { defineConfig } from "@pandacss/dev";
import {
	BUTTON_BG,
	BUTTON_ICON,
	BUTTON_TEXT,
	CURSOR_BURST,
	CURSOR_RIPPLE,
	FONT_BODY,
	FOOTER_BG,
	NAV_BORDER,
	NAV_HOVER,
	NAV_TEXT,
	SECTION_DARK_BG,
	SECTION_LIGHT_BG,
	SECTION_LIGHT_BOT,
	SECTION_LIGHT_TOP,
	SERVER_PHOTO_FRAME,
	SERVER_PHOTO_SURFACE,
	TEACUP_RIM,
	TEXT_BODY,
	TEXT_FAINT,
	TEXT_MUTED,
	TEXT_PRIMARY,
	TEXT_SECONDARY,
	TEXT_STRONG,
	WAVE_DOT,
	YOKAN_FLAVORS,
} from "./src/consts/theme";

// ようかんの味: [data-flavor="azuki"] などを付けた要素の中のようかんがその色になる（Yokan.astro）
const yokanFlavorCss = Object.fromEntries(
	Object.entries(YOKAN_FLAVORS).map(([name, c]) => [
		`[data-flavor="${name}"]`,
		{
			"--yk-top": c.top,
			"--yk-face": c.face,
			"--yk-side": c.side,
			"--yk-texture": c.texture,
			"--yk-texture-size": c.textureSize,
		},
	]),
);

export default defineConfig({
	preflight: true,

	include: [
		"./src/**/*.{js,jsx,ts,tsx,astro}",
	],

	exclude: [],

	theme: {
		extend: {
			// css() の中では theme.ts の定数を import して使わず、ここのトークンを名前で参照する
			// （import した値は Panda がビルド時に読み取れず、CSS が生成されないため）
			tokens: {
				fonts: {
					body: { value: FONT_BODY },
				},
				gradients: {
					button: { value: BUTTON_BG },
				},
				colors: {
					section: {
						lightBg:  { value: SECTION_LIGHT_BG },
						lightTop: { value: SECTION_LIGHT_TOP },
						lightBot: { value: SECTION_LIGHT_BOT },
						darkBg:   { value: SECTION_DARK_BG },
					},
					serverPhoto: {
						frame: { value: SERVER_PHOTO_FRAME },
						surface: { value: SERVER_PHOTO_SURFACE },
					},
					wave: {
						dot: { value: WAVE_DOT },
					},
					footer: {
						bg: { value: FOOTER_BG },
					},
					button: {
						text: { value: BUTTON_TEXT },
						icon: { value: BUTTON_ICON },
					},
					text: {
						primary:   { value: TEXT_PRIMARY },
						secondary: { value: TEXT_SECONDARY },
						strong:    { value: TEXT_STRONG },
						body:      { value: TEXT_BODY },
						muted:     { value: TEXT_MUTED },
						faint:     { value: TEXT_FAINT },
					},
					nav: {
						text:   { value: NAV_TEXT },
						hover:  { value: NAV_HOVER },
						border: { value: NAV_BORDER },
						teacupRim: { value: TEACUP_RIM },
					},
				},
			},
			keyframes: {
				// About のポラロイド: クリックで下へ落ちる
				polaroidFall: {
					"0%":   { transform: "rotate(-3deg)", opacity: "1" },
					"100%": { transform: "translateY(70vh) rotate(20deg)", opacity: "0" },
				},
				// About のポラロイド: 上から新しいカードがふわっと降りてくる
				polaroidDrop: {
					"0%":   { transform: "translateY(-70vh) rotate(-16deg)", opacity: "0" },
					"55%":  { transform: "translateY(12px) rotate(-1deg)", opacity: "1" },
					"78%":  { transform: "translateY(-6px) rotate(-4deg)" },
					"100%": { transform: "rotate(-3deg)", opacity: "1" },
				},
				// フッターの波・雲: タイル 1 枚分（--wave-w）横に流すとつなぎ目なくループする
				footerWave: {
					from: { transform: "translateX(0)" },
					to:   { transform: "translateX(calc(-1 * var(--wave-w)))" },
				},
				// カーソルの水紋トレイル（Layout.astro）
				waterDrop: {
					"0%":   { transform: "translate(-50%, -50%) scale(0.2)", opacity: "0.6" },
					"100%": { transform: "translate(-50%, -50%) scale(4.0)", opacity: "0" },
				},
				// クリックの輪（Layout.astro）
				burstOut: {
					"0%":   { transform: "translate(-50%, -50%) scale(0.2)", opacity: "1" },
					"100%": { transform: "translate(-50%, -50%) scale(2.5)", opacity: "0" },
				},
				// ティーカップの湯気がゆらゆら立ちのぼる（TeaCup.astro）
				steam: {
					"0%":   { transform: "translateY(0) scaleX(1)", opacity: "0" },
					"30%":  { opacity: "0.9" },
					"100%": { transform: "translateY(-14px) scaleX(1.6)", opacity: "0" },
				},
				// 戻るボタンの矢印がぴょこぴょこ動く
				backArrowHop: {
					"0%, 100%": { transform: "translateX(0)" },
					"50%":      { transform: "translateX(-4px)" },
				},
			},
		},
	},

	globalCss: {
		"html, body": {
			backgroundColor: "transparent",
			color: "#3a3a3a",
			fontFamily: "body",
			minHeight: "100vh",
			margin: 0,
		},
		body: { overflowX: "clip" },
		// カスタムカーソル（MouseStalker）が動き出したときだけ OS のカーソルを消す。
		// JS が動かない・タッチ端末のときは普通のカーソルのまま
		"[data-custom-cursor], [data-custom-cursor] *": { cursor: "none !important" },
		// ===== セクションコンテンツのフロートイン（Layout.astro の IntersectionObserver が is-visible を付ける） =====
		// JS が動く環境だけ隠す（JS が無いと中身が表示されないままになるため）
		"[data-js] [data-animate]": {
			opacity: 0,
			willChange: "transform, opacity",
			transition:
				"opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1), transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)",
			transitionDelay: "var(--stagger, 0s)",
		},
		// デフォルト: 下から / data-dir="left" | "right" で横から
		"[data-js] [data-animate]:not([data-dir])": { transform: "translateY(52px)" },
		"[data-js] [data-animate][data-dir=left]": { transform: "translateX(-80px)" },
		"[data-js] [data-animate][data-dir=right]": { transform: "translateX(80px)" },
		"[data-js] [data-animate].is-visible": { opacity: 1, transform: "none" },
		"@media (prefers-reduced-motion: reduce)": {
			"[data-js] [data-animate], [data-js] [data-animate][data-dir]": {
				opacity: 1,
				transform: "none",
				transition: "none",
			},
		},
		// 水紋トレイル・クリックの輪: mousemove / click のたびに JS で生成・削除
		".cursor-ripple": {
			position: "fixed",
			pointerEvents: "none",
			zIndex: 9997,
			width: "10px",
			height: "10px",
			borderRadius: "50%",
			background: CURSOR_RIPPLE,
			animation: "waterDrop 0.75s ease-out forwards",
		},
		".cursor-burst": {
			position: "fixed",
			pointerEvents: "none",
			zIndex: 9998,
			width: "28px",
			height: "28px",
			borderRadius: "50%",
			border: `2px solid ${CURSOR_BURST}`,
			animation: "burstOut 0.45s ease-out forwards",
		},
		// ようかんの切り分けが始まるまで隠す（JS が味を決めて演出を始めるときに外す）
		"[data-js] [data-yokan-wait]": { visibility: "hidden" },
		// ようかんのデフォルトは小豆
		":root": {
			"--yk-top": YOKAN_FLAVORS.azuki.top,
			"--yk-face": YOKAN_FLAVORS.azuki.face,
			"--yk-side": YOKAN_FLAVORS.azuki.side,
			"--yk-texture": YOKAN_FLAVORS.azuki.texture,
			"--yk-texture-size": YOKAN_FLAVORS.azuki.textureSize,
		},
		...yokanFlavorCss,
		// スクロールバーをサイトの雰囲気（ピンク〜水色）に合わせる
		"::-webkit-scrollbar": {
			width: "6px",
		},
		"::-webkit-scrollbar-track": {
			background: "transparent",
		},
		"::-webkit-scrollbar-thumb": {
			background: "linear-gradient(180deg, rgba(255,182,213,0.8), rgba(180,220,255,0.8))",
			borderRadius: "999px",
		},
		"::-webkit-scrollbar-thumb:hover": {
			background: "linear-gradient(180deg, rgba(255,150,190,1), rgba(140,200,255,1))",
		},
	},

	outdir: "styled-system",
});
