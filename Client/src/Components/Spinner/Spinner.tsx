import React from "react";
import styles from "./Spinner.module.scss";

const Spinner: React.FC = () => (
  <div data-testid="spinner" role="status" className={styles.spinner}>
    <div className="spinnerCircle"></div>
  </div>
);

export default Spinner;
