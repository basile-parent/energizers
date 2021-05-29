const PRESET_PARAMETERS = {
  quick: {
    timeout: 900,
    range: { min: 600, max: 1200},
    maxPointsDelay: 350,
    duration: 60000,
    rulesDuration: 10000,
    maxPoints: 1000
  },
  normal: {
    timeout: 1500,
    range: { min: 1000, max: 2000},
    maxPointsDelay: 700,
    duration: 60000,
    rulesDuration: 10000,
    maxPoints: 1000
  },
  slow: {
    timeout: 3000,
    range: { min: 1500, max: 3000},
    maxPointsDelay: 1000,
    duration: 60000,
    rulesDuration: 10000,
    maxPoints: 1000
  }
};

const DEFAULT_PARAMETERS = PRESET_PARAMETERS.normal;
let UPDATE_PARAMETER_ON_INPUT_CHANGE = true;

const isNumber = keyNumber => [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(keyNumber);

const handleParameterInput = e => !isNumber(e.which) && e.preventDefault();

const getParameters = () => {
  const parameters = {
    duration: parseInt(document.getElementById("input-duration").value) * 1000,
    timeout: parseInt(document.getElementById("input-timeout").value),
    range: { min: parseInt(document.getElementById("input-range-min").value), max: parseInt(document.getElementById("input-range-max").value)},
    maxPoints: parseInt(document.getElementById("input-max-points").value),
    maxPointsDelay: parseInt(document.getElementById("input-max-points-delay").value),
    rulesDuration: parseInt(document.getElementById("input-rules-duration").value) * 1000
  };

  Object.keys(parameters).forEach(key => {
    if (!parameters[key]) {
      console.error("Parameters not complete", parameters);
      alert("Vous devez spécifier une valeur pour " + key);
      throw new Error("Parameters not complete");
    }
  });

  return parameters;
};

const initParameters = newParameters => {
  let parameters = newParameters;
  if (!parameters) {
    parameters = DEFAULT_PARAMETERS;
  }
  UPDATE_PARAMETER_ON_INPUT_CHANGE = false;
  document.getElementById("input-duration").value = parameters.duration / 1000;
  document.getElementById("input-timeout").value = parameters.timeout;
  document.getElementById("input-range-min").value = parameters.range.min;
  document.getElementById("input-range-max").value = parameters.range.max;
  document.getElementById("input-max-points").value = parameters.maxPoints;
  document.getElementById("input-max-points-delay").value = parameters.maxPointsDelay;
  document.getElementById("input-rules-duration").value = parameters.rulesDuration / 1000;
  UPDATE_PARAMETER_ON_INPUT_CHANGE = true;

  if (!newParameters) {
    updateParameters();
  }
};

WS_CLIENT.on("parameters", initParameters);

const updateParameters = () => {
  UPDATE_PARAMETER_ON_INPUT_CHANGE && WS_CLIENT.emit("setParameters", getParameters());
};

const applyPreset = presetName => {
  initParameters(PRESET_PARAMETERS[presetName]);
};