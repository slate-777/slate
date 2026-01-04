import React from 'react';
// import { IoIosNotificationsOutline } from "react-icons/io";
import profile from '../../assets/profile.png';

const Header = ({ username, role, userState, assignedLab, toggleSidebar }) => {
    // const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // const toggleDrawer = () => {
    //     setIsDrawerOpen(!isDrawerOpen);
    // };

    return (
        <nav>
            <i className='bx bx-menu' onClick={toggleSidebar}></i>
            <div className="profile">
                <div className="notification-icon">
                    {/* <IoIosNotificationsOutline size={26} onClick={toggleDrawer} /> */}
                    {/* <i className='bx bx-bell bx-sm' onClick={toggleDrawer}></i> */}
                </div>
                <p>Mr./Ms. {username}<br />
                    <span style={{ fontSize: '11px', color: '#335bb2' }}>
                        {role === 1 ? "Admin" : role === 2 ? `Mentor, ${userState}` : `State Officer, ${userState}`}
                        {assignedLab && <><br />Lab: {assignedLab}</>}
                    </span>
                </p>
                <img src={profile} alt="profile" />
            </div>
            {/* <div className={`notification-drawer ${isDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h4>Notifications</h4>
                    <i className='bx bx-x-circle' onClick={toggleDrawer}></i>
                </div>
                <div className="drawer-content">
                    <p>No new notifications</p>
                </div>
            </div> */}
        </nav>
    );
};

export default Header;