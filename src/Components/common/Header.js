import { AddCircleOutline } from "@mui/icons-material"
import { AppBar, Box, CardMedia, Icon, IconButton, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate()
    const handleAdd = () => {
        navigate("/add-bar")
    }
    return(
        <div className="headerwrap">
        <div className="welcomeback">
        <h6>Hi Tam Tran,</h6>
        <h3>Welcome back 👋</h3>
     </div>
     <form className="searchheader" action="/action_page.php">
        <label className="searchicon"><img src="assets/images/icons/search.svg" alt=""/></label>
        <input type="text" placeholder="Search.." name="search"/>
        <button type="submit"><img src="assets/images/icons/closesearch.svg" alt=""/></button>
      </form>
      <div className="notificationsetting">
        <img src="assets/images/icons/messagetop.svg" alt=""/>
        <img src="assets/images/icons/notification.svg" alt=""/>
      </div>
    </div>
    )
}
export default Header