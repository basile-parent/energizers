const dateId = () => {
    return new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();
    // const todayTime = new Date();
    // const year = todayTime .getFullYear();
    // const month = lpad(todayTime.getMonth(), 2, "0");
    // const day = lpad(todayTime.getDate(), 2, "0");
    // const hours = lpad(todayTime.getHours(), 2, "0");
    // const minutes = lpad(todayTime.getMinutes(), 2, "0");
    // const seconds = lpad(todayTime.getSeconds(), 2, "0");
    // return year + month + day + hours + minutes + seconds;
};

const reinitScore = () => {
    WS_CLIENT.emit("reinitScore");
};

// const lpad = (string, size, paddingChar) => {
//   return (string + "").padStart(size, paddingChar);
// };
