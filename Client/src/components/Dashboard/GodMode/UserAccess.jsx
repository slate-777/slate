import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Oval } from 'react-loader-spinner'
import { fetchToken, fetchUsers, handleChangeUserRole, handleSuspendUser, handleUpdateUserDetails, handleDeleteUser } from '../ApiHandler/usersFunctions';
import { fetchStates } from '../ApiHandler/schoolFunctions';
import { fetchExistingLabTypes } from '../ApiHandler/labFunctions';
import { exportToUserCSV, exportToUserExcel, exportToPDF, handlePrint } from '../../utils/Utils';
import { handleCreateUser } from '../ApiHandler/authFunctions';
import usePagination from '../../hooks/usePagination';
import ConfirmationModal from '../../utils/ConfirmationModal';

const UserAccess = () => {
    const [users, setUsers] = useState([]);  // User Data like id, username, email and role_id
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);  // LoggedIn user id
    const [searchQuery, setSearchQuery] = useState("");        // Search Query
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility
    const [editPopupOpen, setEditPopupOpen] = useState(false); // Popup visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([]);
    const [newUser, setNewUser] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        userType: "",
        state: "",
        assignedLab: ""
    });
    const [availableLabs, setAvailableLabs] = useState([]);

    useEffect(() => {
        fetchToken(setCurrentUserId);
        fetchUsers(setUsers);
        fetchStates(setStates);
        // Fetch lab types for admin to assign
        fetchExistingLabTypes(setAvailableLabs);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser(prev => ({ ...prev, [name]: value }));
    };

    const confirmHandleDeleteUser = (userId, userEmail) => {
        setModalAction(() => () => handleDeleteUser(userId, userEmail, currentUserId, setUsers, users));
        setIsModalOpen(true);
    };

    const handleConfirmAction = () => {
        setIsModalOpen(false);
        if (modalAction) modalAction();
    };

    const handleEditUserDetails = (user) => {
        const [fname, lname] = user.username.split(' ');
        setSelectedUser({ ...user, fname: fname || "", lname: lname || "" });
        setEditPopupOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
    } = usePagination(filteredUsers, 10);

    return (
        <div className="artifacts-container">
            <ToastContainer />
            <ConfirmationModal
                isOpen={isModalOpen}
                title="Confirm Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                onConfirm={handleConfirmAction}
                onCancel={() => setIsModalOpen(false)}
            />
            <header
                className="artifacts-header"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h1>User Access</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {loading ? <Oval height="20" width="20" color="blue" ariaLabel="loading" /> : ''}
                    <button
                        type="button"
                        style={{
                            backgroundColor: '#007BFF',
                            padding: '8px 10px',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setIsPopupOpen(true)}
                    >
                        Create User
                    </button>
                </div>
            </header>
            <div className="artifacts-table-container">
                <div className='header-select-entries'>
                    <th className='select-entries'>Show
                        <select onChange={handleEntriesChange} value={entriesPerPage}>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>entries
                    </th>
                    <th>
                        <div className="table-buttons">
                            <button onClick={() => exportToUserCSV(filteredUsers, 'DMS Users.csv')}>CSV</button>
                            <button onClick={() => exportToUserExcel(filteredUsers, 'DMS Users.xlsx')}>Excel</button>
                            <button onClick={() => exportToPDF('.artifacts-table', 'DMS Users.pdf')}>PDF</button>
                            <button onClick={() => handlePrint('.artifacts-table-container')}>Print</button>
                        </div>
                    </th>
                    <th className='user-search'>
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Type Name or Email..."
                            className="user-search-bar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </th>
                </div>
                <div className="artifacts-table-view">
                    <table className="artifacts-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>State & Lab</th>
                                <th>Current Role</th>
                                <th>Delete User</th>
                                <th>Change User Role</th>
                                <th>Suspend User</th>
                                <th>Edit Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEntries.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.state ? (
                                            <>
                                                <div><strong>State:</strong> {user.state}</div>
                                                {user.assignedLab && <div><strong>Lab:</strong> {user.assignedLab}</div>}
                                            </>
                                        ) : (
                                            <span style={{ color: '#999' }}>N/A</span>
                                        )}
                                    </td>
                                    <td>
                                        {user.role_id === 1 ? (
                                            <span className="admin-role">
                                                <i className="bx bx-crown"></i> Admin
                                            </span>
                                        ) : user.role_id === 2 ? (
                                            <span className="user-role">
                                                <i className="bx bx-user"></i> Mentor
                                            </span>
                                        ) : user.role_id === 3 ? (
                                            <span className="user-role">
                                                <i className="bx bx-user"></i> State Officer
                                            </span>
                                        ) : (
                                            <span className="unknown-role">
                                                <i className="bx bx-help-circle"></i> Unknown Role
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => confirmHandleDeleteUser(user.id, user.email)}
                                            disabled={user.id === currentUserId}
                                            style={{
                                                opacity: user.id === currentUserId ? 0.5 : 1,
                                                cursor: user.id === currentUserId ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            <i className='bx bx-trash'></i> Delete
                                        </button>
                                    </td>
                                    <td>
                                        <select
                                            className="role-select-dropdown"
                                            value={user.role_id}
                                            onChange={(e) => handleChangeUserRole(user.id, user.email, parseInt(e.target.value), currentUserId, setUsers, users)}
                                        >
                                            <option value={1}>Admin</option>
                                            <option value={2}>Mentor</option>
                                            <option value={3}>State Officer</option>
                                        </select>
                                    </td>
                                    <td>
                                        <label className="switch">
                                            <div className='in-row-input'>
                                                <input
                                                    type="checkbox"
                                                    checked={user.status === 'inactive'}
                                                    disabled={loading}
                                                    onChange={(e) => handleSuspendUser(e, user.id, currentUserId, user.username, user.email, user.status, setUsers, setLoading)}
                                                />
                                                <span className="slider round"></span>
                                            </div>
                                        </label>
                                    </td>
                                    <td><a href="# " className="edit-link" onClick={() => handleEditUserDetails(user)}>✏️ Edit</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
            </div>
            <div className="usage-instructions">
                <h2>📢 Usage Instructions</h2>
                <ul>
                    <li><i className='bx bx-paper-plane'></i> User role can be changed.</li>
                    <li><i className='bx bx-paper-plane'></i> The logged-in user can't suspend or change their own role.</li>
                    <li><i className='bx bx-paper-plane'></i> All activities done here will be logged.</li>
                    <li><i className='bx bx-paper-plane'></i> Suspended users will not be able to log in.</li>
                    <li><i className='bx bx-paper-plane'></i> State Officers and Mentors must be assigned to a specific state and lab.</li>
                    <li><i className='bx bx-paper-plane'></i> Users will only see data related to their assigned state and lab.</li>
                    <li><i className='bx bx-paper-plane'></i> Admin can delete users, but cannot delete themselves.</li>
                </ul>
            </div>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="add-user-popup">
                        <h2>Register New User</h2>
                        <form>
                            <div>
                                {/* <label>First Name:</label> */}
                                <input
                                    type="text"
                                    name="fname"
                                    placeholder='First Name'
                                    value={newUser.fname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                {/* <label>Last Name:</label> */}
                                <input
                                    type="text"
                                    name="lname"
                                    placeholder='Last Name'
                                    value={newUser.lname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                {/* <label>Email:</label> */}
                                <input
                                    type="email"
                                    name="email"
                                    placeholder='Email'
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                {/* <label>Phone:</label> */}
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder='Phone'
                                    maxLength={10}
                                    value={newUser.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                {/* <label>User Type:</label> */}
                                <select
                                    name="userType"
                                    value={newUser.userType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select User Type</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Mentor">Mentor</option>
                                    <option value="State Officer">State Officer</option>
                                </select>
                            </div>
                            {newUser.userType !== 'Admin' && (
                                <>
                                    <div>
                                        {/* <label>State:</label> */}
                                        <select
                                            name="state"
                                            value={newUser.state}
                                            onChange={handleInputChange}
                                            required={newUser.userType !== 'Admin'}
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state, index) => (
                                                <option key={index} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        {/* <label>Assign Lab:</label> */}
                                        <select
                                            name="assignedLab"
                                            value={newUser.assignedLab}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Lab Type to Assign</option>
                                            {availableLabs.length > 0 ? (
                                                availableLabs.map((lab) => (
                                                    <option key={lab.lab_type_id} value={lab.lab_type_id}>
                                                        {lab.lab_type_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No labs available</option>
                                            )}
                                        </select>
                                        <small style={{ color: '#666', fontSize: '12px' }}>
                                            {availableLabs.length} lab type(s) available
                                        </small>
                                    </div>
                                </>
                            )}
                            <div className="popup-actions">
                                <button type="submit" className="save-btn" onClick={(e) => handleCreateUser(e, newUser, setNewUser, setLoading, setIsPopupOpen)} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setIsPopupOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {editPopupOpen && selectedUser && (
                <div className="popup-overlay">
                    <div className="add-user-popup">
                        <h2>Edit User Details</h2>
                        <form>
                            <div>
                                <label>{selectedUser.email}</label>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="fname"
                                    placeholder='First Name'
                                    value={selectedUser.fname}
                                    onChange={handleUpdateChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="lname"
                                    placeholder='Last Name'
                                    value={selectedUser.lname}
                                    onChange={handleUpdateChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder='Phone'
                                    maxLength={10}
                                    value={selectedUser.phone}
                                    onChange={handleUpdateChange}
                                    required
                                />
                            </div>
                            {selectedUser.role_id !== 1 && (
                                <>
                                    <div>
                                        <select
                                            name="state"
                                            value={selectedUser.state}
                                            onChange={handleUpdateChange}
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state, index) => (
                                                <option key={index} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <select
                                            name="assignedLab"
                                            value={selectedUser.assignedLab || ""}
                                            onChange={handleUpdateChange}
                                        >
                                            <option value="">Select Lab to Assign</option>
                                            {availableLabs.length > 0 ? (
                                                availableLabs.map((lab) => (
                                                    <option key={lab.lab_type_id} value={lab.lab_type_id}>
                                                        {lab.lab_type_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No lab types available</option>
                                            )}
                                        </select>
                                        <small style={{ color: '#666', fontSize: '12px' }}>
                                            {availableLabs.length} lab type(s) available
                                        </small>
                                    </div>
                                </>
                            )}
                            <div className="popup-actions">
                                <button type="submit" className="save-btn" onClick={(e) => handleUpdateUserDetails(e, selectedUser, setLoading, setEditPopupOpen)} disabled={loading}>
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setEditPopupOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserAccess;