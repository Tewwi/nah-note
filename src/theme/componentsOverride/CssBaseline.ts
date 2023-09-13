export const CssBaseline = () => {
  return {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'SVN-Sofia Pro Regular';
          font-style: normal;
          font-weight: 400;
          src: url("/fonts/SVN-Sofia Pro/SVN-SofiaPro-Regular.woff2")
               format("woff2");
        }

        @font-face {
          font-family: 'SVN-Sofia Pro Medium';
          font-style: normal;
          font-weight: 400;
          src: url("/fonts/SVN-Sofia Pro/SVN-SofiaPro-Medium.woff2")
               format("woff2");
        }
      `,
    },
  };
};
