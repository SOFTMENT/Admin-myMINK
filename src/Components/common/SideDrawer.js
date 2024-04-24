import { useState } from "react";
import { sideBarMenu } from "../../config/appConfig";

const SideDrawer = ({selectedTab, setSelectedTab}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return(
        <nav className={`sidebar ${isSidebarOpen ? '' : 'close'}`}>
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
                            return(
                                <li className={`nav-link ${selectedTab == item.index?'active':''}`} key={item.index}>
                                    <a onClick={()=>setSelectedTab(item.index)}>
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
                    <a href="#">
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