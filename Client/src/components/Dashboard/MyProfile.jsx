import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyUser, handleChangePassword } from "./ApiHandler/authFunctions";
import { fetchUserState } from './ApiHandler/usersFunctions';

const MyProfile = () => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState(null);
    const [userState, setUserState] = useState("");
    const [email, setEmail] = useState("");

    // State for password change
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    // Fetch user details
    useEffect(() => {
        verifyUser(null, setUsername, setEmail, setRole, null);
        fetchUserState(setUserState);
    }, []);

    return (
        <div className="upload-document-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>My Profile</h1>
            </header>
            <form className="upload-document-form">
                <div className="form-group">
                    <p>Name:</p>
                    <span>{username}</span>
                </div>
                <div className="form-group">
                    <p>Email:</p>
                    <span>{email}</span>
                </div>
                <div className="form-group">
                    <p>Role:</p>
                    <p>{role === 1 ? "Admin" : role === 2 ? `Mentor` : `State Officer`}</p>
                </div>
                <div className="form-group">
                    <p>State:</p>
                    <span>{role === 1 ? "Not Applicable" : userState}</span>
                </div>
                <header className="upload-document-header">
                    <h1>Reset Password</h1>
                </header>
                <div className="in-row-input">
                    <div className="form-group">
                        <label>Old Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handleChange}
                            placeholder="Enter Old Password"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            placeholder="Enter New Password"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" onClick={(e) => handleChangePassword(e, passwords.oldPassword, passwords.newPassword, passwords.confirmPassword, setPasswords)}>Submit</button>
                </div>
            </form>
            <div className="usage-instructions">
                <h2>📢 Usage Instructions</h2>
                <ul>
                    <li><i className='bx bx-paper-plane'></i> This is the profile section where you can reset your password.</li>
                    <li><i className='bx bx-paper-plane'></i> The old password is required to reset your password.</li>
                </ul>
            </div>
        </div>
    );
};

export default MyProfile;