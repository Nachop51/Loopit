import "./Modal.css";
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { connect } from "react-redux";

import { logIn } from "../../../actions";
import { validateUser } from "./validations";
import useEsc from "../../../hooks/useEsc";
import loopit from "../../../api/loopit";
import { useNavigate } from "react-router-dom";

const ModalLogIn = ({ show, closeModal, openTheOther, logIn }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEsc(show, closeModal);

  const renderErrors = ({ error, touched }) => {
    return (
      <span className={`error-message ${error && touched ? "show-span" : ""}`}>
        {error ? error : <br />}
      </span>
    );
  };

  const buildInput = ({ input, meta, label, placeholder }) => {
    return (
      <div>
        <label htmlFor={input.name}>{label}</label>
        <input
          className={meta.error && meta.touched ? "error-validator" : ""}
          {...input}
          placeholder={placeholder}
          id={input.name}
          autoComplete="off"
        />
        {renderErrors(meta)}
      </div>
    );
  };

  const onSubmit = async ({ username, password }) => {
    try {
      const response = await loopit.post("/auth/login", {
        user: username,
        password: password,
      });
      setError(false);
      logIn(response.data.id, response.data.username, response.data.theme);
      navigate("/l");
    } catch (error) {
      if (error.message.includes("Network")) {
        console.log("Network error");
      }
      setError(true);
    }
  };

  return (
    <div className={`modal ${show ? "show" : ""}`} onClick={closeModal}>
      <div
        className={`modal-content ${show ? "modal-animation" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Log In</h2>
        <h4>To continue to Loopit</h4>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="form">
              <Field
                name="username"
                component={buildInput}
                label="Username or Email"
                placeholder="email@example.com"
                validate={validateUser}
              />
              <Field
                name="password"
                component={buildInput}
                label="Password"
                placeholder="••••••••"
                type="password"
                validate={(value) => {
                  if (!value) return "Password is required";
                }}
              />
              <span className={`error-message ${error ? "show-span" : ""}`}>
                {error ? "Invalid username or password" : <br />}
              </span>
              <button className="btn btn-primary btn-animation" type="submit">
                Log In
              </button>
            </form>
          )}
        />
        <div className="link">
          <p>
            Not registered yet?&nbsp;
            <button
              className="linkTo"
              onClick={() => {
                closeModal();
                openTheOther();
              }}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps, { logIn })(ModalLogIn);
