import React, { useContext, useState } from 'react';
import { Link, json } from "react-router-dom";
import useFetch from "../hook/fetch.hook";
import toast, { Toaster } from 'react-hot-toast';
import { store } from "../App";
import axios from 'axios';
const Approve = () => {
    const [email, setEmail] = useContext(store);
    const [testEmail,setTestEmail] = useState("");
    if (!email) {
        const localemail = localStorage.getItem('email');
        setEmail(localemail)
    }
    const [{ isLoading, apiData, serverError }] = useFetch(`/email/${email}`);
    const LogoutHandler = () => {
        // setShowUsers(!showUsers);
        localStorage.clear()
    }
    const sendEmail = async(e)=>{
      e.preventDefault();
      const res = await axios.post('http://localhost:8080/api/sentmail',{body:JSON.stringify({testEmail})});
      if(res.data.info && res.data.status === 201){
        toast.success("mail send successfully")
      }else{
        toast.error("unable send mail")
      }
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
                            >
                                Orders
                            </a>
                        </li>
                    </div>
                    <div>
                        <li className="nav-item">
                            <a
                                className="nav-link text-light"
                                style={{ textDecoration: "none", cursor: "pointer" }}
                            >
                                Enquiry
                            </a>
                        </li>
                    </div>
                    <div>
                        <li className="nav-item">
                            <a
                                className="nav-link text-light"
                                style={{ textDecoration: "none", cursor: "pointer" }}
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
            <div className='container mt-2'>
                <div className='d-flex justify-content-center'>
                    <h2>Send email with React && Node js</h2>
                </div>
                <div className='d-flex justify-content-center'>
                    <form className='col-lg-6'>
                        <div class="mb-3">
                            <label class="form-label">Email address</label>
                            <input type="email" class="form-control" name='testEmail' onChange={(e)=>setTestEmail(e.target.value)} />
                        </div>
                        <button type="submit" class="btn btn-primary" onClick={sendEmail}>Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Approve