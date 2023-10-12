import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { Toaster } from "react-hot-toast";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { resetPasswordValidation } from "../helper/Validate";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Reset = () => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_pwd:""
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
    },
  });
  return (
    <>
      <Toaster position="top-center" reverseOrder></Toaster>
      <div
        class="card"
        style={{
          width: "28rem",
          padding: "10px",
          marginTop: "200px",
          marginLeft: "600px",
          boxShadow: "5px 5px 15px grey",
        }}
      >
        <div class="card-body">
        <Link to={'/'}><FontAwesomeIcon className="btn btn-outline-primary" icon={faArrowCircleLeft} style={{marginLeft:"1px", cursor:"pointer", fontSize:"25px"}} /></Link>
          <h3 style={{ textAlign: "center" }}>Reset</h3>
          <p style={{marginLeft:"56px"}}>Enter new <span style={{color:"blue"}}>password</span></p>
          <form onSubmit={formik.handleSubmit}>
        <div class="input-group mb-3 mt-2">
        <FontAwesomeIcon icon={faLock} style={{fontSize:"20px", padding:"10px", backgroundColor:"rgb(209, 208, 211)", borderRadius:"5px 0px 0px 5px"}} />
            <input
              type="text"
              {...formik.getFieldProps("password")}
              className="form-control"
              placeholder="enter new password..."
            />
            </div>
            <div class="input-group mb-3 mt-2">
            <FontAwesomeIcon icon={faLock} style={{fontSize:"20px", padding:"10px", backgroundColor:"rgb(209, 208, 211)", borderRadius:"5px 0px 0px 5px"}} />
                <input
                  type="text"
                  {...formik.getFieldProps("confirm_pwd")}
                  className="form-control"
                  placeholder="confirm password..."
                />
                </div>
            
            <button
              className="btn btn-outline-primary mt-2"
              style={{ float: "right" }}
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Reset;
