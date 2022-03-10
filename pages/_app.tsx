import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "antd/dist/antd.css";
import { Amplify } from "aws-amplify";
import type { AppProps } from "next/app";
import Head from "next/head";
import styled, { ThemeProvider } from "styled-components";
import awsconfig from "../src/aws-exports";
import theme from "../src/util/styles";
import "./app.global.css";

Amplify.configure({ ...awsconfig });

const Footer = styled.footer`
  display: none;
`;

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <>
    <Head>
      <title>Machinist</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
      />
    </Head>
    <Authenticator.Provider>
      <ThemeProvider theme={theme}>
        <Authenticator>{() => <Component {...pageProps} />}</Authenticator>
      </ThemeProvider>
    </Authenticator.Provider>
    <Footer>Machinist</Footer>
  </>
);

export default App;
