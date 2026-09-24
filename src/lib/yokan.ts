import { YOKAN_FLAVOR_NAMES, type YokanFlavor } from "@consts/theme";

/** ランダムなようかんの味。exclude を渡すとそれ以外から選ぶ（隣の行と同じ色にしない） */
export function randomFlavor(exclude?: YokanFlavor): YokanFlavor {
	const candidates = YOKAN_FLAVOR_NAMES.filter((name) => name !== exclude);
	return candidates[Math.floor(Math.random() * candidates.length)];
}
