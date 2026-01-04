import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import { useParams } from "react-router-dom";
import { handleResetPassword } from "../Dashboard/ApiHandler/authFunctions";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useParams();

    const handlePasswordChange = (password) => {
        setPassword(password)
    };

    return (
        <>
            <ToastContainer />
            <div className="reset-password-container">
                <h1>Reset Password</h1>
                <form onSubmit={(e) => handleResetPassword(e, token, password, confirmPassword, setPassword, setConfirmPassword, setLoading)}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="save-button" disabled={loading}>
                        {loading ? 'Please wait...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default ResetPassword;