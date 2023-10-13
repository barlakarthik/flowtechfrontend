import React, { useState, useEffect, useContext } from "react";
import useFetch from "../hook/fetch.hook";
import toast, { Toaster } from 'react-hot-toast';
import { store } from "../App";
import { CFormCheck } from "@coreui/react";
import { Link } from "react-router-dom";
import { Modal, ModalBody } from 'react-bootstrap';
import { Collapse, CardBody, Card, Button, CardHeader } from 'reactstrap'
import axios from 'axios';

const Reviewer = () => {
  const [showViwer, setShowViewer] = useState(false)
  const [email, setEmail] = useContext(store);
  const [rowData, setSelectedRowData] = useState([])
  const [customer, setCustomer] = useState([])
  const [selectedAccountName, setSelectedAccountName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(false)
  const [showdata, setShowData] = useState([])
  const [accept, setAccept] = useState(Array(showdata.length).fill(false));
  const [reject, setReject] = useState("")

  useEffect(() => {
    ReviewData()
  }, [])

  if (!email) {
    const localemail = localStorage.getItem('email');
    setEmail(localemail)
  }
  const [{ isLoading, apiData, serverError }] = useFetch(`/email/${email}`);

  const ViewerModal = (rowdata) => {
    setSelectedRowData([rowdata]);
    setShowViewer(!showViwer)
  }

  const closeViewerModal = () => {
    setShowViewer(!showViwer)
  }

  const ReviewData = (accountName) => {
    setIsOpen(!isOpen);
    setSelectedAccountName(accountName);
    axios.get(`http://localhost:8080/api/enquiries`)
      .then((enquiriesRes) => {
        const filteredData = enquiriesRes.data.filter((item) => item.export === true);
        console.log(filteredData, "filter");
        setShowData(filteredData);

        axios.get(`http://localhost:8080/api/getusers`)
          .then((usersRes) => {
            const usersData = usersRes.data;

            // Filter customers who have ordered something
            const customersWithOrders = usersData.filter((customer) =>
              filteredData.find((enquiry) => enquiry.enqRefNum === customer._id)
            );

            console.log(customersWithOrders, "filter");
            setCustomer(customersWithOrders);
          });
      });
  }


  const orderView = () => {
    setViewOrder(!viewOrder)
  }

  const handleAccept = (id, index) => {
    console.log(id, index, "suspect")
    const updatedAcceptRows = [...accept];
    console.log(updatedAcceptRows, "suspect")
    updatedAcceptRows[index] = !updatedAcceptRows[index];
    console.log(updatedAcceptRows[index], "suspect")
    setAccept(updatedAcceptRows);
    const acceptValue = updatedAcceptRows[index] ? true : false;
    axios
      .put(`http://localhost:8080/api/enquiry/${id}`, { accept: acceptValue })
      .then((res) => {
        toast.success('your Products accepted successfully');
      })
      .catch((error) => {
        console.error('Error accepting enquiry:', error);
      });
  };

  const handleReject = async (data, index) => {
    console.log(data.enqSource, "data")
    setReject(data.enqSource)
    const res = await axios.post('http://localhost:8080/api/rejectmail', { body: (reject) });
    if (res.data.info && res.data.status === 201) {
      console.log(res, "ress")
      toast.success("mail send successfully")
      const updatedRejectValue = [...accept]
      updatedRejectValue[index] = updatedRejectValue[index]
      setAccept(updatedRejectValue);
    } else {
      toast.error("unable send mail")
    }

  }

  return (
    <>
      <Modal show={showViwer} onHide={closeViewerModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ display: "flex", justifyContent: "center", color: "blue", flexWrap: "wrap", fontSize: "25px" }} id='contained-modal-title-vcenter' className='text-center'>View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <table className="table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {rowData?.map((item, index) => (
                  <tr key={`${item._id}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.totalItems}</td>
                    <td>{item.totalPrice}</td>
                    <td>{item.totalQuantity}</td>
                  </tr>

                ))}
              </tbody>
            </table>
          </Card>
        </Modal.Body>
      </Modal>
      <div>
        <nav class='nav' style={{ backgroundColor: "rgb(48, 117, 184)" }}>
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
                <a style={{ color: "white", textDecoration: "none" }} onClick={orderView}>Orders</a>
              </li>
            </div>
            {/* <div>
              <li className="nav-item">
                <a style={{ color: "white", textDecoration: "none" }}>Review</a>
              </li>
            </div> */}
            <div>
              <li className="nav-item">
                <a style={{ color: "white", textDecoration: "none" }} >Users</a>
              </li>
            </div>
            <div>
              <Link to={"/register"}>
                <button class="logoutbtn" >Logout</button>
              </Link>
            </div>
          </>
        </nav>
        <Toaster position="top-center" reverseOrder></Toaster>
        {
          viewOrder &&
          customer.map((item) => (
            <Card key={item._id}>
              <CardHeader
                className="pointer"
                onClick={() => ReviewData(item.username)} // Pass the account name as a parameter
              >
                &nbsp;
                <b>{item?.username.toUpperCase()}</b>
              </CardHeader>
              <Collapse isOpen={isOpen && selectedAccountName === item.username}>
                {selectedAccountName === item.username && (
                  <div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>S.No.</th>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showdata.map((data) =>
                          data.accountname === item.username ? (
                            data.products.reduce((acc, product, index) => {
                              console.log(acc, product, index, "acc")
                              if (index === 0) {
                                const totalItems = data.products.map(p => p.itemName).join(', ');
                                const totalQuantity = data.products.reduce((sum, p) => sum + p.quantity, 0);
                                const totalPrice = data.products.reduce((total, t) => total + t.price, 0)
                                const rowData = {
                                  totalItems,
                                  totalQuantity,
                                  totalPrice
                                };
                                acc.push(
                                  <tr key={product._id}>
                                    <td>{acc.length + 1}</td>
                                    <td>{totalItems}</td>
                                    <td>{totalQuantity}</td>
                                    <td>{totalPrice}</td>
                                    <td>
                                      <i
                                        id='View'
                                        className="fa fa-eye mx-2 col-1"
                                        style={{ cursor: "pointer", color: "blue" }}
                                        onClick={() => ViewerModal(rowData)}
                                      ></i>
                                      <i
                                        id="Tick"
                                        className="fa fa-check mx-2 col-1"
                                        style={{ cursor: "pointer", color: "green" }}
                                        onClick={() => handleAccept(data._id, index)}
                                      ></i>
                                      <i
                                        id="Cross"
                                        className="fa fa-times mx-2 col-1"
                                        style={{ cursor: "pointer", color: "red" }}
                                        onClick={() => handleReject(data, index)}
                                      ></i>
                                    </td>
                                  </tr>
                                );
                              }
                              return acc;
                            }, [])
                          ) : null
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

              </Collapse>

            </Card>
          ))
        }

      </div>
    </>
  )
}
export default Reviewer