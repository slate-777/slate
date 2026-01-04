import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserState } from '../ApiHandler/usersFunctions';
import { handleEditSchoolData, handleDisableSchool, fetchStates, fetchDistricts } from '../ApiHandler/schoolFunctions';

const EditSchoolData = ({ role, editFormData, handleClose }) => {
    const [newSchoolData, setNewSchoolData] = useState({ ...editFormData });
    const [schoolStatus, setSchoolStatus] = useState(editFormData.school_status);
    const [userState, setUserState] = useState("");
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setNewSchoolData(prevData => ({
            ...prevData,
            [name]: value
        }));

        if (name === "state") {
            await fetchDistricts(value, setDistricts);
        }
    };

    useEffect(() => {
        fetchUserState(setUserState);
        fetchStates(setStates);
        fetchDistricts(editFormData.state, setDistricts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync userState with schoolData.state when role is not 1
    useEffect(() => {
        if (role !== 1 && userState) {
            setNewSchoolData((prevData) => ({
                ...prevData,
                state: userState,
            }));
            fetchDistricts(userState, setDistricts);

        }
    }, [role, userState]);

    return (
        <div className="edit-document-container my-entries-edit-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>{role === 3 ? 'View School Data' : 'Edit School Data'}</h1>
            </header>
            <form className="edit-document-form" onSubmit={(e) => e.preventDefault()}>
                {/* <div className="form-group">
                    <label>School ID</label>
                    <span className="document-id">{newSchoolData.school_id}</span>
                </div> */}
                <div className="form-group">
                    <label>School Name <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="school_name"
                        value={newSchoolData.school_name}
                        onChange={handleChange}
                        maxLength={150}
                        placeholder="Enter School Name"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>UDISE <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="udise"
                        value={newSchoolData.udise}
                        onChange={(e) => {
                            if (/^\d{0,11}$/.test(e.target.value)) {
                                handleChange(e);
                            }
                        }}
                        placeholder="Enter UDISE"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                {(role === 1 ? (
                    <div className="form-group">
                        <label>State <m style={{ color: 'red' }}>*</m></label>
                        <select
                            name="state"
                            value={newSchoolData.state}
                            onChange={handleChange}
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
                ) : (
                    <div className="form-group">
                        <label>State <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="text"
                            name="state"
                            value={userState}
                            onChange={handleChange}
                            readOnly
                            required
                        />
                    </div>
                ))}
                <div className="form-group">
                    <label>District <m style={{ color: 'red' }}>*</m></label>
                    <select
                        name="district"
                        value={newSchoolData.district}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select District</option>
                        {districts.map((district, index) => (
                            <option key={index} value={district}>
                                {district}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Pincode <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="pincode"
                        value={newSchoolData.pincode}
                        onChange={handleChange}
                        placeholder="Enter Pincode"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Address <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="address"
                        value={newSchoolData.address}
                        onChange={handleChange}
                        placeholder="Enter School Address"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Geo Location <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="geo_location"
                        value={newSchoolData.geo_location}
                        onChange={handleChange}
                        placeholder="Enter Geo Location"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>School Email ID</label>
                    <input
                        type="text"
                        name="school_email_id"
                        value={newSchoolData.school_email_id}
                        onChange={handleChange}
                        placeholder="Enter School Email ID (Optional)"
                        autoComplete='off'
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Primary Contact Person <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="primary_contact_person"
                        value={newSchoolData.primary_contact_person}
                        onChange={handleChange}
                        placeholder="Enter Primary Contact Person"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Contact No <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="contact_no"
                        value={newSchoolData.contact_no}
                        onChange={handleChange}
                        placeholder="Enter Contact No"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Total Students <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="total_students"
                        value={newSchoolData.total_students}
                        onChange={handleChange}
                        placeholder="Enter Total No. Of Students"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-actions">
                    {/* <button
                        type="button"
                        className="delete-btn"
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the school`)) {
                                handleDeleteSchool(editFormData.id, schools, setSchools, handleClose);
                            }
                        }}>Delete School
                    </button> */}
                    {role === 1 && (
                        <button
                            type="button"
                            style={{ backgroundColor: '#fc7465' }}
                            className="delete-btn"
                            onClick={() => handleDisableSchool(editFormData.id, editFormData.school_name, schoolStatus, setSchoolStatus)}> {schoolStatus === 0 ? 'Enable School' : 'Disable School'}
                        </button>
                    )}
                    <div>
                        <button type="button" className="cancel-btn" onClick={handleClose}>{role === 3 ? 'Back' : 'Cancel'}</button>
                        {role !== 3 && (
                            <button type="button" className="update-btn" onClick={(e) => handleEditSchoolData(e, editFormData.id, newSchoolData)}>Update</button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditSchoolData;
