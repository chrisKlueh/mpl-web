import React from "react";

import styles from "./Placeholder.module.css";
import sadSmiley from "../../plotty.jpg";

const Placeholder = (props) => {
  const { message } = props;
  return (
    <div className={styles.container}>
      <img className={styles.plotty} alt="Plotty" src={sadSmiley} />
      <div>{message}</div>
    </div>
  );
};

export default Placeholder;
