import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faArrowCircleLeft, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Recovery = () => {
  return (
    <>
      <ToastContainer position="top-center" />
      <div
        class="card mx-auto"
        style={{
          width: "25%",
          padding: "10px",
          marginTop: "200px",
          marginLeft: "600px",
          boxShadow: "5px 5px 15px grey",
        }}
      >
        <Link to={'/password'}><FontAwesomeIcon className="btn btn-outline-primary" icon={faArrowCircleLeft} style={{marginLeft:"1px", cursor:"pointer", fontSize:"25px"}} /></Link>
          <h3 style={{ textAlign: "center" }}>Recovery</h3>
          <form>
            <p style={{textAlign:"center"}}>please enter OTP to recover <span style={{color:"red"}}>password</span></p>
            <div class="input-group mb-3 mt-2">
              <FontAwesomeIcon icon={faKey} style={{fontSize:"20px", padding:"10px", backgroundColor:"rgb(209, 208, 211)", borderRadius:"5px 0px 0px 5px"}} />
            <input
              type="text"
              className="form-control"
              placeholder="enter OTP..."
            />
            </div>
            <button
              className="btn btn-outline-primary mt-2"
              style={{ float: "right" }}
            >
              Recover
            </button>
            &nbsp;
            <p>
              did'nt get OTP?
              <Link to={"/recovery"} style={{ color: "pink" }}>
                Resend
              </Link>
            </p>
          </form>
      </div>
    </>
  );
};

export default Recovery;
