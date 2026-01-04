import React, { useState, useEffect } from 'react';
import docLogo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
import { handleLogout } from './ApiHandler/authFunctions';

const Sidebar = ({ handleDashboardAgain, handleDashboard, handleClick, role, controlAccess, isSidebarOpen, setIsSidebarOpen }) => {
    const [isLibraryOpen, setIsLibraryOpen] = useState(false); // To open Manage section
    const [isSchoolOpen, setIsSchoolOpen] = useState(false); // To open School section
    const [isGodModeOpen, setIsGodModeOpen] = useState(false); // To open God Mode section
    const [activeOption, setActiveOption] = useState(localStorage.getItem('activeOption') || 'home');

    useEffect(() => {
        localStorage.setItem('activeOption', activeOption);
    }, [activeOption]);

    // Function to manage sidebar css
    const handleSlideBarClick = (item) => {
        setActiveOption(item);
        if (window.innerWidth <= 768) { // Close sidebar on mobile after click
            setIsSidebarOpen(false);
        }
    };

    const toggleLibrary = () => {
        setIsLibraryOpen(!isLibraryOpen);
        setIsSchoolOpen(false); // Close School Section when Manage is opened
        setIsGodModeOpen(false); // Close God Mode when Manage is opened
    };

    const toggleSchool = () => {
        setIsSchoolOpen(!isSchoolOpen);
        setIsLibraryOpen(false); // Close Manage when School Section is opened
        setIsGodModeOpen(false); // Close God Mode when School Section is opened
    };

    const toggleGodMode = () => {
        setIsGodModeOpen(!isGodModeOpen);
        setIsLibraryOpen(false); // Close Manage when God Mode is opened
        setIsSchoolOpen(false); // Close School Section when God Mode is opened
    };

    const navigate = useNavigate();

    return (
        <section id="sidebar" className={isSidebarOpen ? '' : 'hide'}>
            <a href="# " className="brand">
                <img src={docLogo} alt="logo" />
                <span className="text">SLATE</span>
            </a>
            <ul className="side-menu top">
                <li className={activeOption === 'home' ? 'active' : ''}>
                    <a href="# " onClick={() => { handleSlideBarClick('home'); handleClick('home'); handleDashboardAgain(); }}>
                        <i className='bx bxs-dashboard'></i>
                        <span className="text">Dashboard</span>
                    </a>
                </li>
                <li className={activeOption === 'school' ? 'active' : ''}>
                    <a href="# " onClick={() => { handleSlideBarClick('school'); toggleSchool(); }}>
                        <i className='bx bxs-school'></i>
                        <span className="text">School</span>
                        <i className={`bx ${isSchoolOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`} style={{ marginLeft: 'auto' }}></i>
                    </a>
                </li>
                <ul className={`submenu ${isSchoolOpen ? 'open' : ''}`}>
                    {(role === 1 || role === 2) && (
                        <>
                            {controlAccess.school === 1 && (
                                <li className={activeOption === 'addSchool' ? 'active' : ''}>
                                    <a href="# " onClick={() => { handleSlideBarClick('addSchool'); handleClick('addSchool'); handleDashboard() }}>
                                        <i className='bx bx-plus'></i>
                                        <span className="text">Add School</span>
                                    </a>
                                </li>
                            )}
                            {controlAccess.lab === 1 && (
                                <li className={activeOption === 'addLab' ? 'active' : ''}>
                                    <a href="# " onClick={() => { handleSlideBarClick('addLab'); handleClick('addLab'); handleDashboard() }}>
                                        <i className='bx bx-test-tube'></i>
                                        <span className="text">Tag Lab to School</span>
                                    </a>
                                </li>
                            )}
                            {controlAccess.equipment === 1 && (
                                <li className={activeOption === 'addEquipment' ? 'active' : ''}>
                                    <a href="# " onClick={() => { handleSlideBarClick('addEquipment'); handleClick('addEquipment'); handleDashboard() }}>
                                        <i className='bx bx-wrench'></i>
                                        <span className="text">Add Equipment</span>
                                    </a>
                                </li>
                            )}
                            {controlAccess.equipment_allocation === 1 && (
                                <li className={activeOption === 'equipmentAllocation' ? 'active' : ''}>
                                    <a href="# " onClick={() => { handleSlideBarClick('equipmentAllocation'); handleClick('equipmentAllocation'); handleDashboard() }}>
                                        <i className='bx bx-box'></i>
                                        <span className="text">Equipment Allocation</span>
                                    </a>
                                </li>
                            )}
                            {controlAccess.session === 1 && (
                                <li className={activeOption === 'sessionSetup' ? 'active' : ''}>
                                    <a href="# " onClick={() => { handleSlideBarClick('sessionSetup'); handleClick('sessionSetup'); handleDashboard() }}>
                                        <i className='bx bx-calendar'></i>
                                        <span className="text">Session Setup</span>
                                    </a>
                                </li>
                            )}
                        </>
                    )}
                    <li className={activeOption === 'myEntries' ? 'active' : ''}>
                        <a href="# " onClick={() => { handleSlideBarClick('myEntries'); handleClick('myEntries'); handleDashboard() }}>
                            <i className='bx bx-clipboard' ></i>
                            <span className="text">My entries - All Entries</span>
                        </a>
                    </li>
                    <li className={activeOption === 'satheeStudentRegistration' ? 'active' : ''}>
                        <a href="# " onClick={() => { handleSlideBarClick('satheeStudentRegistration'); handleClick('satheeStudentRegistration'); handleDashboard() }}>
                            <i className='bx bx-user-plus' ></i>
                            <span className="text">Sathee Registration</span>
                        </a>
                    </li>
                </ul>
                <li className={activeOption === 'library' ? 'active' : ''}>
                    <a href="# " onClick={() => { handleSlideBarClick('library'); toggleLibrary(); }}>
                        <i className='bx bx-library'></i>
                        {/* <i className='bx bx-brush-alt'></i> */}
                        <span className="text">Library</span>
                        <i className={`bx ${isLibraryOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`} style={{ marginLeft: 'auto' }}></i>
                    </a>
                </li>
                <ul className={`submenu ${isLibraryOpen ? 'open' : ''}`}>
                    <li className={activeOption === 'search' ? 'active' : ''}>
                        <a href="# " onClick={() => { handleSlideBarClick('search'); handleClick('search'); handleDashboard(); }}>
                            <i className='bx bx-search'></i>
                            <span className="text">Search</span>
                        </a>
                    </li>
                    <li className={activeOption === 'myArtifacts' ? 'active' : ''}>
                        <a href="# " onClick={() => { handleSlideBarClick('myArtifacts'); handleClick('myArtifacts'); handleDashboard() }}>
                            <i className='bx bx-folder-open'></i>
                            <span className="text">My Artifacts</span>
                        </a>
                    </li>
                    <li className={activeOption === 'uploadDocuments' ? 'active' : ''}>
                        <a href="# " onClick={() => { handleSlideBarClick('uploadDocuments'); handleClick('upload'); handleDashboard() }}>
                            <i className='bx bx-upload'></i>
                            <span className="text">Upload Document</span>
                        </a>
                    </li>
                    <li className={activeOption === 'addUrl' ? 'active' : ''}>
                        <a href="# " onClick={() => { handleSlideBarClick('addUrl'); handleClick('addUrl'); handleDashboard() }}>
                            <i className='bx bx-link'></i>
                            <span className="text">Add URL</span>
                        </a>
                    </li>
                </ul>
                {role === 1 && ( // Only render God Mode if role is admin
                    <>
                        <li className={activeOption === 'godMode' ? 'active' : ''}>
                            <a href="# " className='godText' onClick={() => { handleSlideBarClick('godMode'); toggleGodMode() }}>
                                <i className='bx bx-crown'></i>
                                <span className="text">God Mode</span>
                                <i className={`bx ${isGodModeOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`} style={{ marginLeft: 'auto' }}></i>
                            </a>
                        </li>
                        <ul className={`submenu ${isGodModeOpen ? 'open' : ''}`}>
                            <li className={activeOption === 'systemSettings' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('systemSettings'); handleClick('systemSettings'); handleDashboard() }}>
                                    <i className='bx bx-cog'></i>
                                    <span className="text">System Settings</span>
                                </a>
                            </li>
                            <li className={activeOption === 'checkUserActivity' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('checkUserActivity'); handleClick('userActivity'); handleDashboard() }}>
                                    <i className='bx bxs-user-detail'></i>
                                    <span className="text">Check User Activity</span>
                                </a>
                            </li>
                            <li className={activeOption === 'changeUserAccess' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('changeUserAccess'); handleClick('userAccess'); handleDashboard() }}>
                                    <i className='bx bx-accessibility'></i>
                                    <span className="text">User Access</span>
                                </a>
                            </li>
                            <li className={activeOption === 'controlAccess' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('controlAccess'); handleClick('controlAccess'); handleDashboard() }}>
                                    <i className='bx bx-street-view'></i>
                                    <span className="text">RBAC</span>
                                </a>
                            </li>
                            <li className={activeOption === 'addLabType' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('addLabType'); handleClick('addLabType'); handleDashboard() }}>
                                    <i className='bx bxs-flask'></i>
                                    <span className="text">Add Lab Type</span>
                                </a>
                            </li>
                            <li className={activeOption === 'defineDocumentType' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('defineDocumentType'); handleClick('defineDocType'); handleDashboard() }}>
                                    <i className='bx bx-file'></i>
                                    <span className="text">Define Document Type</span>
                                </a>
                            </li>
                            <li className={activeOption === 'manageAllArtifacts' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('manageAllArtifacts'); handleClick('manageAllArtifacts'); handleDashboard() }}>
                                    <i className='bx bxl-firebase'></i>
                                    <span className="text">Manage All Artifacts</span>
                                </a>
                            </li>
                            <li className={activeOption === 'editTags' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('editTags'); handleClick('editTags'); handleDashboard() }}>
                                    <i className='bx bx-purchase-tag'></i>
                                    <span className="text">Edit Tags</span>
                                </a>
                            </li>
                            <li className={activeOption === 'schoolsPage' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('schoolsPage'); handleClick('schoolsPage'); handleDashboard() }}>
                                    <i className='bx bxs-school'></i>
                                    <span className="text">Manage Schools & Labs</span>
                                </a>
                            </li>
                            <li className={activeOption === 'manageGrievances' ? 'active' : ''}>
                                <a href="# " onClick={() => { handleSlideBarClick('manageGrievances'); handleClick('manageGrievances'); handleDashboard() }}>
                                    <i className='bx bx-support'></i>
                                    <span className="text">Manage Grievances</span>
                                </a>
                            </li>
                        </ul>
                    </>
                )}
                {controlAccess.reports === 1 && (
                    <li className={activeOption === 'reports' ? 'active' : ''}>
                        <a href="# " onClick={() => { handleSlideBarClick('reports'); handleClick('reports'); handleDashboard(); }}>
                            <i className='bx bx-pie-chart-alt-2' ></i>
                            <span className="text">Reports</span>
                        </a>
                    </li>
                )}
                <li className={activeOption === 'myProfile' ? 'active' : ''}>
                    <a href="# " onClick={() => { handleSlideBarClick('myProfile'); handleClick('myProfile'); handleDashboard(); }}>
                        <i className='bx bx-user' ></i>
                        <span className="text">My Profile</span>
                    </a>
                </li>
                <li className={activeOption === 'grievance' ? 'active' : ''}>
                    <a href="# " onClick={() => { handleSlideBarClick('grievance'); handleClick('grievance'); handleDashboard(); }}>
                        <i className='bx bx-support' ></i>
                        <span className="text">Grievance</span>
                    </a>
                </li>
                <li>
                    <a href="# " className="logout" onClick={() => { handleLogout(navigate) }}>
                        <i className='bx bx-log-out-circle'></i>
                        <span className="text">Logout</span>
                    </a>
                </li>
            </ul>
        </section>
    );
};

export default Sidebar;