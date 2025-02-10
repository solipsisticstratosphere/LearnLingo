import styles from "./Landing.module.css";

const Landing = () => {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src="/src/assets/icons/ukraine.svg" alt="LearnLingo" />
          <p>LearnLingo</p>
        </div>
        <div className={styles.routes}>
          <a href="#home">Home</a>
          <a href="#teachers">Teachers</a>
        </div>

        <div className={styles.navLinks}>
          <div className={styles.authButtons}>
            <button className={styles.loginButton}>
              <img
                src="/src/assets/icons/log-in-01.svg"
                alt="Log In"
                className={styles.loginIcon}
              />
              Log in
            </button>
            <button className={styles.registrationButton}>Registration</button>
          </div>
        </div>
      </nav>

      <div className={styles.contentWrapper}>
        <div className={styles.textSection}>
          <h1 className={styles.mainHeading}>
            Unlock your potential with
            <br />
            the best <span className={styles.highlightText}>language</span>{" "}
            tutors
          </h1>

          <p className={styles.subheading}>
            Embark on an Exciting Language Journey with Expert Language Tutors:
            Elevate your language proficiency to new heights by connecting with
            highly qualified and experienced tutors.
          </p>

          <button className={styles.ctaButton}>Get started</button>
        </div>

        <div className={styles.imageSection}>
          <img src="/src/assets/face.png" alt="" className={styles.face} />
          <img src="/src/assets/iMac.png" alt="" className={styles.iMac} />
        </div>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <h3>32,000+</h3>
          <p>Experienced Tutors</p>
        </div>
        <div className={styles.statItem}>
          <h3>300,000+</h3>
          <p>5-star tutor reviews</p>
        </div>
        <div className={styles.statItem}>
          <h3>120+</h3>
          <p>Subjects taught</p>
        </div>
        <div className={styles.statItem}>
          <h3>200+</h3>
          <p>Tutor nationalities</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
