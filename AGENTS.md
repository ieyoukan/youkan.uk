# AGENTS.md — youkan.uk 開発ガイドライン

## スタイリング

- **CSS は必ず PandaCSS で書く**（`css()`, `cx()` from `@styled/css`）
- `<style>` タグや インラインの `style=` 属性での記述は原則禁止
  - 例外: SVG の `fill` / `stroke` など PandaCSS トークンが届かない属性、またはサーバーサイドで動的に生成する値（波の背景 URL など）
- 色・スペーシング・フォントなどのデザイントークンは `panda.config.ts` で管理する
- 生の色値は `src/consts/theme.ts` にまとめ、そこから import する

## コンポーネント設計

- **その場しのぎの実装をしない** — 再利用・拡張を見据えてコンポーネントに切り出す
- セクションの背景・波・アニメーションは `SectionBackground.astro` に集約する（外から `fill` などを渡さない）
- レイアウト（`<html>`, `<head>`, グローバルスクリプト）は `src/layouts/` に置く
- SEO / OGP メタは `MetaHead.astro` に集約する

## デザイン方針

- **かわいい** デザインを目指す（洗練・ミニマル志向ではない）
- テーマ: 天使 / ロリータ / 電子的 / 水 / フリル
- 色は ピンク → 水色 のグラデーションを基調とする（`SECTION_LIGHT_TOP` → `SECTION_LIGHT_BOT`）
- アニメーションは控えめに、雲のようにゆっくり浮き上がる動きを意識する

## 画像配信

- **`public/` に画像を置かない**（favicon・OGP用 PNG・ダウンロードファイルを除く）
- 最適化対象の画像は `src/assets/` に置き、`astro:assets` の `<Image>` または `getImage()` を使う
  - ビルド時に Sharp が WebP 変換・リサイズを行う
  - `format: "webp"`, `quality: 85` を基本とする
- OGP 画像は SNS 互換のため PNG を `public/` に残す（WebP 非対応の SNS がある）
- `<video poster>` など `<Image>` が使えない箇所は `getImage()` でURLを取得する
- 動的に画像 URL を切り替える場合（カーソルなど）は `data-*` 属性に URL を埋めて JS から参照する

### レスポンシブ画像

- 表示サイズより大きい画像を配信しない。`<Image>` / `getImage()` には表示幅に合わせて `widths`（幅違いの `srcset`）と `sizes` を必ず渡す
  - `sizes` はレイアウト（グリッドの列数・max-width・余白）から計算し、根拠をコメントに残す
  - 表示枠の比率が決まっている画像は `width` + `height` + `fit="cover"` でビルド時にその比率へ切り抜く
- JS で `src` を切り替える画像は、URL だけでなく `srcset` も `data-*` に埋め、先読みする `Image` にも `sizes` / `srcset` を揃える
- `<video poster>` は `srcset` を持てないので、全画面に足りる幅（1600px 程度）に縮めた 1 枚を `getImage()` で出す
- 外部サイトの画像（favicon・OGP など）を実行時にそのまま読み込まない。ビルド時に取り込んで WebP 化するか、`src/assets/` の元画像を使う

### 動画

- ヒーロー背景の `public/hero.webm` は撮影・圧縮をユーザーが別途行って置く（撮影までは 404 のままで構わない）

## クローラー・AI エージェント向け

- `src/pages/404.astro` を必ず残す。無いと Cloudflare Pages は存在しない URL にトップページを 200 で返し、`/llms.txt` などを問い合わせたクローラーが HTML を受け取ってしまう
- `llms.txt` は `src/pages/llms.txt.ts` でビルド時に生成する（作品は `src/content/works`、リンクは `src/consts/links.ts` から組み立てる。手書きしない）
- `ai-catalog.json` / `ard.json`（ARD）は、AI エージェントが呼び出せる API・MCP サーバーを公開するまで置かない

## 技術スタック

- **Astro** (`output: "server"`, Cloudflare adapter)
- **PandaCSS** (`@pandacss/dev`)
- **Cloudflare Pages** でホスティング
- フォントは Google Fonts (Zen Maru Gothic) を JS でノンブロッキング挿入する
- CSS は `build.inlineStylesheets: "always"` で HTML にインライン化する（レンダリングブロックする外部 CSS を出さない）
