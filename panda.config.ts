import { defineConfig } from "@pandacss/dev";
import {
	SECTION_DARK_BG,
	SECTION_LIGHT_BG,
	SECTION_LIGHT_BOT,
	SECTION_LIGHT_TOP,
	TEXT_PRIMARY,
	TEXT_SECONDARY,
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
		"./pages/**/*.{js,jsx,ts,tsx,astro}",
	],

	exclude: [],

	theme: {
		extend: {
			tokens: {
				colors: {
					section: {
						lightBg:  { value: SECTION_LIGHT_BG },
						lightTop: { value: SECTION_LIGHT_TOP },
						lightBot: { value: SECTION_LIGHT_BOT },
						darkBg:   { value: SECTION_DARK_BG },
					},
					wave: {
						dot: { value: WAVE_DOT },
					},
					text: {
						primary:   { value: TEXT_PRIMARY },
						secondary: { value: TEXT_SECONDARY },
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
				// 戻るボタンの矢印がぴょこぴょこ動く
				backArrowHop: {
					"0%, 100%": { transform: "translateX(0)" },
					"50%":      { transform: "translateX(-4px)" },
				},
			},
		},
	},

	globalCss: {
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
