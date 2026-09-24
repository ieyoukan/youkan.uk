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

// ===== ようかん =====
/** チョコミントのチップ（こげ茶の欠片を大小・縦横ばらばらに散らしたタイル。面ごとに位置をずらして使う） */
const CHOCO_CHIPS = [
	"radial-gradient(ellipse 4px 2px at 10% 14%, #3b2721 85%, transparent 100%)",
	"radial-gradient(ellipse 1.5px 3px at 41% 6%, #4a342c 85%, transparent 100%)",
	"radial-gradient(ellipse 3px 2.5px at 73% 24%, #3b2721 85%, transparent 100%)",
	"radial-gradient(ellipse 2px 1.5px at 24% 47%, #52392f 85%, transparent 100%)",
	"radial-gradient(ellipse 5px 2.5px at 58% 58%, #3b2721 85%, transparent 100%)",
	"radial-gradient(ellipse 1.5px 1.5px at 88% 71%, #4a342c 85%, transparent 100%)",
	"radial-gradient(ellipse 2.5px 3.5px at 16% 86%, #3b2721 85%, transparent 100%)",
	"radial-gradient(ellipse 2px 1.5px at 67% 93%, #52392f 85%, transparent 100%)",
].join(", ");

/**
 * ようかんの味ごとの色（淡く・少し暗く）。1 本のようかんは 1 色で、
 * 面ごとの明暗（top: 上面 / face: 断面 / side: 下側・影）だけで立体感と透明感を出す。
 * texture は面に重ねる模様（なければ none）。
 */
export const YOKAN_FLAVORS = {
	/** 小豆（ピンク寄り） */
	azuki: { top: "#a8606c", face: "#8a4552", side: "#6c3440", texture: "none", textureSize: "auto" },
	/** チョコミント（水色寄り）＋チョコチップ */
	mint: { top: "#7fb3b3", face: "#62999a", side: "#467a7c", texture: CHOCO_CHIPS, textureSize: "67px 59px" },
	/** 抹茶 */
	matcha: { top: "#8b9a52", face: "#6f7e3c", side: "#56632d", texture: "none", textureSize: "auto" },
} as const;

export type YokanFlavor = keyof typeof YOKAN_FLAVORS;
export const YOKAN_FLAVOR_NAMES = Object.keys(YOKAN_FLAVORS) as YokanFlavor[];

// ===== フリル・リボン（セクションの境目） =====
/** フリルのふちどり・ステッチ・ひだの色（キャラクターの服に合わせた水色） */
export const FRILL_OUTLINE = "#8fc0e6";
/** フリルの布（青みのある白） */
export const FRILL_FABRIC = "#f6fbff";
/** リボン（光沢なしの平らな塗り） */
export const RIBBON_BLUE = "#a9dcf6";
/** リボンのしっぽの裏・結び目 */
export const RIBBON_BLUE_SHADE = "#8ccbef";
/** リボンのふちどり */
export const RIBBON_BLUE_DEEP = "#5fa9d6";
