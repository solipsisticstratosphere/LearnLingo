import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";

import {
  selectDisplayedTeachers,
  selectError,
  selectHasMore,
  selectIsLoading,
} from "../../redux/teachers/selectors";
import { fetchTeachers } from "../../redux/teachers/operations";
import { loadMoreTeachers } from "../../redux/teachers/slice";
import styles from "./TeachersList.module.css";

const TeachersList = () => {
  const dispatch = useDispatch();
  const teachers = useSelector(selectDisplayedTeachers);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const hasMore = useSelector(selectHasMore);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const [favorites, setFavorites] = useState([]);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      const storedFavorites = localStorage.getItem("teacherFavorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (teachers.length === 0) {
      dispatch(fetchTeachers());
    }
  }, [dispatch, teachers.length]);

  const handleFavoriteClick = (teacherId) => {
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      setTimeout(() => setShowAuthAlert(false), 3000);
      return;
    }

    const newFavorites = favorites.includes(teacherId)
      ? favorites.filter((id) => id !== teacherId)
      : [...favorites, teacherId];

    setFavorites(newFavorites);
    localStorage.setItem("teacherFavorites", JSON.stringify(newFavorites));
  };

  const toggleExpand = (teacherId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [teacherId]: !prev[teacherId],
    }));
  };

  const handleLoadMore = () => {
    dispatch(loadMoreTeachers());
  };

  return (
    <div className={styles.container}>
      {showAuthAlert && (
        <div className={styles.authAlert}>
          <p>Please log in to add teachers to favorites.</p>
        </div>
      )}

      <div className={styles.teacherGrid}>
        {teachers.map((teacher) => (
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

                {/* Basic card content */}
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

                {/* Expanded content */}
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

      {hasMore && !isLoading && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={handleLoadMore}
            className={styles.loadMoreButton}
            disabled={isLoading}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default TeachersList;
