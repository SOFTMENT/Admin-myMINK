import { useState } from "react";
import { sideBarMenu } from "../../config/appConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const SideDrawer = ({selectedTab, setSelectedTab}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigation = useNavigate()
    const location = useLocation();
    const activePath = location.pathname;

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const logout = async event => {
        event.preventDefault()
        await getAuth().signOut().then(()=>{
           
             
        })
    }
    return(
        <nav className={`sidebar sidebarflow ${isSidebarOpen ? '' : 'close'}`}>
        <header>
            <div className="image-text">
                <span className="image">
                    <img src="assets/images/logo.png" alt=""/>
                </span>
            </div>

            <i className='bx bx-chevron-right toggle' onClick={toggleSidebar}></i>
        </header>

        <div className="menu-bar">
            <div className="menu">
                <ul className="menu-links">
                    {
                        sideBarMenu.map(item=>{
                            console.log(item,activePath)
                            return(
                                <li className={`nav-link ${activePath == item.path?'active':''}`} key={item.index}>
                                    <a onClick={()=>navigation(item.path)}>
                                        <i className={`bx ${item.icon} icon`}></i>
                                        <span className="text nav-text">{item.name}</span>
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div className="bottom-content">
                <li className="">
                    <a onClick={logout}>
                        <i className='bx bx-log-out icon'></i>
                        <span className="text nav-text">Logout</span>
                    </a>
                </li>

                {/* <li className="mode">
                    <div className="sun-moon">
                        <i className='bx bx-moon icon moon'></i>
                        <i className='bx bx-sun icon sun'></i>
                    </div>
                    <span className="mode-text text">Dark mode</span>

                    <div className="toggle-switch">
                        <span className="switch"></span>
                    </div>
                </li> */}

            </div>
        </div>

    </nav>
    )
}
export default SideDrawer