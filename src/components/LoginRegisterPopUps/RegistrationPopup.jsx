import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./LoginRegistration.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectError, selectIsLoading } from "../../redux/auth/selectors";
import { register as registerUser } from "../../redux/auth/operations";
import x from "../../assets/icons/x.svg";

const registrationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const RegistrationPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      onClose();
    } catch (error) {
      setFormError("email", {
        type: "manual",
        message: error.message,
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

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
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
        <h2>Registration</h2>
        <p>
          Thank you for your interest in our platform! In order to register, we
          need some information. Please provide us with the following
          information
        </p>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="name"></label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Name"
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email"></label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Email"
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password"></label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPopup;
