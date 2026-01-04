import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchActiveSchools } from '../ApiHandler/schoolFunctions';
import { fetchLabsForSchool } from '../ApiHandler/labFunctions';
import { fetchActiveEquipments, handleAllocateEquipment } from '../ApiHandler/equipmentFunctions';

const EquipmentAllocation = () => {
    const [equipmentData, setEquipmentData] = useState({
        equipmentId: "",
        equipmentName: "",
        schoolId: "",
        schoolName: "",
        labId: "",
        labName: "",
        allocationDate: "",
        allocatedQuantity: "",
    });

    const [equipments, setEquipments] = useState([]);
    const [schools, setSchools] = useState([]);
    const [labs, setLabs] = useState([]);
    const [availableQuantity, setAvailableQuantity] = useState("");
    const [selectedSchools, setSelectedSchools] = useState([]);
    const [selectedEquipments, setSelectedEquipments] = useState([]);

    const handleSchoolCheckbox = (schoolId) => {
        let updatedSelected;

        if (selectedSchools.includes(schoolId)) {
            updatedSelected = selectedSchools.filter(id => id !== schoolId);
        } else {
            updatedSelected = [...selectedSchools, schoolId];
        }

        setSelectedSchools(updatedSelected);

        const selectedSchoolObjects = schools.filter(s => updatedSelected.includes(s.id));
        const selectedIds = selectedSchoolObjects.map(s => s.id);
        const selectedNames = selectedSchoolObjects.map(s => s.school_name);

        setEquipmentData(prevData => ({
            ...prevData,
            schoolId: selectedIds.join(','),
            schoolName: selectedNames.join(', ')
        }));

        if (updatedSelected.length > 0) {
            fetchLabsForSchool(updatedSelected[0], setLabs);
        }
    };

    const handleEquipmentCheckbox = (equipmentId) => {
        let updatedSelected;

        if (selectedEquipments.includes(equipmentId)) {
            updatedSelected = selectedEquipments.filter(id => id !== equipmentId);
        } else {
            updatedSelected = [...selectedEquipments, equipmentId];
        }

        setSelectedEquipments(updatedSelected);

        const selectedEquipmentObjects = equipments.filter(eq => updatedSelected.includes(eq.id));
        const selectedIds = selectedEquipmentObjects.map(eq => eq.id);
        const selectedNames = selectedEquipmentObjects.map(eq => eq.equipment_name);
        const totalAvailable = selectedEquipmentObjects.reduce((sum, eq) => sum + eq.available_quantity, 0);

        setAvailableQuantity(totalAvailable);
        setEquipmentData(prevData => ({
            ...prevData,
            equipmentId: selectedIds.join(','),
            equipmentName: selectedNames.join(', ')
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "allocatedQuantity") {
            const quantity = parseInt(value);
            if (quantity > availableQuantity) {
                toast.warning(`The maximum available quantity is ${availableQuantity}`, {
                    position: "top-center"
                });
                setEquipmentData(prevData => ({
                    ...prevData,
                    [name]: availableQuantity
                }));
            } else {
                setEquipmentData(prevData => ({
                    ...prevData,
                    [name]: quantity
                }));
            }
        } else if (name === "labId") {
            const selectedLab = labs.find(lab => lab.id === parseInt(value));
            setEquipmentData(prevData => ({
                ...prevData,
                [name]: value,
                labName: selectedLab ? selectedLab.lab_name : ""
            }));
        } else {
            setEquipmentData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        fetchActiveEquipments(setEquipments);
        fetchActiveSchools(setSchools);
    }, []);

    return (
        <div className="upload-document-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>Equipment Allocation</h1>
            </header>
            <form className="upload-document-form" onSubmit={(e) => handleAllocateEquipment(e, equipmentData, setEquipmentData)}>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>School Name <m style={{ color: 'red' }}>*</m></label>
                        <div style={{
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '10px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: '#fff'
                        }}>
                            {schools.length > 0 ? (
                                schools.map((school) => (
                                    <div key={school.id} style={{
                                        padding: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            id={`school-${school.id}`}
                                            checked={selectedSchools.includes(school.id)}
                                            onChange={() => handleSchoolCheckbox(school.id)}
                                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                        />
                                        <label
                                            htmlFor={`school-${school.id}`}
                                            style={{ cursor: 'pointer', margin: 0, flex: 1 }}
                                        >
                                            {school.school_name}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#999', margin: 0 }}>No schools available</p>
                            )}
                        </div>
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            {selectedSchools.length} school(s) selected
                        </small>
                    </div>
                    <div className="form-group">
                        <label>Lab Name <m style={{ color: 'red' }}>*</m></label>
                        <select name="labId" value={equipmentData.labId} onChange={handleChange} required>
                            <option value="">Select</option>
                            {labs.map((lab) => (
                                <option key={lab.id} value={lab.id}>
                                    {lab.lab_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Equipment Name <m style={{ color: 'red' }}>*</m></label>
                        <div style={{
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '10px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: '#fff'
                        }}>
                            {equipments.length > 0 ? (
                                equipments.map((equipment) => (
                                    <div key={equipment.id} style={{
                                        padding: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            id={`equipment-${equipment.id}`}
                                            checked={selectedEquipments.includes(equipment.id)}
                                            onChange={() => handleEquipmentCheckbox(equipment.id)}
                                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                        />
                                        <label
                                            htmlFor={`equipment-${equipment.id}`}
                                            style={{ cursor: 'pointer', margin: 0, flex: 1 }}
                                        >
                                            {equipment.equipment_name} (Available: {equipment.available_quantity})
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#999', margin: 0 }}>No equipment available</p>
                            )}
                        </div>
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            {selectedEquipments.length} equipment(s) selected
                        </small>
                    </div>
                    <div className="form-group">
                        <label>Allocation Date <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="date"
                            name="allocationDate"
                            value={equipmentData.allocationDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Available Quantity</label>
                        <input
                            type="number"
                            value={availableQuantity}
                            placeholder="Available Quantity"
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Allocation Quantity <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="number"
                            name="allocatedQuantity"
                            value={equipmentData.allocatedQuantity}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && value <= 9999) {
                                    handleChange(e);
                                }
                            }}
                            placeholder="Enter Quantity to Allocate"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default EquipmentAllocation;