import { defineMiddleware } from "astro:middleware";

// 画像はすべてビルド時に最適化済み（prerender ページのみで使用）なので、実行時の /_image は不要。
// Cloudflare の /_image は許可したリモート URL へリダイレクトするだけで、
// remotePatterns で https を全許可しているとオープンリダイレクトになるため本番では塞ぐ。
// （dev では画像変換に /_image を使うので塞がない）
export const onRequest = defineMiddleware((context, next) => {
	if (import.meta.env.PROD && context.url.pathname === "/_image") {
		return new Response("Not Found", { status: 404 });
	}
	return next();
});
