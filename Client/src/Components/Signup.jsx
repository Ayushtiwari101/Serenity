import './Signup.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const clientID = "85462322080-3ie3vc4olh1oi5puuv4b3j3p71get9f6.apps.googleusercontent.com";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactOrEmail, setContactOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isEmail = /\S+@\S+\.\S+/.test(contactOrEmail);
    const userdata = {
      firstName,
      lastName,
      username,
      password,
      ...(isEmail ? { email: contactOrEmail } : { contactNumber: contactOrEmail })
    };

    try {
      const response = await axios.post("https://serenitysteps.onrender.com/signup", userdata);
      alert(response.data);
      navigate("/");
    } catch (error) {
      setSignupError(error.message);
    }
  };

  const onSuccess = (res) => {
    navigate("/home");
  };

  return (
    <div className="auth-root">
      <div className="auth-blob auth-blob-sage"></div>
      <div className="auth-blob auth-blob-blue"></div>

      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join Serenity Steps today.</p>

        <form className="auth-form" onSubmit={handleFormSubmit}>
          <div className="auth-row">
            <div className="auth-input-group">
              <label className="auth-label">First Name</label>
              <input type="text" className="auth-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="auth-input-group">
              <label className="auth-label">Last Name</label>
              <input type="text" className="auth-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Email or Mobile</label>
            <input type="text" className="auth-input" value={contactOrEmail} onChange={(e) => setContactOrEmail(e.target.value)} required />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Username</label>
            <input type="text" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input type="password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          <button type="submit" className="auth-btn-submit">Sign Up</button>

          <div className="auth-divider">or sign up with</div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleOAuthProvider clientId={clientID}>
              <GoogleLogin onSuccess={onSuccess} text="signup_with" shape="circle" width="250" />
            </GoogleOAuthProvider>
          </div>
        </form>

        {signupError && <p style={{ color: 'red', textAlign: 'center' }}>{signupError}</p>}

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
