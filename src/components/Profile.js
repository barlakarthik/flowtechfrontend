import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import convertToBase64 from "../helper/Convert";
import { profileValidation } from "../helper/Validate";
import useFetch from "../hook/fetch.hook";
import { updateUser } from "../helper/helper";
import { store } from "../App";
import "./profile.css";
import avatar from "../Assets/user.jpg";
import {
  faLock,
  faPhone,
  faEnvelope,
  faBuilding,
  faAddressCard,
  faIdCardAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Register = () => {
  const [file, setFile] = useState();
  const [email, setEmail] = useContext(store);
  const [{ isLoading, apiData, serverError }] = useFetch(`/email/${email}`);
  const formik = useFormik({
    initialValues: {
      username: apiData?.username,
      lastname: apiData?.lastname,
      email: apiData?.email,
      password: apiData?.password,
      mobile: apiData?.mobile,
      organization: apiData?.organization,
      address: apiData?.address,
      profile: apiData?.profile,
      role: apiData?.role,
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = Object.assign(values, { profile: apiData?.profile || file });
      let updatePromise = await updateUser(values);
      if (updatePromise) {
        toast.success(<b>profile updated successfully...!</b>);
      } else {
        toast.error(<b>failed to update profile...!</b>);
      }
    },
  });

  // useEffect(() => {
  //   formik.values.firstname = apiData?.username
  //   formik.values.lastname = apiData?.lastname
  //   formik.values.email = apiData?.email
  //   formik.values.organization = apiData?.organization
  //   formik.values.mobile = apiData?.mobile
  //   formik.values.address = apiData?.address
  //   formik.values.profile = apiData?.profile
  // }, [apiData, formik])

  const t = localStorage.getItem("token");
  //  const notify = ()=>{
  //   toast.success(<b>Registered Successfully...</b>)
  //  }
  //  if(t){
  //   notify();
  //  }
  const upload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };
  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  return (
    <>
      {/* <ToastContainer position="top-center" /> */}
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div
        className="card mx-auto mt-40"
        style={{
          width: "40%",
          boxShadow: "5px 5px 15px grey",
        }}
      >
        <form onSubmit={formik.handleSubmit} className="my-3 mx-4">
          <div className="row" style={{ display: "block" }}>
            <h3 style={{ textAlign: "center" }}>Profile</h3>
            <p id="profile-p-tag">you can update your profile ⓘ</p>
          </div>
          <div className="row">
            <label htmlFor="profile">
              <img
                className="mx-auto"
                src={file ? file : apiData?.profile || avatar}
                alt="avatar"
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50px",
                  cursor: "pointer",
                }}
              />
              <input
                type="file"
                id="profile"
                name="profile"
                onChange={upload}
              />
            </label>
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <input
                {...formik.getFieldProps("username")}
                type="text"
                placeholder="Firstname..."
                className="form-control"
              />
            </div>
            <div className="col-6">
              <input
                {...formik.getFieldProps("lastname")}
                type="text"
                placeholder="Lastname..."
                className="form-control"
              />
            </div>
          </div>
          <div className="row  mt-2">
            <div className="col-6">
              <div class="input-group">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{
                    fontSize: "20px",
                    padding: "10px",
                    backgroundColor: "rgb(209, 208, 211)",
                    borderRadius: "5px 0px 0px 5px",
                  }}
                />
                <input
                  {...formik.getFieldProps("email")}
                  type="text"
                  className="form-control"
                  placeholder="email.."
                />
              </div>
            </div>
            <div className="col-6">
              <div class="input-group">
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
                  {...formik.getFieldProps("password")}
                  type="text"
                  className="form-control"
                  placeholder="password.."
                />
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <div className="input-group">
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{
                    fontSize: "20px",
                    padding: "10px",
                    backgroundColor: "rgb(209, 208, 211)",
                    borderRadius: "5px 0px 0px 5px",
                  }}
                />
                <input
                  {...formik.getFieldProps("mobile")}
                  type="text"
                  placeholder="Mobile..."
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <FontAwesomeIcon
                  icon={faBuilding}
                  style={{
                    fontSize: "20px",
                    padding: "10px",
                    backgroundColor: "rgb(209, 208, 211)",
                    borderRadius: "5px 0px 0px 5px",
                  }}
                />
                <input
                  {...formik.getFieldProps("organization")}
                  type="text"
                  placeholder="Organisation..."
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div div className="row mt-2">
            <div className="col-6">
              <div className="input-group">
                <FontAwesomeIcon
                  icon={faAddressCard}
                  style={{
                    fontSize: "20px",
                    padding: "10px",
                    backgroundColor: "rgb(209, 208, 211)",
                    borderRadius: "5px 0px 0px 5px",
                  }}
                />
                <input
                  {...formik.getFieldProps("address")}
                  type="text"
                  className="form-control"
                  placeholder="Address..."
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <FontAwesomeIcon
                  icon={faIdCardAlt}
                  style={{
                    fontSize: "20px",
                    padding: "10px",
                    backgroundColor: "rgb(209, 208, 211)",
                    borderRadius: "5px 0px 0px 5px",
                  }}
                />
                <select
                  {...formik.getFieldProps("role")}
                  className="form-control"
                >
                  <option value="" disabled>
                    Select a role...
                  </option>
                  <option value="customer">Customer</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="approver">Approver</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <Link
                to={"/register"}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="input-group">
                  <button
                    id="logout"
                    style={{
                      width: "100%",
                      padding: "9px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      border: "1px solid black",
                    }}
                  >
                    Logout
                  </button>
                </div>
              </Link>
            </div>
            <div className="col-6">
              <div className="input-group">
                <button
                  id="update"
                  style={{
                    width: "100%",
                    padding: "9px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: "1px solid  rgb(48, 117, 184)",
                  }}
                  type="submit"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
