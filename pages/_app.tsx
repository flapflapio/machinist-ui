import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../src/util/styles";
import "./app.global.css";

const Footer = styled.footer`
  display: none;
`;

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  // Below is for MUI integration with Next.js SSR
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
  }, []);

  return (
    <>
      {/* prettier-ignore */}
      <Head>
        <title>Machinist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no" />
        {/* <link rel="icon"       href={`${assetPrefix}/favicon.ico`} /> */}
        <link rel="icon" href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/31/baby-chick_1f424.png" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=B612:wght@700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@300&display=swap" />
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
      <Footer>Machinist</Footer>
    </>
  );
}
