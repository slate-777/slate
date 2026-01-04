import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleAddEquipment } from '../ApiHandler/equipmentFunctions';

const AddEquipment = () => {
    const [equipmentData, setEquipmentData] = useState({
        equipmentName: "",
        equipmentDescription: "",
        warrantyStatus: "",
        equipmentQuantity: "",
        serialNumber: "",
        expiryDate: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipmentData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="upload-document-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>Add Equipment</h1>
            </header>
            <form className="upload-document-form" onSubmit={(e) => handleAddEquipment(e, equipmentData, setEquipmentData)}>
                <div className="form-group">
                    <label>Equipment Name <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="equipmentName"
                        value={equipmentData.equipmentName}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="Enter Equipment Name"
                        autoComplete='off'
                        required
                    />
                    <label style={{ color: 'red', fontWeight: '350', fontSize: '12px' }}>Maximum Characters: 100</label>
                </div>
                <div className="form-group">
                    <label>Equipment Description <m style={{ color: 'red' }}>*</m></label>
                    <textarea
                        type="text"
                        name="equipmentDescription"
                        value={equipmentData.equipmentDescription}
                        onChange={handleChange}
                        maxLength={250}
                        placeholder="Enter Equipment Description"
                        autoComplete='off'
                        required
                    />
                    <label style={{ color: 'red', fontWeight: '350', fontSize: '12px' }}>Maximum Characters: 250</label>
                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Warranty Status <m style={{ color: 'red' }}>*</m></label>
                        <select name="warrantyStatus" value={equipmentData.warrantyStatus} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="In Warranty">In Warranty</option>
                            <option value="Out of Warranty">Out of Warranty</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Quantity <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="number"
                            name="equipmentQuantity"
                            value={equipmentData.equipmentQuantity}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && value <= 9999) {
                                    handleChange(e);
                                }
                            }}
                            placeholder="Enter Quantity of Equipment"
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Date of Expiry<m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={equipmentData.expiryDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Serial Number</label>
                        <input
                            type="text"
                            name="serialNumber"
                            value={equipmentData.serialNumber}
                            onChange={handleChange}
                            maxLength={50}
                            placeholder="Enter Serial Number"
                            autoComplete='off'
                        />
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default AddEquipment;