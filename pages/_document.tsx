import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

/**
 * This `_document.js` includes some code for fixing the "className did not
 * match" bug that happens with Next.js SSR with styled-components.
 */
export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<{
    styles: JSX.Element;
    html: string;
    head?: JSX.Element[];
  }> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render(): JSX.Element {
    return (
      <Html>
        {/* prettier-ignore */}
        <Head>
          {/* <link rel="icon"       href={`${assetPrefix}/favicon.ico`} /> */}
          <link rel="icon" href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/31/baby-chick_1f424.png" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=B612:wght@700&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@300&display=swap" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
