import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import convertToBase64 from '../helper/Convert';
import { registerValidation } from '../helper/Validate'
import './profile.css';
import avatar from '../Assets/user.jpg'
import { faLock, faUser, faEnvelope, faPhone, faBuilding, faAddressCard, faIdCardAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllUsers, registerUser } from '../helper/helper';
const Register = () => {
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const [typesOfroles, setTypesOfRoles] = useState([
    {value:"customer", label:"Customer"},
    {value:"reviewer", label:"Reviewer"},
    {value:"approver", label:"Approver"}
  ])
  const formik = useFormik({
    initialValues: {
      username: "",
      lastname: "",
      email: "",
      password: "",
      mobile: "",
      organization: "",
      address: "",
      role: "user"
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = Object.assign(values, { profile: file || "" })
      try {
        const registerPromise = registerUser(values);
        const allusers = await getAllUsers();
        const exist = allusers.find(user => user.email === values.email);
        if (exist) {
          toast.error(<b>Could not Register...!</b>)
        } else {
          toast.success(<b>Registered Successfully...!</b>)
          setTimeout(() => {
            navigate('/');
          })
        }
        await registerPromise;
      } catch (error) {
        console.error(error);
      }
    }
  })
  const upload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64)
  }
  return (
    <>
      <Toaster position="top-center" reverseOrder></Toaster>
      <div
        class="card mx-auto mt-40"
        style={{
          width: "45%",
          boxShadow: "5px 5px 15px grey",
        }}
      >
        <form onSubmit={formik.handleSubmit} className="mx-3 my-2">
          <div className="row">
            <h3 style={{ textAlign: "center" }}>Register-Form</h3>
          </div>
          <div className="row">
            <label htmlFor="profile">
              <img className="mx-auto" src={file || avatar} alt="avatar" style={{ width: "70px", height: "70px", borderRadius: "50px" }} />
              <input type="file" id="profile" name="profile" onChange={upload} />
            </label>
          </div>
          <div className="row mt-2">
            <div class="col-6">
              <div className="input-group">
                <FontAwesomeIcon icon={faUser} style={{ fontSize: "20px", padding: "10px", backgroundColor: "rgb(209, 208, 211)", borderRadius: "5px 0px 0px 5px" }} />
                <input {...formik.getFieldProps('username')} type="text" className="form-control" placeholder="username..." />
              </div>
            </div>
            <div class="col-6">
              <div className="input-group">
                <FontAwesomeIcon icon={faUser} style={{ fontSize: "20px", padding: "10px", backgroundColor: "rgb(209, 208, 211)", borderRadius: "5px 0px 0px 5px" }} />
                <input {...formik.getFieldProps('lastname')} type="text" className="form-control" placeholder="lastname..." />
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: "20px", padding: "10px", backgroundColor: "rgb(209, 208, 211)", borderRadius: "5px 0px 0px 5px" }} />
                <input {...formik.getFieldProps('email')} type="text" className="form-control" placeholder="email.." />
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} style={{ fontSize: "20px", padding: "10px", backgroundColor: "rgb(209, 208, 211)", borderRadius: "5px 0px 0px 5px" }} />
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
            <div class="col-6">
              <div className="input-group">
                <FontAwesomeIcon icon={faBuilding} style={{ fontSize: "20px", padding: "10px", backgroundColor: "rgb(209, 208, 211)", borderRadius: "5px 0px 0px 5px" }} />
                <input {...formik.getFieldProps('organization')} type="text" className="form-control" placeholder="organization..." />
              </div>
            </div>
            <div class="col-6">
              <div className="input-group">
                <FontAwesomeIcon icon={faPhone} style={{ fontSize: "20px", padding: "10px", backgroundColor: "rgb(209, 208, 211)", borderRadius: "5px 0px 0px 5px" }} />
                <input {...formik.getFieldProps('mobile')} type="text" className="form-control" placeholder="mobile..." />
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div class="col-6">
              <div className="input-group">
                <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: "20px", padding: "10px", backgroundColor: "rgb(209, 208, 211)", borderRadius: "5px 0px 0px 5px" }} />
                <input {...formik.getFieldProps('address')} type="text" className="form-control" placeholder="address..." />
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
                <select {...formik.getFieldProps('role')} className="form-control">
                  <option>Select a role...</option>
                  {typesOfroles.map((item)=>(
                    <option value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <div className="input-group">
                <button
                  id="register"
                  style={{ width: "100%", padding: "8px", borderRadius: "10px", cursor: "pointer", border: "1px solid  rgb(48, 117, 184)" }}
                  type="submit"
                >
                  Register
                </button>
              </div>
              <p className="ms-25" style={{ textAlign: "center" }}>already have an account?<Link to={"/"} style={{ color: "blue" }}>Login</Link></p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
{/* <Row>
            <Col md={8}>
              <Row>
                <Col md={4}>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label
                        htmlFor="custom_page_obj"
                        data-i18n="lang.Select object"
                        className="col-form-label"
                      >
                        Page Types
                      </label>
                      <Select
                        value={props.parentState.customPageObject}
                        onChange={(e) => {
                          handleObjectSelect("customPageObject", e);
                        }}
                        id="custom_page_obj"
                        disabled={props.disabled}
                        required
                        options={props.parentState?.deviceOptions}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label
                        htmlFor="screen_name"
                        className="col-form-label"
                        data-i18n="lang.Screen name"
                      >
                        Page name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Page name"
                        aria-label="Search"
                        id="page_name"
                        disabled={props.disabled}
                        autoComplete="off"
                        name="customPageName"
                        value={props.parentState.customPageName}
                        onChange={props.handleChange}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label
                        htmlFor="screen_name"
                        className="col-form-label"
                        data-i18n="lang.Screen name"
                      >
                        Page List
                      </label>
                      <select
                        type="text"
                        className="form-control"
                        aria-label="Search"
                        id="selected_page"
                        disabled={props.disabled}
                        autoComplete="off"
                        name="selected_page"
                        value={props.parentState.selected_page}
                        onChange={(e) => { props.handleChange(e) }}
                      >
                        <option>Select Page</option>
                        {props.parentState?.custom_pages?.map((custom_page, i) => (<option value={i}>{custom_page?.page_name}</option>))}
                      </select>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={3} >
              &nbsp;&nbsp;
              {(props.parentState?.selected_page ||
                props.parentState?.selected_page === 0) && (
                  <button
                    className="btn btn-outline-primary mx-1"
                    type="button"
                    style={{ margin: "33px" }}
                    onClick={() => editCustomPage(props.parentState.custom_pages[props.parentState?.selected_page], props.parentState?.selected_page)}
                    id="addPageButton"
                  >
                    Edit
                  </button>
                )}
              {(props.parentState?.selected_page ||
                props.parentState?.selected_page === 0) && (
                  <button
                    className="btn btn-outline-danger mx-1"
                    type="button"
                    style={{ margin: "33px" }}
                    onClick={() => deleteCustomPage(props.parentState.custom_pages[props.parentState?.selected_page], props.parentState?.selected_page)}
                    id="addPageButton"
                  >
                    Delete
                  </button>
                )}
              {!props.parentState?.customPageEdit &&
                !props.parentState?.scriptPageEdit && (
                  <button
                    className="btn btn-outline-primary mx-1"
                    type="button"
                    style={{ margin: "33px" }}
                    onClick={addPages}
                    id="addPageButton"
                  >
                    Add
                  </button>

                )}

              {(props.parentState?.customPageEdit ||
                props.parentState?.scriptPageEdit) && (
                  <button
                    className="btn btn-outline-primary mx-1"
                    type="button"
                    style={{ margin: "33px" }}
                    onClick={updatePages}
                    id="addPageButton"
                  >
                    Update
                  </button>
                )}
              &nbsp;&nbsp;
              <button
                className="btn btn-outline-secondary mx-1"
                type="button"
                style={{ margin: "33px" }}
                data-i18n="lang.Clear"
                onClick={clearPages}
              >
                Clear
              </button>
              &nbsp;&nbsp;
            </Col>
          </Row> */}
