/**
 * フッターの有機的な波を SVG で作る。ビルド時にだけ使う。
 * 幅 width のタイルで、横に繰り返しても継ぎ目が出ない（左右の端が同じ高さ・同じ傾き）。
 */

/** シード付き乱数（mulberry32） */
function random(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const r1 = (n: number) => Math.round(n * 10) / 10;

type Shape = {
	width: number;
	height: number;
	/** 波・雲の付け根の y（これより下は塗りつぶす） */
	base: number;
	fill: string;
	seed: number;
};

/**
 * おだやかな波: タイル幅で 1〜3 周する sin 波をランダムな位相で重ねる（低く、幅が広い）。
 * 周期がタイル幅の約数なので、つなぎ目で形も傾きもそろう。
 */
export function organicWaveSvg({ width, height, base, fill, seed, amplitude }: Shape & { amplitude: number }) {
	const rand = random(seed);
	const waves = [1, 2, 3].map((k, i) => ({
		k,
		a: amplitude * [0.55, 0.3, 0.15][i] * (0.8 + rand() * 0.4),
		phase: rand() * Math.PI * 2,
	}));
	const y = (x: number) => base - waves.reduce((sum, w) => sum + w.a * Math.sin((2 * Math.PI * w.k * x) / width + w.phase), 0);
	const points = Array.from({ length: Math.ceil(width / 4) + 1 }, (_, i) => Math.min(i * 4, width));
	const edge = points.map((x, i) => `${i === 0 ? "M" : "L"}${r1(x)},${r1(y(x))}`).join(" ");
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${edge} L${width},${height} L0,${height} Z" fill="${fill}"/></svg>`;
}
