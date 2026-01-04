import Axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL;

// Function to fetch token from local storage
export const fetchToken = async (setCurrentUserId) => {
    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwtDecode(token);
        setCurrentUserId(decodedToken.id);
    }
};

// Function to fetch user info 
export const fetchUsers = async (setUsers) => {
    try {
        const response = await Axios.get(`${API_URL}/users/fetchUsers`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setUsers(response.data.data);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch user state 
export const fetchUserState = async (setUserState) => {
    try {
        const response = await Axios.get(`${API_URL}/users/fetchUserState`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setUserState(response.data.data);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to change user role
export const handleChangeUserRole = async (userId, userEmail, newRoleId, currentUserId, setUsers, users) => {
    if (userId === currentUserId) {
        toast.error("Ask another admin to change your role", {
            position: "top-center"
        });
        return;
    }

    try {
        const response = await Axios.put(`${API_URL}/users/changeUserRole`, {
            userId,
            userEmail,
            newRoleId
        }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        });
        if (response.data.status === 'success') {
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role_id: newRoleId } : user
            ));
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to change user role!", {
                position: "top-center"
            });
        }
    } catch (error) {
        toast.error("An error occurred while changing user role!", {
            position: "top-center"
        });
    }
};

// Function to update user details
export const handleUpdateUserDetails = async (e, selectedUser, setLoading, setEditPopupOpen) => {
    setLoading(true);
    // Exclude `state` from the check if userType is 'Admin'
    const requiredFields = ['fname', 'lname', 'phone'];
    if (selectedUser.role_id !== 1) {
        requiredFields.push('state'); // Add state to required fields only if userType is not Admin
    }

    if (selectedUser.role_id === 1) {
        selectedUser.state = "";
    }

    // Check if required fields are filled
    const allFieldsFilled = requiredFields.every(field => selectedUser[field]?.trim().length > 0);

    if (allFieldsFilled) {
        try {
            const response = await Axios.put(`${API_URL}/users/updateUserDetails`, { selectedUser }, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            });
            if (response.data.status === 'success') {
                setEditPopupOpen(false);
                toast.success(response.data.message, {
                    position: "top-center"
                });
            } else if (response.data.status === 'userWithSameState') {
                // Handle already existing user with same state
                toast.error(response.data.message, {
                    position: "top-center",
                });
            } else {
                toast.error(response.data.message, {
                    position: "top-center"
                });
            }
        } catch (error) {
            toast.error("Failed to update user details", { position: "top-center" });
        } finally {
            setLoading(false);
        }
    } else {
        // Show popup if details are missing
        toast.error("Please fill in all the required fields!", {
            position: "top-center",
        });
        setLoading(false);
    }

};

// Function to delete user
export const handleDeleteUser = async (userId, userEmail, currentUserId, setUsers, users) => {
    if (userId === currentUserId) { // If logged in user tries to delete its account exit the function
        toast.error("Ask another admin to delete your account", {
            position: "top-center"
        });
        return;
    }
    try {
        const response = await Axios.post(`${API_URL}/users/deleteUser/${userId}`, { userEmail }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        });

        if (response.data.status === "success") {
            setUsers(users.filter(user => user.id !== userId));
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to delete user!", {
                position: "top-center"
            });
        }
    } catch (error) {
        toast.error("An error occurred while deleting the user!", {
            position: "top-center"
        });
    }
};

// Function to get control access info
export const getControlAcessInfo = async (setControlAccess) => {
    try {
        const response = await Axios.get(`${API_URL}/users/getControlAccessInfo`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        });
        if (response.data.status === "success") {
            setControlAccess(response.data.data);
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to update user access
export const handleControlAccessUpdate = async (userId, userEmail, sideBarOption, setControlAccessUsers) => {
    try {
        const response = await Axios.put(`${API_URL}/users/updateUserControlAccess`, { userId, userEmail, sideBarOption }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        }
        );
        if (response.data.status === "success") {
            setControlAccessUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? {
                            ...user,
                            [sideBarOption]: user[sideBarOption] === 1 ? 0 : 1,
                        }
                        : user
                )
            );
            toast.success(response.data.message, {
                position: "top-center",
            });
        } else {
            toast.error("Failed to update user access!", {
                position: "top-center",
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating the user access!", {
            position: "top-center",
        });
    }
};

// Function to get control access users
export const getControlAccessUsers = async (setControlAccessUsers) => {
    try {
        const response = await Axios.get(`${API_URL}/users/fetchControlAccessUsers`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        });
        if (response.data.status === "success") {
            setControlAccessUsers(response.data.data);
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to suspend/reinstated user 
export const handleSuspendUser = async (e, userId, currentUserId, userName, userEmail, userStatus, setUsers, setLoading) => {
    e.preventDefault();
    if (userId === currentUserId) {
        toast.error("You can't suspend yourself", {
            position: "top-center"
        });
        return;
    }
    try {
        setLoading(true);
        const response = await Axios.put(`${API_URL}/users/suspendUser/${userId}`, { userName, userEmail, userStatus }, {
            headers: {
                Authorization: localStorage.getItem("token")
            },
        });
        if (response.data.status === "success") {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, status: userStatus === "active" ? "inactive" : "active" } : user
                )
            );
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to suspend user!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while suspending the user!", {
            position: "top-center"
        });
    } finally {
        setLoading(false);
    }
};

// Function to get user activity logs
export const handleUserActivitySubmit = async (userId, userEmail, period, setUserActivity, setActivitySection) => {
    if (!userId || userId.trim() === "") {
        return;
    }
    try {
        const response = await Axios.post(`${API_URL}/users/fetchUserActivity`, { userId, userEmail, period }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setUserActivity(response.data.data);
            setActivitySection(true);
        } else {
            toast.error("Failed to get user activity logs!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while getting user activity logs!", {
            position: "top-center"
        });
    }
};