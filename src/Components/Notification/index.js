import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
  } from "@mui/material";
import { toast } from "react-toastify";
const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title,setTitle] = useState("")
  const [message,setMessage] = useState("")
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
        return
        setLoading(true)
      const response = await fetch('YOUR_CLOUD_FUNCTION_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            message,
            topic:"all"
        })
      });
      if (response.ok) {
        toast.success('Notification sent successfully');
        setMessage("")
        setTitle("")
        closeModal()
        // Handle success
      } else {
        toast.error('Error sending notification');
        // Handle error
      }
    } catch (error) {
      toast.error('Error sending notification:', error);
      // Handle error
    }
    finally{
        setLoading(false)
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
      <div className="row">
        <div className="col-xxl-4 col-xl-6 col-lg-6 ">
          <div className="notificationwrap">
            <div className="notificationall">
              <span>
                <h4>Notifications</h4>
              </span>
            </div>
            <ul>
              <li>
                <p>
                  Oh, I finished de-bugging the phones, but the system's
                  compiling for eighteen minutes, or twenty.
                </p>
                <small>Last Wednesday at 9:42 AM</small>{" "}
                <button>
                  <img
                    src="assets/images/icons/deletenotification.svg"
                    alt=""
                  />
                </button>
              </li>
              <li>
                <p>
                  Oh, I finished de-bugging the phones, but the system's
                  compiling for eighteen minutes, or twenty.
                </p>
                <small>Last Wednesday at 9:42 AM</small>{" "}
                <button>
                  <img
                    src="assets/images/icons/deletenotification.svg"
                    alt=""
                  />
                </button>
              </li>
              <li>
                <p>
                  Oh, I finished de-bugging the phones, but the system's
                  compiling for eighteen minutes, or twenty.
                </p>
                <small>Last Wednesday at 9:42 AM</small>{" "}
                <button>
                  <img
                    src="assets/images/icons/deletenotification.svg"
                    alt=""
                  />
                </button>
              </li>
              <li>
                <p>
                  Oh, I finished de-bugging the phones, but the system's
                  compiling for eighteen minutes, or twenty.
                </p>
                <small>Last Wednesday at 9:42 AM</small>{" "}
                <button>
                  <img
                    src="assets/images/icons/deletenotification.svg"
                    alt=""
                  />
                </button>
              </li>
            </ul>
            <a href="#">View More...</a>
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
