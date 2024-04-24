import { Navigate } from "react-router-dom";
import Header from "../Components/common/Header";
import { auth } from "../config/firebase-config";

const CommonRoute = (props) => {
    const {children, authRequire} = props
    if(authRequire){
      if(auth.currentUser)
      return (
        <>
          {children}
        </>
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
