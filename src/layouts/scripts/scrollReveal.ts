/**
 * スクロールフェードイン。
 * [data-animate] 要素が画面内に入ったら is-visible を付与する（1 回のみ）。
 * 見た目（隠す・浮き上がる）は panda.config.ts の globalCss が担当する。
 */
export function setupScrollReveal(): void {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.08 },
	);
	for (const el of document.querySelectorAll("[data-animate]")) observer.observe(el);
}
