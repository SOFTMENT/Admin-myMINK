import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../config/firebase-config";
import { LinearProgress } from "@mui/material";
import { AWS_IMAGE_BASE_URL } from "../../config/appConfig";

const Report = () => {
    const [posts,setPosts] = useState([])
    const [loading,setLoading] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                let data = []
                // Get all documents from the "Reports" collection
                const reportsSnapshot = await getDocs(collection(db, 'Reports'));

                await Promise.all(reportsSnapshot.docs.map(async (reportDoc) => {
                    // Get the postId from the report
                    const postId = reportDoc.data().postId;
        
                    // Get the corresponding post document from the "Posts" collection
                    const postDoc = await getDoc(doc(db, 'Posts', postId));
        
                    // Access the post data
                    const postData = postDoc.data();
                    data.push({...postData,...reportDoc.data()});
                }));
        
                // After all posts are fetched and added to the data array
                setPosts(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally{
                setLoading(false)
            }
        };

        fetchData();
    }, []);
    return(
        <div className="userprofilebody">
        <div className="mainheading">
            <h3>Report</h3>
        </div>
        <div className="row">
            {
                loading?
                <LinearProgress color="error"/>:
                posts.map(post=>{
                    console.log(post)
                    return(
                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6">
                            <div className="reportwrap">
                                <div className="reportimg" style={post.postType == "text"?{position:"relative"}:{}}>
                                    {
                                       
                                        post.postType == "image"?
                                        <img src={AWS_IMAGE_BASE_URL+post.postImages[0]} alt=""/>:
                                        post.postType == "video"?
                                        <img src={AWS_IMAGE_BASE_URL+post.videoImage} alt=""/>:
                                        <img src={"assets/images/profilecover.png"} alt=""/>
                                    }
                                    {
                                     post.postType == "text"&&
                                     <p style={{position:"absolute",top:"10px",color:"white"}}>{post?.caption}</p>
                                     
                                }
                                </div>
                                {
                                     post.postType != "text"&&
                                     <p>{post?.caption}</p>
                                     
                                }
                                
                                <span>
                                    <p>{post.reason}</p>
                                    <button id="theButton" onclick="clickMe()"><img src="assets/images/icons/more.svg"
                                            alt=""/></button>
                                    <div id="popup" className="hide">
                                        <p>Share</p>
                                        <p>Block</p>
                                    </div>
                                </span>
                            </div>
                        </div>
                    )
                })
            }
            
        </div>
        {/* <div className="pagination">
            <a href="#">&laquo;</a>
            <a href="#">1</a>
            <a className="active" href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a className="arrow" href="#">&raquo;</a>
        </div> */}
    </div>
    )
}
export default Report