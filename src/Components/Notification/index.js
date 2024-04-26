import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Stack,
    TextField,
  } from "@mui/material";
import { toast } from "react-toastify";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import dayjs from "dayjs";
const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title,setTitle] = useState("")
  const [message,setMessage] = useState("")
    const [dataLoading, setDataLoading] = useState(false);
  const [allNotifications,setAllNotifications] = useState([])
  useEffect(()=>{
    setDataLoading(true)
    const q = query(collection(db, "PushNotifications"),orderBy("createDate","desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push(doc.data());
      });
      setAllNotifications(notifications)
    setDataLoading(false)

    });
    return unsubscribe
  },[])
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        if (!title || !message) {
            toast.error("Please fill all the fields")
            return
        }
        const colRef = collection(db,"PushNotifications")
      const docRef = doc(colRef)
      const id = docRef.id
      setLoading(true)

      await setDoc(docRef,{
        id,
        title,
        message,
        createDate:serverTimestamp()
      })
      setMessage("")
          setTitle("")
          closeModal()
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
      toast.error('Error sending notification:', error);
      // Handle error
    }
    finally{
        setLoading(false)
    }
  };
  const handleDelete = async(id) => {
    try {
     const docRef = doc(db,"PushNotifications",id)
     await deleteDoc(docRef)
     toast.error("Notification deleted!")
    } catch (error) {
     toast.error("Something went wrong!")
    }
   }
  return (
    <div className="userprofilebody">
      <div className="mainheading">
        <h3>Push Notification</h3>
        <button type="button" className="btn btn-primary" onClick={openModal}>
          <img src="assets/images/icons/plus.svg" alt="" />
          Send Notification{" "}
        </button>
      </div>
      <div className="row" style={{justifyContent:"center"}}>
        <div className="col-xxl-4 col-xl-6 col-lg-6 ">
          <div className="notificationwrap">
            <div className="notificationall">
              <span>
                <h4>Notifications</h4>
              </span>
            </div>
            <ul>
              {
                dataLoading?
                 <LinearProgress color="error"/>:
                allNotifications.map(item=>{
                    return(
                        <li>
                            <h5>
                            {
                                item.title
                            }
                            </h5>
                            <p>
                            {
                                item.message
                            }
                            </p>
                            <small>{dayjs(item?.createDate?.toDate())?.format('MM/DD/YYYY HH:mm')}</small>{" "}
                            <button onClick={()=>handleDelete(item.id)}>
                            <img
                                src="assets/images/icons/deletenotification.svg"
                                alt=""
                            />
                            </button>
                        </li>
                    )
                })
              }
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
        <DialogContent >
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            //type="number" // Use type="number" to restrict input to numeric values
            fullWidth
            value={title}
            onChange={(event)=>setTitle(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            //type="number" // Use type="number" to restrict input to numeric values
            fullWidth
            value={message}
            onChange={(event)=>setMessage(event.target.value)}
          />

        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          {/* <Button onClick={closeModal} color="primary" variant="contained">
                        Cancel
                    </Button> */}
          <button disabled={loading} className="myminkbutton" onClick={handleSubmit}>
            Send
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Notification;
