import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  getDoc,
} from "firebase/firestore";
import { db, functionsAus, functionsAsiaEast1 } from "../../config/firebase-config";
import { auth } from "../../config/firebase-config";
import dayjs from "dayjs";
import { httpsCallable } from "firebase/functions";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [deletingNotificationId, setDeletingNotificationId] = useState(null);
  const [allNotifications, setAllNotifications] = useState([]);
  useEffect(() => {
    setDataLoading(true);
    let unsubscribe = null;
    let unsubscribeWithoutOrder = null;
    let hasShownError = false; // Prevent multiple error toasts
    
    // Check if user is admin before setting up listener
    const checkAdminAndSetup = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          toast.error("Please log in first");
          setDataLoading(false);
          return;
        }

        // Check if user is admin
        const adminDocRef = doc(db, "Admins", currentUser.uid);
        const adminDoc = await getDoc(adminDocRef);
        
        if (!adminDoc.exists()) {
          toast.error("Admin access required. Your UID must be in the Admins collection. Check ADMIN_SETUP.md for instructions.");
          setDataLoading(false);
          return;
        }

        // User is admin, proceed with setup
        setupListener();
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("Error checking admin status");
        setDataLoading(false);
      }
    };

    const setupListener = () => {
      try {
        // Try with orderBy first
        const q = query(
          collection(db, "PushNotifications"),
          orderBy("createDate", "desc")
        );
        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const notifications = [];
            querySnapshot.forEach((doc) => {
              notifications.push(doc.data());
            });
            setAllNotifications(notifications);
            setDataLoading(false);
            hasShownError = false; // Reset error flag on success
          },
          (error) => {
            console.error("Error fetching notifications:", error);
            // If error is about missing index, try without orderBy
            if (error.code === "failed-precondition") {
              // Unsubscribe from the first listener
              if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
              }
              
              const qWithoutOrder = query(collection(db, "PushNotifications"));
              unsubscribeWithoutOrder = onSnapshot(
                qWithoutOrder,
                (querySnapshot) => {
                  const notifications = [];
                  querySnapshot.forEach((doc) => {
                    notifications.push(doc.data());
                  });
                  // Sort manually
                  notifications.sort((a, b) => {
                    const dateA = a.createDate?.toDate?.() || new Date(0);
                    const dateB = b.createDate?.toDate?.() || new Date(0);
                    return dateB - dateA;
                  });
                  setAllNotifications(notifications);
                  setDataLoading(false);
                  hasShownError = false; // Reset error flag on success
                },
                (err) => {
                  console.error("Error fetching notifications (fallback):", err);
                  if (!hasShownError) {
                    if (err.code === "permission-denied") {
                      toast.error("Permission denied. Please ensure you are logged in as admin and your UID is in the Admins collection.");
                    } else {
                      toast.error("Error loading notifications");
                    }
                    hasShownError = true;
                  }
                  setDataLoading(false);
                }
              );
            } else {
              if (!hasShownError) {
                if (error.code === "permission-denied") {
                  toast.error("Permission denied. Please ensure you are logged in as admin and your UID is in the Admins collection.");
                } else {
                  toast.error("Error loading notifications");
                }
                hasShownError = true;
              }
              setDataLoading(false);
            }
          }
        );
      } catch (error) {
        console.error("Error setting up notification listener:", error);
        if (!hasShownError) {
          toast.error("Error loading notifications");
          hasShownError = true;
        }
        setDataLoading(false);
      }
    };
    
    checkAdminAndSetup();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (unsubscribeWithoutOrder) {
        unsubscribeWithoutOrder();
      }
    };
  }, []);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  //sendPushNotificationsOnTopic
  //topic title message
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!title || !title.trim()) {
        toast.error("Please enter a notification title");
        return;
      }
      if (!message || !message.trim()) {
        toast.error("Please enter a notification message");
        return;
      }
      if (title.length > 100) {
        toast.error("Title must be 100 characters or less");
        return;
      }
      if (message.length > 500) {
        toast.error("Message must be 500 characters or less");
        return;
      }
      setLoading(true);

      const sendNotificationToTopic = httpsCallable(
        functionsAus,
        "sendNotificationToTopic"
      );
      const result = await sendNotificationToTopic({
        title,
        message,
        topic: "all",
      });
      const data = result?.data;
      if (data?.error) {
        throw new Error(data.error);
      }
      toast.success(data?.result || "Notification sent successfully!");
      setMessage("");
      setTitle("");
      closeModal();
      //   const response = await fetch('YOUR_CLOUD_FUNCTION_ENDPOINT', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //         title,
      //         message,
      //         topic:"all"
      //     })
      //   });
      //   if (response.ok) {
      //     toast.success('Notification sent successfully');
      //     setMessage("")
      //     setTitle("")
      //     closeModal()
      //     // Handle success
      //   } else {
      //     toast.error('Error sending notification');
      //     // Handle error
      //   }
    } catch (error) {
      console.error("Notification error:", error);
      toast.error(error?.message || "Error sending notification");
    } finally {
      setLoading(false);
    }
  };
  //deleteNotification
  //id
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        setDeletingNotificationId(id);
        const deleteNotification = httpsCallable(
          functionsAsiaEast1,
          "deleteNotification"
        );
        const result = await deleteNotification({
          id,
        });
        const data = result?.data;
        if (data?.error) {
          throw new Error(data.error);
        }
        // Remove from local state immediately for better UX
        setAllNotifications(allNotifications.filter((notif) => notif.id !== id));
        toast.success(data?.result || "Notification deleted successfully!");
      } catch (error) {
        console.error("Delete notification error:", error);
        const errorMessage = error?.message || error?.error || "Failed to delete notification. Please try again.";
        toast.error(errorMessage);
      } finally {
        setDeletingNotificationId(null);
      }
    }
  };
  return (
    <div className="userprofilebody">
      <div className="mainheading">
        <h3>Push Notification</h3>
        <button type="button" className="btn btn-primary" onClick={openModal}>
          <img src="assets/images/icons/plus.svg" alt="" />
          Send Notification{" "}
        </button>
      </div>
      <div className="row" style={{ justifyContent: "center" }}>
        <div className="col-xxl-4 col-xl-6 col-lg-6 ">
          <div className="notificationwrap">
            <div className="notificationall">
              <span>
                <h4>Notifications</h4>
              </span>
            </div>
            <ul>
              {dataLoading ? (
                <LinearProgress color="error" />
              ) : allNotifications.length === 0 ? (
                <li style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No notifications sent yet
                </li>
              ) : (
                allNotifications.map((item) => {
                  return (
                    <li key={item.id}>
                      <h5>{item.title}</h5>
                      <p>{item.message}</p>
                      <small>
                        {dayjs(item?.createDate?.toDate())?.format(
                          "MM/DD/YYYY HH:mm"
                        )}
                      </small>{" "}
                      <button 
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingNotificationId === item.id}
                        title={deletingNotificationId === item.id ? "Deleting..." : "Delete notification"}
                      >
                        {deletingNotificationId === item.id ? (
                          <CircularProgress size={16} sx={{ color: "white" }} />
                        ) : (
                          <img
                            src="assets/images/icons/deletenotification.svg"
                            alt=""
                          />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
            {/* <a href="#">View More...</a> */}
          </div>
        </div>
      </div>
      <Dialog
        open={isOpen}
        onClose={closeModal}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="form-dialog-title">
          <Stack direction={"horizontal"} justifyContent={"space-between"}>
            <h5 className="modal-title" id="exampleModalLabel">
              Send Notification
            </h5>
            <button
              type="button"
              onClick={closeModal}
              class="btn-close"
              aria-label="Close"
            ></button>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            //type="number" // Use type="number" to restrict input to numeric values
            fullWidth
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            //type="number" // Use type="number" to restrict input to numeric values
            fullWidth
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          {/* <Button onClick={closeModal} color="primary" variant="contained">
                        Cancel
                    </Button> */}
          <button
            disabled={loading}
            className="myminkbutton"
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", marginRight: 1 }} />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Notification;
