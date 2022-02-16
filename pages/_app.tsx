import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../src/util/styles";
import "./app.global.css";

const Footer = styled.footer`
  display: none;
`;

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Machinist</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
      <Footer>Machinist</Footer>
    </>
  );
}
