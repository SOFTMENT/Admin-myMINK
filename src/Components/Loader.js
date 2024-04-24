import React from 'react'
import {CircularProgress, } from "@mui/material"
const Loader = ({customStyle})=>{
    return(
        <div style={customStyle?customStyle:{display:"flex", justifyContent:"center",alignItems:"center",marginTop:"10px",height:"100vh",width:"100vw"}}>
            <CircularProgress/>
        </div>
    )
}
export default Loader