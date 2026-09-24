/**
 * ようかんの切り分けアニメーション（トップの作品欄・/works の各行で共通）。
 *
 * 画面の端から続く長いようかんが、端から少しだけ顔を出す。
 * 1 切れぶん押し出す → 端の近くの決まった位置で糸で切る → 切れ端はよけながら回ってカードへ、
 * を作品の数だけ繰り返す（奥のカードから）。押し出した分が切り取られるので、顔を出す長さは毎回同じに戻る。
 *
 * 遠近感: 全ての要素に「同じ消失点 V を中心にした perspective」をかける
 *   translate(V - c) perspective(P) translate(c - V) …   （c はその要素の中心）
 * これで別々の要素でも 1 つの空間にあるように見え、ようかんの切り口（角丸の断面）も見える。
 * カードに収まった切れ端は V = 自分の中心 になるように補間する（WorkCard の pieceStyles と同じ関数の並び）。
 *
 * 切れ端（WorkCard の data-yokan-piece）は最終的な位置に置いたまま、
 * WAAPI の fill: "backwards" で「ようかんの中にいた状態」から戻す。アニメーション後は CSS の状態に戻る。
 * 始まるまで隠しておく要素には data-yokan-wait を付けておき、ここで外す。
 */

const PERSPECTIVE = 900; // WorkCard の pieceStyles と同じ
const TILT = "rotateX(-6deg)";
const FINAL_TURN = "rotateX(-12deg) rotateY(-12deg)"; // WorkCard の pieceStyles と同じ
/**
 * 消失点: ようかんの行から上へ（上面が見えるように）、ようかんが出てくる画面端から内側へ。
 * 端に寄せるほど、奥の縁が内側にずれ込まない（カードに被らない）。遠すぎると切り口が見えない
 */
const EYE_ABOVE = 320;
const EYE_FROM_EDGE = 260;

const ENTER_MS = 500;
const PUSH_MS = 200;
const CUT_MS = 70; // 糸が通ってから切れ端が離れるまで
const FLY_MS = 420; // 切れ端がよけながら回ってカードに収まる時間
const NEXT_MS = 140; // 切れ端が離れてから次を押し出すまで
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
/** 押し出し: 動き出しも止まりもなめらかに */
const PUSH_EASING = "cubic-bezier(0.45, 0, 0.2, 1)";
/** 切れ端の移動: 途中で止めず 1 本のカーブで、最後だけほんの少し行き過ぎて収まる */
const FLY_EASING = "cubic-bezier(0.25, 0.8, 0.3, 1.06)";
/** 切る位置を画面端から最低これだけ内側に（糸が見えるように）／最大でもこれだけ（空いた行でも端っこで切る）／カードの手前に空ける間 */
const MIN_STUB = 8;
const MAX_STUB = 140;
const STUB_GAP = 20;

type Point = { x: number; y: number };

/** 消失点 v を中心にした遠近（c は要素の中心、画面座標） */
const persp = (c: Point, v: Point) =>
	`translate(${v.x - c.x}px, ${v.y - c.y}px) perspective(${PERSPECTIVE}px) translate(${c.x - v.x}px, ${c.y - v.y}px)`;

