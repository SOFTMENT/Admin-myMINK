import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getCountFromServer, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from "firebase/firestore"
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify"
import { db } from "../../config/firebase-config";
const Coupon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState(dayjs(new Date()));
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [allCoupons,setAllCoupons] = useState([])
  useEffect(()=>{
    const q = query(collection(db, "Coupons"),orderBy("createDate","desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coupons = [];
      querySnapshot.forEach((doc) => {
          coupons.push(doc.data());
      });
      setAllCoupons(coupons)
    });
    return unsubscribe
  },[])
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const handleSubmit = async(event) => {
    event.preventDefault();
    if (discountPercentage >= 1 && discountPercentage <= 100) {
      try {
      setLoading(true)

        const length = 6; // Adjust the length of the coupon as needed
      const newCoupon = generateRandomCoupon(length);
      const colRef = collection(db,"Coupons")
      const docRef = doc(colRef)
      const id = docRef.id
      await setDoc(docRef,{
        id,
        expiryDate:dayjs(expiryDate).format("DD-MM-YYYY"),
        discountPercentage,
        couponCode:newCoupon,
        createDate:serverTimestamp()
      })
      closeModal()
      setDiscountPercentage("")
      setExpiryDate(dayjs(new Date()))
      toast.success("Coupon created!")
      } catch (error) {
        toast.error("Something went wrong!")
      }
      finally{
      setLoading(false)
      }
    }
    else{
      toast.error("Please enter a valid discount percentage.")
    }
  };
  const handleDelete = async(id) => {
   try {
    const docRef = doc(db,"Coupons",id)
    await deleteDoc(docRef)
    toast.error("Coupon deleted!")
   } catch (error) {
    toast.error("Something went wrong!")
   }
  }
  function generateRandomCoupon(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let coupon = '';
    for (let i = 0; i < length; i++) {
        coupon += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return coupon;
}
  return (
    <div>
      <div className="userprofilebody">
        <div className="mainheading">
          <h3>Coupon</h3>
          <button type="button" className="btn btn-primary" onClick={openModal}>
            <img src="assets/images/icons/plus.svg" alt="" />
            Add New Coupon{" "}
          </button>
        </div>
        <div className="row">
          {
            allCoupons.map(item=>{
              return(
                <div className="col-xxl-2 col-xl-3 col-lg-4" key={item.id}>
                <div className="userprofilewrap userimgcoupon">
                  <div className="userimg">
                    <img src="assets/images/icons/coupon.svg" alt="" />
                  </div>
                  <h2>{item.discountPercentage}%</h2>
                  <h6>{item.couponCode}</h6>
                  <b>{dayjs(item.expiryDate, 'DD-MM-YYYY').format('DD MMMM YYYY')}</b>
                  <button onClick={()=>handleDelete(item.id)}>
                    <img src="assets/images/icons/deletecoupon.svg" alt="" />{" "}
                  </button>
                </div>
              </div>
              )
            })
          }
        </div>
      </div>
      {/* <!-- Modal Popup -->
        <!-- Modal --> */}
      {/* Dialog */}
      <Dialog
        open={isOpen}
        onClose={closeModal}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Stack direction={"horizontal"} justifyContent={"space-between"}>
            <h5 className="modal-title" id="exampleModalLabel">
              Add Coupon
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
            id="discount"
            label="Discount Percentage"
            type="number" // Use type="number" to restrict input to numeric values
            fullWidth
            inputProps={{ min: "0", max: "100" }} // Set the minimum and maximum values
            value={discountPercentage}
            onChange={(event) => {
              const input = event.target.value;
              // Validate input to ensure it's a number and within the range 0 to 100
              if (!isNaN(input) && input >= 0 && input <= 100) {
                setDiscountPercentage(input);
              }
            }}
          />

          <DatePicker
            label="Expiry Date"
            sx={{ marginTop: "20px", width: "100%" }}
            value={expiryDate}
            minDate={dayjs(new Date())}
            onChange={(newValue) => setExpiryDate(newValue)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          {/* <Button onClick={closeModal} color="primary" variant="contained">
                        Cancel
                    </Button> */}
          <button disabled={loading} className="myminkbutton" onClick={handleSubmit}>
            Add
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Coupon;
