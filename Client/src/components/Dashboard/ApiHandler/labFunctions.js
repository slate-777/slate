import Axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

// Function to add lab type
export const handleAddLabType = async (e, labType, setLabType) => {
    e.preventDefault();
    try {
        const response = await Axios.post(`${API_URL}/labs/addLabType`, { labType }, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });
        if (response.data.status === 'success') {
            toast.success(response.data.message, {
                position: 'top-center',
            });
            setLabType("");
        } else {
            toast.error('Failed to add lab type!', {
                position: 'top-center',
            });
        }
    } catch (error) {
        if (error.response && error.response.status === 409) {
            toast.error('Lab type with this name already exists!', {
                position: 'top-center',
            });
        } else {
            toast.error('An error occurred while adding the lab type!', {
                position: 'top-center',
            });
        }
    }
};

// Function to fetch existing lab types
export const fetchExistingLabTypes = async (setExistingLabTypes) => {
    try {
        const response = await Axios.get(`${API_URL}/labs/fetchLabTypes`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });
        if (response.data.status === 'success') {
            setExistingLabTypes(response.data.labTypes);
        } else {
            toast.error('Failed to fetch lab types!', {
                position: 'top-center',
            });
        }
    } catch (error) {
        console.log(error);
        toast.error('An error occurred while fetching lab types!', {
            position: 'top-center',
        });
    }
};

// Function to add lab
export const handleAddLab = async (e, labData, setLabData) => {
    e.preventDefault();
    try {
        const response = await Axios.post(`${API_URL}/labs/addLab`, labData, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            toast.success(response.data.message, {
                position: "top-center"
            });
            setLabData({
                labName: "",
                labType: "",
                labCapacity: "",
                labDescription: "",
                schoolId: "",
            });
        } else {
            toast.error("Failed to add Lab!", {
                position: "top-center"
            });
        }
    } catch (error) {
        toast.error("An error occurred while adding the lab!", {
            position: "top-center"
        });
    }
};

// Function to fetch all labs
export const fetchMyLabs = async (setLabs) => {
    try {
        const response = await Axios.get(`${API_URL}/labs/fetchMyLabs`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setLabs(response.data.data);
        } else {
            console.log("Failed to fetch labs");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch all labs
export const fetchAllLabs = async (setLabs) => {
    try {
        const response = await Axios.get(`${API_URL}/labs/fetchAllLabs`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setLabs(response.data.data);
        } else {
            console.log("Failed to fetch labs");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch all labs
export const fetchActiveLabs = async (setActiveLabs) => {
    try {
        const response = await Axios.get(`${API_URL}/labs/fetchactiveLabs`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setActiveLabs(response.data.data);
        } else {
            console.log("Failed to fetch lab names");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch labs for a specific school
export const fetchLabsForSchool = async (schoolId, setLabs) => {
    try {
        const response = await Axios.get(`${API_URL}/labs/fetchLabsForSchool/${schoolId}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setLabs(response.data.labs);
        } else {
            console.error("Failed to fetch labs");
        }
    } catch (error) {
        console.error("An error occurred while fetching labs!", error);
    }
};

// Function to update lab data
export const handleEditLabData = async (e, labId, newLabData) => {
    e.preventDefault();
    try {
        const response = await Axios.put(`${API_URL}/labs/updateLabData/${labId}`, newLabData, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to update lab data!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating lab data!", {
            position: "top-center"
        });
    }
};

// Function to disable lab
export const handleDisableLab = async (labId, labName, labStatus, setLabStatus) => {
    try {
        const response = await Axios.put(`${API_URL}/labs/disableLab/${labId}`, { labName, labStatus }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            const newStatus = labStatus === 0 ? 1 : 0;
            setLabStatus(newStatus); // Update the local state instantly
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to disable lab!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while disabling the lab!", {
            position: "top-center"
        });
    }
};

// Function to delete lab
export const handleDeleteLab = async (labId, myLabs, setMyLabs, handleClose) => {
    try {
        const response = await Axios.delete(`${API_URL}/labs/deleteLab/${labId}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setMyLabs(myLabs.filter(lab => lab.id !== labId));
            handleClose();
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to delete lab!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while deleting the lab!", {
            position: "top-center"
        });
    }
};

// Function to fetch total labs count
export const fetchLabsCount = async (setTotalLabsCount) => {
    try {
        const response = await Axios.get(`${API_URL}/labs/fetchCountOfLabs`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === 'success') {
            setTotalLabsCount(response.data.data.total_labs);
        }
    } catch (error) {
        console.error('Error fetching labs counts:', error);
    }
};

// Function to update lab type
export const handleUpdateLabType = async (labTypeId, labTypeName, callback) => {
    try {
        const response = await Axios.put(`${API_URL}/labs/updateLabType/${labTypeId}`,
            { labTypeName },
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            }
        );
        if (response.data.status === 'success') {
            toast.success(response.data.message, {
                position: 'top-center',
            });
            if (callback) callback();
        } else {
            toast.error('Failed to update lab type!', {
                position: 'top-center',
            });
        }
    } catch (error) {
        console.log(error);
        toast.error('An error occurred while updating lab type!', {
            position: 'top-center',
        });
    }
};

// Function to delete lab type
export const handleDeleteLabType = async (labTypeId, labTypeName, callback) => {
    try {
        const response = await Axios.delete(`${API_URL}/labs/deleteLabType/${labTypeId}`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            data: { labTypeName }
        });
        if (response.data.status === 'success') {
            toast.success(response.data.message, {
                position: 'top-center',
            });
            if (callback) callback();
        } else {
            toast.error('Failed to delete lab type!', {
                position: 'top-center',
            });
        }
    } catch (error) {
        console.log(error);
        toast.error('An error occurred while deleting lab type!', {
            position: 'top-center',
        });
    }
};
