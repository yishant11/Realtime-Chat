import { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import db from "../../../instantdb/config";

const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError(null);

    if (currState === "Sign up" || currState === "Login") {
      if (!email) return;

      try {
        setSentEmail(email);
        await db.auth.sendMagicCode({ email });
        alert("A magic code has been sent to your email!");
      } catch (err) {
        setError(err.body?.message || "Something went wrong!");
      }
    }
  };

  const onVerifyHandler = async (event) => {
    event.preventDefault();
    setError(null);

    if (!code) return;

    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code });
      alert("You are now logged in!");
    } catch (err) {
      setError(err.body?.message || "Invalid magic code!");
    }
  };

  return (
    <div className="login">
      <img className="logo" src={assets.logo_big} alt="" />
      <form onSubmit={sentEmail ? onVerifyHandler : onSubmitHandler} className="login-form">
        <h2>{sentEmail ? "Verify your email" : currState}</h2>

        {!sentEmail ? (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-input"
              type="email"
              placeholder="Email address"
              required
            />
            <button type="submit">
              {currState === "Sign up" ? "Create account" : "Login now"}
            </button>
          </>
        ) : (
          <>
            <input
              onChange={(e) => setCode(e.target.value)}
              value={code}
              className="form-input"
              type="text"
              placeholder="Magic code"
              required
            />
            <button type="submit" onClick={()=> navigate('/profile')}>Verify Code</button>
          </>
        )}

        {error && <p className="error-message">{error}</p>}

        {!sentEmail && (
          <div className="login-term">
            <input type="checkbox" />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>
        )}

        <div className="login-forgot">
          {!sentEmail ? (
            <>
              {currState === "Sign up" ? (
                <p className="login-toggle">
                  Already have an account?{" "}
                  <span onClick={() => setCurrState("Login")}>Login here</span>
                </p>
              ) : (
                <p className="login-toggle">
                  Create an account{" "}
                  <span onClick={() => setCurrState("Sign up")}>Click here</span>
                </p>
              )}
            </>
          ) : (
            <p className="login-toggle">
              <span onClick={() => setSentEmail("")}>Back to login</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
