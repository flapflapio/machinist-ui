import { css, DefaultTheme } from "styled-components";

const purple = ({ opacity = 1 } = {}): string => `rgba(39, 0, 84, ${opacity})`;
const blue = ({ opacity = 1 } = {}): string =>
  `hsla(240, 100%, 20%, ${opacity})`;

const theme: DefaultTheme = {
  colors: {
    sqlRed: "hsl(0, 100%, 30%)",
    preProBlue: blue(),
    seeThroughPurple: purple({ opacity: 0.623 }),
    createPurple: purple,
    createBlue: blue,
  },

  fonts: {
    B612: `
      "B612", Menlo, Monaco,
      Lucida Console, Liberation Mono,
      DejaVu Sans Mono, Bitstream Vera Sans Mono,
      Courier New, monospace
    `,
    IBMPlexSerif: `
      IBM Plex Serif
    `,
  },

  shadows: {
    sparse: "0px 11px 67px -4px rgba(0, 0, 0, 0.6)",
    medium: "0 3px 6px rgba(140, 149, 159, 0.15)",
    dark: "3px 3px 6px rgba(140, 149, 159, 0.568)",
  },

  transitions: {
    lifted: "all 700ms cubic-bezier(0.75, 0, 0.25, 1)",
    liftedFast: "all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1)",
    atndMenuBarBezier: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  },

  mixins: {
    unselectable: ({
      pointerEvents = false,
    }: { pointerEvents?: boolean } = {}) =>
      css`
        ${!pointerEvents && "pointer-events: none;"}
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
      `.toString(),
  },
};

export default theme;
export { theme };
