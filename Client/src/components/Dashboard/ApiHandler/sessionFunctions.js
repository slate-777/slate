import Axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

// Function to setup session
export const handleSessionSetup = async (e, sessionData, attendeesFile, setLoading) => {
    e.preventDefault();

    const validFileTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel' // .xls
    ];

    if (!attendeesFile || !validFileTypes.includes(attendeesFile.type)) {
        toast.error("Please upload a valid Excel file (.xls or .xlsx)", { position: "top-center" });
        return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('sessionTitle', sessionData.sessionTitle);
    formData.append('sessionHost', sessionData.sessionHost);
    formData.append('sessionDate', sessionData.sessionDate);
    formData.append('sessionTime', sessionData.sessionTime);
    formData.append('schoolId', sessionData.schoolId);
    formData.append('labId', sessionData.labId);
    formData.append('sessionDescription', sessionData.sessionDescription);
    formData.append('sessionImages', JSON.stringify(sessionData.sessionImages));
    // SATHEE KENDRA fields
    formData.append('centreCode', sessionData.centreCode || '');
    formData.append('state', sessionData.state || '');
    formData.append('district', sessionData.district || '');
    formData.append('satheeMitraName', sessionData.satheeMitraName || '');
    formData.append('schoolType', sessionData.schoolType || '');
    formData.append('schoolTypeOther', sessionData.schoolTypeOther || '');
    formData.append('schoolAddress', sessionData.schoolAddress || '');
    formData.append('principalName', sessionData.principalName || '');
    formData.append('principalContact', sessionData.principalContact || '');
    formData.append('visitMode', sessionData.visitMode || '');
    formData.append('attendeesFile', attendeesFile);

    try {
        const response = await Axios.post(`${API_URL}/sessions/setupSession`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: localStorage.getItem("token"),
            },
        });

        if (response.data.status === "success") {
            // Store the success message in localStorage
            localStorage.setItem("sessionSuccessMessage", response.data.message);

            // Reload the page
            window.location.reload();
        } else {
            toast.error(response.data.message, { position: "top-center" });
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            if (error.response.status === 400) {
                toast.error(error.response.data.message || "Please check your input file.", { position: "top-center" });
            } else {
                toast.error(error.response.data.message || "An error occurred while setting up the session!", { position: "top-center" });
            }
        } else {
            toast.error("Network error. Please try again later.", { position: "top-center" });
        }
    } finally {
        setLoading(false);
    }
};

// Check for success message on page load
export const showSessionSuccessToast = () => {
    const successMessage = localStorage.getItem("sessionSuccessMessage");
    if (successMessage) {
        toast.success(successMessage, { position: "top-center" });
        localStorage.removeItem("sessionSuccessMessage"); // Remove it after showing
    }
};

// Function to fetch user's sessions
export const fetchMySessions = async (setSessions) => {
    try {
        const response = await Axios.get(`${API_URL}/sessions/fetchMySessions`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setSessions(response.data.data);
        } else {
            console.log("Failed to fetch sessions");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch all sessions
export const fetchAllSessions = async (setSessions) => {
    try {
        const response = await Axios.get(`${API_URL}/sessions/fetchAllSessions`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setSessions(response.data.data);
        } else {
            console.log("Failed to fetch sessions");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch sessions hosts
export const fetchSessionHosts = async (setSessionHost) => {
    try {
        const response = await Axios.get(`${API_URL}/sessions/fetchSessionHosts`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setSessionHost(response.data.data);
        } else {
            console.log("Failed to fetch sessions");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to update session data
export const handleEditSessionData = async (e, sessionId, newSessionData, handleClose) => {
    e.preventDefault();
    try {
        const response = await Axios.put(`${API_URL}/sessions/updateSessionData/${sessionId}`, newSessionData, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            handleClose();
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to update session data!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating session data!", {
            position: "top-center"
        });
    }
};

// Function to delete session
export const handleDeleteSession = async (sessionId, sessionTitle, sessions, setSessions, handleClose, reloadCallback) => {
    try {
        const response = await Axios.post(`${API_URL}/sessions/deleteSession/${sessionId}`, { sessionTitle }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            handleClose();
            toast.success(response.data.message, {
                position: "top-center"
            });
            // Reload sessions from server instead of filtering local state
            // This prevents issues with duplicate IDs
            if (reloadCallback) {
                reloadCallback();
            } else {
                // Fallback to filtering if no reload callback provided
                setSessions(sessions.filter(session => Number(session.id) !== Number(sessionId)));
            }
        } else {
            toast.error("Failed to delete session!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while deleting the session", {
            position: "top-center"
        });
    }
};

// Function to fetch the student list from public/sessions folder
export const fetchStudentList = async (sessionId, setStudents) => {
    try {
        const response = await Axios.get(`${API_URL}/sessions/getStudentList/${sessionId}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setStudents(response.data.data);
        } else {
            console.log("Failed to load student list!");
        }
    } catch (error) {
        console.log(error);
        toast.error("Failed to load student list!");
    }
};

// Function to save the student list 
export const handleSaveStudentList = async (e, sessionId, students, handleStudentListClose) => {
    e.preventDefault();
    try {
        const updatedAttendance = students.map(student => ({
            student_id: student.student_id,
            student_attendance: student.student_attendance
        }));

        const response = await Axios.put(`${API_URL}/sessions/saveStudentList/${sessionId}`, { attendance: updatedAttendance }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });

        if (response.status === 200) {
            toast.success(response.data.message, {
                position: "top-center"
            });
            handleStudentListClose();
        }
    } catch (error) {
        console.error('Error updating attendance:', error);
        toast.error("Failed to update attendance. Please try again.", {
            position: "top-center"
        });
    }
};

// Function to fetch sessions per month
export const fetchSessionsPerMonth = async (setSessionData) => {
    try {
        const response = await Axios.get(`${API_URL}/sessions/sessionsPerMonth`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setSessionData(response.data.data);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.error('Error fetching schools data:', error);
    }
};

// Function to fetch sessions count
export const fetchSessionsCount = async (setTotalSessionsCount) => {
    try {
        const response = await Axios.get(`${API_URL}/sessions/fetchCountOfSessions`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === 'success') {
            setTotalSessionsCount(response.data.data.total_sessions);
        }
    } catch (error) {
        console.error('Error fetching equipment counts:', error);
    }
};

// Function to fetch latest sessions
export const fetchLatestSessions = async (setLatestSessions, limit = 5) => {
    try {
        const response = await Axios.get(`${API_URL}/sessions/fetchLatestSessions?limit=${limit}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === 'success') {
            console.log('Latest sessions received:', response.data.data);
            setLatestSessions(response.data.data);
        } else {
            console.warn('Failed to fetch latest sessions:', response.data);
            setLatestSessions([]);
        }
    } catch (error) {
        console.error('Error fetching latest sessions:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        setLatestSessions([]);
    }
};