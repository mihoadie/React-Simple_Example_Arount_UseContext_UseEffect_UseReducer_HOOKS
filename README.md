# React-Simple_Example_Arount_UseContext_UseEffect_UseReducer_HOOKS

No connection to DataBase/API Rest. 100% based on Maximilian Scharzmuller complete guide tutorial; Aim is to go deeper into useState(), useReducer() and useContext() with pieces of example

## installing project

git clone git@github.com:mihoadie/React-Simple_Example_Arount_UseContext_UseEffect_UseReducer_HOOKS.git

cd React-Simple_Example_Arount_UseContext_UseEffect_UseReducer_HOOKS

npm install

npm start

and go to http://localhost:3000/ in your browser

### main recap of features covered WITH USEeFFECT:

it is important to mention that useEffect will run ONLY
A ) when the component render FOR THE VERY FIRST TIME (WHEN OPENING THE APP FOR EXAMPLE)
B) once the first execution cicle has been done, it will run AFTER every component reevaluation ONLY if its dependancies change
so if we leave the dependancy array empty in the useEffect, then the inside functions will only run ONCE at the very beginning

these are the only two cases when the useEffect will run

we can use setTimeout and clean up function from useEffect (return ()=>{}) to check when user stop typping.
that is a technic called Debouncing, confere the cleartimeout function put into the cleanup function of the use effect

more details: /src/Login/Login.js

UNDERSTANDING USEEFFECT WITH EXAMPLES:

######### SCENARIO 1 ###############
const [nimportequoi, setNimportequoi] = useState('')
useEffect(() => {
console.log("Effect running");
});

in this case, useEffect will run at the very first mount of the component, but also
at every re rendering of the component
(for ex every time a state like nimportequoi changes, the component is re rendered, so the useEffect will be re executed

######### SCENARIO 2 ###############
const [nimportequoi, setNimportequoi] = useState('')
useEffect(() => {
console.log("Effect running");
}, []);

in this case, useEffect will run at the very first mount of the component, and only at that time, because we have an empty dependancie Array

######### SCENARIO 3 ###############
const [nimportequoi, setNimportequoi] = useState('')
const [nimportequoi2, setNimportequoi2] = useState('')

useEffect(() => {
console.log("Effect running");
},[nimportequoi2]);

in this case, useEffect will run at the very first mount of the component,
and also if (and only if) nimportequoi2 is re evaluated.
so if nimportequoi changes, this useeffect won't be executed again, even if the component re render due to this change, because it only executes the useEffect at mounting + change of the eventual dependancies, and here, nimportequoi is not a dependancie, only nimportequoi2!

######### SCENARIO 4 ###############
const [nimportequoi, setNimportequoi] = useState('')
const [nimportequoi2, setNimportequoi2] = useState('')

useEffect(() => {
console.log("Effect running");
return () =>{
console.log("cleanup")
}
},[nimportequoi2]);

in this case, useEffect will run at the very first mount of the component,
and also if (and only if) nimportequoi2 is re evaluated.
and the console log clean up will be executed before the useEffect runs but not before the first time it runs (so in other words not before the mount)
and the cleanup console log will also be executed at the definite unmount of the component
BUt if nimportequoi changes, useEffect wont be affected so wont be executed because it is not a dependancie, so clean up wont be executed !
so if nimportequoi changes, this useeffect won't be executed again, even if the component re render due to this change, because it only executes the useEffect at mounting + change of the eventual dependancies, and here, nimportequoi is not a dependancie, only nimportequoi2!

######### SCENARIO 5 ###############
const [nimportequoi, setNimportequoi] = useState('')
const [nimportequoi2, setNimportequoi2] = useState('')

useEffect(() => {
console.log("Effect running");
return () =>{
console.log("cleanup")
}
},[]);

in this case, useEffect will run at the very first mount of the component ONLY,  
and the console log clean up will be executed only when the component is definitely unmount
no other impacts or re executions!

### RECAP ABOUT THE useReducer() hook

complete description in alternative file /src/components/Login/LoginUsingReducer.js
such file is an alternative to the Login.js file of that same folder

### RECAP ABOUT THE useContext() hook

1 ) creation of a folder named store (src/store)
in that folder we create a file called auth-context.js in which we create a React.createContext variable AuthContext
that we export default AuthContext

