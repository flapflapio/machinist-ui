import { useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { CognitoUserAmplify } from "@aws-amplify/ui-react/node_modules/@aws-amplify/ui";
import "@aws-amplify/ui-react/styles.css";
import "antd/dist/antd.css";
import { Amplify } from "aws-amplify";
import type { AppProps as NextAppProps } from "next/app";
import Head from "next/head";
import { createContext, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components";
import awsconfig from "../src/aws-exports";
import { theme } from "../src/util/styles";
import "./app.global.css";

Amplify.configure(awsconfig);

const Footer = styled.footer`
  display: none;
`;

type AuthProps = {
  signOut?: ReturnType<typeof useAuthenticator>["signOut"];
  user?: CognitoUserAmplify;
};

type AppProps = NextAppProps & AuthProps;

const AuthContext = createContext<AuthProps>({});

const App = ({
  signOut,
  user,
  Component,
  pageProps,
}: AppProps): JSX.Element => {
  const authPackage = useMemo(() => ({ user, signOut }), [user, signOut]);

  return (
    <>
      <Head>
        <title>Machinist</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
        />
      </Head>
      <AuthContext.Provider value={authPackage}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthContext.Provider>
      <Footer>Machinist</Footer>
    </>
  );
};

export default withAuthenticator(App);
