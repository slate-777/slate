import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleUpdateAllocation } from '../ApiHandler/equipmentFunctions';

const EditEquipmentAllocationData = ({ role, editFormData, handleClose }) => {
    const [newEquipmentAllocationData, setNewEquipmentAllocationData] = useState({ ...editFormData });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setNewEquipmentAllocationData((prevData) => {
            if (name === "allocated_quantity") {
                const quantity = parseInt(value, 10) || 0; // Convert to integer
                const availableQuantity = editFormData.available_quantity + editFormData.allocated_quantity; // Get available quantity

                if (quantity > availableQuantity) {
                    toast.warning(`The maximum available quantity is ${availableQuantity}`, {
                        position: "top-center",
                    });
                    return { ...prevData, [name]: availableQuantity }; // Prevent exceeding available quantity
                } else {
                    return { ...prevData, [name]: quantity };
                }
            }

            return { ...prevData, [name]: value };
        });
    };

    return (
        <div className="edit-document-container my-entries-edit-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>{role === 3 ? 'View Allocated Equipment Data' : 'Edit Allocated Equipment Data'}</h1>
            </header>
            <form className="edit-document-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>School Name <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="school_name"
                        value={newEquipmentAllocationData.school_name}
                        onChange={handleChange}
                        placeholder="Enter school Name"
                        autoComplete='off'
                        required
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Lab Name <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="lab_name"
                        value={newEquipmentAllocationData.lab_name}
                        onChange={handleChange}
                        placeholder="Enter lab Name"
                        autoComplete='off'
                        required
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Equipment Name <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="equipment_name"
                        value={newEquipmentAllocationData.equipment_name}
                        onChange={handleChange}
                        placeholder="Enter equipment Name"
                        autoComplete='off'
                        required
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Allocation Date <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="date"
                        name="allocation_date"
                        value={newEquipmentAllocationData.allocation_date}
                        onChange={handleChange}
                        required
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Available Quantity</label>
                    <input
                        type="number"
                        value={newEquipmentAllocationData.available_quantity}
                        placeholder="Available Quantity"
                        readOnly
                        disabled={role === 3}
                    />
                </div>
                <div className="form-group">
                    <label>Allocated Quantity</label>
                    <input
                        type="number"
                        name="allocated_quantity"
                        value={newEquipmentAllocationData.allocated_quantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value <= 9999) {
                                handleChange(e);
                            }
                        }}
                        placeholder="Enter Quantity to Allocate"
                        required
                        disabled={
                            role === 3 ||
                            (role === 2 &&
                                new Date() - new Date(newEquipmentAllocationData.allocation_date) > 72 * 60 * 60 * 1000)
                        }
                    />
                </div>
                {role === 2 &&
                    new Date() - new Date(newEquipmentAllocationData.allocation_date) > 72 * 60 * 60 * 1000 && (
                        <p className="error-message" style={{ color: 'red', marginTop: '5px' }}>
                            You cannot edit this data as it has been more than 3 days. Please contact the admin for assistance.
                        </p>
                    )}
                <div className="form-actions">
                    <div>
                        <button type="button" className="cancel-btn" onClick={handleClose}>{role === 3 ? 'Back' : 'Cancel'}</button>
                        {role !== 3 && (
                            <button type="button" className="update-btn" onClick={(e) => handleUpdateAllocation(e, editFormData.allocation_id, newEquipmentAllocationData)}>Update</button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditEquipmentAllocationData;
