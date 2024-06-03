import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, functions } from "../../config/firebase-config";
import { CircularProgress, Icon, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AWS_IMAGE_BASE_URL } from "../../config/appConfig";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { deleteUser } from "firebase/auth";
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
import { getFunctions, httpsCallable } from "firebase/functions";
const UserDetail = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [confirmationText, setConfirmationText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchUserData();

    // Clean up function to unsubscribe from Firestore listener
    return () => {
      // Any cleanup code here
    };
  }, [userId]);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const fetchUserData = async () => {
    try {
      const userDocRef = doc(db, "Users", userId); // Reference to the document with userId
      const userDocSnapshot = await getDoc(userDocRef); // Get the document snapshot

      if (userDocSnapshot.exists()) {
        // Data exists for the provided user ID
        setUserData(userDocSnapshot.data());
      } else {
        // No data found for the provided user ID
        // console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
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
        setLoading(true);
        const deleteUserAccount = httpsCallable(functions, "deleteUserAccount");
        await deleteUserAccount({
          userId,
          username: userData.username,
        });
        toast.error("User deleted!");
        closeModal();
        navigate(-1);
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    }
  };

  //blockUnblockUserAccount
  //userId
  //sendOnly userId
  const handleBlock = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const toggleUserBlockStatus = httpsCallable(
        functions,
        "toggleUserBlockStatus"
      );
      await toggleUserBlockStatus({
        userId,
      });
      if (userData.isBlocked) toast.success("User unblocked!");
      else toast.error("User blocked!");

      await fetchUserData();
      setLoading(false);
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong!");
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
      console.error("No email or phone provided for contact");
    }
  };

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
                <button onClick={handleContactButtonClick}>
                  <LocalPhoneOutlinedIcon htmlColor="#A9A9A9" />
                  Contact
                </button>
                <button disabled={loading} onClick={handleBlock}>
                  {userData?.isBlocked ? (
                    <CheckCircleOutlineOutlinedIcon htmlColor="green" />
                  ) : (
                    <CancelOutlinedIcon htmlColor="red" />
                  )}
                  {userData?.isBlocked ? "Unblock" : "Block"}
                  {loading && (
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
          <Button onClick={closeModal} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button
            endIcon={
              loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : null
            }
            onClick={handleDelete}
            disabled={loading}
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
