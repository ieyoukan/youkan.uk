import { defineConfig } from "@pandacss/dev";
import {
	SECTION_DARK_BG,
	SECTION_LIGHT_BG,
	SECTION_LIGHT_BOT,
	SECTION_LIGHT_TOP,
	TEXT_PRIMARY,
	TEXT_SECONDARY,
	WAVE_DOT,
} from "./src/consts/theme";

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
				// カーソル水紋エフェクト（GlobalLayout.astro の is:global CSS でも定義）
				waterDrop: {
					"0%":   { transform: "translate(-50%, -50%) scale(0.2)", opacity: "0.6" },
					"100%": { transform: "translate(-50%, -50%) scale(3.5)", opacity: "0" },
				},
				// About のポラロイド: クリックで下へ落ちる
				polaroidFall: {
					"0%":   { transform: "rotate(-3deg)", opacity: "1" },
					"20%":  { transform: "translateY(-14px) rotate(-7deg)", opacity: "1" },
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

	// スクロールバーをサイトの雰囲気（ピンク〜水色）に合わせる
	globalCss: {
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
