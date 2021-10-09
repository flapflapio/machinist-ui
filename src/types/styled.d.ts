import { DefaultTheme } from "styled-components";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      sqlRed: string;
      preProBlue: string;
      seeThroughPurple: string;
      createPurple: ({ opacity }?: { opacity?: number }) => string;
      createBlue: ({ opacity }?: { opacity?: number }) => string;
      [key: string]: string | ((...args: any[]) => string);
    };

    fonts: {
      B612: string;
      IBMPlexSerif: string;
      [key: string]: string;
    };

    shadows: {
      sparse: string;
      medium: string;
      [key: string]: string;
    };

    transitions: {
      lifted: string;
      liftedFast: string;
      [key: string]: string;
    };

    mixins: {
      unselectable: ({ pointerEvents }?: { pointerEvents?: boolean }) => string;
      [key: string]: (...args: any[]) => string;
    };
  }
}
