import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from "./theme";
import {Typography, Paper, withStyles} from "@material-ui/core";
import InstructionPopper from "./components/InstructionPopper";

const isNumbers = keyNumber => [34, 38, 39, 40, 45, 95, 224, 231, 232, 233,
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(keyNumber);

const isLetter = keyNumber => (keyNumber >= 97 && keyNumber <= 122) || (keyNumber >= 65 && keyNumber <= 90);
const isSpace = keyNumber => keyNumber === 32;

class WalkStop extends React.Component {

  constructor(props) {
    super(props);
    this.instructionRef = React.createRef();
    this.myRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("keypress", e => {
      const input = isNumbers(e.which) ? "number" :
        isLetter(e.which) ? "letter" :
          isSpace(e.which) ? "space" : null;
      input && this.instructionRef.current.handleInput(input);
    });
    window.addEventListener("click", e => {
      this.instructionRef.current.handleInput("click");
    });
    window.addEventListener("mousemove", e => {
      this.instructionRef.current.handleInput("shake");
    });
  }

  _addPoints = (delay) => {
    if (delay < 500) {
      console.log("1000 points", delay);
      return;
    }
    const points = Math.max(0, 1000 - (delay - 500));
    console.log(points + " points", delay);
  };

  _fail = () => {
    console.log("FAIL 0 points");
  };

  render() {
    let {match: {params}, classes} = this.props;

    // useEffect(() => {
    //   window.addEventListener("keypress", e => {
    //     const input = isNumbers(e.which) ? "number" :
    //       isLetter(e.which) ? "letter" :
    //         isSpace(e.which) ? "space" : null;
    //     input && instructionRef.current.handleInput(input);
    //   });
    //   window.addEventListener("click", e => {
    //     instructionRef.current.handleInput("click");
    //   });
    //   window.addEventListener("mousemove", e => {
    //     instructionRef.current.handleInput("shake");
    //   });
    //
    //   // const mic = new p5.AudioIn();
    //   // mic.start();
    //
    //   // const recognition = new window.webkitSpeechRecognition();
    //   // recognition.continuous = true;
    //   // recognition.start();
    //   // recognition.onspeechstart = event => {
    //   //   instructionRef.current.handleInput("speak");
    //   //   console.log("speak");
    //   //   recognition.stop(); // Force stop to detect speech start again
    //   // };
    //   // recognition.onend = function(e) {
    //   //   recognition.start();
    //   // }
    // }, []);

    // let mic = null;
    // const Sketch = (p) => {
    //   p.setup = () => {
    //     mic = new p.AudioIn();
    //     mic.start();
    //   };
    //
    //   p.draw = () => {
    //     console.log(mic.getLevel());
    //   }
    // };

    return (
      <ThemeProvider theme={theme}>
        <Paper elevation={0} square={true} className={classes.root}>
          <Typography variant={"h1"} className={classes.title}>
            Walk and stop (but sitted down) : {params.room}
          </Typography>
          <main className={classes.main}>
            <InstructionPopper ref={this.instructionRef}
                               onSuccess={this._addPoints}
                               onFail={this._fail}
            />
          </main>
        </Paper>
      </ThemeProvider>
    );
  }
}

const useStyles = theme => ({
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
  }
});

WalkStop.propTypes = {};
WalkStop.defaultProps = {};

export default withStyles(useStyles)(WalkStop);