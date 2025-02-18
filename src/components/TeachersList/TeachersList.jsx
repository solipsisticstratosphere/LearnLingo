import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import dot from "../../assets/icons/dot.svg";
import rating from "../../assets/icons/Rating.svg";
import book from "../../assets/icons/book.svg";
import {
  selectDisplayedTeachers,
  selectError,
  selectHasMore,
  selectIsLoading,
} from "../../redux/teachers/selectors";
import { fetchTeachers } from "../../redux/teachers/operations";
import { loadMoreTeachers, setFilters } from "../../redux/teachers/slice";
import styles from "./TeachersList.module.css";
import BookTrialPopUp from "../BookTrialPopUp/BookTrialPopUp";
import toast from "react-hot-toast";

const TeachersList = () => {
  const dispatch = useDispatch();
  const teachers = useSelector(selectDisplayedTeachers);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const hasMore = useSelector(selectHasMore);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
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
      toast.error("Please log in to add teachers to favorites", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
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
  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };
  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Languages</label>
          <select
            onChange={(e) => handleFilterChange("language", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Languages</option>
            <option value="French">French</option>
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="Spanish">Spanish</option>
            <option value="Italian">Italian</option>
            <option value="Mandarin Chinese">Chinese</option>
            <option value="Korean">Korean</option>
            <option value="Vietnamese">Vietnamese</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Level of knowledge</label>
          <select
            onChange={(e) => handleFilterChange("level", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Levels</option>
            <option value="A1 Beginner">A1 Beginner</option>
            <option value="A2 Elementary">A2 Elementary</option>
            <option value="B1 Intermediate">B1 Intermediate</option>
            <option value="B2 Upper-Intermediate">B2 Upper-Intermediate</option>
            <option value="C1 Advanced">C1 Advanced</option>
            <option value="C2 Proficient">C2 Proficient</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Price</label>
          <select
            onChange={(e) => handleFilterChange("pricePerHour", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Prices</option>
            <option value="25">Up to $25</option>
            <option value="30">Up to $30</option>
            <option value="40">Up to $40</option>
            <option value="50">Up to $50</option>
            <option value="100">Up to $100</option>
          </select>
        </div>
      </div>
      {isLoading && <div className={styles.loadingSpinner}>Loading...</div>}

      {error && (
        <div className={styles.errorMessage}>
          Error loading teachers: {error}
        </div>
      )}

      {!isLoading && !error && teachers.length === 0 && (
        <div className={styles.noResults}>
          <h2 className={styles.noResultsTitle}>
            No teachers found matching your criteria
          </h2>
          <p className={styles.noResultsText}>
            Try adjusting your filters or search again with different criteria.
          </p>
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
                      { label: "Lessons ", value: "online", isBook: true },
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
                    ].map(({ label, value, isRating, isBook }) => (
                      <div key={label} className={styles.statItem}>
                        <span className={styles.statText}>
                          {isRating ? (
                            <img
                              src={rating}
                              alt="Rating"
                              className={styles.ratingImage}
                            />
                          ) : null}
                          {isBook ? (
                            <img src={book} alt="" className={styles.book} />
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
