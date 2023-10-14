import React, { useContext, useEffect, useState } from 'react';
import { Link, json } from "react-router-dom";
import { useFormik } from "formik";
import { Modal } from 'react-bootstrap';
import useFetch from "../hook/fetch.hook";
import { getAllUsers } from "../helper/helper";
import { deleteUser } from '../helper/helper';
import { updateUser } from "../helper/helper";
import toast, { Toaster } from 'react-hot-toast';
import { faEye, faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { store } from "../App";
import axios from 'axios';
const Approve = () => {
    const [email, setEmail] = useContext(store);
    const [approved, setApproved] = useState([]);
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [showUsers, setShowUsers] = useState(false)
    const [blur, setBlur] = useState("");
    const [disabledIcon, setDisableIcon] = useState({});
    const [toggleCard, setToggleCard] = useState(false);
    const [modeOfShow, setModeOfShow] = useState(false);
    const [customerProducts, setCustomerProducts] = useState([]);
    const [viewtype, setViewType] = useState("");
    const [enqObj, setEnqObj] = useState({
        name: "",
        description: "",
        category: "",
        price: null,
        countInStock: null,
        imageUrl: ""
    });
    const [addProducts, setAddProducts] = useState(false);
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
        localStorage.clear()
    }
    const toggleModeOfShow = () => {
        setShowUsers(false);
        setModeOfShow(true);
        setAddProducts(false);
        setShow(false);
        getProducts();
    }
    const usersData = async () => {
        setShow(false);
        setViewType("");
        setAddProducts(false);
        setShowUsers(!showUsers)
        const allData = await getAllUsers()
        const filteredUsers = allData.filter((item) => (item.email !== apiData.email))
        setUsers(filteredUsers)
    }
    const getProducts = async () => {
        const productsData = await axios.get("http://localhost:8080/api/products");
        setProducts(productsData.data)
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
    const onChnagehHandler = (e) => {
        const { name, value } = e.target;
        setEnqObj({ ...enqObj, [name]: value })
    }
    const Submit = async () => {
        const obj = {
            name: enqObj.name,
            description: enqObj.description,
            category: enqObj.category,
            price: Number(enqObj.price),
            countInStock: Number(enqObj.countInStock),
            imageUrl: enqObj.imageUrl
        }
        const res = await axios.post(`http://localhost:8080/api/product`, obj);
        if (res.status === 201 && res.data.result) {
            toast.success("Product added successfully")
        } else {
            toast.error("Unable to Product")
        }
        setEnqObj({
            name: "",
            description: "",
            category: "",
            price: null,
            countInStock: null,
            imageUrl: ""
        })
    }
    const AssignRole = (user) => {
        setShowModal(!showModal);
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setToggleCard(false);
        setModeOfShow(false);
    }
    const HandleViewType = (e) => {
        const { value } = e.target;
        setViewType(value);
    }
    const sendmail = async (e, testEmail, id) => {
        e.preventDefault();
        const res = await axios.post('http://localhost:8080/api/sentmail', { body: JSON.stringify({ testEmail }) });
        if (res.data.info && res.data.status === 201) {
            toast.success("mail send successfully");
            setDisableIcon(prev => ({
                ...prev, [testEmail]: true
            }))
            setBlur(testEmail);
            setTimeout(async () => {
                const remainingMails = await axios.delete(`http://localhost:8080/api/enquiry/${id}`);
                setApproved(remainingMails);
            }, 10000)
        } else {
            toast.error("unable send mail");
            setDisableIcon(prev => ({
                ...prev, [testEmail]: false
            }))
        }
    }
    const CustomerProducts = (e, item) => {
        e.preventDefault()
        setToggleCard(!toggleCard);
        setCustomerProducts(item.products);
    }
    useEffect(() => {
    }, [disabledIcon]);
    const DeleteProduct = async (id) => {
        const remaingProducts = await axios.delete(`http://localhost:8080/api/product/${id}`);
        setProducts(remaingProducts);
        toast.success("product removed successfully")
        getProducts();
    }
    const getApprovedEnquiries = async () => {
        setShowUsers(false);
        setViewType("");
        setAddProducts(false);
        const approvedEnq = await axios(`http://localhost:8080/api/enquiries`);
        const trueEnq = approvedEnq.data.filter((io) => io.accept === true);
        setApproved(trueEnq)
        setShow(!show);
    }
    const AddProducts = () => {
        setShowUsers(false);
        setViewType("");
        setShow(false);
        setAddProducts(true);
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
                                onClick={AddProducts}
                            >
                                AddProducts
                            </a>
                        </li>
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
                        <li className="nav-item">
                            <a
                                className="nav-link text-light"
                                style={{ textDecoration: "none", cursor: "pointer" }}
                                onClick={toggleModeOfShow}
                            >
                                Products<span style={{ backgroundColor: "yellow", color: "red", padding: "3px", borderRadius: "50px" }}>{products.length}</span>
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
            {viewtype === "grid" && (
                <div className='row mt-2 mx-2'>
                    {products && products.length >= 1 && products.map((item) => {
                        return (
                            <div className='col-3'>
                                <div className='card mb-2'>
                                    <div className='card-body'>
                                        <div className='row' style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div className='col-6'>
                                                {item.name}
                                            </div>
                                            <div className='col-2'>
                                                <img src={item.imageUrl} alt='pic'
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        borderRadius: "50px",
                                                    }}
                                                />
                                            </div>
                                            <div className='row'>
                                                <div className='col-4'>
                                                    {item.category === "groceries" && <span style={{ color: "green" }}><b>{item.category}</b></span> || item.category === "deo" && <span style={{ color: "red" }}><b>{item.category}</b></span> || item.category === "mobiles" && <span style={{ color: "blue" }}><b>{item.category}</b></span> || item.category === "footwear" && <span style={{ color: "black" }}><b>{item.category}</b></span> || item.category === "electronics" && <span style={{ color: "yellow" }}><b>{item.category}</b></span>}
                                                </div>
                                                <div className='col-2'>
                                                    ₹{item.price}
                                                </div>
                                                <div className='col-4'>
                                                    <span style={{ color: "orange" }}><b>Stock</b></span>{item.countInStock}
                                                </div>
                                                <div className='col-2'>
                                                    <FontAwesomeIcon icon={faTrash} style={{ color: "red" }} onClick={() => DeleteProduct(item._id)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            {
                viewtype === "list" && (
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>S.no</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>countInStock</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && products.length >= 1 && products.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.price}</td>
                                        <td>{item.countInStock}</td>
                                        <td><img src={item.imageUrl} style={{ width: "25px", height: "25px", borderRadius: "50px", }} /></td>
                                        <td>
                                            <FontAwesomeIcon icon={faTrash} style={{ color: "red" }} onClick={() => DeleteProduct(item._id)} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
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
                                        <input type="email" className="form-control" name='testEmail' disabled={blur === item.enqSource} value={item.enqSource} /*onChange={(e) => setTestEmail(e.target.value)}*/ />
                                    </div>
                                </div>
                                <div className="col">
                                    <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: "30px", cursor: "pointer" }} disabled={disabledIcon[item.enqSource] === true} onClick={(e) => sendmail(e, item.enqSource, item._id)} />{" "}
                                    <FontAwesomeIcon icon={faEye} style={{ color: "dodgerblue", fontSize: "30px", cursor: "pointer" }} onClick={(e) => CustomerProducts(e, item)} />
                                </div>
                            </form>
                        </div>

                    </div>
                )
            })}
            {addProducts && (
                <div class="card mx-auto w-50 mt-5">
                    <div class="card-body">
                        <span style={{ display: "flex", justifyContent: "center", color: "dodgerblue", flexWrap: "wrap", fontSize: "25px" }}>Product Information</span>
                        <div class="mb-3">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-control" placeholder="name..." name='name' value={enqObj.name} onChange={onChnagehHandler} />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <input type="text" class="form-control" placeholder="description..." name='description' value={enqObj.description} onChange={onChnagehHandler} />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Category</label>
                            <input type="text" class="form-control" placeholder="category..." name='category' value={enqObj.category} onChange={onChnagehHandler} />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Price</label>
                            <input type="text" class="form-control" placeholder="price..." name='price' value={enqObj.price} onChange={onChnagehHandler} />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Count In Stock</label>
                            <input type="text" class="form-control" placeholder="countInStock..." name='countInStock' value={enqObj.countInStock} onChange={onChnagehHandler} />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Image</label>
                            <input type="text" class="form-control" placeholder="imageUrl..." name='imageUrl' value={enqObj.imageUrl} onChange={onChnagehHandler} />
                        </div>
                        <button className='btn btn-outline-primary float-end' onClick={Submit}>Submit</button>
                    </div>
                </div>
            )}
            <Modal show={modeOfShow} onHide={handleCloseModal} size='sm'>
                <Modal.Header closeButton>
                    <Modal.Title>select mode of show</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row' style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className='col-2'>
                            <label class="form-label">Grid</label>{" "}
                            <input type="radio" name='viewtype' value="grid" checked={viewtype === "grid"} onChange={HandleViewType} />
                        </div>
                        <div className='col-2'>
                            <label class="form-label">List</label>{" "}
                            <input type="radio" name='viewtype' value="list" checked={viewtype === "list"} onChange={HandleViewType} />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={toggleCard} onHide={handleCloseModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Customer Orders</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        {customerProducts && customerProducts.length >= 1 && customerProducts.map(((item, index) => {
                            return (
                                <div className='col-3'>
                                    <div className='card'>
                                        <div className='card-body'>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                {item.itemName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }))}
                    </div>
                </Modal.Body>
            </Modal>
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