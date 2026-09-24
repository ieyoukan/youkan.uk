import { BUTTON_BG, BUTTON_ICON, BUTTON_TEXT, TEXT_PRIMARY, TEXT_SECONDARY } from "@consts/theme";
import { css, cx } from "@styled/css";

/** ファイル共有ページ共通のスタイル */

export const shareMain = css({
	width: "100%",
	minHeight: "100vh",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "6rem 1rem",
});

export const shareCard = css({
	width: "100%",
	display: "flex",
	flexDirection: "column",
	gap: "1.5rem",
	padding: { base: "2rem 1.5rem", md: "3rem" },
	backgroundColor: "rgba(255,255,255,0.85)",
	backdropFilter: "blur(16px)",
	borderRadius: "28px",
	border: "2px dashed rgba(255,182,213,0.8)",
	boxShadow: "0 8px 40px rgba(180,120,200,0.18)",
	color: TEXT_PRIMARY,
});

export const shareTitle = css({
	margin: 0,
	fontSize: { base: "1.8rem", md: "2.3rem" },
	fontWeight: "bold",
	textAlign: "center",
	color: TEXT_PRIMARY,
});

export const shareMuted = css({
	color: TEXT_SECONDARY,
	textAlign: "center",
});

export const shareIconBubble = css({
	display: "grid",
	placeItems: "center",
	flexShrink: 0,
	borderRadius: "50%",
	background: BUTTON_BG,
	color: "white",
});

const buttonBase = css({
	display: "inline-flex",
	alignItems: "center",
	gap: "0.5rem",
	padding: "0.8rem 1.8rem",
	borderRadius: "999px",
	fontWeight: "bold",
	fontSize: "1rem",
	fontFamily: "inherit",
	textDecoration: "none",
	cursor: "pointer",
	transition: "transform 0.2s ease, box-shadow 0.2s ease",
	_hover: { transform: "translateY(-2px)" },
	_active: { transform: "translateY(0) scale(0.97)" },
	_focusVisible: { outline: `3px solid ${BUTTON_ICON}`, outlineOffset: "3px" },
});

export const shareButtonPrimary = cx(
	buttonBase,
	css({
		border: "2px solid white",
		background: BUTTON_BG,
		color: BUTTON_TEXT,
		boxShadow: "0 4px 16px rgba(200,150,200,0.3)",
		_hover: { boxShadow: "0 8px 24px rgba(200,150,200,0.45)" },
	}),
);

export const shareButtonSecondary = cx(
	buttonBase,
	css({
		border: "2px solid rgba(255,182,213,0.8)",
		background: "white",
		color: BUTTON_TEXT,
		_hover: { boxShadow: "0 6px 18px rgba(200,150,200,0.3)" },
	}),
);
