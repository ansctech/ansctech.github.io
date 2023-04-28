import React, { useState } from "react";
import i18next from "i18next";
import { Link, useNavigate } from "react-router-dom";
import styles from "./authSyles.module.css";
import useFetch from "../../hooks/global/useFetch";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/Authentication/user";
import { useEffect } from "react";
import { useRef } from "react";

function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const recaptchaRef = useRef();

  // Captcha calculations
  function generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    return randomNumber;
  }
  const [firstNumber, setFirstNumber] = useState(generateRandomNumber());
  const [secondNumber, setSecondNumber] = useState(generateRandomNumber());

  // User data
  const user = useSelector((state) => state.userReducer);

  const { reqFn: authRequest, isLoading } = useFetch();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event, stateUpdate) => {
    stateUpdate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const captchaValue =
      Number(recaptchaRef.current.value) === firstNumber + secondNumber;

    if (captchaValue) {
      // Send login request
      authRequest({
        url: "login",
        method: "POST",
        values: {
          email,
          password,
        },
        successFn: (data) => {
          // Update user data
          dispatch(userActions.update({ ...data.data.user }));

          // Set the language
          i18next.changeLanguage(
            data.data.user.default_lang?.slice(0, 2).toLowerCase()
          );

          // Save data to localstorage
          localStorage.setItem(
            "agroCurrentUser",
            JSON.stringify(data.data.user)
          );

          // Redirect to main page
          navigate("/", { replace: true });
        },
        errorFn: (data) => {
          setErrorMessage(data.message);

          // Reset all data
          setEmail("");
          setPassword("");
          recaptchaRef.current.value = "";
        },
      });
    } else {
      setErrorMessage("Captcha Failed");
    }
  };

  useEffect(() => {
    if (user.user_id) {
      // logout if user is already logged in, log them out
      authRequest({
        url: "logout",
        method: "POST",
        successFn: () => {
          // Update user data
          dispatch(userActions.clear());

          // Save data to localstorage
          localStorage.clear("agroCurrentUser");
        },
      });
    }
  }, []);

  return (
    <div className={styles.back}>
      <div className={styles.container}>
        {/* Logo */}
        <img
          src={require("../../assets/img/logo.jpg")}
          alt="Logo"
          className={styles.logo}
        />
        {errorMessage && <span className={styles.error}>{errorMessage}</span>}
        {/* Form */}
        <form
          action=""
          className={styles.form}
          onSubmit={handleSubmit}
          onFocus={() => {
            if (errorMessage) {
              setErrorMessage(null);
              setFirstNumber(generateRandomNumber());
              setSecondNumber(generateRandomNumber());
              recaptchaRef.current.value = "";
            }
          }}
        >
          <div className={styles["form-group"]}>
            {/* Email */}
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              className={styles.input}
              id="email"
              required
              autoComplete="off"
              value={email}
              onChange={(event) => handleChange(event, setEmail)}
            />
          </div>
          {/* Password */}
          <div className={styles["form-group"]}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              className={styles.input}
              id="password"
              required
              value={password}
              onChange={(event) => handleChange(event, setPassword)}
            />
          </div>

          <div className={styles.recaptcha}>
            <span>
              Show us you're not a robot, What is {firstNumber} + {secondNumber}
              ?
            </span>
            <input type="text" ref={recaptchaRef} />
          </div>

          <button className={styles.button} type="submit">
            {isLoading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className={styles.spinner}
              >
                <path
                  fill="currentColor"
                  d="M10 3a7 7 0 0 0-7 7a.5.5 0 0 1-1 0a8 8 0 1 1 8 8a.5.5 0 0 1 0-1a7 7 0 1 0 0-14Z"
                />
              </svg>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>
        <Link to="register" className={styles.link}>
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default Login;
