import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { forgotPassword } from "../Dashboard/ApiHandler/authFunctions";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <>
            <ToastContainer />
            <div className="reset-password-container">
                    <h1>Forgot Password</h1>
                    <p>Please enter your email to reset your password</p>
                    <form onSubmit={(e) => forgotPassword(e, email, setLoading, setEmail)}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="save-button" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
        </>
    );
}

export default ForgotPassword;