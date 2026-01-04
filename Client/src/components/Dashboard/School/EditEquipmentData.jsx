import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleEditEquipmentData, handleDisableEquipment } from '../ApiHandler/equipmentFunctions';

const EditEquipmentData = ({ role, editFormData, handleClose }) => {
    const [newEquipmentData, setNewEquipmentData] = useState({ ...editFormData });
    const [equipmentStatus, setEquipmentStatus] = useState(editFormData.equipment_status);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEquipmentData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="edit-document-container my-entries-edit-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>{role === 3 ? 'View Equipment Data' : 'Edit Equipment Data'}</h1>
            </header>
            <form className="edit-document-form" onSubmit={(e) => e.preventDefault()}>
                {/* <div className="form-group">
                    <label>Equipment ID</label>
                    <span className="document-id">{newEquipmentData.equipment_id}</span>
                </div> */}
                <div className="form-group">
                    <label>Equipment Name <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="equipment_name"
                        value={newEquipmentData.equipment_name}
                        onChange={handleChange}
                        placeholder="Enter equipment Name"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Equipment Description <m style={{ color: 'red' }}>*</m></label>
                    <textarea
                        type="text"
                        name="equipment_description"
                        value={newEquipmentData.equipment_description}
                        onChange={handleChange}
                        maxLength={250}
                        placeholder="Enter Equipment Description"
                        autoComplete='off'
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Warranty Status <m style={{ color: 'red' }}>*</m></label>
                    <select
                        name="warranty_status"
                        value={newEquipmentData.warranty_status}
                        onChange={handleChange}
                        required
                        disabled={role === 3}
                    >
                        <option value="">Select</option>
                        <option value="In Warranty">In Warranty</option>
                        <option value="Out of Warranty">Out of Warranty</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Quantity <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="number"
                        name="equipment_quantity"
                        value={newEquipmentData.equipment_quantity}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            const minQuantity = editFormData.equipment_quantity - editFormData.available_quantity; // Minimum allowed value

                            if (value >= minQuantity && value <= 9999) {
                                handleChange(e);
                            } else {
                                toast.warning(`You cannot reduce quantity below ${minQuantity}.`);
                            }
                        }}
                        placeholder="Enter Quantity of Equipment"
                        autoComplete="off"
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Date of Expiry<m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="date"
                        name="expiry_date"
                        value={newEquipmentData.expiry_date}
                        onChange={handleChange}
                        required
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Serial Number</label>
                    <input
                        type="text"
                        name="serial_number"
                        value={newEquipmentData.serial_number}
                        onChange={handleChange}
                        maxLength={50}
                        placeholder="Enter Serial Number"
                        autoComplete='off'
                        disabled={role === 3}
                    />
                </div>
                <div className="form-actions">
                    {role === 1 && (
                        <button
                            type="button"
                            style={{ backgroundColor: '#fc7465' }}
                            className="delete-btn"
                            onClick={() => handleDisableEquipment(editFormData.id, editFormData.equipment_name, equipmentStatus, setEquipmentStatus)}> {equipmentStatus === 0 ? 'Enable Equipment' : 'Disable Equipment'}
                        </button>
                    )}
                    <div>
                        <button type="button" className="cancel-btn" onClick={handleClose}>{role === 3 ? 'Back' : 'Cancel'}</button>
                        {role !== 3 && (
                            <button type="button" className="update-btn" onClick={(e) => handleEditEquipmentData(e, editFormData.id, newEquipmentData)}>Update</button>
                        )}
                    </div>
                    {/* <button
                        type="button"
                        className="delete-btn"
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the equipment`)) {
                                handleDeleteEquipment(editFormData.id, equipments, setEquipments, handleClose);
                            }
                        }}>Delete Equipment
                    </button> */}

                </div>
            </form>
        </div>
    )
}

export default EditEquipmentData;
