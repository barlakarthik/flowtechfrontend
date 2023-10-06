import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faIdCardAlt, faCartPlus, faEye, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody } from 'react-bootstrap';
import {Collapse,CardBody,Card,Button, CardHeader} from 'reactstrap'
import axios from 'axios';

const Reviewer=()=>{
const [showViwer,setShowViewer]=useState(false)
const [isOpen, setIsOpen] = useState(false);
const [showdata,setShowData]=useState([])

useEffect(()=>{
  ReviewData()
},[])

    const ViewerModal=()=>{
        setShowViewer(!showViwer)
    }

    const closeViewerModal=()=>{
        setShowViewer(!showViwer)
    }

    const ReviewData=()=>{
      setIsOpen(!isOpen)
      axios.get('http://localhost:8080/api/enquiries')
      .then((res)=>{
        const data=res.data
        console.log(data,"data")
        setShowData(data)
      })
    }


    return(
        <>
        <Modal show={showViwer} onHide={closeViewerModal} size="lg">
        <Modal.Header closeButton>
            <Modal.Title style={{ display: "flex", justifyContent: "center", color: "blue", flexWrap: "wrap", fontSize: "25px" }} id='contained-modal-title-vcenter' className='text-center'>View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            {showdata.map((data)=>{
              return(
            <CardHeader
            onClick={ReviewData}
            className="pointer"
            >
           {data.accountname}
            </CardHeader>
              )
          })
}
            <Collapse isOpen={isOpen}
           
            > 
              <table  class="table table-striped">
          <thead>
            <tr>
              <th >id</th>
              <th >Account Name</th>
              <th >Contact</th>
              <th >Territory</th>
              <th >Enquiry Ref Id</th>
              <th >Enquiry Source</th>
              <th >Sector</th>
              <th >Enquiry Owner</th>
              <th >Products</th>
              <th >Actions</th>
            </tr>
          </thead>
          </table>
            </Collapse> 
            </Card>
        </Modal.Body>
        </Modal>
        <div>
            <nav class='nav' style={{ backgroundColor: "rgb(48, 117, 184)" }}>
        <>
          <div>
            {/* <img
              src={apiData?.profile}
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50px",
                cursor: "pointer",
              }}
              alt="Profile"
            /> */}
          </div>
          <div>
            <li className="nav-item">
              <a style={{ color: "white", textDecoration: "none" }} >Orders</a>
            </li>
          </div>
          <div>
            <li className="nav-item">
              <a style={{ color: "white", textDecoration: "none" }} onClick={ViewerModal}>Review</a>
            </li>
          </div>
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
        </div>
        </>
    )
}
export default Reviewer