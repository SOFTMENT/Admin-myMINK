import { Navigate } from "react-router-dom";
import Header from "../Components/common/Header";
import { auth } from "../config/firebase-config";
import SideDrawer from "../Components/common/SideDrawer";

const CommonRoute = (props) => {
    const {children, authRequire} = props
    if(authRequire){
      if(auth.currentUser)
      return (
        <div>
        <SideDrawer/>
        <section className="home">
        <Header/>
        {
            children
        }
        </section>
    </div>
      )
      return <Navigate to="/login" replace />;
    }
    return (
      <>
        {/* <Header/> */}
        {children}
      </>
    )
  };

  export default (CommonRoute)
