export { render };
// See https://vike.dev/data-fetching
export const passToClient = ["pageProps", "urlPathname"];

import ReactDOMServer from "react-dom/server";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import type { PageContextServer } from "./types";

async function render(pageContext: PageContextServer) {
	const { Page, pageProps } = pageContext;
	// This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
	if (!Page)
		throw new Error(
			"My render() hook expects pageContext.Page to be defined"
		);
	const pageHtml = ReactDOMServer.renderToString(
		<PageShell pageContext={pageContext}>
			<Page {...pageProps} />
		</PageShell>
	);

	// See https://vike.dev/head
	const { documentProps } = pageContext.exports;
	const title = (documentProps && documentProps.title) || "Quad Tree Imaging";
	const desc =
		(documentProps && documentProps.description) ||
		"Default Page for Quad Tree Imaging";

	const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body style="margin:0">
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

	return {
		documentHtml,
		pageContext: {
			// We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
		},
	};
}
