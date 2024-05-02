import { Tab, Tabs } from "@mui/material";
import React from "react";
import CommentReport from "../CommentReport";
import Report from "../Report";

const ReportParent = () => {
    const [value, setValue] = React.useState(0);
   
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    return(
        <div className="userprofilebody">
        <div className="mainheading">
            <h3>Report</h3>
        </div>
        <Tabs sx={{marginBottom:5}}  value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab sx={{fontSize:15}} label="Posts" />
        <Tab sx={{fontSize:15}}  label="Comments" />
        </Tabs>
        {
          value == 0 &&
          <Report/>
        }
        {
          value == 1 &&
          <CommentReport/>
        }
        </div>
    )
}
export default ReportParent