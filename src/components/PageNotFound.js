import React from 'react';
import {Link} from 'react-router-dom';
import notfound from '../Assets/shutterstock.jpg';
import{faArrowAltCircleLeft} from '@fortawesome/free-solid-svg-icons';
import{FontAwesomeIcon} from '@fortawesome/react-fontawesome'
const PageNotFound = () => {
  return (
    <div style={{marginTop:"100px", marginLeft:"500px", width:"700px", height:"500px", borderRadius:"50px"}}>
      <Link to={'/'}>
      <FontAwesomeIcon icon={faArrowAltCircleLeft} style={{cursor:"pointer", fontSize:"25px"}}/>
      </Link>
      <img src={notfound} alt='notfound'/>
    </div>
  )
}

export default PageNotFound