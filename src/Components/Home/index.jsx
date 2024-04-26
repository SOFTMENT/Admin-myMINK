import { useState } from "react"
import Header from "../common/Header"
import SideDrawer from "../common/SideDrawer"
import User from "../User"
import Coupon from "../Coupon"
import Report from "../Report"
import Notification from "../Notification"

const Home = () => {
    const [selectedTab,setSelectedTab] = useState(0)
    let tabContent;
    switch (selectedTab) {
        case 0:
            tabContent = <User />;
            break;
        case 1:
            tabContent = <Coupon />;
            break;
        case 2:
            tabContent = <Notification />;
            break;
        case 3:
            tabContent = <Report />;
            break;
        default:
            tabContent = null;
            break;
    }
    return(
        <User/>
    )
}
export default Home