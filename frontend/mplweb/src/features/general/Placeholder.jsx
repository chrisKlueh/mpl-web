import React from "react";

import styles from "./Placeholder.module.css";
import sadSmiley from "../../plotty.jpg";

const Placeholder = () => {
  return (
    <div className={styles.container}>
      <img className={styles.plotty} alt="Remy Sharp" src={sadSmiley} />
      <div>There's nothing here..</div>
    </div>
  );
};

export default Placeholder;
