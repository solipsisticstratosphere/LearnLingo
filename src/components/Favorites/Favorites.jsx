import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  selectDisplayedTeachers,
  selectIsLoading,
  selectError,
} from "../../redux/teachers/selectors";
import { fetchTeachers } from "../../redux/teachers/operations";
import styles from "../TeachersList/TeachersList.module.css";

const Favorites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allTeachers = useSelector(selectDisplayedTeachers);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const [favorites, setFavorites] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  // Redirect if not authenticated
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
    if (allTeachers.length === 0) {
      dispatch(fetchTeachers());
    }
  }, [dispatch, allTeachers.length]);

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

  // Filter teachers to show only favorites
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
              </div>

              <div className={styles.infoContainer}>
                <div className={styles.headerGroup}>
                  <div>
                    <p className={styles.teacherInfo}>Languages</p>
                    <h3 className={styles.teacherName}>
                      {teacher.name} {teacher.surname}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleFavoriteClick(teacher.firebaseId)}
                    className={styles.favoriteButton}
                    aria-label="Remove from favorites"
                  >
                    <Heart
                      className={`${styles.favoriteIcon} ${styles.favoriteIconActive}`}
                    />
                  </button>
                </div>

                <div className={styles.statsGrid}>
                  {[
                    { label: "Lessons online", value: "Online" },
                    { label: "Lessons done", value: teacher.lessons_done },
                    { label: "Rating", value: teacher.rating },
                    {
                      label: "Price / 1 hour",
                      value: `${teacher.price_per_hour}$`,
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className={styles.statItem}>
                      <span className={styles.statText}>
                        {label}:{" "}
                        <span className={styles.statValue}>{value}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <p className={styles.description}>{teacher.lesson_info}</p>

                <div className={styles.levelsList}>
                  {(teacher.levels || []).map((level) => (
                    <span
                      key={`${teacher.firebaseId}-${level}`}
                      className={styles.levelBadge}
                    >
                      {level}
                    </span>
                  ))}
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

                {expandedCards[teacher.firebaseId] && (
                  <div className={styles.expandedContent}>
                    <div className={styles.experienceSection}>
                      <h4 className={styles.sectionTitle}>Experience</h4>
                      <p className={styles.experienceText}>
                        {teacher.experience}
                      </p>
                    </div>

                    <div className={styles.conditionsSection}>
                      <h4 className={styles.sectionTitle}>Conditions</h4>
                      <ul className={styles.conditionsList}>
                        {teacher.conditions.map((condition, index) => (
                          <li key={index} className={styles.conditionItem}>
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.reviewsSection}>
                      <h4 className={styles.sectionTitle}>Reviews</h4>
                      <div className={styles.reviewsList}>
                        {teacher.reviews.map((review, index) => (
                          <div key={index} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                              <span className={styles.reviewerName}>
                                {review.reviewer_name}
                              </span>
                              <span className={styles.reviewRating}>
                                Rating: {review.reviewer_rating}
                              </span>
                            </div>
                            <p className={styles.reviewComment}>
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      className={styles.bookButton}
                      onClick={() =>
                        console.log(`Booking trial lesson with ${teacher.name}`)
                      }
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
