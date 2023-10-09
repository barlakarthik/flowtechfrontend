import React, { useContext, useState } from 'react';
import { Link, json } from "react-router-dom";
import { useFormik } from "formik";
import { Modal } from 'react-bootstrap';
import useFetch from "../hook/fetch.hook";
import { getAllUsers } from "../helper/helper";
import { deleteUser } from '../helper/helper';
import { updateUser } from "../helper/helper";
import toast, { Toaster } from 'react-hot-toast';
import { store } from "../App";
import axios from 'axios';
const Approve = () => {
    const [email, setEmail] = useContext(store);
    // const [testEmail, setTestEmail] = useState("");
    const [approved, setApproved] = useState([]);
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [showUsers, setShowUsers] = useState(false)
    const filter = {
        where: {
            approve: true
        }
    };
    const filterString = JSON.stringify(filter);
    const encodedFilter = encodeURIComponent(filterString)
    if (!email) {
        const localemail = localStorage.getItem('email');
        setEmail(localemail)
    }
    const [{ isLoading, apiData, serverError }] = useFetch(`/email/${email}`);
    const formik = useFormik({
        initialValues: {
          role: apiData?.role,
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
          let updatePromise = await updateUser(values);
          if (updatePromise) {
            toast.success(<b>role updated successfully...!</b>);
          } else {
            toast.error(<b>failed to update role...!</b>);
          }
        },
      });
    const LogoutHandler = () => {
        // setShowUsers(!showUsers);
        localStorage.clear()
    }
    const usersData = async () => {
        setShow(false)
        setShowUsers(!showUsers)
        const allData = await getAllUsers()
        const filteredUsers = allData.filter((item) => (item.email !== apiData.email))
        setUsers(filteredUsers)
    }
    const DeleteHandler = async (id) => {
        if (id) {
            toast.success(<b>Account deleted Successfully...</b>)
            await deleteUser(id);
            const allData = await getAllUsers()
            const filteredUsers = allData.filter((item) => (item.email !== apiData.email))
            setUsers(filteredUsers)
        }
    }
    const AssignRole = (user) => {
        setShowModal(!showModal)
    }
    const handleCloseModal = () => {
        setShowModal(!showModal)
    }
    const sendEmail = async (e, testEmail) => {
        e.preventDefault();
        const res = await axios.post('http://localhost:8080/api/sentmail', { body: JSON.stringify({ testEmail }) });
        if (res.data.info && res.data.status === 201) {
            toast.success("mail send successfully")
        } else {
            toast.error("unable send mail")
        }
    }
    const getApprovedEnquiries = async () => {
        setShowUsers(false);
        const approvedEnq = await axios(`http://localhost:8080/api/enquiries`)
        setApproved(approvedEnq.data)
        setShow(!show);
    }
    return (
        <div>
            <Toaster position="top-center" reverseOrder></Toaster>
            <nav className='nav' style={{ backgroundColor: "rgb(48, 117, 184)" }}>
                <>
                    <div>
                        <Link to="/profile">
                            <img
                                src={apiData?.profile}
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    borderRadius: "50px",
                                    cursor: "pointer",
                                }}
                                alt="Profile"
                            />
                        </Link>
                    </div>
                    <div>
                        <li className="nav-item">
                            <a
                                className="nav-link text-light"
                                style={{ textDecoration: "none", cursor: "pointer" }}
                                onClick={getApprovedEnquiries}
                            >
                                EnquiriesApproved<span style={{ backgroundColor: "red", color: "white", padding: "3px", borderRadius: "50px" }}>{approved.length}</span>
                            </a>
                        </li>
                    </div>
                    <div>
                        <li className="nav-item">
                            <a
                                className="nav-link text-light"
                                style={{ textDecoration: "none", cursor: "pointer" }}
                                onClick={() => usersData()}
                            >
                                Users
                            </a>
                        </li>
                    </div>
                    <div>
                        <Link to={"/register"}>
                            <button className="logoutbtn" onClick={LogoutHandler}>Logout</button>
                        </Link>
                    </div>
                </>
            </nav>
            {
                showUsers && (
                    <div className='row mt-2 mx-2'>
                        {users?.map((user, index) => {
                            return (
                                <div className='col-4'>
                                    <div className="card">
                                        <div className="card-body">
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <img src={user.profile} alt='profilepic'
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        borderRadius: "50px",
                                                        cursor: "pointer",
                                                    }}
                                                />
                                                {/* <span className={`${user.role ==="user"?"badge badge-sm bg-success float-end mt-1 me-2 py-2 p-1":"badge badge-sm bg-primary float-end mt-1 me-2 py-2 p-1"}`} style={{color:"white"}}>{user.role}</span> */}
                                                {user.role === "reviewer" ? <span style={{ color: "red" }}><b>{user.role}</b></span> : <span style={{ color: "blue" }}><b>{user.role}</b></span>}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div>
                                                    {user.username}
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "row" }} className='mt-1'>
                                                    <i
                                                        id='Delete'
                                                        className="fa fa-trash mx-2 col-1"
                                                        style={{ cursor: "pointer", color: "red" }}
                                                        onClick={() => DeleteHandler(user._id)}
                                                    />
                                                    <i
                                                        id='Edit'
                                                        className="fa fa-pencil mx-2 col-1"
                                                        onClick={() => AssignRole(user)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            }
            {
                show && approved.length > 0 &&
                <div className='d-flex justify-content-center'>
                    <h2>Orders Approved</h2>
                </div>
            }
            {show && approved.length > 0 && approved.map((item) => {
                return (
                    <div className='container mt-2'>
                        <div className='d-flex justify-content-center'>
                            <form className='col-lg-6 row'>
                                <div className="col">
                                    <div className="mb-3">
                                        <input type="email" className="form-control" name='testEmail' value={item.enqSource} /*onChange={(e) => setTestEmail(e.target.value)}*/ />
                                    </div>
                                </div>
                                <div className="col">
                                    <button type="submit" className="btn btn-primary" onClick={() => sendEmail(item.enqSource)}>Send</button>
                                </div>
                            </form>
                        </div>

                    </div>
                )
            })}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="input-group">
                            <i
                                className="fa fa-id-card"
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
                        <button className='btn btn-outline-primary' type="submit">Add Role</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Approve