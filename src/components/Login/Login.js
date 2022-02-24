import React, { useState, useEffect } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const Login = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    const myTimerIdentifier = setTimeout(() => {
      console.log("checking for validity");
      setFormIsValid(
        enteredEmail.includes("@") && enteredPassword.trim().length > 6
      );
    }, 500);

    // cleanup function runs before every  re-execution of the function component exec
    // and  ALSO when the component unmounts
    /* what occurs here is that
      1 - useEffect will run at the very first execution of the component 
      2 - if the dependancies change, it will of course rerun (dependancies = enteredEmail and enteredPassword)
      3 - BUT we have a clean up function with the return ()=>{}
          meaning that before every rerendering of the useeffect, and also when the component unmounts definitely, this cleanup function is executed
          so here, by setting a timer and immediately cancel it, each time a change in password input or email input is processed will not execute the setFormIsValid because it will not have the time, as the cleanup function will immediately be executed 
          but... after 500 ms, and without any other changes operated in email nor password fields... useEffect won't be re executed... so after 500ms the setFormIsValid will be executed. 
          if such function was a http request, it will make it much easier and lightly to process so...avoiding any systematic request at any typing!
          this is called UNBOUNCING!
          synthesis: cleanup console log will appear each time a user types in one of the two input fiels email/password. But checking for validity console log will only appear after 500ms (if no changes in typing those input)
    */
    return () => {
      console.log("CLEANUP");
      clearTimeout(myTimerIdentifier);
    };
  }, [enteredEmail, enteredPassword]);

  useEffect(() => {
    console.log("Effect running");
  });

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes("@"));
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
