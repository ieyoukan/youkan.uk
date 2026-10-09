/**
 * スムーズスクロール（Lenis）とページ内リンク（/#links など）の移動。
 * セクション側の変更は不要。
 */
import Lenis from "lenis";

/** ページ内リンクの href から移動先の id を取り出す（/#links → links） */
function hashTarget(href: string): string | null {
	if (href.startsWith("/#")) return href.slice(2);
	if (href.startsWith("#")) return href.slice(1);
	return null;
}

export function setupSmoothScroll({ smooth }: { smooth: boolean }): void {
	// duration: 大きいほどゆっくり (0.8〜1.6 推奨)
	const lenis = smooth
		? new Lenis({
				duration: 1.2,
				easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)), // expo 的な減衰
				touchMultiplier: 2,
			})
		: null;

	if (lenis) {
		const raf = (time: number) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};
		requestAnimationFrame(raf);
	}

	document.addEventListener("click", (e) => {
		const a = (e.target as Element | null)?.closest("a");
		if (!a) return;
		const id = hashTarget(a.getAttribute("href") ?? "");
		if (!id) return;
		const el = document.getElementById(id);
		if (!el) return;
		e.preventDefault();
		if (lenis) lenis.scrollTo(el, { offset: 0 });
		else el.scrollIntoView();
	});
}
