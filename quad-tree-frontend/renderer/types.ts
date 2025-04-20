export type { PageContextServer };
export type { PageContextClient };
export type { PageContext };
export type { PageProps };

import type {
	PageContextServer as _PageContextServer,
	/*
  // When using Client Routing https://vike.dev/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
  /*/
	// When using Server Routing
	PageContextClientWithServerRouting as _PageContextClientWithServerRouting,
	//*/
} from "vike/types";

type Page = (pageProps: PageProps) => React.ReactElement;
type PageProps = Record<string, unknown>;

export type PageContextCustom = {
	Page: Page;
	pageProps?: PageProps;
	urlPathname: string;
	exports: {
		documentProps?: {
			title?: string;
			description?: string;
		};
	};
};

type PageContextServer = _PageContextServer<Page> & PageContextCustom;
type PageContextClient = _PageContextClientWithServerRouting<Page> &
	PageContextCustom;

type PageContext = PageContextClient | PageContextServer;
