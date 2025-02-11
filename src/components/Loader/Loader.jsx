import { PuffLoader } from "react-spinners";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <PuffLoader color="#ff5733" size={60} />
    </div>
  );
};

export default Loader;
