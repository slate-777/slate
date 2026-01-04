import Axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

// Function to add equipment
export const handleAddEquipment = async (e, equipmentData, setEquipmentData) => {
    e.preventDefault();
    try {
        const response = await Axios.post(`${API_URL}/equipments/addEquipment`, equipmentData, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            toast.success(response.data.message, {
                position: "top-center"
            });
            setEquipmentData({
                equipmentName: "",
                equipmentDescription: "",
                warrantyStatus: "",
                equipmentQuantity: "",
                serialNumber: "",
                expiryDate: ""
            });
        } else {
            toast.error("Failed to add equipment!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while adding the equipment!", {
            position: "top-center"
        });
    }
};

// Function to fetch user's equipments
export const fetchMyEquipments = async (setEquipments) => {
    try {
        const response = await Axios.get(`${API_URL}/equipments/fetchMyEquipments`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setEquipments(response.data.data);
        } else {
            console.log("Failed to fetch equipments");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch equipments
export const fetchAllEquipments = async (setEquipments) => {
    try {
        const response = await Axios.get(`${API_URL}/equipments/fetchAllEquipments`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setEquipments(response.data.data);
        } else {
            console.log("Failed to fetch equipment names");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch active equipments
export const fetchActiveEquipments = async (setActiveEquipments) => {
    try {
        const response = await Axios.get(`${API_URL}/equipments/fetchactiveEquipments`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setActiveEquipments(response.data.data);
        } else {
            console.log("Failed to fetch equipments names");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to handle equipment aallocation
export const handleAllocateEquipment = async (e, equipmentData, setEquipmentData) => {
    e.preventDefault();
    try {
        const response = await Axios.post(`${API_URL}/equipments/allocateEquipment`, equipmentData, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            toast.success(response.data.message, {
                position: "top-center"
            });
            setEquipmentData({
                equipmentId: "",
                schoolId: "",
                labId: "",
                allocationDate: "",
                allocatedQuantity: "",
            });
        } else {
            toast.error("Failed to allocate equipment!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while allocating the equipment!", {
            position: "top-center"
        });
    }
};

// Function to fetch user's allocated equipments
export const fetchMyAllocatedEquipments = async (setEquipments) => {
    try {
        const response = await Axios.get(`${API_URL}/equipments/fetchMyAllocatedEquipments`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setEquipments(response.data.data);
        } else {
            console.log("Failed to fetch equipments");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to fetch all allocated equipments
export const fetchAllAllocatedEquipments = async (setEquipments) => {
    try {
        const response = await Axios.get(`${API_URL}/equipments/fetchAllAllocatedEquipments`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setEquipments(response.data.data);
        } else {
            console.log("Failed to fetch equipment names");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to update equipment data
export const handleEditEquipmentData = async (e, equipmentId, newEquipmentData) => {
    e.preventDefault();
    try {
        const response = await Axios.put(`${API_URL}/equipments/updateEquipmentData/${equipmentId}`, newEquipmentData, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to update equipment data", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating equipment data", {
            position: "top-center"
        });
    }
};

// Function to update equipment allocation
export const handleUpdateAllocation = async (e, allocationId, newEquipmentData) => {
    e.preventDefault();
    try {
        const response = await Axios.put(`${API_URL}/equipments/updateAllocation/${allocationId}`, newEquipmentData, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to update equipment allocation", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating equipment allocation", {
            position: "top-center"
        });
    }
};

// Function to disable Equipment
export const handleDisableEquipment = async (equipmentId, equipmentName, equipmentStatus, setEquipmentStatus) => {
    try {
        const response = await Axios.put(`${API_URL}/equipments/disableEquipment/${equipmentId}`, { equipmentName, equipmentStatus }, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            const newStatus = equipmentStatus === 0 ? 1 : 0;
            setEquipmentStatus(newStatus);
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Failed to disable equipment!", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while disabling the equipment!", {
            position: "top-center"
        });
    }
};

// Function to delete equipment
export const handleDeleteEquipment = async (equipmentId, myEquipments, setMyEquipments, handleClose) => {
    try {
        const response = await Axios.delete(`${API_URL}/equipments/deleteEquipment/${equipmentId}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setMyEquipments(myEquipments.filter(equipment => equipment.id !== equipmentId));
            handleClose();
            toast.success(response.data.message, {
                position: "top-center"
            });
        } else {
            toast.error("Equipment delete failed", {
                position: "top-center"
            });
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while deleting the equipment", {
            position: "top-center"
        });
    }
};

// Function to fetch lab equipment count
export const fetchLabEquipmentCount = async (setLabEquipmentData) => {
    try {
        const response = await Axios.get(`${API_URL}/equipments/fetchLabEquipmentCount`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            const formattedData = response.data.data.map(lab => ({
                ...lab,
                equipment_names: lab.equipment_names ? lab.equipment_names.split(", ") : [],
            }));
            setLabEquipmentData(formattedData);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.error('Error fetching lab equipment data:', error);
    }
};

// Function to fetch schools With Most Allocated Equipment
export const FetchSchoolsWithMostAllocatedEquipment = async (setSchoolsWithMostAllocatedEquipment) => {
    try {
        const response = await Axios.get(`${API_URL}/equipments/schoolsWithMostAllocatedEquipment`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setSchoolsWithMostAllocatedEquipment(response.data.data);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.error('Error fetching lab equipment data:', error);
    }
};

// Function to fetch labs With Most Allocated Equipment
export const FetchLabsWithMostAllocatedEquipment = async (setLabsWithMostAllocatedEquipment) => {
    try {
        const response = await Axios.get(`${API_URL}/equipments/labsWithMostAllocatedEquipment`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === "success") {
            setLabsWithMostAllocatedEquipment(response.data.data);
        } else {
            console.log(response);
        }
    } catch (error) {
        console.error('Error fetching lab equipment data:', error);
    }
};



// Function to fetch total allocated Equipment count
export const fetchEquipmentCount = async (setTotalEquipmentCount) => {
    try {
        const response = await Axios.get(`${API_URL}/equipments/fetchCountOfEquipment`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });
        if (response.data.status === 'success') {
            setTotalEquipmentCount(response.data.data.total_equipment);
        }
    } catch (error) {
        console.error('Error fetching equipment counts:', error);
    }
};