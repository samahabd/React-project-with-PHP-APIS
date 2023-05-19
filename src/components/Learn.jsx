import React, { useState } from "react";
import style from "./LiveDemo.module.css";
import axios from "axios";
import { Link,NavLink,useNavigate } from "react-router-dom";
import Joi from "joi";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext.jsx";
import ForgetPassword from "../ForgetPassword/ForgetPassword";
// import {  NavLink } from 'react-router-dom';


export default function LiveDemo({ isOpenLogin, toggleOpenLogin }) {
  // forget Pass

  const [isOpenForget, setIsOpenForget] = useState(true);

  function toggleOpenForget() {
    setIsOpenForget(!isOpenForget);
  }

  
    // fuction to handle forget and login
  
    const handleBothClickslogForget = () => {
      toggleOpenLogin(!isOpenLogin);
      toggleOpenForget();
    };


  const { userData, saveUserData } = useContext(AuthContext);

  let navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [errorList, seterrorList] = useState([]);

  const [error, setError] = useState("");

  const [user, setUser] = useState({
    email: "",
    password: " ",
  });

  function getUserData(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  }

  async function sendloginDataToApi() {
    let { data } = await axios.post(
      "http://ec2-13-41-193-30.eu-west-2.compute.amazonaws.com/user/login",
      user
    );

    if (data.message === "Successfull Login") {
      setIsLoading(false);
      localStorage.setItem("userToken", data.token);
      console.log(localStorage);

      saveUserData();


      // profile
      navigate("/profile");
    } else {
      setIsLoading(false);
      setError(data.detail);
    }
  }

  function submitloginForm(e) {
    setIsLoading(true);

    e.preventDefault();

    let validation = validateloginForm();

    if (validation.error) {
      setIsLoading(false);

      seterrorList(validation.error.details);
    } else {
      sendloginDataToApi();
    }
  }

  function validateloginForm() {
    let scheme = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(/^(?=.\d)(?=.[a-zA-Z])[a-zA-Z]{5,}[a-zA-Z\d]{3,}$/)
        .required(),
    });
    console.log(scheme.validate(user, { abortEarly: false }));

    return scheme.validate(user, { abortEarly: false });
  }

  let showErrors = (inputName) => {
    let errors = errorList.filter((error) => {
      return error.message.includes(inputName);
    });

    if (errors[0] !== undefined && errors[0].message.includes("password")) {
      return (
        <div className="alert alert-danger py-1">
          Password must be 5 char and 3 letter at least
        </div>
      );
    } else if (errors[0] !== undefined) {
      return <div className="alert alert-danger py-1">{errors[0].message}</div>;
    }
  };

  function close(){
    
  }

  return (
    <>
      
        <ForgetPassword isOpenForget={isOpenForget} toggleOpenForget={toggleOpenForget} isOpenLogin={isOpenLogin} toggleOpenLogin={toggleOpenLogin} />
      

      <form onSubmit={submitloginForm}>
        <div
          className={`live-demo ${isOpenLogin ? "open" : ""} mt-2  ${style.sin
            }`}
          id="first"
        >
          <div className={${style.navLogin}}>
            <div className=" text-end mx-4 py-2">
              <i
                className="fa-solid fa-xmark text-white fa-lg"
                onClick={toggleOpenLogin}
              ></i>
            </div>
          </div>

          <div className="user">
            <div className={${style.content} px-3}>
              <h2 className="text-center py-2">Log In</h2>

              {/* errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrror */}

              {error.length > 0 ? (
                <div className=" alert alert-danger my-1">{error}</div>
              ) : (
                ""
              )}
              <div
                className={w-100 me-auto position-relative ${style.user} mt-2}
              >
                <input
                  onChange={getUserData}
                  type="text"
                  className={ form-control w-100  ${style.formControlCustom}}
                  placeholder="Email"
                  name="email"
                />
                <i
                  className={fa-solid fa-envelope position-absolute  ${style.iconUser}}
                ></i>
              </div>
              {/*validation for email  */}

              {errorList.length > 0 ? showErrors("email") : ""}

              {/* end validation of email */}

              <div
                className={w-100 me-auto position-relative ${style.user} mt-2}
              >
                <input
                  onChange={getUserData}
                  type="password"
                  className={ form-control w-100 ${style.formControlCustom}}
                  placeholder="password"
                  name="password"
                />
                <i
                  className={fa-solid fa-lock position-absolute  ${style.iconUser}}
                ></i>
              </div>

              {/*validation for password  */}

              {errorList.length > 0 ? showErrors("password") : ""}

              {/* end validation of password */}
{/* /////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* forget pass */}
              <NavLink   onClick={handleBothClickslogForget} className="text-end my-1 text-muted">
                Forget your Password?
              </NavLink>

              <div className="w-75 m-auto">
                <button
                  className={w-100  ${style.btn_log} my-4 rounded-5}
                  type="submit"
                >
                  {isLoading === true ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "log in"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className={${style.otherLogin} w-100 text-center my-4}>
            <h5>
              <span>or</span> sign in with
            </h5>
            <div className="my-2">
              <i className="fa-brands fa-facebook px-2 fa-lg"></i>
              <i className="fa-brands fa-google fa-lg"></i>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}