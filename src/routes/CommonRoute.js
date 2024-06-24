import { Navigate } from "react-router-dom";
import Header from "../Components/common/Header";
import { auth } from "../config/firebase-config";
import SideDrawer from "../Components/common/SideDrawer";
import { useContext } from "react";
import { Context } from "../Context/AuthContext";

const CommonRoute = (props) => {
  const { children } = props;
  const { user } = useContext(Context);
  if (!user) {
    return <Navigate to="/login" replace />;
  } else {
    return (
      <div>
        <SideDrawer />
        <section className="home">
          <Header />
          {children}
        </section>
      </div>
    );
  }
};

export default CommonRoute;
