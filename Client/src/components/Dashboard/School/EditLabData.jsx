import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchActiveSchools } from '../ApiHandler/schoolFunctions';
import { fetchExistingLabTypes, handleEditLabData, handleDisableLab } from '../ApiHandler/labFunctions';

const EditLabData = ({ role, editFormData, handleClose }) => {
    const [newLabData, setNewLabData] = useState({ ...editFormData });
    const [labTypes, setLabTypes] = useState([]);
    const [schoolNames, setSchoolNames] = useState([]);
    const [labStatus, setLabStatus] = useState(editFormData.lab_status);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLabData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchActiveSchools(setSchoolNames);
        fetchExistingLabTypes(setLabTypes);
    }, []);

    return (
        <div className="edit-document-container my-entries-edit-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>{role === 3 ? 'View Lab Data' : 'Edit Lab Data'}</h1>
            </header>
            <form className="edit-document-form" onSubmit={(e) => e.preventDefault()}>
                {/* <div className="form-group">
                    <label>Lab ID</label>
                    <span className="document-id">{newLabData.lab_id}</span>
                </div> */}
                <div className="form-group">
                    <label>Lab Name <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="lab_name"
                        value={newLabData.lab_name}
                        onChange={handleChange}
                        placeholder="Enter Lab Name"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Lab Type <m style={{ color: 'red' }}>*</m></label>
                    <select
                        name="lab_type_id"
                        value={newLabData.lab_type_id}
                        onChange={handleChange}
                        required
                        disabled={role === 3}
                    >
                        <option value="">Select</option>
                        {labTypes.map((type) => (
                            <option key={type.lab_type_id} value={type.lab_type_id}>
                                {type.lab_type_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Lab Capacity <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="lab_capacity"
                        value={newLabData.lab_capacity}
                        onChange={(e) => {
                            if (/^\d{0,3}$/.test(e.target.value)) {
                                handleChange(e);
                            }
                        }}
                        placeholder="No. of students can be accommodated in this lab"
                        autoComplete='off'
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Lab Description <m style={{ color: 'red' }}>*</m></label>
                    <textarea
                        type="text"
                        name="lab_description"
                        value={newLabData.lab_description}
                        onChange={handleChange}
                        maxLength="500"
                        placeholder="Enter Lab Description"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>School Name <m style={{ color: 'red' }}>*</m></label>
                    <select
                        name="school_id"
                        value={newLabData.school_id}
                        onChange={handleChange}
                        required
                        disabled={role === 3}
                    >
                        <option value="">Select</option>
                        {schoolNames.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.school_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-actions">
                    {role === 1 && (
                        <button
                            type="button"
                            style={{ backgroundColor: '#fc7465' }}
                            className="delete-btn"
                            onClick={() => handleDisableLab(editFormData.id, editFormData.lab_name, labStatus, setLabStatus)}> {labStatus === 0 ? 'Enable Lab' : 'Disable Lab'}
                        </button>
                    )}
                    <div>
                        <button type="button" className="cancel-btn" onClick={handleClose}>{role === 3 ? 'Back' : 'Cancel'}</button>
                        {role !== 3 && (
                            <button type="button" className="update-btn" onClick={(e) => handleEditLabData(e, editFormData.id, newLabData)}>Update</button>
                        )}
                    </div>
                    {/* <button
                        type="button"
                        className="delete-btn"
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the lab`)) {
                                handleDeleteLab(editFormData.id, labs, setLabs, handleClose);
                            }
                        }}>Delete Lab
                    </button> */}

                </div>
            </form>
        </div>
    )
}

export default EditLabData;
