import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { selectError, selectIsLoading } from "../../redux/auth/selectors";
import { login } from "../../redux/auth/operations";
import styles from "./LoginRegistration.module.css";
import x from "../../assets/icons/x.svg";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const PasswordInput = ({ field, error, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={styles.inputGroup}>
      <input
        {...field}
        {...props}
        type={isVisible ? "text" : "password"}
        className={`${styles.input} ${styles.passwordInput}`}
      />
      <button
        type="button"
        className={styles.eyeIcon}
        onClick={toggleVisibility}
      >
        {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
      {error && <p className={styles.errorMessage}>{error.message}</p>}
    </div>
  );
};

const LoginPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      onClose();
    } catch (error) {
      setFormError("email", {
        type: "manual",
        message: "Invalid email or password",
      });
    }
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.popupOverlay} onClick={handleBackdropClick}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={x} alt="Close" />
        </button>
        <h2>Log In</h2>
        <p>
          Welcome back! Please enter your credentials to access your account and
          continue your search for an teacher.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="email"></label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Email"
              className={styles.input}
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password"></label>
            <PasswordInput
              field={register("password")}
              id="password"
              placeholder="Password"
              error={errors.password}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
