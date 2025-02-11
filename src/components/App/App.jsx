import { useEffect, useState } from "react";
import styles from "./App.module.css";
import HomePage from "../../pages/HomePage/HomePage";
import Layout from "../Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRefreshing } from "../../redux/auth/selectors";
import { refreshUser } from "../../redux/auth/operations";
import Loader from "../Loader/Loader";

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);
  useEffect(() => {
    console.log("Refreshing user...");
    dispatch(refreshUser());
  }, [dispatch]);
  if (isRefreshing) {
    return <Loader />;
  }
  return (
    <div className={styles.app}>
      <Layout />
      <HomePage />
    </div>
  );
}

export default App;
