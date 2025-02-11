import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPopup from "../LoginRegisterPopUps/LoginPopup";
import RegistrationPopup from "../LoginRegisterPopUps/RegistrationPopup";
import { selectIsLoggedIn, selectUser } from "../../redux/auth/selectors";
import { logout } from "../../redux/auth/operations";
import styles from "../Landing/Landing.module.css";
import ukraine from "../../assets/icons/ukraine.svg";
import login from "../../assets/icons/log-in-01.svg";
const Layout = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={ukraine} alt="LearnLingo" />
        <p>LearnLingo</p>
      </div>

      <div className={styles.routes}>
        <a href="#home">Home</a>
        <a href="#teachers">Teachers</a>
      </div>

      <div className={styles.navLinks}>
        <div className={styles.authButtons}>
          {isLoggedIn ? (
            <button
              className={styles.registrationButton}
              onClick={handleLogout}
            >
              Log out
            </button>
          ) : (
            <>
              <button
                className={styles.loginButton}
                onClick={() => setShowLoginPopup(true)}
              >
                <img src={login} alt="Log In" className={styles.loginIcon} />
                Log in
              </button>
              <button
                className={styles.registrationButton}
                onClick={() => setShowRegistrationPopup(true)}
              >
                Registration
              </button>
            </>
          )}
        </div>
      </div>

      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}

      {showRegistrationPopup && (
        <RegistrationPopup onClose={() => setShowRegistrationPopup(false)} />
      )}
    </nav>
  );
};

export default Layout;
