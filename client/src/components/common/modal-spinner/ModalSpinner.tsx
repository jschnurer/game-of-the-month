import React from "react";
import styles from "./ModalSpinner.module.scss";
import Portal from "~/components/layout/portal/Portal";

const ModalSpinner: React.FC = () =>
  <Portal>
    <div className={styles.spinnerArea}>
      <img src="/6-dots-scale-middle-white-36.svg" alt="Working..." className={styles.spinner} />
    </div>
  </Portal>;

export default ModalSpinner;