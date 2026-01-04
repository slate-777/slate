import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleLoginSubmit } from '../Dashboard/ApiHandler/authFunctions';

const Login = () => {
    const navigate = useNavigate();

    // User login Details
    const [userLoginData, setUserLoginData] = useState({
        email: "",
        password: "",
    });

    // Remember Me state
    const [rememberMe, setRememberMe] = useState(false);

    // Handle input change
    const handleLoginChange = (e) => {
        const { value, name } = e.target;
        setUserLoginData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle Remember Me change
    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    // Submit handler that also includes rememberMe logic
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Call your existing login logic
        await handleLoginSubmit(e, userLoginData, setUserLoginData, navigate);

        // Store email if Remember Me is checked (optional logic)
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", userLoginData.email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }
    };

    // On component mount, check if email was remembered
    useState(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setUserLoginData((prev) => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="login-container">
            <ToastContainer />
            <div className="login-box">
                <div className="login-left">
                    <h1 className="login-title">Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            name="email"
                            type="email"
                            value={userLoginData.email}
                            placeholder="Enter Email"
                            onChange={handleLoginChange}
                            autoComplete="email"   // Enables browser autofill
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            value={userLoginData.password}
                            placeholder="Enter Password"
                            onChange={handleLoginChange}
                            autoComplete="current-password"  // Enables browser autofill
                            required
                        />
                        <div>
                            <input
                                style={{ marginRight: '4px' }}
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                            />
                            <label htmlFor="rememberMe" style={{ fontSize: '15px' }}>Remember Me</label>
                        </div>

                        <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
                        <button type="submit" className="login-button">SIGN IN</button>
                    </form>
                </div>
                <div className="login-right">
                    <h1 className="welcome-title">Welcome to SLATE<br></br><span style={{ fontSize: '16px' }}>Sample-based Learning &amp; Assessment Test</span></h1>
                    <p>Slate is designed to simplify school and document management, making workflows seamless and efficient. From organizing and managing student records to tracking attendance and streamlining administrative tasks, Slate ensures everything runs smoothly. Whether you're handling documents or overseeing school operations, we've got you covered. Let's make management smarter and more effective!</p>
                </div>
            </div>
        </div>
    );
};

export default Login;