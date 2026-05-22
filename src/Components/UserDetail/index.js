import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, functionsAus } from "../../config/firebase-config";
import { CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AWS_IMAGE_BASE_URL } from "../../config/appConfig";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { httpsCallable } from "firebase/functions";

const UserDetail = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [confirmationText, setConfirmationText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      setFetchingUser(true);
      const userDocRef = doc(db, "Users", userId); // Reference to the document with userId
      const userDocSnapshot = await getDoc(userDocRef); // Get the document snapshot

      if (userDocSnapshot.exists()) {
        // Data exists for the provided user ID
        setUserData(userDocSnapshot.data());
      } else {
        // No data found for the provided user ID
        toast.error("User not found");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error getting document:", error);
      toast.error("Error loading user data");
    } finally {
      setFetchingUser(false);
    }
  }, [userId, navigate]);

  useEffect(() => {
    fetchUserData();

    // Log current user UID for admin setup (remove after setup)
    if (auth.currentUser) {
      console.log("Your UID for admin setup:", auth.currentUser.uid);
    }
  }, [fetchUserData]);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmationText("");
  };
  const handleClick = (event) => {
    event.preventDefault();
    navigate(-1);
  };
  // const handleDelete = async(event) => {
  //     event.preventDefault()

  // }

  const handleConfirmationTextChange = (event) => {
    setConfirmationText(event.target.value);
  };

  const handleDelete = async () => {
    if (confirmationText === "confirm") {
      //   onDelete();
      try {
        setDeleteLoading(true);
        const deleteUserAccount = httpsCallable(
          functionsAus,
          "deleteUserAccount"
        );
        await deleteUserAccount({
          userId,
          username: userData.username,
        });
        toast.success("User deleted!");
        closeModal();
        navigate(-1);
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(error?.message || "Something went wrong!");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  //blockUnblockUserAccount
  //userId
  //sendOnly userId
  const handleBlock = async (event) => {
    event.preventDefault();
    try {
      setBlockLoading(true);
      const toggleUserBlockStatus = httpsCallable(
        functionsAus,
        "toggleUserBlockStatus"
      );
      await toggleUserBlockStatus({
        userId,
      });
      if (userData.isBlocked) {
        toast.success("User unblocked successfully!");
      } else {
        toast.success("User blocked successfully!");
      }

      await fetchUserData();
      setBlockLoading(false);
    } catch (error) {
      console.error("Block error:", error);
      const errorMessage =
        error?.message ||
        error?.error ||
        "Failed to update user status. Please try again.";
      toast.error(errorMessage);
      setBlockLoading(false);
    }
  };
  const handleContactButtonClick = () => {
    if (userData?.email) {
      // If email is provided, open the default email app
      window.open(`mailto:${userData?.email}`, "_blank");
    } else if (userData?.phoneNumber) {
      // If phone number is provided, open the default phone app
      window.open(`tel:${userData?.phoneNumber}`, "_blank");
    } else {
      // Handle case when neither email nor phone number is provided
      toast.error("No contact information available for this user");
    }
  };

  if (fetchingUser) {
    return (
      <div
        className="userprofilebody"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="userprofilebody">
        <IconButton onClick={handleClick}>
          <ArrowBackIcon />
        </IconButton>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h3>User not found</h3>
          <Button
            onClick={handleClick}
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="userprofilebody">
      <div className="row">
        <div className="col-xxl-5 col-xl-5 col-lg-7 col-md-8 profilecenter">
          <IconButton onClick={handleClick}>
            <ArrowBackIcon />
          </IconButton>
          <div className="mainheading">
            <h3>User</h3>
          </div>
          <div className="profileuserwrap">
            <div className="userprofileimg">
              <img src="/assets/images/profilecover.png" alt="" />
            </div>
            <div className="profilebody">
              <div className="userimg">
                <img src={AWS_IMAGE_BASE_URL + userData?.profilePic} alt="" />
                <span>
                  <h2>{userData?.fullName}</h2>
                  <div className="bangladeshprofile">
                    <p>
                      {userData?.phoneNumber
                        ? userData?.phoneNumber
                        : userData?.email}
                    </p>
                    <label>
                      {" "}
                      <img src="/assets/images/icons/location.svg" alt="" />
                      {userData?.location}
                    </label>
                  </div>
                </span>
              </div>
              <p>{userData?.biography}</p>
              <h3>Information</h3>
              <ul>
                <div className="informationbody">
                  <li>
                    <span>
                      <AccountCircleOutlinedIcon htmlColor="#A9A9A9" />
                    </span>
                    Username
                  </li>
                  <li>@{userData?.username}</li>
                </div>
                {userData?.email && (
                  <div className="informationbody">
                    <li>
                      <span>
                        {" "}
                        <EmailOutlinedIcon htmlColor="#A9A9A9" />
                      </span>
                      Email
                    </li>
                    <li>{userData?.email}</li>
                  </div>
                )}
                {userData?.phoneNumber && (
                  <div className="informationbody">
                    <li>
                      <span>
                        {" "}
                        <LocalPhoneOutlinedIcon htmlColor="#A9A9A9" />
                      </span>
                      Phone
                    </li>
                    <li>{userData?.phoneNumber}</li>
                  </div>
                )}
                <div className="informationbody">
                  <li>
                    <span>
                      {" "}
                      <CalendarMonthOutlinedIcon htmlColor="#A9A9A9" />
                    </span>
                    Joined
                  </li>
                  <li>
                    {dayjs(userData?.registredAt?.toDate())?.format(
                      "DD MMMM YYYY"
                    )}
                  </li>
                </div>
                {/* <div className="informationbody">
                            <li><span><img src="/assets/images/icons/language.svg" alt=""/></span>Language</li>
                            <li>English</li>
                        </div>
                        <div className="informationbody">
                            <li><span><img src="/assets/images/icons/timezone.svg" alt=""/></span>Time zone</li>
                            <li>09/12/2024</li>
                        </div> */}
              </ul>
              <div className="profilebutton">
                <button
                  onClick={handleContactButtonClick}
                  disabled={!userData?.email && !userData?.phoneNumber}
                  title={
                    !userData?.email && !userData?.phoneNumber
                      ? "No contact information available"
                      : "Contact user"
                  }
                >
                  <LocalPhoneOutlinedIcon htmlColor="#A9A9A9" />
                  Contact
                </button>
                <button disabled={blockLoading} onClick={handleBlock}>
                  {userData?.isBlocked ? (
                    <CheckCircleOutlineOutlinedIcon htmlColor="green" />
                  ) : (
                    <CancelOutlinedIcon htmlColor="red" />
                  )}
                  {userData?.isBlocked ? "Unblock" : "Block"}
                  {blockLoading && (
                    <CircularProgress size={20} sx={{ color: "red" }} />
                  )}
                </button>
                <button className="active" onClick={openModal}>
                  <img src="/assets/images/icons/deleteprofile.svg" alt="" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isOpen} onClose={closeModal}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: 2 }}>
            <strong>Warning:</strong> This action cannot be undone. This will
            permanently delete the user account and all associated data
            including posts, comments, likes, and other content.
          </DialogContentText>
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
          <Button onClick={closeModal} color="primary" disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            endIcon={
              deleteLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : null
            }
            onClick={handleDelete}
            disabled={deleteLoading || confirmationText !== "confirm"}
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
export default UserDetail;
