import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [navigate]);

  const getLinkClassName = ({ isActive }) => {
    return isActive ? styles.activeLink : styles.link;
  };
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to="/" className={styles.logoLink}>
          <div className={styles.logo}>
            <img src={ukraine} alt="LearnLingo" />
            <p>LearnLingo</p>
          </div>
        </NavLink>

        <div className={`${styles.routes} ${styles.desktopMenu}`}>
          <NavLink to="/" className={getLinkClassName}>
            Home
          </NavLink>
          <NavLink to="/teachers" className={getLinkClassName}>
            Teachers
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/favorites" className={getLinkClassName}>
              Favorites
            </NavLink>
          )}
        </div>

        <div className={`${styles.navLinks} ${styles.desktopMenu}`}>
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

        <button
          className={`${styles.mobileMenuButton} ${styles.mobileOnly}`}
          onClick={handleMobileMenuClick}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} color="black" />
          ) : (
            <Menu size={24} color="black" />
          )}
        </button>

        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuContent}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
              <NavLink
                to="/teachers"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
                onClick={closeMobileMenu}
              >
                Teachers
              </NavLink>
              {isLoggedIn && (
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : styles.link
                  }
                  onClick={closeMobileMenu}
                >
                  Favorites
                </NavLink>
              )}
              <div className={styles.mobileAuthButtons}>
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
                      onClick={() => {
                        setShowLoginPopup(true);
                        closeMobileMenu();
                      }}
                    >
                      <img
                        src={login}
                        alt="Log In"
                        className={styles.loginIcon}
                      />
                      Log in
                    </button>
                    <button
                      className={styles.registrationButton}
                      onClick={() => {
                        setShowRegistrationPopup(true);
                        closeMobileMenu();
                      }}
                    >
                      Registration
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

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
