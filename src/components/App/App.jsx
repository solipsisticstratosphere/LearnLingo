import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import HomePage from "../../pages/HomePage/HomePage";
import TeachersPage from "../../pages/TeachersPage/TeachersPage";
import Layout from "../Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRefreshing } from "../../redux/auth/selectors";
import { refreshUser } from "../../redux/auth/operations";
import Loader from "../Loader/Loader";
import FavoritesPage from "../../pages/FavoritesPage/FavoritesPage";
import PrivateRoute from "../Routes/PrivateRoute";
import NotFoundPage from "../../pages/NotFoundPage/NotFoundPage";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  if (isRefreshing) {
    return <Loader />;
  }

  return (
    <div className={styles.app}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route
            path="/favorites"
            element={
              <PrivateRoute
                component={<FavoritesPage />}
                redirectTo="/teachers"
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
