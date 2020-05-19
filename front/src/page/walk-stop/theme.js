import {createMuiTheme} from '@material-ui/core/styles';

const commonFontFamily = "Roboto, Helvetica, Arial, sans-serif";
const mainText = {
  color: '#ddd'
};

const darkTheme = {
  palette: {
    type: "dark",
    primary: {main: '#4caf50'},
    secondary: {main: '#e63066'},
    contrastText: mainText.color
  },
  overrides: {
    MuiTypography: {
      root: {fontFamily: commonFontFamily, ...mainText},
      h1: {fontSize: 35, fontWeight: "bold", textShadow: "1px 1px 2px #222", textAlign: "center"},
      h2: {fontSize: 20, fontWeight: "bold", textShadow: "1px 1px 2px #222"},
      body1: {fontSize: 14}
    },
    MuiAppBar: {colorPrimary: {color: "#eee"}},
    MuiListItemIcon: {root: {...mainText}},
    MuiIconButton: {root: {...mainText}}
  }
};

export const theme = createMuiTheme(darkTheme);
