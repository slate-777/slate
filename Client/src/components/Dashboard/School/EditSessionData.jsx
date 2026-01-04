import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchActiveSchools } from '../ApiHandler/schoolFunctions';
import { fetchLabsForSchool, fetchAllLabs } from '../ApiHandler/labFunctions';
import { handleEditSessionData, handleDeleteSession } from '../ApiHandler/sessionFunctions';
import StudentList from './StudentList';
import ConfirmationModal from '../../utils/ConfirmationModal';

const EditSessionData = ({ role, editFormData, sessions, setSessions, handleClose }) => {
    const [newSessionData, setNewSessionData] = useState({ ...editFormData });
    const [schools, setSchools] = useState([]);
    const [labs, setLabs] = useState([]);
    const [showStudentList, setShowStudentList] = useState(false); // State to manage the overlay visibility
    const readOnlySection = (editFormData.session_status);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalMessage, setModalMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSessionData(prevData => ({
            ...prevData,
            [name]: value
        }));
        if (name === "school_id") {
            fetchLabsForSchool(value, setLabs);
        }
    };

    useEffect(() => {
        fetchActiveSchools(setSchools);
        fetchAllLabs(setLabs);
    }, []);

    const handleStudentListClose = () => {
        setShowStudentList(false); // Function to close the overlay
    };

    const confirmHandleDeleteSession = (sessionId, sessionTitle) => {
        setModalAction(() => () => handleDeleteSession(sessionId, sessionTitle, sessions, setSessions, handleClose));
        setModalMessage('Are you sure you want to delete the session?');
        setIsModalOpen(true);
    };

    const confirmHandleUpdateSession = (e, sessionId) => {
        e.preventDefault();
        setModalAction(() => () =>
            handleEditSessionData(e, sessionId, newSessionData, handleClose)
        );
        setModalMessage(
            `After closing the session, you won't be able to edit the details or mark the attendees. Are you sure you want to proceed?`
        );
        setIsModalOpen(true);
    };

    const handleConfirmAction = () => {
        setIsModalOpen(false);
        if (modalAction) modalAction();
    };

    return (
        <div className="edit-document-container my-entries-edit-container">
            <ToastContainer />
            <ConfirmationModal
                isOpen={isModalOpen}
                title="Confirm Action"
                message={modalMessage}
                onConfirm={handleConfirmAction}
                onCancel={() => setIsModalOpen(false)}
            />
            <header className="upload-document-header">
                <h1>{role === 3 ? 'View Session Data' : 'Edit Session Data'}</h1>
            </header>
            <form className="edit-document-form">
                {/* <div className="form-group">
                    <label>Session ID</label>
                    <span className="document-id">{newSessionData.session_id}</span>
                </div> */}
                {readOnlySection === 'closed' ? (
                    <div>
                        <div className="form-group">
                            <label>Session Title</label>
                            <h3>{editFormData.session_title}</h3>
                        </div>
                        <div className="form-group">
                            <label>Session Host</label>
                            <p>{editFormData.session_host}</p>
                        </div>
                        <div className="form-group">
                            <label>Session Date</label>
                            <p>{editFormData.session_date}</p>
                        </div>
                        <div className="form-group">
                            <label>Session Time</label>
                            <p>{editFormData.session_time}</p>
                        </div>
                        <div className="form-group">
                            <label>School Name</label>
                            <p>{editFormData.school_name}</p>
                        </div>
                        <div className="form-group">
                            <label>Lab Name</label>
                            <p>{editFormData.lab_name}</p>
                        </div>
                        <div className="form-group">
                            <label>Session Description</label>
                            <p>{editFormData.session_description}</p>
                        </div>
                        <div className="form-group">
                            <label>Session Status</label>
                            <p>{editFormData.session_status}</p>
                        </div>
                        <div className="form-group">
                            <label>Attendees Count</label>
                            <p>{editFormData.attendees_count}</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="form-group">
                            <label>Session Title <m style={{ color: 'red' }}>*</m></label>
                            <input
                                type="text"
                                name="session_title"
                                value={newSessionData.session_title}
                                onChange={handleChange}
                                placeholder="Enter Session Title"
                                autoComplete='off'
                                required
                                disabled={role === 3}
                            />
                        </div>
                        <div className="form-group">
                            <label>Session Host <m style={{ color: 'red' }}>*</m></label>
                            <input
                                type="text"
                                name="session_host"
                                value={newSessionData.session_host}
                                onChange={handleChange}
                                placeholder="Enter session host name"
                                autoComplete='off'
                                required
                                disabled={role === 3}
                            />
                        </div>
                        <div className='in-row-input'>
                            <div className="form-group">
                                <label>Session Date <m style={{ color: 'red' }}>*</m></label>
                                <input
                                    type="date"
                                    name="session_date"
                                    value={newSessionData.session_date}
                                    onChange={handleChange}
                                    placeholder="Enter Session Date"
                                    autoComplete='off'
                                    required
                                    disabled={role === 3}
                                />
                            </div>
                            <div className="form-group geo-location-container">
                                <label>Session Time <m style={{ color: 'red' }}>*</m></label>
                                <input
                                    type="text"
                                    name="session_time"
                                    value={newSessionData.session_time}
                                    onChange={handleChange}
                                    placeholder="Enter Session Time"
                                    autoComplete='off'
                                    required
                                    disabled={role === 3}
                                />
                            </div>
                        </div>
                        <div className='in-row-input'>
                            <div className="form-group">
                                <label>School Name <m style={{ color: 'red' }}>*</m></label>
                                <select
                                    name="school_id"
                                    value={newSessionData.school_id}
                                    onChange={handleChange}
                                    required
                                    disabled={role === 3}
                                >
                                    <option value="">Select</option>
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.school_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Lab Name <m style={{ color: 'red' }}>*</m></label>
                                <select
                                    name="lab_id"
                                    value={newSessionData.lab_id}
                                    onChange={handleChange}
                                    required
                                    disabled={role === 3}
                                >
                                    <option value="">Select</option>
                                    {labs.map((lab) => (
                                        <option key={lab.id} value={lab.id}>
                                            {lab.lab_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Session Description<m style={{ color: 'red' }}>*</m></label>
                            <textarea
                                type="text"
                                name="session_description"
                                value={newSessionData.session_description}
                                onChange={handleChange}
                                maxLength="300"
                                placeholder="Enter Session Description"
                                autoComplete='off'
                                required
                                disabled={role === 3}
                            />
                        </div>
                        <div className="form-group">
                            <label>Session Status <m style={{ color: 'red' }}>*</m></label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="session_status"
                                        value="open"
                                        checked={newSessionData.session_status === 'open'}
                                        onChange={handleChange}
                                        disabled={role === 3}
                                    /> Open
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="session_status"
                                        value="closed"
                                        checked={newSessionData.session_status === 'closed'}
                                        onChange={handleChange}
                                        disabled={role === 3}
                                        onClick={() => setShowStudentList(true)}
                                    /> Closed
                                </label>
                            </div>
                        </div>
                        {role !== 3 && (
                            <div className="form-group student-list-button">
                                <label>Mark Attendees</label>
                                <button type="button" onClick={() => setShowStudentList(true)}>Open List</button>
                            </div>
                        )}
                    </div>
                )}
                <div className="form-actions">
                    <div>
                        <button type="button" className="cancel-btn" onClick={handleClose}>{role === 3 ? 'Back' : 'Cancel'}</button>
                        {role !== 3 && (
                            readOnlySection === 'open' ? (
                                <button
                                    type="button"
                                    className="update-btn"
                                    onClick={(e) => {
                                        if (newSessionData.session_status === 'closed') {
                                            confirmHandleUpdateSession(e, editFormData.id);
                                        } else {
                                            handleEditSessionData(e, editFormData.id, newSessionData, handleClose);
                                        }
                                    }}
                                >
                                    Update
                                </button>
                            ) : null
                        )}
                    </div>
                    {role !== 3 && (
                        readOnlySection === 'open' ? (
                            <button
                                type="button"
                                className="delete-btn"
                                onClick={() => confirmHandleDeleteSession(newSessionData.id, newSessionData.session_title)}
                            >Delete Session
                            </button>
                        ) : null
                    )}
                </div>
            </form>
            {showStudentList && (
                <StudentList sessionId={newSessionData.id} handleStudentListClose={handleStudentListClose} />
            )}
        </div>
    );
};

export default EditSessionData;