import Axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;


// Function to Add New User
export const handleCreateUser = async (e, newUser, setNewUser, setLoading, setIsPopupOpen) => {
    e.preventDefault();

    // Exclude `state` from the check if userType is 'Admin'
    const requiredFields = ['fname', 'lname', 'email', 'phone', 'userType'];
    if (newUser.userType !== 'Admin') {
        requiredFields.push('state'); // Add state to required fields only if userType is not Admin
    }

    if (newUser.userType === 'Admin') {
        newUser.state = "";
    }

    // Check if required fields are filled
    const allFieldsFilled = requiredFields.every(field => newUser[field]?.trim().length > 0);

    if (allFieldsFilled) {
        try {
            setLoading(true);
            const response = await Axios.post(`${process.env.REACT_APP_API_URL}/auth/createUser`, newUser, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            if (response.status === 201) {
                toast.success("User added successfully!", {
                    position: "top-center",
                });

                // Reset form data
                setNewUser({
                    fname: "",
                    lname: "",
                    email: "",
                    phone: "",
                    userType: "",
                    state: "",
                });
                setIsPopupOpen(false);
            } else if (response.status === 400) {
                // Handle missing required fields
                toast.error("Please fill in all the required fields!", {
                    position: "top-center",
                });
            } else if (response.status === 409) {
                // Handle already existing user
                toast.error(response.data.error, {
                    position: "top-center",
                });
            } else {
                toast.error(response.data.message || "Failed to add user. Please try again!", {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error adding user:", error);
            // Handle unexpected errors
            toast.error(error.response?.data?.error || "An unexpected error occurred. Please try again later!", {
                position: "top-center",
            });
        } finally {
            setLoading(false);
        }
    } else {
        // Show popup if details are missing
        toast.error("Please fill in all the required fields!", {
            position: "top-center",
        });
    }
};


// Function to login 
export const handleLoginSubmit = async (e, userLoginData, setUserLoginData, navigate) => {
    e.preventDefault();
    if (Object.values(userLoginData).every(value => value.length > 0)) {
        try {
            const response = await Axios.post(`${API_URL}/auth/login`, userLoginData);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
            } else {
                toast.error("Invalid login details!", {
                    position: "top-center"
                });
                setUserLoginData({
                    email: "",
                    password: "",
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("An unexpected error occurred. Please try again later!", {
                position: "top-center"
            });
        }
    }
}

// Function to send a reset password link to user's email
export const forgotPassword = async (e, email, setLoading, setEmail) => {
    e.preventDefault();
    try {
        setLoading(true);
        const response = await Axios.post(`${API_URL}/auth/forgotPassword`, { email }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        });
        if (response.status === 200) {
            toast.success("If the email is registered, a verification link has been sent!", {
                position: 'top-center',
            });
            setEmail('');
        } else {
            toast.error('An Error Occured, please try again later!', {
                position: 'top-center',
            });
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            toast.success("If the email is registered, a verification link has been sent!", {
                position: 'top-center',
            });
            setEmail('');
        } else {
            console.error('Error sending reset link:', error);
            toast.error('Server error, please try again later', {
                position: 'top-center',
            });
        }
    } finally {
        setLoading(false);
    }
};


// Function to reset user's password
export const handleResetPassword = async (e, token, password, confirmPassword, setPassword, setConfirmPassword, setLoading) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast.error("Passwords do not match", {
            position: "top-center"
        });
        return;
    }
    try {
        setLoading(true);
        const response = await Axios.post(`${API_URL}/auth/resetPassword/${token}`, { password }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        });
        if (response.status === 200) {
            toast.success(response.data.message, {
                position: 'top-center',
            });
            setPassword('');
            setConfirmPassword('');
        } else {
            toast.error('An Error Occured, please try again later!', {
                position: 'top-center',
            });
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            toast.error("Invalid or expired link", {
                position: 'top-center',
            });
        } else {
            console.error('Error in resetting password:', error);
            toast.error('Server error, please try again later', {
                position: 'top-center',
            });
        }
    } finally {
        setLoading(false);
    }
};

// Function to verify user
export const verifyUser = async (setAuth, setUsername, setEmail, setRole, setMessage, setAssignedLab) => {
    try {
        const option = {
            method: 'get',
            url: `${API_URL}/auth/verifyUser`,
            headers: {
                Authorization: localStorage.getItem("token") // Get token from local storage
            }
        };
        const res = await Axios(option);
        if (res.data.status === "success") {
            if (setAuth) setAuth(true);
            if (setUsername) setUsername(res.data.username);
            if (setEmail) setEmail(res.data.email);
            if (setRole) setRole(res.data.role_id);
            if (setAssignedLab) setAssignedLab(res.data.assignedLab);
        } else {
            if (setAuth) setAuth(false);
            if (setMessage) setMessage(res.data.message);
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to logout
export const handleLogout = async (navigate) => {
    const token = localStorage.getItem("token");
    if (token) {
        await Axios.post(`${API_URL}/auth/logout`, {}, {
            headers: {
                Authorization: token
            }
        })
            .then(res => {
                if (res.data.status === "success") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("activeOption");
                    localStorage.removeItem("activeSection");
                    navigate("/");
                }
            })
            .catch(err => console.log(err));
    } else {
        localStorage.removeItem("token");
        localStorage.removeItem("activeOption");
        localStorage.removeItem("activeSection");
        navigate("/");
    }
};

// Function to change password
export const handleChangePassword = async (e, oldPassword, newPassword, confirmPassword, setPasswords) => {
    e.preventDefault();
    try {
        if (newPassword !== confirmPassword) {
            toast.error("New Password and Confirm Password do not match!", {
                position: "top-center",
            });
            return;
        }

        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/auth/changePassword`, { oldPassword, newPassword }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        }
        );

        if (response.status === 200) {
            toast.success("Password changed successfully!", {
                position: "top-center",
            });
            setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            toast.error(response.data.error || "Failed to change password. Please try again!", {
                position: "top-center",
            });
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized or old password mismatch
                toast.error(error.response.data.error || "Old password does not match!", {
                    position: "top-center",
                });
            } else {
                // Handle other known errors
                toast.error(error.response.data.error || "Failed to change password. Please try again!", {
                    position: "top-center",
                });
            }
        } else {
            // Handle network or unexpected errors
            console.error("Error changing password:", error);
            toast.error("An unexpected error occurred. Please try again later!", {
                position: "top-center",
            });
        }
    }
};