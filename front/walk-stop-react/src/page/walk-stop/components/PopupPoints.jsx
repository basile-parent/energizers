import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Animated} from "react-animated-css";
import {makeStyles} from "@material-ui/core/styles";

const PopupPoints = ({ points }) => {
  const classes = useStyles();
  const [pointsVisible, setPointsVisible] = useState(false);

  setTimeout(() => setPointsVisible(false), 600);

  return (
    <Animated animationIn="fadeInUp" animationOut="fadeOutUp"
              animationInDuration={500}
              animationOutDuration={300}
              isVisible={pointsVisible}
              className={classes.popupPoints}>
      <div className={points > 0 ? classes.negativePoints : classes.negativePoints}>
        {points >=0 && "+"}{points}
      </div>
    </Animated>
  )
};


const useStyles = makeStyles(theme => ({
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

PopupPoints.propTypes = {
  points: PropTypes.number
};
PopupPoints.defaultProps = {};

export default PopupPoints;