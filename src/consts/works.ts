export const WORK_CATEGORIES = {
	dev: "開発",
	creative: "創作",
} as const;

export type WorkCategory = keyof typeof WORK_CATEGORIES;
