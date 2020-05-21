import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {theme} from "./theme";
import {Typography, Paper} from "@material-ui/core";
import InstructionPopper from "./components/InstructionPopper";
import {Animated} from "react-animated-css";
import PopupPoints from "./components/PopupPoints";

const isNumbers = keyNumber => [34, 38, 39, 40, 45, 95, 224, 231, 232, 233,
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(keyNumber);

const isLetter = keyNumber => (keyNumber >= 97 && keyNumber <= 122) || (keyNumber >= 65 && keyNumber <= 90);
const isSpace = keyNumber => keyNumber === 32;

const WalkStop = ({match: {params}}) => {
  const classes = useStyles();
  const instructionRef = useRef(null);
  const [points, setPoints] = useState("");

  useEffect(() => {
    window.addEventListener("keypress", e => {
      const input = isNumbers(e.which) ? "number" :
        isLetter(e.which) ? "letter" :
          isSpace(e.which) ? "space" : null;
      input && instructionRef.current.handleInput(input);
    });
    window.addEventListener("click", e => {
      instructionRef.current.handleInput("click");
    });
    window.addEventListener("mousemove", e => {
      instructionRef.current.handleInput("shake");
    });

    // const recognition = new window.webkitSpeechRecognition();
    // recognition.continuous = true;
    // recognition.start();
    // recognition.onspeechstart = event => {
    //   instructionRef.current.handleInput("speak");
    //   console.log("speak");
    //   recognition.stop(); // Force stop to detect speech start again
    // };
    // recognition.onend = function(e) {
    //   recognition.start();
    // }
  }, []);

  const success = (code, delay) => {
    if (code === "nothing" || delay < 500) {
      // console.log("1000 points", delay);
      addPoints(1000);
      return;
    }
    const points = Math.max(0, 1000 - (delay - 500));
    addPoints(points);
    // console.log(points + " points", delay);
  };
  const fail = (code) => {
    if (code === "nothing") {
      addPoints(-500);
      console.log("FAIL -500 points");
    } else {
      addPoints(0);
      console.log("FAIL 0 points");
    }
  };

  const addPoints = points => {
    setPoints(points);
    // setPointsVisible(true);
    // setTimeout(() => setPointsVisible(false), 600);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={0} square={true} className={classes.root}>
        <Typography variant={"h1"} className={classes.title}>
          Walk and stop (but sitted down) : {params.room}
        </Typography>

        <PopupPoints points={points} />

        <main className={classes.main}>
          <InstructionPopper ref={instructionRef} onSuccess={success} onFail={fail} />
        </main>
      </Paper>
    </ThemeProvider>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    padding: 25,
    flex: 0
  },
  main: {
    flex: 1
  },
  popupPoints: {
    position: "absolute",
    top: "50%",
    marginTop: -150,
    right: "10%",
    fontSize: 50,
    fontWeight: "bold"
  },
  positivePoints: {
    color: "#5aff5a"
  },
  negativePoints: {
    color: "#ff7676"
  }
}));

WalkStop.propTypes = {};
WalkStop.defaultProps = {};

export default WalkStop;