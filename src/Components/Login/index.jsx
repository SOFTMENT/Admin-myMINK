import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Email Required!");
    } else if (!pass) {
      toast.error("Password Requied!");
    } else {
      signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          navigate("/", { replace: true });

          // ...
        })
        .catch((error) => {
          console.log(error);
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
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
          <h4>MY MINK</h4>
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
            <button type="submit" className="myminkbutton">
              Sign in
            </button>{" "}
            {/* Changed <a> to <button> */}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
