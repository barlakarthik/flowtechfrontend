import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import toast, { Toaster } from 'react-hot-toast';
import { Modal } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css'
import useFetch from "../hook/fetch.hook";
import { getAllUsers } from "../helper/helper";
import { updateUser } from "../helper/helper";
import { deleteUser } from '../helper/helper';
import { store } from "../App";
import "./profile.css";
import axios from 'axios';
import EnquiryModal from './EnquiryModal';
const AdminaccessPage = () => {
  const [users, setUsers] = useState([])
  const [showUsers, setShowUsers] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [email, setEmail] = useContext(store);
  const [enquiries, setEnquiries] = useState([]);
  const [showEnq, setShowEnq] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editRowData, setEditRowData] = useState(null);
  const [viewMode, setViewMode] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [exportRow, setExportRow] = useState(Array(enquiries.length).fill(false));

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

  const loadEnquiries = () => {
    setShowEnq(!showEnq)
    setShowUsers(false)
    axios.get('http://localhost:8080/api/enquiries').then((res) => {
      const filteredEnquiries = res.data.filter((enquiry) => enquiry.enqRefNum === apiData?._id);
      setEnquiries(filteredEnquiries);
    })
  }

  const usersData = async () => {
    setShowEnq(false)
    setShowUsers(!showUsers)
    const allData = await getAllUsers()
    const filteredUsers = allData.filter((item) => (item.email !== apiData.email))
    setUsers(filteredUsers)
  }
  const LogoutHandler = () => {
    setShowUsers(!showUsers);
    localStorage.clear()
  }

  const openEnquiryModal = () => {
    setViewMode(false)
    setShowEnquiry(true)
  }

  const closeEnquiryModal = () => {
    setShowEnquiry(!showEnquiry)
  }

  const handleDeleteClick = async (id) => {
    if (id) {
      try {
        await axios.delete(`http://localhost:8080/api/enquiry/${id}`);
        toast.success(<b>Row deleted Successfully...</b>);
        setEnquiries((prevEnquiries) =>
          prevEnquiries.filter((item) => item._id !== id)
        );
      } catch (error) {
        toast.error(<b>Error deleting row...</b>);
      }
    }
  };

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

  const handleEditClick = (rowData) => {
    setViewMode(false)
    setIsEdit(true)
    setSelectedRowData(null);
    setEditRowData([rowData]);
    setShowEnquiry(true);
  };

  const handleViewClick = (rowData) => {
    setIsEdit(false)
    setViewMode(true)
    setSelectedRowData([rowData]);
    setShowEnquiry(true);
  };

  const handleCheckboxChange = (id, index) => {
    const updatedExportRows = [...exportRow];
    updatedExportRows[index] = !updatedExportRows[index];
    setExportRow(updatedExportRows);
    const exportValue = updatedExportRows[index] ? true : false;
    axios
      .put(`http://localhost:8080/api/enquiry/${id}`, { export: exportValue })
      .then(() => {
        toast.success('exported successfully');
      })
      .catch((error) => {
        console.error('Error exporting enquiry:', error);
      });
  };

  const pageSize = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const currentEnquiries = enquiries.slice(startIndex, endIndex);


  return (
    <>
      <Modal show={showEnquiry} onHide={closeEnquiryModal} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title style={{ display: "flex", justifyContent: "center", color: "blue", flexWrap: "wrap", fontSize: "25px" }} id='contained-modal-title-vcenter' className='text-center'>Enquiry Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {<EnquiryModal selectedRowData={selectedRowData} viewMode={viewMode} isEdit={isEdit} editRowData={editRowData} />}
        </Modal.Body>
      </Modal>
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
                onClick={loadEnquiries}
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
                onClick={openEnquiryModal}
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
                onClick={() => usersData()}
              >
                Users
              </a>
            </li>
          </div>
          <div>
            <Link to={"/register"}>
              <button className="logoutbtn" onClick={LogoutHandler/*() => setShowUsers(!showUsers)*/}>Logout</button>
            </Link>
          </div>
        </>
      </nav>
      {(showEnq && currentEnquiries.length >= 1) && (
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope='col' style={{ textAlign: 'center' }}>S.No.</th>
                <th scope="col" style={{ textAlign: 'center' }}>Account Name</th>
                <th scope='col' style={{ textAlign: 'center' }}>Products</th>
                <th scope='col' style={{ textAlign: 'center' }}>Total quantity</th>
                <th scope='col' style={{ textAlign: 'center' }}>Total Price</th>
                <th scope='col' style={{ textAlign: 'center' }}>Actions</th>
                <th scope='col' style={{ textAlign: 'center' }}>Export</th>
              </tr>
            </thead>
            <tbody>
              {currentEnquiries.map((item, index) => {
                const totalItems = item.products.map(product => product.itemName).join(', ');
                const totalQuantity = item.products.reduce((acc, product) => acc + product.quantity, 0);
                const totalPrice = item.products.reduce((acc, product) => acc + (product.quantity * product.price), 0);

                return (
                  <tr key={item._id}>
                    <td className="col" style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td className="col" style={{ textAlign: 'center' }}>{item.accountname}</td>
                    <td className="col" style={{ textAlign: 'center' }}>{totalItems}</td>
                    <td className="col" style={{ textAlign: 'center' }}>{totalQuantity}</td>
                    <td className="col" style={{ textAlign: 'center' }}>{totalPrice}</td>
                    <td className="col-1" style={{ textAlign: 'center' }}>
                      <i
                        id='View'
                        className="fa fa-eye mx-2 col-1"
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => { handleViewClick(item) }}
                      ></i>
                      <i
                        id='Edit'
                        className="fa fa-pencil mx-2 col-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditClick(item)}
                      ></i>
                      <i
                        id='Delete'
                        className="fa fa-trash mx-2 col-1"
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => handleDeleteClick(item._id)}
                      ></i>
                    </td>
                    <td className="col" style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={exportRow[index]}
                        onChange={() => handleCheckboxChange(item._id, index)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table >
          <div className="pagination">
            <button
              className='page-link'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className='page-link'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={endIndex >= enquiries.length || currentEnquiries.length === 0}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {
        (showEnq && currentEnquiries.length === 0) && (
          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope='col'>S.No.</th>
                  <th scope="col">Account Name</th>
                  <th scope='col'>Products</th>
                  <th scope='col'>Total quantity</th>
                  <th scope='col'>Total Price</th>
                  <th scope='col'>Actions</th>
                  <th scope='col'>Export</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <h5 className='mx-auto'>No Enquiries Found !!</h5>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      }
      <Toaster position="top-center" reverseOrder></Toaster>
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
    </>

  )
}

export default AdminaccessPage