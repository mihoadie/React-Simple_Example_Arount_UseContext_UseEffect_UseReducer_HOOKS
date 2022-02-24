// such file is an equivalent of the Login.js file, but using useReducer() instead of useEffect()+useState() comnbination
import React, { useState, useReducer, useEffect } from "react";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

/*
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
*/

// we put the here below  emailReducer function outside of the component function with purpouse,
// it is not an error! as this function does not need to be executed within the component, react will automatically call it when needed

// this function will be in charge of, depending on action.type, set the emailState value (emailReducer() being called each time dispatchEmail is called!)

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return {
      value: action.val,
      isValid: action.val.includes("@") ? true : false,
    };
  }
  // here there is no value caption , so we can use the value of the last and current state, trhough state property providing as a reminder the last snapshot of the state
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.includes("@") ? true : false,
    };
  }
  // default state return if action.type is not "USER_INPUT" neither "INPUT_BLUR"
  return { value: "", isValid: false };
};

// we do the same as emailState for passwordState , this function will also  be in charge then of, depending on action.type, set the passwordState value (passwordReducer() being called each time dispatchPassword is called!)
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return {
      value: action.val,
      isValid: action.val.trim().length > 6 ? true : false,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.trim().length > 6 ? true : false,
    };
  }
  return { value: "", isValid: false };
};

/*
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
#################################################################################################################################
*/

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value }); //this will trigger the emailReducer to execute, beacause dispatchEmail will launch the emailReducer() execution (confere ligne 18)
    // setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    // here there is no value caption , so we can only pass an object ith type=INPUT_BLUR and then the emailReducer() funciton called through dispatchEmail will use the value of the last and current state, (trhough state property providing as a reminder the last snapshot of the state)
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value); //********************
  };

  // the here below two lines will help us optimizing the dependancies (so re rendering) of the useEffect of this component, only if validity changes, and not also the values (to heavy otherwise)
  // by processing so, instead of putting emailState and passwordState complete object variables as dependancies, we only make sure that the useEffect will be re rendered only if their validity attributes changes
  const { isValid: emailIsValid } = emailState; // here we do a destructuring of the emailState, to only get the isValid property, and giving such property an alias, so that we can also use it for the password destructuring in the coming line
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    // check the useEffects_details.js file if you do not understand anymore or forgot the logic behind the scene of setting and clearing timeOut intervals! it is the all thing about debouncing depending on user changes operated or not
    const identifier = setTimeout(() => {
      setFormIsValid(emailState.isValid && passwordState.isValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]); // conf the destructuring of the emailState and passwordState done through aliases emailIsValid and passwordIsValid

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`} //********************
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value} //********************
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`} //********************
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value} //********************
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
