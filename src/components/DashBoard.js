import React,{useState} from 'react'
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const DashBoard = () => {
    const [sidebar, setSidebar] = useState(true);
    const ToggleSideBar = () => {
        setSidebar(!sidebar)
    }
    localStorage.getItem('email')
    return (
        <div>
            <nav class="navbar navbar-expand-lg" style={{ backgroundColor: "rgb(48, 117, 184)" }}>
                <span className='ms-2'><FontAwesomeIcon icon={faBars} style={{ color: "white" }} onClick={ToggleSideBar} /></span>
            </nav>
            {sidebar && (
                <aside style={{ width: "15%", backgroundColor: "rgb(45, 51, 84)", height: "100vh" }}>

                </aside>
            )}
        </div>
    )
}

export default DashBoard