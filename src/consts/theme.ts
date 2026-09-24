/**
 * サイト全体の色定数。
 * panda.config.ts のトークン値・コンポーネントのインラインスタイル双方から参照することで
 * 色の一元管理を実現する。
 */

// ===== ライトセクション（リンク・作品） =====
/** グラデーション始端（上側）: やわらかいピンクホワイト */
export const SECTION_LIGHT_TOP = "#fff5f8";
/** グラデーション終端（下側）: やわらかい水色ホワイト */
export const SECTION_LIGHT_BOT = "#ebf4ff";
/**
 * セクション背景グラデーション。
 * 180deg（真上→真下）にすることで、上端が SECTION_LIGHT_TOP、
 * 下端が SECTION_LIGHT_BOT と一致し、波の fill 色とのシームがなくなる。
 */
export const SECTION_LIGHT_BG =
	`linear-gradient(180deg, ${SECTION_LIGHT_TOP} 0%, ${SECTION_LIGHT_BOT} 100%)`;

// ===== ダークセクション（サーバールーム） =====
export const SECTION_DARK_BG = "#1a1a2e";

// ===== 装飾 =====
/** フリル波の水玉ライン色 */
export const WAVE_DOT = "rgba(125,211,252,0.85)";

// ===== テキスト =====
export const TEXT_PRIMARY   = "#4a4a4a";
export const TEXT_SECONDARY = "#666";

// ===== ボタン =====
/** かわいいボタンの背景（ピンク → 水色） */
export const BUTTON_BG = "linear-gradient(135deg, rgba(255,182,213,0.95), rgba(180,220,255,0.95))";
/** ボタンの文字色 */
export const BUTTON_TEXT = "#5a3a5a";
/** ボタン内のアイコン色 */
export const BUTTON_ICON = "#e07aa8";
