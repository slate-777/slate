import Axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

// Function to add school
export const handleAddSchool = async (e, formData, setFormData) => {
    e.preventDefault();
    try {
        const response = await Axios.post(`${API_URL}/schools/addSchool`, formData, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            toast.success(response.data.message, {
                position: "top-center"
            });
            setFormData({
                schoolName: "",
                udise: "",
                state: "",
                district: "",
                pincode: "",
                address: "",
                geoLocation: "",
                schoolEmail: "",
                contactPerson: "",
                contactNo: "",
                totalStudents: ""
            });
        } else {
            toast.error("Failed to add school!", {
                position: "top-center"
            });
        }
    } catch (error) {
        if (error.response && error.response.status === 409) {
            toast.error("School with this UDISE already exists!", {
                position: "top-center"
            });
        } else {
            console.log(error);
            toast.error("An error occurred while adding the school!", {
                position: "top-center"
            });
        }
    }
};


// Function to fetch user's schools
export const fetchMySchools = async (setSchools) => {
    try {
        const response = await Axios.get(`${API_URL}/schools/fetchMySchools`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setSchools(response.data.data);
        } else {
            console.log("Failed to fetch schools");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch all schools
export const fetchAllSchools = async (setSchools) => {
    try {
        const response = await Axios.get(`${API_URL}/schools/fetchAllSchools`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setSchools(response.data.data);
        } else {
            console.log("Failed to fetch school names");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch all schools
export const fetchActiveSchools = async (setActiveSchools) => {
    try {
        const response = await Axios.get(`${API_URL}/schools/fetchActiveSchools`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setActiveSchools(response.data.data);
        } else {
            console.log("Failed to fetch school names");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to update school data
export const handleEditSchoolData = async (e, schoolId, newSchoolData) => {
    e.preventDefault();
    try {
        const response = await Axios.put(`${API_URL}/schools/updateSchoolData/${schoolId}`, newSchoolData, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to update school data!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating school data!", {
            position: "top-center"
        });
    }
};

// Function to disable school
export const handleDisableSchool = async (schoolId, schoolName, schoolStatus, setSchoolStatus) => {
    try {
        const response = await Axios.put(`${API_URL}/schools/disableSchool/${schoolId}`, { schoolName, schoolStatus }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            const newStatus = schoolStatus === 0 ? 1 : 0;
            setSchoolStatus(newStatus); // Update the local state instantly
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to disable school!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while disabling the school!", {
            position: "top-center"
        });
    }
};

// Function to delete school
export const handleDeleteSchool = async (schoolId, mySchools, setMySchools, handleClose) => {
    try {
        const response = await Axios.delete(`${API_URL}/schools/deleteSchool/${schoolId}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setMySchools(mySchools.filter(school => school.id !== schoolId));
            handleClose();
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to delete school!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while deleting the school!", {
            position: "top-center"
        });
    }
};

// Function to fetch unique states
export const fetchStates = async (setStates) => {
    try {
        const response = await Axios.get(`${API_URL}/schools/fetchStates`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.success) {
            setStates(response.data.states);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.log('Error fetching states:', error);
    }
};

// Function to fetch districts by state
export const fetchDistricts = async (state, setDistricts) => {
    try {
        const response = await Axios.get(`${API_URL}/schools/fetchDistricts/${state}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.success) {
            setDistricts(response.data.districts);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.log('Error fetching districts:', error);
    }
};

// Function to fetch all districts
export const fetchAllDistricts = async (setDistricts) => {
    try {
        const response = await Axios.get(`${API_URL}/schools/fetchAllDistricts`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.success) {
            setDistricts(response.data.districts);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.log('Error fetching districts:', error);
    }
};

// Function to fetch schools per state
export const fetchSchoolsPerState = async (setSchoolsData) => {
    try {
        const response = await Axios.get(`${API_URL}/schools/schoolsPerState`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setSchoolsData(response.data.data);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.error('Error fetching schools data:', error);
    }
};

// Function to fetch total schools count
export const fetchSchoolsCount = async (setTotalSchoolsCount) => {
    try {
        const response = await Axios.get(`${API_URL}/schools/fetchCountOfSchools`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === 'success') {
            setTotalSchoolsCount(response.data.data.total_schools);
        }
    } catch (error) {
        console.error('Error fetching school counts:', error);
    }
};