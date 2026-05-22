import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  CircularProgress,
} from "@mui/material";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db, functionsAus, functionsAsiaEast1 } from "../../config/firebase-config";

const Coupon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingCouponId, setDeletingCouponId] = useState(null);
  const [allCoupons, setAllCoupons] = useState([]);

  useEffect(() => {
    setDataLoading(true);
    const q = query(collection(db, "Coupons"), orderBy("createDate", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coupons = [];
      querySnapshot.forEach((doc) => {
        coupons.push(doc.data());
      });
      setAllCoupons(coupons);
      setDataLoading(false);
    });
    return unsubscribe;
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // createCoupon
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const createCoupon = httpsCallable(functionsAsiaEast1, "createCoupon");
      await createCoupon({
        length: 6,
      });
      closeModal();
      toast.success("Coupon created successfully!");
    } catch (error) {
      console.error("Create coupon error:", error);
      const errorMessage = error?.message || error?.error || "Failed to create coupon. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // deleteCoupon
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      try {
        setDeletingCouponId(id);
        const deleteCoupon = httpsCallable(functionsAus, "deleteCoupon");
        await deleteCoupon({
          couponId: id,
        });
        // Remove from local state immediately for better UX
        setAllCoupons(allCoupons.filter((coupon) => coupon.id !== id));
        toast.success("Coupon deleted successfully!");
      } catch (error) {
        console.error("Delete coupon error:", error);
        const errorMessage = error?.message || error?.error || "Failed to delete coupon. Please try again.";
        toast.error(errorMessage);
      } finally {
        setDeletingCouponId(null);
      }
    }
  };

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
          {dataLoading ? (
            <LinearProgress color="error" />
          ) : allCoupons.length === 0 ? (
            <div style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>No coupons created yet</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>Click "Add New Coupon" to create one</p>
            </div>
          ) : (
            allCoupons.map((item) => {
              return (
                <div
                  className="col-xxl-3 col-xl-4 col-lg-4 col-md-6"
                  key={item.id}
                >
                  <div className="userprofilewrap userimgcoupon">
                    <div className="userimg">
                      <img src="assets/images/icons/coupon.svg" alt="" />
                    </div>
                    <h2>100%</h2>
                    <h6>{item.id}</h6>
                    <b>Lifetime (until redeemed)</b>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingCouponId === item.id}
                      title={deletingCouponId === item.id ? "Deleting..." : "Delete coupon"}
                    >
                      {deletingCouponId === item.id ? (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                      ) : (
                        <img src="assets/images/icons/deletecoupon.svg" alt="" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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
              className="btn-close"
              aria-label="Close"
            ></button>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <p style={{ marginTop: "12px", marginBottom: 0 }}>
            This coupon will stay valid until someone redeems it.
          </p>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <button
            disabled={loading}
            className="myminkbutton"
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", marginRight: 1 }} />
                Creating...
              </>
            ) : (
              "Add"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Coupon;
