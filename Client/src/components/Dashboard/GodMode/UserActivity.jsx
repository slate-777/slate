import { useState, useEffect } from "react";
import moment from 'moment';
import { fetchUsers, handleUserActivitySubmit } from '../ApiHandler/usersFunctions';
import { exportToUserActivityCSV, exportToUserActivityExcel, exportToPDF, handlePrint } from '../../utils/Utils';
import usePagination from '../../hooks/usePagination';

const UserActivity = () => {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [period, setPeriod] = useState("7");
    const [userActivity, setUserActivity] = useState([]);
    const [activitySection, setActivitySection] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchUsers(setUsers);
    }, []);

    const handleUserChange = (e) => {
        const selectedUserId = e.target.value;
        setUserId(selectedUserId);

        const selectedUser = users.find(user => String(user.id) === selectedUserId);
        setUserEmail(selectedUser ? selectedUser.email : "");
    };

    const filteredUserActivity = userActivity.filter(activity =>
        activity.log_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.activity.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const {
        currentPage,
        entriesPerPage,
        currentEntries,
        handlePageChange,
        handleEntriesChange,
        totalEntries,
        startEntry,
        endEntry,
        totalPages
    } = usePagination(filteredUserActivity, 10);
    return (
        <div className="artifacts-container">
            <header className="artifacts-header">
                <h1>User Activity</h1>
            </header>
            <div className="artifacts-table-container user-activity">
                <div className="log-search">
                    <label>Users</label>
                    <select value={userId} onChange={handleUserChange}>
                        <option value="">Select</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.email}
                            </option>
                        ))}
                    </select>
                    <label>Period</label>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option value="7">Last 7 days</option>
                        <option value="14">Last 14 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="180">Last 6 Months</option>
                        <option value="365">Last 1 Year</option>
                    </select>
                    <button
                        className="user-activity-button"
                        onClick={() => handleUserActivitySubmit(userId, userEmail, period, setUserActivity, setActivitySection)}
                    >Track</button>
                </div>
                {activitySection && (
                    <div className="artifacts-table-view">
                        <div className='header-select-entries'>
                            <th className='select-entries'>Show
                                <select onChange={handleEntriesChange} value={entriesPerPage}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>entries</th>
                            <th colSpan="4">
                                <div className="table-buttons">
                                    <button onClick={() => exportToUserActivityCSV(filteredUserActivity, `${userEmail}_activity_log.csv`)}>CSV</button>
                                    <button onClick={() => exportToUserActivityExcel(filteredUserActivity, `${userEmail}_activity_log.xlsx`)}>Excel</button>
                                    <button onClick={() => exportToPDF('.artifacts-table', `${userEmail}_activity_log.pdf`)}>PDF</button>
                                    <button onClick={() => handlePrint('.artifacts-table-container')}>Print</button>
                                </div>
                            </th>
                            <th className='user-search'>
                                <label>Search</label>
                                <input
                                    type="text"
                                    placeholder="Type here..."
                                    className="user-search-bar"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </th>
                        </div>
                        <table className="artifacts-table">
                            <thead>
                                <tr>
                                    <th>Log ID</th>
                                    <th>Activity</th>
                                    <th>Log Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.log_id}</td>
                                        <td>{item.activity}</td>
                                        <td>{moment(item.log_date).format('DD-MM-YY HH:mm:ss')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activitySection && (
                    <div className="pagination">
                        <p>Showing {startEntry} to {endEntry} of {totalEntries} entries</p>
                        <div className="pagination-buttons">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={currentPage === i + 1 ? "active" : ""}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="usage-instructions">
                <h2>📢 Usage Instructions</h2>
                <ul>
                    <li><i className='bx bx-paper-plane'></i> Choose from the available users in the list.</li>
                    <li><i className='bx bx-paper-plane'></i> You may select maximum of 1 user.</li>
                    <li><i className='bx bx-paper-plane'></i> If user you are trying to track is not available, then punch in the user id (email) and hit enter.</li>
                    <li><i className='bx bx-paper-plane'></i> By default last 7 days activities will be fetched. You may change the period as required.</li>
                </ul>
            </div>
        </div>
    );
};

export default UserActivity;