import React, { useEffect, useCallback } from "react";
import x from "../../assets/icons/x.svg";
import styles from "./BookTrialPopUp.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  reason: yup.string().required("Please select your reason for learning"),
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9+\s-()]+$/, "Please enter a valid phone number")
    .required("Phone number is required"),
});
const BookTrialPopUp = ({ isOpen, onClose, teacherName, teacherAvatar }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      reason: "",
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const handleEscapeKey = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscapeKey]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const reasons = [
    "Career and business",
    "Lesson for kids",
    "Living abroad",
    "Exams and coursework",
    "Culture, travel or hobby",
  ];

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={x} alt="Close" />
        </button>

        <h2 className={styles.title}>Book trial lesson</h2>
        <p className={styles.description}>
          Our experienced tutor will assess your current language level, discuss
          your learning goals, and tailor the lesson to your specific needs.
        </p>

        <div className={styles.teacherInfo}>
          <img
            src={teacherAvatar || "/placeholder-avatar.png"}
            alt={teacherName}
            className={styles.teacherAvatar}
          />
          <div className={styles.teacherName}>
            <span className={styles.teacherLabel}>Your teacher</span>
            <span className={styles.name}>{teacherName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.reasonSection}>
            <h3 className={styles.reasonTitle}>
              What is your main reason for learning English?
            </h3>
            <div className={styles.radioGroup}>
              {reasons.map((reason) => (
                <label key={reason} className={styles.radioLabel}>
                  <input
                    type="radio"
                    value={reason}
                    {...register("reason")}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>{reason}</span>
                </label>
              ))}
            </div>
            {errors.reason && (
              <span className={styles.errorMessage}>
                {errors.reason.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName")}
              className={`${styles.input} ${
                errors.fullName ? styles.inputError : ""
              }`}
            />
            {errors.fullName && (
              <span className={styles.errorMessage}>
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
            />
            {errors.email && (
              <span className={styles.errorMessage}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="tel"
              placeholder="Phone number"
              {...register("phone")}
              className={`${styles.input} ${
                errors.phone ? styles.inputError : ""
              }`}
            />
            {errors.phone && (
              <span className={styles.errorMessage}>
                {errors.phone.message}
              </span>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTrialPopUp;