const centerOf = (el: Element): Point => {
	const r = el.getBoundingClientRect();
	return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

const cssPx = (el: Element, name: string) => Number.parseFloat(getComputedStyle(el).getPropertyValue(name));

export type YokanSlicerOptions = {
	/** 長いようかんのひな形（Yokan 要素）。断面は切れ端と同じ。複製して host に置く */
	loafTemplate: HTMLElement;
	/** ようかんと糸を置く position: relative の要素（ここからはみ出た分は画面端で切れる） */
	host: HTMLElement;
	/** この行のカード（中に data-yokan-stage / piece / shadow / text） */
	cards: HTMLElement[];
	threadTemplate: HTMLElement;
	/** 1: 左の画面端から / -1: 右の画面端から */
	dir: 1 | -1;
	/** 味（ようかん本体に付ける） */
	flavor?: string;
	/** data-yokan-wait を外す要素 */
	waiting: HTMLElement[];
};

export function playYokanSlicer({ loafTemplate, host, cards, threadTemplate, dir, flavor, waiting }: YokanSlicerOptions) {
	const reveal = () => {
		for (const el of waiting) delete el.dataset.yokanWait;
	};

	// 差し出す側から見た順（u 座標 = dir * x。u が小さいほど画面端側）
	const u = (x: number) => dir * x;
	const pieces = cards
		.map((card) => ({
			stage: card.querySelector<HTMLElement>("[data-yokan-stage]"),
			piece: card.querySelector<HTMLElement>("[data-yokan-piece]"),
			shadow: card.querySelector<HTMLElement>("[data-yokan-shadow]"),
			text: card.querySelector<HTMLElement>("[data-yokan-text]"),
		}))
		.filter((p): p is typeof p & { stage: HTMLElement; piece: HTMLElement } => p.stage !== null && p.piece !== null)
		.map((p) => ({ ...p, center: centerOf(p.stage) }))
		.sort((a, b) => u(a.center.x) - u(b.center.x));
	if (pieces.length === 0) return reveal();

	const vw = window.innerWidth;
	const slice = cssPx(pieces[0].piece, "--yk-d");
	const faceHalf = cssPx(pieces[0].piece, "--yk-w") / 2;
	const rowY = pieces[0].center.y;
	const eye: Point = { x: dir === 1 ? EYE_FROM_EDGE : vw - EYE_FROM_EDGE, y: rowY - EYE_ABOVE };

	// 切る位置（u）: 遠近で奥の縁は消失点側にずれて見えるので、そのずれ込みでも
	// いちばん端側のカードに被らない位置にする。狭い画面では画面端すれすれで切る
	const edgeU = dir === 1 ? 0 : -vw;
	const limit = u(pieces[0].center.x) - faceHalf - STUB_GAP;
	const backShift = (PERSPECTIVE + faceHalf) / PERSPECTIVE; // ようかんの奥行き = 断面の幅
	const stub = Math.max(
		edgeU + MIN_STUB,
		Math.min(edgeU + MAX_STUB, u(eye.x) + (limit - u(eye.x)) * backShift),
	);

	// ===== 長いようかんを置く（端から切る位置まで。はみ出た分は画面端で切れて角が見えない） =====
	const loaf = loafTemplate.cloneNode(true) as HTMLElement;
	for (const key of Object.keys(loaf.dataset)) delete loaf.dataset[key];
	if (flavor) loaf.dataset.flavor = flavor;
	// 画面の外まで届けば十分（長すぎると描く面積が増えて重くなる）
	const length = MAX_STUB + slice + 400;
	loaf.style.setProperty("--yk-d", `${length}px`);
	loaf.style.position = "absolute";
	loaf.style.pointerEvents = "none";
	host.prepend(loaf); // 切れ端より先に描く（切れ端が手前に重なる）

	const hostRect = host.getBoundingClientRect();
	loaf.style.left = `${pieces[0].center.x - hostRect.left + host.scrollLeft - loaf.offsetWidth / 2}px`;
	loaf.style.top = `${rowY - hostRect.top + host.scrollTop - loaf.offsetHeight / 2}px`;
	const loafCenter = centerOf(loaf);

	const turned = `${TILT} rotateY(${-90 * dir}deg)`;
	/** 先端が u = end のときの、ようかん本体の transform */
	const loafAt = (end: number) =>
		`${persp(loafCenter, eye)} translate(${dir * (end - length / 2) - loafCenter.x}px, 0px) ${turned}`;

	// ===== 時間割: 登場 → （押し出す → 切る → 離れる）× 作品数 =====
	type Frame = { time: number; end: number; easing?: string };
	const loafFrames: Frame[] = [
		{ time: 0, end: edgeU - 20, easing: EASE_OUT },
		{ time: ENTER_MS, end: stub },
	];

	let t = ENTER_MS;
	let lastEnd = 0;
	// 奥のカードから
	for (let k = pieces.length - 1; k >= 0; k--) {
		const p = pieces[k];
		const pushAt = t;
		const cutAt = pushAt + PUSH_MS + CUT_MS;
		const fly = u(p.center.x) > u(dir === 1 ? vw : 0) ? 260 : FLY_MS; // 画面外行きはすばやく
		const total = cutAt + fly;

		loafFrames.push(
			{ time: pushAt, end: stub, easing: PUSH_EASING },
			{ time: pushAt + PUSH_MS, end: stub + slice },
			// 切れた瞬間に切った分がようかんから無くなる（切れ端がちょうどそこを覆っている）
			{ time: cutAt, end: stub + slice },
			{ time: cutAt, end: stub },
		);

		// 切れ端: 押し出されるまでは隠れてようかんの先端に重なっている
		const at = (ms: number) => ms / total;
		const inLoaf = (centerU: number, visible: boolean) => ({
			transform: `${persp(p.center, eye)} translate(${dir * centerU - p.center.x}px, 0px) ${turned}`,
			visibility: visible ? "visible" : "hidden",
		});
		const final = `${persp(p.center, p.center)} translate(0px, 0px) ${FINAL_TURN}`;
		p.piece.animate(
			[
				{ ...inLoaf(stub - slice / 2, false), offset: 0 },
				{ ...inLoaf(stub - slice / 2, false), offset: at(pushAt), easing: PUSH_EASING },
				{ ...inLoaf(stub + slice / 2, true), offset: at(pushAt + PUSH_MS) },
				{ ...inLoaf(stub + slice / 2, true), offset: at(cutAt), easing: FLY_EASING },
				{ transform: final, visibility: "visible", offset: 1 },
			],
			{ duration: total, fill: "backwards" },
		);
		p.shadow?.animate(
			[
				{ opacity: 0, transform: `translateX(${dir * (stub + slice / 2) - p.center.x}px) scaleX(0.2)` },
				{
					opacity: 0,
					transform: `translateX(${dir * (stub + slice / 2) - p.center.x}px) scaleX(0.2)`,
					offset: at(cutAt),
					easing: FLY_EASING,
				},
				{ opacity: 1, transform: "translateX(0px) scaleX(1)" },
			],
			// easing はアニメーション全体ではなく区間ごとに（全体に付けると時間がゆがんで影が先に出る）
			{ duration: total, fill: "backwards" },
		);
		p.text?.animate(
			[
				{ opacity: 0, transform: "translateY(6px)" },
				{ opacity: 1, transform: "translateY(0)" },
			],
			{ duration: 200, delay: cutAt + fly * 0.6, fill: "backwards", easing: "ease-out" },
		);

		// 糸: いつも同じ切る位置に上から通る
		const thread = threadTemplate.cloneNode() as HTMLElement;
		thread.hidden = false;
		thread.style.left = `${dir * stub - hostRect.left + host.scrollLeft}px`;
		thread.style.top = `${rowY - hostRect.top + host.scrollTop - loaf.offsetHeight / 2 - 10}px`;
		thread.style.height = `${loaf.offsetHeight + 40}px`;
		host.append(thread);
		thread
			.animate(
				[
					{ transform: "scaleY(0)", opacity: 1 },
					{ transform: "scaleY(1)", opacity: 1, offset: 0.7 },
					{ transform: "scaleY(1)", opacity: 0 },
				],
				{ duration: CUT_MS + 90, delay: cutAt - CUT_MS, fill: "backwards", easing: "ease-in" },
			)
			.finished.then(() => thread.remove());

		lastEnd = cutAt;
		t = cutAt + NEXT_MS;
	}

	loafFrames.push({ time: lastEnd + 1, end: stub });
	const loafTotal = lastEnd + 1;
	loaf.animate(
		loafFrames.map((f) => ({ transform: loafAt(f.end), offset: f.time / loafTotal, easing: f.easing ?? "linear" })),
		{ duration: loafTotal, fill: "backwards" },
	);
	loaf.style.transform = loafAt(stub);
	reveal();
}
