import YouTubeIcon from "@mui/icons-material/YouTube";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import { toast } from "react-toastify";
import { AWS_IMAGE_BASE_URL, AWS_VIDEO_BASE_URL } from "../../config/appConfig";
import {
  db,
  functionsAus,
  functionsAsiaEast1,
} from "../../config/firebase-config";

const CommentReport = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [processingPostId, setProcessingPostId] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const open = Boolean(anchorEl);
  const [imagesOpen, setImagesOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const handleOpenDialog = (images) => {
    setSelectedImages(images.map((item) => `${AWS_IMAGE_BASE_URL}${item}`));
    setImagesOpen(true);
  };

  const handleCloseDialog = () => {
    setImagesOpen(false);
    setSelectedImages([]);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openModal = (postId) => {
    setSelectedPost(postId);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmationText("");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        let data = [];
        // Get all documents from the "Reports" collection
        const reportsSnapshot = await getDocs(collection(db, "CommentReports"));

        await Promise.all(
          reportsSnapshot.docs.map(async (reportDoc) => {
            const reportData = reportDoc.data() || {};
            const reportId = reportDoc.id;
            // Get the postId from the report
            const postId = reportData?.postId;
            const commentId = reportData?.commentId;
            if (
              !postId ||
              typeof postId !== "string" ||
              !commentId ||
              typeof commentId !== "string"
            ) {
              // Malformed report doc (missing ids). Still show so admin can dismiss it.
              data.push({
                ...reportData,
                id: reportId,
                postId: postId || "",
                commentId: commentId || "",
                commentMissing: true,
                postMissing: true,
              });
              return;
            }
            // Get the corresponding post document from the "Posts" collection
            const postDoc = await getDoc(doc(db, "Posts", postId));
            const commentDoc = await getDoc(
              doc(db, "Posts", postId, "Comments", commentId)
            );
            
            if (!commentDoc.exists()) {
              console.warn(`Comment ${commentId} not found for post ${postId}`);
              // Still show the report so admin can dismiss it.
              data.push({
                ...reportData,
                id: reportId,
                postId,
                commentId,
                commentMissing: true,
                postMissing: !postDoc.exists(),
              });
              return;
            }
            
            const { comment, commentDate } = commentDoc.data() || {};
            // Access the post data
            const postData = postDoc.exists() ? (postDoc.data() || {}) : {};
            data.push({
              ...postData,
              ...reportData,
              id: reportId,
              comment,
              commentId,
              commentDate,
              postMissing: !postDoc.exists(),
            });
          })
        );

        // Filter out null values
        const filteredData = data.filter(item => item !== null);
        // After all posts are fetched and added to the data array
        setPosts(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading reported comments. Please refresh the page.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);
  const handleThumbnailClick = (event, post) => {
    event.preventDefault();
    // Open the video in a new tab
    window.open(AWS_VIDEO_BASE_URL + post.postVideo, "_blank");
  };
  const handleConfirmationTextChange = (event) => {
    setConfirmationText(event.target.value);
  };
  const handleNoIssue = async (id) => {
    handleClose();
    try {
      setProcessingPostId(id);
      const deleteCommentReport = httpsCallable(
        functionsAsiaEast1,
        "deleteCommentReport"
      );
      const result = await deleteCommentReport({
        reportId: id,
      });
      const data = result?.data;
      if (data?.error) throw new Error(data.error);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success(data?.message || "Report dismissed successfully!");
    } catch (error) {
      console.error("Dismiss report error:", error);
      const errorMessage = error?.message || error?.error || "Failed to dismiss report. Please try again.";
      toast.error(errorMessage);
    } finally {
      setProcessingPostId(null);
    }
  };
  const handleDelete = async () => {
    if (confirmationText === "confirm") {
      try {
        setLoading(true);
        const deleteComment = httpsCallable(functionsAus, "deleteComment");
        const postId = selectedPost?.postID || selectedPost?.postId;
        const commentId = selectedPost?.commentId;
        if (!postId || !commentId) {
          throw new Error("Post id / comment id is missing for this report.");
        }
        const delCommentRes = await deleteComment({
          postId,
          commentId,
        });
        const delCommentData = delCommentRes?.data;
        if (delCommentData?.error) throw new Error(delCommentData.error);

        const deleteCommentReport = httpsCallable(
          functionsAsiaEast1,
          "deleteCommentReport"
        );
        const delReportRes = await deleteCommentReport({
          reportId: selectedPost.id,
        });
        const delReportData = delReportRes?.data;
        if (delReportData?.error) throw new Error(delReportData.error);

        // Remove from list
        setPosts(posts.filter((post) => post.id !== selectedPost.id));
        toast.success("Comment deleted successfully!");
        closeModal();
        setConfirmationText("");
      } catch (error) {
        console.error("Delete comment error:", error);
        const errorMessage = error?.message || error?.error || "Failed to delete comment. Please try again.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please type "confirm" to delete');
    }
  };
  return (
    <div>
      <div className="row">
        {fetchingData ? (
          <LinearProgress color="error" />
        ) : posts.length === 0 ? (
          <div style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#999' }}>
            <Typography variant="h6" sx={{ color: '#666', marginBottom: 1 }}>No Reported Comments</Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>All clear! No comments have been reported.</Typography>
          </div>
        ) : (
          posts.map((post) => {
            return (
              <div key={post.id || `${post.postID}-${post.commentId}`} className="col-xxl-3 col-xl-4 col-lg-4 col-md-6">
                <div className="reportwrap">
                  <div
                    className="reportimg"
                    style={
                      post.postType === "text" || post.postType === "video"
                        ? { position: "relative" }
                        : {}
                    }
                  >
                    {post.postType === "image" ? (
                      <button
                        type="button"
                        className="media-button"
                        onClick={() => handleOpenDialog(post.postImages)}
                      >
                        {" "}
                        <img
                          src={AWS_IMAGE_BASE_URL + post.postImages[0]}
                          alt=""
                        />
                      </button>
                    ) : post.postType === "video" ? (
                      <button
                        type="button"
                        className="media-button"
                        onClick={(event) => handleThumbnailClick(event, post)}
                      >
                        <img
                          src={AWS_IMAGE_BASE_URL + post.videoImage}
                          alt=""
                        />
                      </button>
                    ) : (
                      <img src={"assets/images/profilecover.png"} alt="" />
                    )}
                    {post.postType === "text" && (
                      <p
                        style={{
                          position: "absolute",
                          top: "10px",
                          color: "white",
                        }}
                      >
                        {post?.caption}
                      </p>
                    )}
                    {post.postType === "video" && (
                      <YouTubeIcon
                        sx={{
                          position: "absolute",
                          top: "60px",
                          left: "150px",
                          color: "white",
                        }}
                      />
                    )}
                  </div>
                  {post.postType !== "text" && <p>{post?.caption}</p>}
                  <p>{post.comment}</p>
                  <span>
                    <p>{post.reason}</p>
                    <button
                      type="button"
                      className="icon-menu-button"
                      onClick={handleClick}
                      aria-label="Open comment report actions"
                    >
                      <MoreVertIcon />
                    </button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem 
                        onClick={() => handleNoIssue(post.id)}
                        disabled={processingPostId === post.id}
                      >
                        {processingPostId === post.id ? "Processing..." : "No Issue"}
                      </MenuItem>
                      <MenuItem 
                        onClick={() => openModal(post)}
                        disabled={processingPostId === post.id || post.commentMissing || post.postMissing}
                      >
                        Delete Comment
                      </MenuItem>
                      {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                    </Menu>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* <div className="pagination">
            <a href="#">&laquo;</a>
            <a href="#">1</a>
            <a className="active" href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a className="arrow" href="#">&raquo;</a>
        </div> */}
      {imagesOpen && (
        <ReactSimpleImageViewer
          src={selectedImages}
          currentIndex={0}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={() => {
            handleCloseDialog();
          }}
        />
      )}
      <Dialog open={isOpen} onClose={closeModal}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To confirm deletion, please type <strong>"confirm"</strong> in the
            input field below:
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
            endIcon={
              loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : null
            }
            onClick={handleDelete}
            disabled={loading || confirmationText !== "confirm"}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default CommentReport;
// const useStyles = makeStyles((theme) => ({
// image: {
//   width: '100%',
//   height: 'auto',
//   cursor: 'pointer',
// },
// dialogContent: {
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// }));