2 ) we provide such context in our app
to do that, we need to wrapp all components of the return section, that will need such AuthContext
so we will wrapp our complete app components with this provider, directly in the app.js file
by importing of course the AuthContext from './store/auth-context' but also by importing {Provider} from react
but to do so, we need to give the context a value prop (mandoatory that the name is value here!)
that is why we write <AuthContext.Provider value={{ isLoggedIn: isLoggedIn }}>
and then pass to that value prop an object whose pair 'key-value' is key isLoggedIn and value isLoggedIn from the useState
and we can of course also pass function, like onLogout, that will call the logoutHandler of the App component!

3. we consume it in our corresponding components, here in the /src/components/MainHeader/Navigation.js file
   by first importing useContext from react
   and then declaring a ctx const variable that takes a function useContext with the AuthContext import as arg.
   by doing so, we wcould simply remove, (which we did not do but could do as it is not necessary anymore), the
   isLoggedIn={props.isAuthenticated} prop passed to Navigation, in the MainHeader parent component !

4. we could also create our own customer context provider, to do so, please hve a look at the same auth-context.js file, but with that customer provider

1 - auth-context.js file:
import React from "react";
const AuthContext = React.createContext({
isLoggedIn: false,
onLogout:()=>{}
});
export default AuthContext;

2 - App.js file
import React, { useState, useEffect, Provider } from "react";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./store/auth-context";

function App() {

const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
if (storedUserLoggedInInformation === "1") {
setIsLoggedIn(true);
}
}, []);

const loginHandler = (email, password) => {
localStorage.setItem("isLoggedIn", "1");
setIsLoggedIn(true);
};
const logoutHandler = () => {
localStorage.removeItem("isLoggedIn");
setIsLoggedIn(false);
};

return (
<React.Fragment>
<AuthContext.Provider value={{ isLoggedIn: isLoggedIn }}> {/_ ##################### _/}
<MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />

<main>
{!isLoggedIn && <Login onLogin={loginHandler} />}
{isLoggedIn && <Home onLogout={logoutHandler} />}
</main>
</AuthContext.Provider> {/_ ##################### _/}
</React.Fragment>
);
}

export default App;

// 3 - Navigation.js file:
import React, { useContext } from "react";
import AuthContext from "../../store/auth-context"; //##########################

import classes from "./Navigation.module.css";

const Navigation = (props) => {
const ctx = useContext(AuthContext); //##########################
return (

<nav className={classes.nav}>
<ul>
{ctx.isLoggedIn && ( //##########################
<li>
<a href="/">Users</a>
</li>
)}
{ctx.isLoggedIn && ( //##########################
<li>
<a href="/">Admin</a>
</li>
)}
{ctx.isLoggedIn && ( //##########################
<li>
<button onClick={props.onLogout}>Logout</button>
</li>
)}
</ul>
</nav>
);
};

export default Navigation;

// 4 - auth-context.js file with integration of a custom context provider that can then be used as a component to wrap DOM elements in our App, instead of calling AuthContext.provider

import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
isLoggedIn: false,
onLogout: () => {}, //################ default state
onLogin: (email, password) => {}, //################ default state
});

//if we want to create a custom context provider component
export const AuthContextProvider = (props) => {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const logoutHandler = () => {
localStorage.removeItem("isLoggedIn");
setIsLoggedIn(false);
};
const loginHandler = () => {
localStorage.setItem("isLoggedIn", "1");
setIsLoggedIn(true);
};

useEffect(() => {
const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
if (storedUserLoggedInInformation === "1") {
setIsLoggedIn(true);
}
}, []); // here no dependancies needed

return (
<AuthContext.Provider
value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }} >
{props.children}
</AuthContext.Provider>
);
};

export default AuthContext;

AND BY DOING SO OUR APP.JS FILE WOULD SIMPLY BE LIKE BELOW IF WE ALSO MODIFY THE INDEX;JS FILE TO BE LIKE BELOW:

//APP.JS FILE COULD THEN BE AS SIMPLE AS:
import React, {useContext} from "react";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./store/auth-context";

function App() {
const ctx = useContext(AuthContext)
return (
<React.Fragment>
<MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />

<main>
{!ctx.isLoggedIn && <Login  />}
{ctx.isLoggedIn && <Home />}
</main>

    </React.Fragment>

);
}
export default App;

// AND INDEX.JS FILE WOULD THEN NEED TO BE LIKE:
import React from 'react';
import ReactDOM from 'react-dom';
import { AuthContextProvider } from "./store/auth-context";

import './index.css';
import App from './App';

ReactDOM.render(<AuthContextProvider><App /></AuthContextProvider>, document.getElementById('root'));
