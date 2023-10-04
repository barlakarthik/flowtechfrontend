import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faIdCardAlt, faCartPlus, faEye, faFileExport } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { Modal, ModalBody } from 'react-bootstrap';
import useFetch from "../hook/fetch.hook";
import { getAllUsers } from "../helper/helper";
import { updateUser } from "../helper/helper";
import { deleteUser } from '../helper/helper';
import { store } from "../App";
import "./profile.css";
import axios from 'axios';
const AdminaccessPage = () => {
  const [users, setUsers] = useState([])
  const [showUsers, setShowUsers] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [modalPop, setModalPop] = useState(false);
  const [email, setEmail] = useContext(store);
  const [enquiries, setEnquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [showEnq, setShowEnq] = useState(false);
  const [productsCard, setProductsCard] = useState(
    {
      groceries: false,
      footwear: false,
      electronics: false,
      mobiles: false,
    }
  )
  const [enqObj, setEnqObj] = useState({
    sector: {
      value: "",
      label: ""
    },
    enqOwner: {
      value: "",
      label: ""
    },
    products: []
  })
  if(!email){
    const localemail = localStorage.getItem('email');
    setEmail(localemail)
  }
  const [{ isLoading, apiData, serverError }] = useFetch(`/email/${email}`);
  const [data, setData] = useState([])
  const [groceries, setGroceries] = useState([]);
  const [shopGroceries, setShopGroceries] = useState([])
  const [mobiles, setMobiles] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [footwear, setFootwear] = useState([]);
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
  useEffect(() => {
    loadProducts();
  }, [])
  const loadProducts = async () => {
    await axios.get('http://localhost:8080/api/products').then((res) => {
      setData(res.data)
      const groceriesData = res.data.filter((item) => (item.category === "groceries"));
      const mobilesData = res.data.filter((item) => (item.category === "mobiles"));
      const electronicsData = res.data.filter((item) => (item.category === "electronics"));
      const footwearData = res.data.filter((item) => (item.category === "footwear"));
      setGroceries(groceriesData);
      setMobiles(mobilesData);
      setElectronics(electronicsData);
      setFootwear(footwearData)
    })
  }
  const loadEnquiries = () => {
    setShowEnq(!showEnq)
    setShowUsers(false)
    axios.get('http://localhost:8080/api/enquiries').then((res) => {
      setEnquiries(res.data)
    })
  }
  const onChnagehHandler = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    if (name === 'sector' || name === 'enqOwner') {
      setEnqObj({ ...enqObj, [name]: value });
    }
  }

  const CheckBoxHandler = (e) => {
    const { name, checked } = e.target;
    setProductsCard({ ...productsCard, [name]: checked })
  }
  const SubmitEnqiry = () => {
    console.log(enqObj);
    const obj = {
      accountname: apiData?.username,
      contact: apiData?.mobile,
      territory: apiData?.address,
      enqRefNum: apiData?._id,
      sector: enqObj?.sector,
      enqOwner: enqObj?.enqOwner,
      // groceries: enqObj.groceries,
      // footwear: enqObj.footwear,
      // electronics: enqObj.electronics,
      // mobiles: enqObj.mobiles,
      products: shopGroceries
    }
    console.log(obj, "obj");
    axios.post('http://localhost:8080/api/enquiry', obj).then(() => {
      toast.success(<b>enquiry created successfully...!</b>);
    }).catch((error) => {
      console.error("An error occurred:", error);
      toast.error(<b>failed to create enquiry...!</b>);
    });
    setEnqObj({
      sector: {},
      enqOwner: {},
      groceries: false,
      footwear: false,
      electronics: false,
      mobiles: false,
      products: []
    });
    setShopGroceries([]);
    closeEnquiryModal();
  }
  const usersData = async () => {
    setShowEnq(false)
    setShowUsers(!showUsers)
    const allData = await getAllUsers()
    const filteredUsers = allData.filter((item) => (item.email !== apiData.email))
    setUsers(filteredUsers)
  }
  const EnquiryModal = () => {
    setShowEnq(false);
    setShowUsers(false);
    setShowEnquiry(!showEnquiry)
  }
  const closeEnquiryModal = () => {
    setShowEnquiry(!showEnquiry)
  }
  const closeModal = () => {
    setModalPop(false)
    setProductsCard(!productsCard.groceries)
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
  const addItem = (e, item, type) => {
    e.preventDefault();
    const filterdItem = [...data];
    const updatedItem = filterdItem.find((i, index) => (i?.name === item));
    const groceriesObj = {
      name: updatedItem?.name,
      description: updatedItem?.description,
      category: updatedItem?.category,
      price: updatedItem?.price,
      countInStock: updatedItem?.countInStock,
    }
    setShopGroceries([...shopGroceries, groceriesObj])
  }
  return (
    <>
      <Modal show={productsCard.groceries} onHide={closeModal} size='lg'>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            {groceries.map((go) => {
              return (
                <div class="card" style={{ width: "15rem" }}>
                  <img src={go.imageUrl} class="card-img-top" alt="..." />
                  <div class="card-body">
                    <h5 class="card-title">{go.name} <span style={{ color: "green" }}>{"₹" + go.price}</span>&nbsp;<FontAwesomeIcon icon={faCartPlus} style={{ cursor: "pointer", color: "blue" }} onClick={(e) => addItem(e, go.name, go.category)} /></h5>
                    <p class="card-text">{go.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={productsCard.footwear} onHide={closeModal} size='lg'>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            {footwear.map((fo) => {
              return (
                <div className='card' style={{ width: "15rem" }}>
                  <img src={fo.imageUrl} className='card-img-top' alt='...' />
                  <div class="card-body">
                    <h5 class="card-title">{fo.name} <span style={{ color: "green" }}>{"₹" + fo.price}</span>&nbsp;<FontAwesomeIcon icon={faCartPlus} style={{ cursor: "pointer", color: "blue" }} onClick={(e) => addItem(e, fo.name, fo.category)} /></h5>
                    <p class="card-text">{fo.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={productsCard.electronics} onHide={closeModal} size='lg'>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className='row'>
            {electronics.map((el) => {
              return (
                <div className='card' style={{ width: "15rem" }}>
                  <img src={el.imageUrl} className='card-img-top' alt='...' />
                  <div class="card-body">
                    <h5 class="card-title">{el.name} <span style={{ color: "green" }}>{"₹" + el.price}</span>&nbsp;<FontAwesomeIcon icon={faCartPlus} style={{ cursor: "pointer", color: "blue" }} onClick={(e) => addItem(e, el.name, el.category)} /></h5>
                    <p class="card-text">{el.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={productsCard.mobiles} onHide={closeModal} size='lg'>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className='row'>
            {mobiles.map((mob) => {
              return (
                <div className='card' style={{ width: "15rem" }}>
                  <img src={mob.imageUrl} className='card-img-top' alt='...' />
                  <div className='card-body'>
                    <h5 className='card-title'>{mob.name} <span style={{ color: "green" }}>{"₹" + mob.price}</span>&nbsp;<FontAwesomeIcon icon={faCartPlus} style={{ cursor: "pointer", color: "blue" }} onClick={(e) => addItem(e, mob.name, mob.category)} /></h5>
                    <p class="card-text">{mob.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showEnquiry} onHide={closeEnquiryModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title style={{ display: "flex", justifyContent: "center", color: "blue", flexWrap: "wrap", fontSize: "25px" }} id='contained-modal-title-vcenter' className='text-center'>Enquiry Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Account Name</label>
              <input type="text" class="form-control" placeholder="account name..." value={apiData?.username} />
            </div>
            <div class="mb-3">
              <label class="form-label">Contact</label>
              <input type="text" class="form-control" placeholder="contact..." value={apiData?.mobile} />
            </div>
            <div class="mb-3">
              <label class="form-label">Territory</label>
              <input type="text" class="form-control" placeholder="territory..." value={apiData?.address} />
            </div>
            <div class="mb-3">
              <label class="form-label">Enquiry Reference Number</label>
              <input type="text" class="form-control" placeholder="enqRefNum..." value={apiData?._id} />
            </div>
            <div className='mb-3'>
              <label class="form-label">Sector</label>
              <select class="form-select" name='sector' value={enqObj?.sector?.value} onChange={onChnagehHandler}>
                <option value="">type of customer</option>
                <option value="consumer">Consumer</option>
                <option value="murchant">Murchant</option>
              </select>
            </div>
            <div className='mb-3'>
              <label class="form-label">Enquiry Owner</label>
              <select class="form-select" name='enqOwner' value={enqObj?.enqOwner?.value} onChange={onChnagehHandler}>
                <option value="">Select Owner</option>
                <option value="mohan">Mohan</option>
                <option value="harsha">Harsha</option>
                <option value="karthik">Karthik</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Products</label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div class="form-check form-switch">
                <label class="form-check-label">Groceries</label>
                <input class="form-check-input" type="checkbox" name='groceries' checked={productsCard.groceries} onChange={CheckBoxHandler} />
              </div>
              <div class="form-check form-switch">
                <label class="form-check-label">Footwear</label>
                <input class="form-check-input" type="checkbox" name='footwear' checked={productsCard.footwear} onChange={CheckBoxHandler} />
              </div>
              <div class="form-check form-switch">
                <label class="form-check-label">Electronics</label>
                <input class="form-check-input" type="checkbox" name='electronics' checked={productsCard.electronics} onChange={CheckBoxHandler} />
              </div>
              <div class="form-check form-switch">
                <label class="form-check-label">Mobiles</label>
                <input class="form-check-input" type="checkbox" name='mobiles' checked={productsCard.mobiles} onChange={CheckBoxHandler} />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-outline-primary float-end' onClick={SubmitEnqiry}>Submit</button>
        </Modal.Footer>
      </Modal>
      <nav class='nav' style={{ backgroundColor: "rgb(48, 117, 184)" }}>
        <>
          <div>
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
          </div>
          <div>
            <li className="nav-item">
              <a style={{ color: "white", textDecoration: "none" }} onClick={loadEnquiries}>Orders</a>
            </li>
          </div>
          <div>
            <li className="nav-item">
              <a style={{ color: "white", textDecoration: "none" }} onClick={EnquiryModal}>Enquiry</a>
            </li>
          </div>
          <div>
            <li className="nav-item">
              <a style={{ color: "white", textDecoration: "none" }} onClick={() => usersData()}>Users</a>
            </li>
          </div>
          <div>
            <Link to={"/register"}>
              <button class="logoutbtn" onClick={() => setShowUsers(!showUsers)}>Logout</button>
            </Link>
          </div>
        </>
      </nav>
      {(showEnq && enquiries.length >= 1) && (
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Account Name</th>
              <th scope="col">Contact</th>
              <th scope="col">Territory</th>
              <th scope='col'>Enquiry Id</th>
              <th scope='col'>Sector</th>
              <th scope='col'>Enquiry Owner</th>
              <th scope='col'>Products</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          {enquiries.map((item, index) => {
            console.log(item);
            return (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.accountname}</td>
                <td>{item.contact}</td>
                <td>{item.territory}</td>
                <td>{item.enqRefNum}</td>
                <td>{item.sector}</td>
                <td>{item.enqOwner}</td>
                <td>{item.products ? "true" : "false"}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <FontAwesomeIcon icon={faTrashAlt} className="fa-lg d-block pointer text-danger" />
                    <FontAwesomeIcon icon={faEdit} className="fa-lg d-block pointer text-primary" />
                    <FontAwesomeIcon icon={faEye} className='fa-lg d-block pointer text-secondary' />
                    <FontAwesomeIcon icon={faFileExport} className='fa-lg d-block pointer text-info' />
                  </div>
                </td>
              </tr>
            )
          })}
        </table>
      )}
      {(showEnq && enquiries.length === 0) && (
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Account Name</th>
              <th scope="col">Contact</th>
              <th scope="col">Territory</th>
              <th scope='col'>Enquiry Id</th>
              <th scope='col'>Sector</th>
              <th scope='col'>Enquiry Owner</th>
              <th scope='col'>Products</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h5 className='mx-auto'>No Enquiries Found !!</h5>
          </div>
        </table>
      )}
      <Toaster position="top-center" reverseOrder></Toaster>
      {showUsers && (
        <div className='row mt-2 mx-2'>
          {users?.map((user, index) => {
            return (
              <div className='col-4'>
                <div class="card">
                  <div class="card-body">
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
                        <FontAwesomeIcon icon={faTrashAlt} className="fa-lg d-block pointer text-danger" onClick={() => DeleteHandler(user._id)} />
                        <FontAwesomeIcon icon={faEdit} onClick={() => AssignRole(user)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
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
            <button className='btn btn-outline-primary' type="submit">Add Role</button>
          </form>
        </Modal.Body>
      </Modal>
    </>

  )
}

export default AdminaccessPage