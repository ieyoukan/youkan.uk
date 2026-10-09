/**
 * カーソル演出（水紋トレイル＋クリックの輪）。
 * カーソル本体は MouseStalker.astro が担当する。見た目は panda.config.ts の
 * .cursor-ripple / .cursor-burst（globalCss）を使う。
 */

/** 水紋を出す最短間隔（ms）。約 15fps */
const RIPPLE_INTERVAL = 65;

function spawn(className: string, x: number, y: number): void {
	const el = document.createElement("div");
	el.className = className;
	el.style.left = `${x}px`;
	el.style.top = `${y}px`;
	document.body.appendChild(el);
	// アニメーション終了後に削除
	el.addEventListener("animationend", () => el.remove(), { once: true });
}

export function setupCursorEffects(): void {
	let lastRipple = 0;
	document.addEventListener("mousemove", (e) => {
		const now = performance.now();
		if (now - lastRipple < RIPPLE_INTERVAL) return;
		lastRipple = now;
		spawn("cursor-ripple", e.clientX, e.clientY);
	});
	document.addEventListener("click", (e) => {
		// キーボードでの決定（座標 0,0）では出さない
		if (e.detail === 0) return;
		spawn("cursor-burst", e.clientX, e.clientY);
	});
}
