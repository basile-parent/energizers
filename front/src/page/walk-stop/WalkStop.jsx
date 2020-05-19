import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {theme} from "./theme";
import {Typography, Paper} from "@material-ui/core";

const WalkStop = ({match: {params}}) => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={0} square={true} className={classes.root}>
        <Typography variant={"h1"}>Walk and stop (but sitted down) : {params.room}</Typography>
      </Paper>
    </ThemeProvider>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: "100vh"
  },
}));

WalkStop.propTypes = {};
WalkStop.defaultProps = {};

export default WalkStop;