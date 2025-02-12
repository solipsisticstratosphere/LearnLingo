import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPopup from "../LoginRegisterPopUps/LoginPopup";
import RegistrationPopup from "../LoginRegisterPopUps/RegistrationPopup";
import { selectIsLoggedIn, selectUser } from "../../redux/auth/selectors";
import { logout } from "../../redux/auth/operations";
import styles from "../Landing/Landing.module.css";
import ukraine from "../../assets/icons/ukraine.svg";
import login from "../../assets/icons/log-in-01.svg";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src={ukraine} alt="LearnLingo" />
          <p>LearnLingo</p>
        </div>

        <div className={styles.routes}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/teachers"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Teachers
          </NavLink>
          {isLoggedIn && (
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              Favorites
            </NavLink>
          )}
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
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
