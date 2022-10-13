import React from "react";

import styles from "./Placeholder.module.css";
import sadSmiley from "../../plotty.jpg";

const Placeholder = (props) => {
  const { message } = props;
  return (
    <div className={styles.container}>
      <img className={styles.plotty} alt="Plotty" src={sadSmiley} />
      <div>{message ? message : "Looks like there's nothing here yet.."}</div>
    </div>
  );
};

export default Placeholder;
