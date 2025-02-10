import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./LoginRegistration.module.css";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = (data) => {
    console.log("Registration submitted", data);
    // Add your registration logic here
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input {...register("name")} type="text" id="name" />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email"></label>
            <input {...register("email")} type="email" id="email" />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input {...register("password")} type="password" id="password" />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className={styles.submitButton}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPopup;
