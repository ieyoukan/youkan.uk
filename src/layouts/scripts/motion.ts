/** OS の「視差効果を減らす」設定。true のときは動きの演出を止める */
export const prefersReducedMotion = (): boolean =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;
