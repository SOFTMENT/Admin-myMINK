import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db, functions } from "../../../../config/firebase-config";
import { doc, updateDoc } from "firebase/firestore";
const plans = [
  {
    id: "ID_LIFETIME",
    name: "LIFETIME",
  },
  {
    id: "ID_WEEKLY",
    name: "WEEKLY",
  },
  {
    id: "ID_MONTHLY",
    name: "MONTHLY",
  },
  {
    id: "ID_QUARTERLY",
    name: "QUARTERLY",
  },
  {
    id: "ID_YEARLY",
    name: "YEARLY",
  },
];
const SubscriptionUpdateModal = ({ isOpen, closeModal, selectedPlan }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  //   const [selectedSubPlan, SetSelectedSubPlan] = useState("");
  useEffect(() => {
    if (selectedPlan) {
      setAmount(selectedPlan?.price);
      //SetSelectedSubPlan(selectedPlan?.id);
    }
  }, [selectedPlan]);
  const handleChange = (event) => {
    const value = event.target.value;
    if (value === "" || (parseFloat(value) > 0 && /^\d*\.?\d*$/.test(value))) {
      setAmount(value);
    } else {
      toast.error("Invalid amount!");
    }
  };
  //   const handlePlanChange = (value) => {
  //     SetSelectedSubPlan(value);
  //   };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const updateSubscriptionPlan = httpsCallable(
        functions,
        "updateSubscriptionPlan"
      );
      const res = await updateSubscriptionPlan({
        id: selectedPlan.id,
        price: amount,
      });
      await updateDoc(doc(db, "SubscriptionPlans", selectedPlan.id), {
        price: amount,
      });
      setLoading(false);
      closeModal({ withUpdate: true });
    } catch (error) {}
  };
  return (
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
            Update Subscription Plan
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
          id="amount"
          label="Subscription Amount"
          type="number" // Use type="number" to restrict input to numeric values
          fullWidth
          value={amount}
          onChange={handleChange}
          inputProps={{ min: 0.01, step: 0.01 }}
        />
        {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
        {/* <TextField
          select
          sx={{ mt: "10px" }}
          value={selectedSubPlan}
          label="Subscription Duration"
          placeholder="adas"
          fullWidth
          onChange={(event) => handlePlanChange(event.target.value)}
        >
          {plans.map((item) => {
            return <MenuItem value={item.id}>{item.name}</MenuItem>;
          })}
        </TextField> */}
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
          {loading ? "" : "Update"}
          {loading && (
            <CircularProgress
              size={30}
              sx={{ position: "absolute", color: "white" }}
            />
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
};
export default SubscriptionUpdateModal;
