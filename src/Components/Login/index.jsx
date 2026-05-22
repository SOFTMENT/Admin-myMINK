import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !email.trim()) {
      toast.error("Email is required");
      return;
    } else if (!pass || !pass.trim()) {
      toast.error("Password is required");
      return;
    } else {
      setLoading(true);
      signInWithEmailAndPassword(auth, email.trim(), pass)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // Log UID for admin setup (remove after setup)
          console.log("Your UID for admin setup:", user.uid);
          toast.success("Login successful!");
          navigate("/", { replace: true });
        })
        .catch((error) => {
          console.error("Login error:", error);
          let errorMessage = "Login failed. Please try again.";
          if (error.code === "auth/user-not-found") {
            errorMessage = "No account found with this email.";
          } else if (error.code === "auth/wrong-password") {
            errorMessage = "Incorrect password. Please try again.";
          } else if (error.code === "auth/invalid-email") {
            errorMessage = "Invalid email address.";
          } else if (error.code === "auth/too-many-requests") {
            errorMessage = "Too many failed login attempts. Please try again later.";
          } else if (error.message) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePass = (event) => {
    setPass(event.target.value);
  };
  return (
    <div className="loginwrap">
      <div className="logomink">
        <img src="assets/images/logo.png" alt="" />
      </div>
      <div className="loginscreenwrap">
        <div className="welcomemink">
          <h2>WELCOME TO </h2>
          <h4>my MINK</h4>
          <p>
            Log in to get the moment updates on the things that interest you.
          </p>
          <form className="loginwrapform" onSubmit={handleSubmit}>
            <label htmlFor="uname">
              <img src="/assets/images/icons/user.svg" alt="" />
            </label>
            <input
              type="text"
              value={email}
              placeholder="Email"
              name="uname"
              required
              onChange={handleEmail}
            />
            <label htmlFor="psw">
              <img src="/assets/images/icons/password.svg" alt="" />
            </label>
            <input
              type="password"
              value={pass}
              placeholder="Password"
              name="psw"
              required
              onChange={handlePass}
            />
            <button type="submit" className="myminkbutton" disabled={loading}>
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "white", marginRight: 1 }} />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>{" "}
            {/* Changed <a> to <button> */}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
