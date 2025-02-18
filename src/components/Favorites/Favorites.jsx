import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Navigate } from "react-router-dom";
import {
  selectAllTeachers,
  selectIsLoading,
  selectError,
} from "../../redux/teachers/selectors";
import { fetchTeachers } from "../../redux/teachers/operations";
import styles from "../TeachersList/TeachersList.module.css";
import dot from "../../assets/icons/dot.svg";
import rating from "../../assets/icons/Rating.svg";
import BookTrialPopUp from "../BookTrialPopUp/BookTrialPopUp";

const Favorites = () => {
  const dispatch = useDispatch();
  const allTeachers = useSelector(selectAllTeachers);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  if (!isAuthenticated) {
    return <Navigate to="/teachers" replace />;
  }

  useEffect(() => {
    const storedFavorites = localStorage.getItem("teacherFavorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleFavoriteClick = (teacherId) => {
    const newFavorites = favorites.filter((id) => id !== teacherId);
    setFavorites(newFavorites);
    localStorage.setItem("teacherFavorites", JSON.stringify(newFavorites));
  };

  const toggleExpand = (teacherId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [teacherId]: !prev[teacherId],
    }));
  };

  const favoriteTeachers = allTeachers.filter((teacher) =>
    favorites.includes(teacher.firebaseId)
  );
  return (
    <div className={styles.container}>
      {favoriteTeachers.length === 0 && !isLoading && (
        <div className={styles.noFavorites}>
          <h2>No favorite teachers yet</h2>
          <p>Add teachers to your favorites list to see them here</p>
        </div>
      )}

      <div className={styles.teacherGrid}>
        {favoriteTeachers.map((teacher) => (
          <div key={teacher.firebaseId} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.avatarWrapper}>
                <img
                  src={teacher.avatar_url || "/placeholder-avatar.png"}
                  alt={`${teacher.name} ${teacher.surname}`}
                  className={styles.avatar}
                  onError={(e) => {
                    e.target.src = "/placeholder-avatar.png";
                    e.target.onerror = null;
                  }}
                />
                <img src={dot} alt="" className={styles.dot} />
              </div>

              <div className={styles.infoContainer}>
                <div className={styles.headerGroup}>
                  <div className={styles.teacherInfoContainer}>
                    <p className={styles.teacherInfo}>Languages</p>
                    <h3 className={styles.teacherName}>
                      {teacher.name} {teacher.surname}
                    </h3>
                  </div>
                  <div className={styles.statsGrid}>
                    {[
                      { label: "Lessons ", value: "online" },
                      { label: "Lessons done:", value: teacher.lessons_done },
                      {
                        label: "Rating:",
                        value: teacher.rating,
                        isRating: true,
                      },
                      {
                        label: "Price / 1 hour:",
                        value: `${teacher.price_per_hour}$`,
                      },
                    ].map(({ label, value, isRating }) => (
                      <div key={label} className={styles.statItem}>
                        <span className={styles.statText}>
                          {isRating ? (
                            <img
                              src={rating}
                              alt="Rating"
                              className={styles.ratingImage}
                            />
                          ) : null}
                          {label}{" "}
                          <span className={styles.statValue}>{value}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleFavoriteClick(teacher.firebaseId)}
                    className={styles.favoriteButton}
                    aria-label="Add to favorites"
                  >
                    <Heart
                      className={`${styles.favoriteIcon} ${
                        favorites.includes(teacher.firebaseId)
                          ? styles.favoriteIconActive
                          : styles.favoriteIconInactive
                      }`}
                    />
                  </button>
                </div>

                <div className={styles.descriptionContainer}>
                  <div className={styles.languages}>
                    <p className={styles.description}>Speaks: </p>
                    <ul className={styles.languagesList}>
                      <li className={styles.languagesItem}>
                        {teacher.languages.join(", ")}
                      </li>
                    </ul>
                  </div>
                  <p className={styles.description}>
                    Lesson info:{" "}
                    <span className={styles.lessonInfo}>
                      {teacher.lesson_info}
                    </span>
                  </p>
                  <p className={styles.description}>
                    Conditions:{" "}
                    <span className={styles.lessonInfo}>
                      {teacher.conditions}
                    </span>
                  </p>
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    className={styles.readMoreButton}
                    onClick={() => toggleExpand(teacher.firebaseId)}
                  >
                    {expandedCards[teacher.firebaseId] ? (
                      <>
                        Read Less <ChevronUp className={styles.chevronIcon} />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className={styles.chevronIcon} />
                      </>
                    )}
                  </button>
                </div>
                {!expandedCards[teacher.firebaseId] && (
                  <div className={styles.levelsList}>
                    {(teacher.levels || []).map((level) => (
                      <span
                        key={`${teacher.firebaseId}-${level}`}
                        className={styles.levelBadge}
                      >
                        #{level}
                      </span>
                    ))}
                  </div>
                )}
                {expandedCards[teacher.firebaseId] && (
                  <div className={styles.expandedContent}>
                    <div className={styles.experienceSection}>
                      {/* <h4 className={styles.sectionTitle}>Experience</h4> */}
                      <p className={styles.experienceText}>
                        {teacher.experience}
                      </p>
                    </div>

                    <div className={styles.reviewsSection}>
                      <div className={styles.reviewsList}>
                        {teacher.reviews.map((review, index) => (
                          <div key={index} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                              <span className={styles.reviewerName}>
                                {review.reviewer_name}
                              </span>
                              <span className={styles.reviewRating}>
                                <img src={rating} alt="Rating" />{" "}
                                {review.reviewer_rating}.0
                              </span>
                            </div>
                            <p className={styles.reviewComment}>
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.levelsList}>
                      {(teacher.levels || []).map((level) => (
                        <span
                          key={`${teacher.firebaseId}-${level}`}
                          className={styles.levelBadge}
                        >
                          #{level}
                        </span>
                      ))}
                    </div>
                    <button
                      className={styles.bookButton}
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setIsModalOpen(true);
                      }}
                    >
                      Book trial lesson
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <BookTrialPopUp
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teacherName={
          selectedTeacher
            ? `${selectedTeacher.name} ${selectedTeacher.surname}`
            : ""
        }
        teacherAvatar={selectedTeacher?.avatar_url}
      />

      {isLoading && (
        <div className={styles.loadingStatus} role="status">
          Loading...
        </div>
      )}

      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Favorites;
