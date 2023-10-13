import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { faChampagneGlasses, faLock } from "@fortawesome/free-solid-svg-icons";
import { passwordValidate } from "../helper/Validate";
import avatar from "../Assets/user.jpg";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { verifyPassword } from "../helper/helper";
import { getAllUsers } from "../helper/helper";
import useFetch from "../hook/fetch.hook";
import { store } from "../App";
const Password = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useContext(store);
  const localemail = localStorage.getItem('email');
  const [{ isLoading, apiData, serverError }] = useFetch(`/email/${localemail}`);
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = await verifyPassword({
        email,
        password: values?.password,
      });
      const allData = await getAllUsers()
      const logeduser = allData.find((item) => (item.username === loginPromise.username))
      if (loginPromise) {
        localStorage.setItem("token", loginPromise.token);
        if (logeduser.role === "customer") {
          navigate("/admin")
        }
        else if(logeduser.role === "reviewer"){
          navigate("/reviewer")
        }
         else if (logeduser.role === "approver") {
          navigate("/approver");
        } else {
          navigate("/profile");
        }
      } else {
        toast.error(<b>credentials wrong...!</b>);
      }
    },
  });
  if (isLoading) return <h1 className="text-2xl font-bold">isLoading...</h1>;
  return (
    <>
      <Toaster position="top-center" reverseOrder></Toaster>
      <div
        class="card mx-auto mt-40"
        style={{
          width: "25%",

          boxShadow: "5px 5px 15px grey",
        }}
      >
        <form onSubmit={formik.handleSubmit} className="mx-3 my-3">
          <Link to={"/"}>
            <FontAwesomeIcon
              className="btn btn-outline-primary"
              icon={faArrowCircleLeft}
              style={{ cursor: "pointer" }}
            />
          </Link>
          <h3 style={{ textAlign: "center" }}>Login-Form</h3>
          <h4 style={{ textAlign: "center" }}>
            Hello <span style={{ color: "blue" }}>{apiData?.username}</span>
          </h4>
          <img
            className="mx-auto"
            src={apiData?.profile || avatar}
            alt="profile"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50px",
            }}
          />
          <div class="input-group mb-3 mt-2">
            <FontAwesomeIcon
              icon={faLock}
              style={{
                fontSize: "20px",
                padding: "10px",
                backgroundColor: "rgb(209, 208, 211)",
                borderRadius: "5px 0px 0px 5px",
              }}
            />
            <input
              type="text"
              {...formik.getFieldProps("password")}
              className="form-control"
              placeholder="password..."
            />
          </div>
          <button
            className="btn btn-outline-primary mt-2"
            style={{ float: "right" }}
          >
            Login
          </button>
          &nbsp;
          <p>
            forgot password?
            <Link to={"/recovery"} style={{ color: "pink" }}>
              Recover now
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Password;
