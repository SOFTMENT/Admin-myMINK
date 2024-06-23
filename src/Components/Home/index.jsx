import { useState } from "react";
import Coupon from "../Coupon";
import Notification from "../Notification";
import Report from "../Report";
import User from "../User";

const Home = () => {
  const [selectedTab, setSelectedTab] = useState(0);
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
  return <User />;
};
export default Home;
