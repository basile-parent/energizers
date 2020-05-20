import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from "@material-ui/core/styles";
import {Animated} from "react-animated-css";

const Instruction = forwardRef(({ message, code, color, successInput, onFail }, ref) => {
  const classes = useStyles();
  const [visible, setVisible] = useState(true);
  // const [success, setSuccess] = useState(false);
  let success = false;

  // console.log(message, success);

  useImperativeHandle(ref, () => ({
    handleInput(inputType) {
      // console.debug(code, inputType, code === inputType);
      if (visible && code === inputType) {
        setVisible(false);
        // setSuccess(true);
        success = true;
        successInput();
      }
    }
  }));

  useEffect(() => {
    setTimeout(() => {
      if (!success && visible) {
        setVisible(false);
        onFail();
      }
    }, 1000);
  }, [ code ]);

  return (
    <Animated animationIn="bounceIn" animationOut="fadeOut" animationOutDuration={300} isVisible={visible}>
      <p className={classes.instruction} style={{ color }}>
        { message }
      </p>
    </Animated>
  )
});

const useStyles = makeStyles(theme => ({
  instruction: {
    fontSize: 200,
    fontWeight: "bold"
  }
}));

Instruction.propTypes = {
  message: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  successInput: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired
};
Instruction.defaultProps = {};

export default Instruction;