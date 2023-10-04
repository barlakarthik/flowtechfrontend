import React, { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import { Toaster } from 'react-hot-toast';
import { profileValidation } from '../helper/Validate';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {useAuthStore} from '../store/Store';
import { store } from '../App'
import avatar from '../Assets/user.jpg'
const Email = () => {
  const [email, setEmail] = useContext(store);
  const navigate = useNavigate()
  // const setEmail = useAuthStore(state=>state.setEmail)
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      setEmail(values.email)
      navigate('/password')
    }
  })
  localStorage.setItem("email", email);
  return (
    <>
      <Toaster position="top-center" reverseOrder></Toaster>
      <div class="card mx-auto mt-40" style={{ "width": "30%", boxShadow: "5px 5px 15px grey" }}>
        <form onSubmit={formik.handleSubmit} className="my-3 mx-4">
          <h3 style={{ textAlign: "center" }}>Login-Form</h3>
          <img className="mx-auto" src={avatar} alt="profile" style={{ width: "70px", height: "70px", borderRadius: "50px" }} />
          <div class="input-group mb-3 mt-2">
            <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: "20px", padding: "10px", backgroundColor: "rgb(209, 208, 211)", borderRadius: "5px 0px 0px 5px" }} />
            <input type="text" {...formik.getFieldProps('email')} className="form-control" placeholder="email.." />
          </div>
          <button className="btn btn-outline-primary mt-2" style={{ float: "right" }}>Next</button>&nbsp;<p className="ms-12">don't you have an account?<Link to={"/register"} style={{ color: "green" }}>register</Link></p>
        </form>
      </div>
    </>
  );
};

export default Email;
