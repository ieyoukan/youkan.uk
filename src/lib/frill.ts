/**
 * セクション境目のフリルを SVG で作る。ビルド時にだけ使う。
 *
 * 1 枚の SVG = フリル 1 つ分（ruffleUnitSvg）。これを repeat-x で同じ形のまま横に並べる。
 * フリル 1 つの構造（上から）:
 *   - 上のセクションの色で塗った部分（境目の線からフリルの帯まで。継ぎ目を隠す）
 *   - 帯（ステッチ入り）。フリル 1 つごとに少したわんでいて、並べるとスカートの裾のように丸く連なる
 *   - ギャザーを寄せた布。裾は同じ大きさの丸い山が並び、山と山の間は布の裏が少し見える巻き込み
 * 線はすべてピンクのふちどり。横に並べたとき継ぎ目に縦線が出ないよう、左右の端には線を引かない。
 *
 * 返す SVG は「垂れ下がるフリル」（帯が上、裾が下）。flip で上下反転（上に立ち上がるフリル）。
 */

export type RuffleSize = {
	/** フリル 1 つの幅 */
	width: number;
	/** 裾の山の数 */
	lobes: number;
	/** 境目の線より上に塗り足す高さ（継ぎ目を隠す） */
	overlap: number;
	/** 帯のたわみ（まん中がどれだけ下がるか） */
	sag: number;
	/** 帯の太さ */
	band: number;
	/** 帯から裾までの布の長さ */
	length: number;
	/** 裾の山の深さ */
	lobeDepth: number;
};

export type RuffleOptions = RuffleSize & {
	/** 上のセクションの色（境目の線から帯まで） */
	sectionFill: string;
	/** 布の色 */
	fabric: string;
	/** ふちどりの色 */
	outline: string;
	/** 上下反転（上に立ち上がるフリル） */
	flip?: boolean;
};

/** SVG 全体の高さ */
export const ruffleHeight = (s: RuffleSize) => s.overlap + s.sag + s.band + s.length + s.lobeDepth + 4;

const r1 = (n: number) => Math.round(n * 10) / 10;

export function ruffleUnitSvg(o: RuffleOptions) {
	const { width: w, lobes, overlap, sag, band, length, lobeDepth } = o;
	const height = ruffleHeight(o);
	const lobe = w / lobes;

	// 帯の上端（境目の線 y = overlap から、まん中ほど下がる）
	const bandTop = (x: number) => overlap + sag * Math.sin((Math.PI * x) / w);
	const bandBottom = (x: number) => bandTop(x) + band;
	// 裾: 丸い山が並び、山と山の間は上にきゅっと寄る
	const hem = (x: number) => bandBottom(x) + length + lobeDepth * Math.abs(Math.sin((Math.PI * x) / lobe)) ** 0.7;

	const xs = Array.from({ length: Math.ceil(w / 2) + 1 }, (_, i) => Math.min(i * 2, w));
	const line = (f: (x: number) => number, from = xs) =>
		from.map((x, i) => `${i === 0 ? "M" : "L"}${r1(x)},${r1(f(x))}`).join(" ");
	const along = (f: (x: number) => number, from = xs) => from.map((x) => `L${r1(x)},${r1(f(x))}`).join(" ");
	const back = [...xs].reverse();

	// 上のセクションの色: 上端から帯の上端まで
	const section = `M0,0 L${w},0 ${along(bandTop, back)} Z`;
	// 布（帯＋ギャザー）
	const fabric = `${line(bandTop)} ${along(hem, back)} Z`;

	// ギャザーのひだ: 帯から裾の谷へ細くのびる影（谷ごとに濃く、山のまん中に薄く）
	const fold = (x: number, strength: number, reach: number) => {
		const top = bandBottom(x) + 1;
		const bottom = top + (hem(x) - top) * reach;
		const spread = lobe * 0.12 * strength;
		return `<path d="M${r1(x - 1)},${r1(top)} L${r1(x + 1)},${r1(top)} Q${r1(x + spread * 0.6)},${r1((top + bottom) / 2)} ${r1(x + spread)},${r1(bottom)} L${r1(x - spread)},${r1(bottom)} Q${r1(x - spread * 0.6)},${r1((top + bottom) / 2)} ${r1(x - 1)},${r1(top)} Z" fill="${o.outline}" fill-opacity="${r1(0.16 * strength * 100) / 100}"/>`;
	};
	const joins = Array.from({ length: lobes + 1 }, (_, i) => i * lobe);
	const middles = Array.from({ length: lobes }, (_, i) => (i + 0.5) * lobe);
	const folds = [...joins.map((x) => fold(x, 1, 0.92)), ...middles.map((x) => fold(x, 0.55, 0.7))].join("");

	// 谷の巻き込み（布の裏が少し見える）
	const tucks = joins
		.map((x) => {
			const y = hem(x);
			return `<path d="M${r1(x - 6)},${r1(y + 3)} Q${r1(x)},${r1(y - 7)} ${r1(x + 6)},${r1(y + 3)}" fill="${o.outline}" fill-opacity="0.18" stroke="${o.outline}" stroke-width="1.6" stroke-linecap="round"/>`;
		})
		.join("");

	const stroke = `fill="none" stroke="${o.outline}" stroke-linecap="round" stroke-linejoin="round"`;
	const body = [
		`<path d="${section}" fill="${o.sectionFill}"/>`,
		`<path d="${fabric}" fill="${o.fabric}"/>`,
		folds,
		// 帯のふちどりとステッチ
		`<path d="${line(bandTop)}" ${stroke} stroke-width="2"/>`,
		`<path d="${line(bandBottom)}" ${stroke} stroke-width="1.6"/>`,
		`<path d="${line((x) => bandTop(x) + band / 2)}" ${stroke} stroke-width="1.3" stroke-dasharray="6 5"/>`,
		// 裾のふちどり
		`<path d="${line(hem)}" ${stroke} stroke-width="2.2"/>`,
		tucks,
	].join("");

	const content = o.flip ? `<g transform="translate(0,${height}) scale(1,-1)">${body}</g>` : body;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${height}" viewBox="0 0 ${w} ${height}">${content}</svg>`;
}

/** CSS の background-image 用 url("data:...") */
export const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** #rrggbb 同士を混ぜる（t = 0 で a、1 で b） */
export function mixHex(a: string, b: string, t: number) {
	const parse = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
	const [ca, cb] = [parse(a), parse(b)];
	return `#${ca
		.map((v, i) =>
			Math.round(v + (cb[i] - v) * t)
				.toString(16)
				.padStart(2, "0"),
		)
		.join("")}`;
}
