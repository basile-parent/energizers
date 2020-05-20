import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Instruction from "./Instruction";

const GREEN = "#3afb3a";
const RED = "#ff4545";
const BLUE = "#00c4ff";
const YELLOW = "#ffff00";
const LIGHT_YELLOW = "#ffffe0";
const PINK = "#ee82ee";

const InstructionPopper = forwardRef(({ onSuccess, onFail }, ref) => {
  const [index, setIndex] = useState(0);
  const lastRenderTime = new Date();

  const instructionRef = useRef(null);

  useImperativeHandle(ref, () => ({
    handleInput(inputType) {
      instructionRef.current.handleInput(inputType);
    }
  }));

  const getRandomTimer = (rangeMin, rangeMax) => {
    const diff = rangeMax - rangeMin;
    const token = Math.round(Math.random() * diff);
    return rangeMin + token;
  };

  const calcRandomTimer = () => getRandomTimer(1500, 3000);

  const instructions = [
    { code: "click", message: "Clic", color: GREEN, timeout: calcRandomTimer() },
    { code: "letter", message: "Lettre", color: RED, timeout: calcRandomTimer() },
    { code: "click", message: "Clic", color: GREEN, timeout: calcRandomTimer() },
    { code: "number", message: "Chiffre", color: BLUE, timeout: calcRandomTimer() },
    { code: "space", message: "Espace", color: LIGHT_YELLOW, timeout: calcRandomTimer() },
    { code: "speak", message: "Chante", color: PINK, timeout: calcRandomTimer() },
    { code: "shake", message: "Secoue", color: YELLOW, timeout: calcRandomTimer() },
  ];

  const scheduleNext = (nextIndex) => {
    if (nextIndex >= instructions.length) {
      // Fin du jeu
      return;
    }

    setTimeout(
      () => setIndex(nextIndex),
      instructions[nextIndex - 1].timeout
    );
  };

  const successInput = () => {
    onSuccess(new Date() - lastRenderTime);
  };

  const instruction = instructions[index];
  scheduleNext(index + 1);

  return (
    <div>
      <Instruction message={ instruction.message }
                   code={ instruction.code }
                   color={ instruction.color }
                   successInput={successInput}
                   onFail={onFail}
                   key={"instruction_" + Math.random()}
                   ref={instructionRef}
      />
    </div>
  );
});

InstructionPopper.propTypes = {
  onSuccess: PropTypes.func.isRequired
};
InstructionPopper.defaultProps = {};

export default InstructionPopper;