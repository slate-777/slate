import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Search from './Manage/Search';
import MyArtifacts from './Manage/MyArtifacts';
import Upload from './Manage/Upload';
import AddUrl from './Manage/AddUrl';
import AddSchool from './School/AddSchool';
import AddLabType from './School/AddLabType';
import AddLab from './School/AddLab';
import AddEquipment from './School/AddEquipment';
import EquipmentAllocation from './School/EquipmentAllocation';
import MyEntries from './School/AllEntries';
import SessionSetup from './School/SessionSetup';
import SatheeStudentRegistration from './School/SatheeStudentRegistration';
import SchoolsPage from './DetailPages/SchoolsPage';
import SystemSettings from './GodMode/SystemSettings';
import UserActivity from './GodMode/UserActivity';
import UserAccess from './GodMode/UserAccess';
import ControlAccess from './GodMode/ControlAccess'
import ManageAllArtifacts from './GodMode/ManageAllArtifacts';
import EditTags from './GodMode/EditTags';
import DefineDocType from './GodMode/DefineDocType';
import ManageGrievances from './GodMode/ManageGrievances';
import MyProfile from './MyProfile';
import Reports from './Reports';
import Grievance from './Grievance/Grievance';
import { verifyUser } from './ApiHandler/authFunctions';
import { getControlAcessInfo, fetchUserState } from './ApiHandler/usersFunctions';

// All dashboard components initial states (Home is set to true by default)
const initialState = {
    home: true,
    search: false,
    myArtifacts: false,
    upload: false,
    addUrl: false,
    addSchool: false,
    addLabType: false,
    addLab: false,
    addEquipment: false,
    equipmentAllocation: false,
    myEntries: false,
    sessionSetup: false,
    satheeStudentRegistration: false,
    schoolsPage: false,
    systemSettings: false,
    userActivity: false,
    userAccess: false,
    controlAccess: false,
    manageAllArtifacts: false,
    editTags: false,
    defineDocType: false,
    manageGrievances: false,
    myProfile: false,
    reports: false,
    grievance: false,
};

function Dashboard() {
    const [isDashboard, setIsDashboard] = useState(true);
    const [activeSection, setActiveSection] = useState(initialState);
    const [username, setUsername] = useState("");  // Username to show on header
    const [role, setRole] = useState(null);  // Role ID (If 1 then Admin, 0 for user cannot access God Mode )
    const [userState, setUserState] = useState(""); // Logged in user's state
    const [assignedLab, setAssignedLab] = useState(""); // Logged in user's assigned lab
    const [auth, setAuth] = useState(false); // To check if user is authentic or not
    const [message, setMessage] = useState(""); // To store message from API
    const [controlAccess, setControlAccess] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768); // To hide and show sidebar

    // To toggle(hide and show) sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // To hide dashboard home 
    const handleDashboard = () => {
        setIsDashboard(false);
    };

    // To show dashboard home 
    const handleDashboardAgain = () => {
        setIsDashboard(true);
    };

    // If the user is authenticate then the dashboard will be visible
    useEffect(() => {
        verifyUser(setAuth, setUsername, null, setRole, setMessage, setAssignedLab);
        getControlAcessInfo(setControlAccess);
        fetchUserState(setUserState);

        const savedSection = localStorage.getItem("activeSection");
        if (savedSection) {
            setActiveSection({ ...initialState, [savedSection]: true });
            setIsDashboard(savedSection === "home");
        } else {
            // If no saved section, keep home as active
            setActiveSection(initialState);
            setIsDashboard(true);
        }
    }, []);

    // Function to navigate the sidebar 
    const handleClick = (clicked) => {
        setActiveSection({ ...initialState, [clicked]: true });
        setIsDashboard(clicked === "home");  // Update isDashboard based on selection
        localStorage.setItem("activeSection", clicked);
    };

    const navigate = useNavigate();

    return (
        <div>
            {auth ? (
                <div>
                    <Sidebar
                        handleDashboardAgain={handleDashboardAgain}
                        handleDashboard={handleDashboard}
                        handleClick={handleClick}
                        role={role}
                        controlAccess={controlAccess}
                        setIsSidebarOpen={setIsSidebarOpen}
                        isSidebarOpen={isSidebarOpen}
                    />
                    <section id="content">
                        <Header username={username} role={role} userState={userState} assignedLab={assignedLab} toggleSidebar={toggleSidebar} />
                        {activeSection.home && isDashboard && <Home handleClick={handleClick} setIsSidebarOpen={setIsSidebarOpen} />}
                        {activeSection.search && <Search />}
                        {activeSection.myArtifacts && <MyArtifacts />}
                        {activeSection.upload && <Upload />}
                        {activeSection.addUrl && <AddUrl />}
                        {activeSection.addSchool && <AddSchool role={role} />}
                        {activeSection.addLabType && <AddLabType />}
                        {activeSection.addLab && <AddLab />}
                        {activeSection.addEquipment && <AddEquipment />}
                        {activeSection.equipmentAllocation && <EquipmentAllocation />}
                        {activeSection.myEntries && <MyEntries role={role} />}
                        {activeSection.sessionSetup && <SessionSetup />}
                        {activeSection.satheeStudentRegistration && <SatheeStudentRegistration />}
                        {activeSection.schoolsPage && <SchoolsPage />}
                        {activeSection.systemSettings && <SystemSettings />}
                        {activeSection.userActivity && <UserActivity />}
                        {activeSection.userAccess && <UserAccess />}
                        {activeSection.controlAccess && <ControlAccess />}
                        {activeSection.defineDocType && <DefineDocType />}
                        {activeSection.manageAllArtifacts && <ManageAllArtifacts />}
                        {activeSection.editTags && <EditTags />}
                        {activeSection.manageGrievances && <ManageGrievances />}
                        {activeSection.myProfile && <MyProfile />}
                        {activeSection.reports && <Reports role={role} />}
                        {activeSection.grievance && <Grievance />}
                    </section>
                </div>
            ) : (
                // Navigate to sign in page
                <div className="auth-heading">
                    <h1>{message}</h1>
                    <button onClick={() => { navigate("/") }}>Sign In</button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;