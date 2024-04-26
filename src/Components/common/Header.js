import { AddCircleOutline } from "@mui/icons-material"
import { AppBar, Autocomplete, Box, CardMedia, Icon, IconButton, TextField, Typography } from "@mui/material"
import algoliasearch from "algoliasearch";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
const algoliaClient = algoliasearch(
  "9XQY8DOXRV",
  "0904fb732ab2992c81a3129991bb5100"
);
const index = algoliaClient.initIndex("Users");
const Header = () => {
    const navigate = useNavigate()
    const [term,setTerm] = useState("")
    const handleNavigate = (event) => {
        event.preventDefault()
        navigate("notifications")
    }
    const handleSubmit = (event) => {
      event.preventDefault()
      index.search(term).then(({ hits }) => {
        
        navigate('/',{state:{hits,term}})
        setTerm("")
        // if (hits.length == 0) setNoData(true);
        // else setNoData(false);
        // hits.map(hit=>console.log(hit))
        // setHits(hits.filter(hit=>hit.membershipActive));
        // // if(hits.length >0){
        // //   handleSearchHistory(hits,term)
        // // }
      });
    }
    const handleChange = event => {
      setTerm(event.target.value)
    }
    return(
        <div className="headerwrap">
        <div className="welcomeback">
        <h6>Hi Admin,</h6>
        <h3>Welcome back 👋</h3>
     </div>
    
      <form className="searchheader" onSubmit={handleSubmit}>
        <label className="searchicon"><img src="assets/images/icons/search.svg" alt=""/></label>
         <input type="text" placeholder="Search.." name="search" value={term} onChange={handleChange}/>
         <button type="submit" style={{display: 'none'}}>Search</button>
         {/* <button><img src="assets/images/icons/closesearch.svg" alt=""/></button> */}
      </form>
      <div className="notificationsetting">
        {/* <img src="assets/images/icons/messagetop.svg" alt=""/> */}
        <a onClick={handleNavigate}>
        <img src="assets/images/icons/notification.svg" alt=""/>
        </a>
      </div>
    </div>
    )
}
export default Header