import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { downloadReport } from "./ApiHandler/reportsFunction";
import { fetchAllSessions, fetchSessionHosts } from './ApiHandler/sessionFunctions';
import { fetchStates } from "./ApiHandler/schoolFunctions";

const Reports = ({ role }) => {
    const [selectedReport, setSelectedReport] = useState("");
    const [sessions, setSessions] = useState([]);
    const [states, setStates] = useState([]);
    const [sessionHosts, setSessionHosts] = useState([]);
    const [parameter, setParameter] = useState("");

    // Report Options - All reports accessible to all roles
    const reports = [
        { id: "List_of_All_Sessions_with_School_Details", name: "List of All Sessions with School Details" },
        { id: "Student_Attendance_Report_for_a_Specific_Session", name: "Student Attendance Report for a Specific Session" },
        { id: "Total_Number_of_Students_Attended_per_Session", name: "Total Number of Students Attended per Session" },
        { id: "List_of_Schools_with_Total_Sessions_Conducted", name: "List of Schools with Total Sessions Conducted" },
        { id: "Students_with_Low_Attendance_Across_All_Sessions", name: "Students with Low Attendance Across All Sessions" },
        { id: "Sessions_Conducted_in_a_Specific_or_All_states", name: "Sessions Conducted in a Specific or All States" },
        { id: "Schools_with_No_Sessions_Conducted", name: "Schools with No Sessions Conducted" },
        { id: "Sessions_Conducted_by_a_Specific_Host", name: "Sessions Conducted by a Specific Host" },
        { id: "Total_count_of_equipment_available", name: "Total count of equipment available" },
        { id: "List_of_Equipment_with_Expired_Warranties", name: "List of equipment with expired warranties" },
        { id: "Recently_Added_Equipment_for_a_period", name: "Recently added equipment for a period" },
        { id: "Equipment_Inventory_Status_Available_vs_Allocated", name: "Equipment inventory status (available vs. allocated)" },
        { id: "Allocations_Made_in_past", name: "Allocations made in past" },
        { id: "Total_Number_of_Labs_per_School", name: "Total number of labs per school" },
        { id: "Labs_Grouped_by_Type", name: "Labs grouped by type" },
        { id: "Labs_Added_in_past", name: "Labs added in past" },
        { id: "Schools_Grouped_by_State", name: "Schools grouped by state" },
        { id: "Schools_with_Labs_but_No_Equipment_Allocations", name: "Schools with labs but no equipment allocations" },
        { id: "Fetch_Student_Data_by_Aadhar", name: "Fetch student data by aadhar" }
    ];

    const reportLabels = {
        Student_Attendance_Report_for_a_Specific_Session: "Select a Session",
        Sessions_Conducted_in_a_Specific_or_All_states: "Select a State",
        Sessions_Conducted_by_a_Specific_Host: "Select a Host",
        Fetch_Student_Data_by_Aadhar: "Enter Student Aadhar",
        Total_Number_of_Labs_per_School: "Select a State",
        Schools_Grouped_by_State: "Select a State",
        Recently_Added_Equipment_for_a_period: "Select period",
        Allocations_Made_in_past: "Select period",
        Labs_Added_in_past: "Select period"
    };

    // Default to a generic label if `selectedReportType` is not found
    const selectedLabel = reportLabels[selectedReport] || "Select an Option";

    useEffect(() => {
        if (selectedReport === 'Student_Attendance_Report_for_a_Specific_Session') {
            fetchAllSessions(setSessions);
        }
        if (selectedReport === 'Sessions_Conducted_in_a_Specific_or_All_states' || selectedReport === 'Total_Number_of_Labs_per_School' || selectedReport === 'Schools_Grouped_by_State') {
            fetchStates(setStates);
        }
        if (selectedReport === 'Sessions_Conducted_by_a_Specific_Host') {
            fetchSessionHosts(setSessionHosts);
        }
    }, [selectedReport]);

    return (
        <div className="upload-document-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>Reports</h1>
            </header>
            <form className="upload-document-form">
                <div className="in-row-input">
                    <div className="form-group">
                        <select style={{ margin: "0px" }} onChange={(e) => setSelectedReport(e.target.value)}>
                            <option value="">Select a Report</option>
                            {reports.map((report) => (
                                <option key={report.id} value={report.id}>
                                    {report.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {["Student_Attendance_Report_for_a_Specific_Session",
                        "Sessions_Conducted_in_a_Specific_or_All_states",
                        "Total_Number_of_Labs_per_School",
                        "Schools_Grouped_by_State",
                        "Sessions_Conducted_by_a_Specific_Host",
                        "Recently_Added_Equipment_for_a_period",
                        "Allocations_Made_in_past",
                        "Labs_Added_in_past"].includes(selectedReport) && (
                            <div className="form-group">
                                <select style={{ margin: "0px" }} onChange={(e) => setParameter(e.target.value)}>
                                    <option value="">{selectedLabel}</option>
                                    {selectedReport === "Student_Attendance_Report_for_a_Specific_Session" && sessions.map((session) => (
                                        <option key={session.id} value={session.id}>
                                            {session.session_title}
                                        </option>
                                    ))}

                                    {selectedReport === "Sessions_Conducted_in_a_Specific_or_All_states" && (
                                        <>
                                            <option value="allStates">All States</option>
                                            {states.map((state, index) => (
                                                <option key={index} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </>
                                    )}

                                    {(selectedReport === "Total_Number_of_Labs_per_School" || selectedReport === "Schools_Grouped_by_State") && (
                                        <>
                                            {states.map((state, index) => (
                                                <option key={index} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </>
                                    )}

                                    {selectedReport === "Sessions_Conducted_by_a_Specific_Host" && sessionHosts.map((sessionHost, index) => (
                                        <option key={index} value={sessionHost}>
                                            {sessionHost}
                                        </option>
                                    ))}

                                    {selectedReport === "Recently_Added_Equipment_for_a_period" && (
                                        <>
                                            <option value="30">30 Days</option>
                                            <option value="60">60 Days</option>
                                            <option value="90">90 Days</option>
                                        </>
                                    )}
                                    {(selectedReport === "Allocations_Made_in_past" || selectedReport === "Labs_Added_in_past") && (
                                        <>
                                            <option value="30">30 Days</option>
                                            <option value="60">60 Days</option>
                                            <option value="90">90 Days</option>
                                            <option value="180">180 Days</option>
                                            <option value="365">365 Days</option>
                                            <option value="1000">1000 Days</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        )}

                    {["Fetch_Student_Data_by_Aadhar"].includes(selectedReport) && (
                        <div className="form-group">
                            <input
                                style={{ margin: "0px" }}
                                type="text"
                                value={parameter}
                                onChange={(e) => {
                                    if (/^\d{0,12}$/.test(e.target.value)) {
                                        setParameter(e.target.value);
                                    }
                                }}
                                placeholder="Enter Student Aadhar"
                                autoComplete="off"
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <button onClick={(e) => downloadReport(e, role, selectedReport, parameter, setParameter)}>Download</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Reports;