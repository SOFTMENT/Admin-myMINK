import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { db, functions } from "../../config/firebase-config";
import {
  alpha,
  Card,
  Icon,
  IconButton,
  LinearProgress,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import styled from "@emotion/styled";
import SubscriptionUpdateModal from "./components/SubscriptionUpdateModal";
const label = { inputProps: { "aria-label": "controlled" } };
const RedSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#D10000",
    "&:hover": {
      backgroundColor: alpha("#D10000", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#D10000",
  },
}));
const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const openModal = (id) => {
    setSelectedPlan(plans.find((plan) => plan.id == id));
    setIsOpen(true);
  };

  const closeModal = ({ withUpdate }) => {
    setIsOpen(false);
    if (withUpdate) getAllPlans();
  };
  useEffect(() => {
    getAllPlans();
  }, []);
  const getAllPlans = async () => {
    const getAllSubscriptionPlans = httpsCallable(
      functions,
      "getAllSubscriptionPlans"
    );
    try {
      setLoading(true);
      const res = await getAllSubscriptionPlans();
      const q = query(collection(db, "SubscriptionPlans"));
      const querySnapshot = await getDocs(q);
      let data = res?.data?.plans?.filter((plan) => plan.id != "ID_NOTRIAL");
      data = querySnapshot.docs.map((doc) => {
        const doc2 = data.find((item) => item.id == doc.data().planId);
        console.log(doc2);
        return {
          ...doc2,
          isActive: doc.data().isActive,
        };
      });
      console.log(data);
      setPlans(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (id) => {
    try {
      const plan = plans.find((item) => item.id == id);
      console.log(plan);
      updateDoc(doc(db, "SubscriptionPlans", id), {
        isActive: !plan?.isActive,
      });
      setPlans(
        plans.map((plan) => {
          if (plan.id == id) {
            return {
              ...plan,
              isActive: !plan?.isActive,
            };
          } else return plan;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="userprofilebody">
      <div className="mainheading">
        <h3>Subscription Plans</h3>
        {/* <button type="button" className="btn btn-primary" onClick={openModal}>
          <img src="assets/images/icons/plus.svg" alt="" />
          Send Notification{" "}
        </button> */}
      </div>
      <div className="row" style={{ justifyContent: "center" }}>
        <div className="col-xxl-4 col-xl-6 col-lg-6 ">
          <div className="notificationwrap">
            <div className="notificationall">
              {/* <span>
                <h4>Notifications</h4>
              </span> */}
            </div>
            {loading ? (
              <LinearProgress color="error" />
            ) : (
              plans.map((plan) => {
                return (
                  <Card sx={{ padding: "10px", mb: "10px" }}>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography variant="h6">{plan?.name}</Typography>
                      <Stack direction={"row"}>
                        <IconButton onClick={() => openModal(plan?.id)}>
                          <Edit htmlColor="#D10000" />
                        </IconButton>
                        <RedSwitch
                          {...label}
                          checked={plan?.isActive}
                          onChange={() => handleChange(plan?.id)}
                          color="warning"
                        />
                      </Stack>
                    </Stack>
                    <Typography color={"GrayText"}>
                      {plan?.price} AUD
                    </Typography>
                  </Card>
                );
              })
            )}
            {/* <a href="#">View More...</a> */}
          </div>
        </div>
      </div>
      {selectedPlan && (
        <SubscriptionUpdateModal
          selectedPlan={selectedPlan}
          isOpen={isOpen}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};
export default SubscriptionPlans;
