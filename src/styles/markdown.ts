import { css } from "@styled/css";

/**
 * Markdown / MDX 本文の共通スタイル。
 * 本文を包む要素に付ける（作品詳細・Misskey ページ）。
 */
export const markdownStyles = css({
	color: "#444",
	lineHeight: 1.8,
	"& h2": {
		fontSize: "1.5rem",
		fontWeight: "bold",
		color: "text.primary",
		marginTop: "2.5rem",
		marginBottom: "1rem",
		paddingBottom: "0.5rem",
		borderBottom: "2px dashed rgba(255,182,213,0.8)",
	},
	"& h3": {
		fontSize: "1.25rem",
		fontWeight: "bold",
		color: "text.primary",
		marginTop: "2rem",
		marginBottom: "0.8rem",
	},
	"& > :first-child": { marginTop: 0 },
	"& p": { marginBottom: "1.5rem" },
	"& a": {
		color: "#5c93e6",
		textDecoration: "none",
		transition: "color 0.2s",
		_hover: { color: "#3b71c7", textDecoration: "underline" },
	},
	"& ul, & ol": { marginBottom: "1.5rem", paddingLeft: "1.5rem" },
	"& ul": { listStyleType: "disc" },
	"& ol": { listStyleType: "decimal" },
	"& li": { marginBottom: "0.5rem" },
	"& li::marker": { color: "button.icon" },
	"& strong": { fontWeight: "bold" },
	"& code": {
		fontSize: "0.9em",
		padding: "0.1rem 0.4rem",
		borderRadius: "6px",
		backgroundColor: "rgba(180,220,255,0.3)",
	},
	"& pre": {
		marginBottom: "1.5rem",
		padding: "1rem 1.25rem",
		borderRadius: "12px",
		overflowX: "auto",
		fontSize: "0.9rem",
	},
	"& pre code": { padding: 0, backgroundColor: "transparent" },
	"& blockquote": {
		marginBottom: "1.5rem",
		padding: "0.5rem 1rem",
		borderLeft: "4px solid rgba(255,182,213,0.9)",
		backgroundColor: "rgba(255,245,248,0.8)",
		borderRadius: "0 12px 12px 0",
	},
	"& img": { maxWidth: "100%", borderRadius: "12px" },
});
