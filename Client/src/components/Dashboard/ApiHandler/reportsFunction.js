import Axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

// Function to Download Report
export const downloadReport = async (e, role, selectedReport, parameter = null, setParameter) => {
    e.preventDefault();
    if (!selectedReport) {
        toast.error("Please select a report!", {
            position: "top-center",
        });
        return;
    }

    // If selected report is parameter dependent and the parameter is null
    if ((selectedReport === "Student_Attendance_Report_for_a_Specific_Session" || selectedReport === "Sessions_Conducted_in_a_Specific_or_All_states" || ((selectedReport === "Total_Number_of_Labs_per_School" || selectedReport === "Schools_Grouped_by_State") && role === 1) || selectedReport === "Sessions_Conducted_by_a_Specific_Host" || selectedReport === "Recently_Added_Equipment_for_a_period" || selectedReport === "Allocations_Made_in_past" || selectedReport === "Labs_Added_in_past" || selectedReport === "Fetch_Student_Data_by_Aadhar") && parameter === "") {
        toast.error("Please fill in all the required fields!", {
            position: "top-center",
        });
        return;
    }

    let backendUrl = `${API_URL}/reports/${selectedReport}`

    // If selectedReport is one of the specified reports and parameter exists, add it as a query parameter
    if ((selectedReport === "Student_Attendance_Report_for_a_Specific_Session" || selectedReport === "Sessions_Conducted_in_a_Specific_or_All_states" || ((selectedReport === "Total_Number_of_Labs_per_School" || selectedReport === "Schools_Grouped_by_State") && role === 1) || selectedReport === "Sessions_Conducted_by_a_Specific_Host" || selectedReport === "Recently_Added_Equipment_for_a_period" || selectedReport === "Allocations_Made_in_past" || selectedReport === "Labs_Added_in_past" || selectedReport === "Fetch_Student_Data_by_Aadhar") && parameter) {
        backendUrl += `?parameter=${parameter}`;
    }

    try {
        const response = await Axios.get(backendUrl, {
            responseType: "blob", // Important for downloading files
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });

        // Convert current UTC time to IST (UTC +5:30)
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
        const istTime = new Date(now.getTime() + istOffset);

        // Format IST timestamp as YYYYMMDD_HHMMSS
        const timestamp = istTime.toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

        // Create a Blob and Download the File
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${selectedReport}_${timestamp}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error downloading report:", error);
        toast.error("Failed to download the report.");
    }
};