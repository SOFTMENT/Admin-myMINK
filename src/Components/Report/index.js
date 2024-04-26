import { Dropdown } from '@mui/base/Dropdown';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { IconButton, LinearProgress, MenuItem,Menu, Button, CircularProgress} from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AWS_IMAGE_BASE_URL, AWS_VIDEO_BASE_URL } from "../../config/appConfig";
import { db } from "../../config/firebase-config";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-toastify';
import {  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
const Report = () => {
    const [posts,setPosts] = useState([])
    const [loading,setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [confirmationText, setConfirmationText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPost,setSelectedPost] = useState(null)
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const openModal = (postId) => {
        setSelectedPost(postId)
        setIsOpen(true);
      };
    
      const closeModal = () => {
        setIsOpen(false);
      };
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
    const handleThumbnailClick = (event,post) => {
        event.preventDefault()
        // Open the video in a new tab
        window.open(AWS_VIDEO_BASE_URL+post.postVideo, '_blank');
      };
      const handleConfirmationTextChange = (event) => {
        setConfirmationText(event.target.value);
      };
    const handleNoIssue = async(id) => {
        handleClose()
        try {
            const docRef = doc(db,"Reports",id)
            await deleteDoc(docRef)
            setPosts(posts.filter(post=>post.id!=id))
           } catch (error) {
            toast.error("Something went wrong!")
           }
    }
    const handleDelete = async() => {
        if (confirmationText === 'confirm') {
        //   onDelete();
        try {
            const docRef = doc(db,"Posts",selectedPost.postID)
            await deleteDoc(docRef)
            await handleNoIssue(selectedPost.id)
            toast.error("Post deleted!")
            closeModal()
           } catch (error) {
            toast.error("Something went wrong!")
           }
           finally{
            setLoading(false)
           }
        }
      };
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
                    return(
                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6">
                            <div className="reportwrap">
                                <div className="reportimg" style={post.postType == "text"||post.postType == "video"?{position:"relative"}:{}}>
                                    {
                                       
                                        post.postType == "image"?
                                        <img src={AWS_IMAGE_BASE_URL+post.postImages[0]} alt=""/>:
                                        post.postType == "video"?
                                       <a onClick={(event)=>handleThumbnailClick(event,post)}>
                                         <img src={AWS_IMAGE_BASE_URL+post.videoImage} alt=""/>
                                       </a>:
                                        <img src={"assets/images/profilecover.png"} alt=""/>
                                    }
                                    {
                                     post.postType == "text"&&
                                     <p style={{position:"absolute",top:"10px",color:"white"}}>{post?.caption}</p>
                                     
                                    }
                                    {
                                     post.postType == "video"&&
                                     <YouTubeIcon sx={{position:"absolute",top:"60px",left:"150px",color:"white"}}/>
                                     
                                    }
                                </div>
                                {
                                     post.postType != "text"&&
                                     <p>{post?.caption}</p>
                                     
                                }
                                
                                <span>
                                    <p>{post.reason}</p>
                                    <a onClick={handleClick}>
                                        <MoreVertIcon/>
                                    </a>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={()=>handleNoIssue(post.id)}>No Issue</MenuItem>
                                        <MenuItem onClick={()=>openModal(post)}>Delete Post</MenuItem>
                                        {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                                    </Menu>
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
        <Dialog open={isOpen} onClose={closeModal}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To confirm deletion, please type <strong>"confirm"</strong> in the input field below:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Confirmation"
          fullWidth
          value={confirmationText}
          onChange={handleConfirmationTextChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="primary">
          Cancel
        </Button>
        <Button 
            endIcon={loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : null}
            onClick={handleDelete} disabled={loading} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </div>
    )
}
export default Report