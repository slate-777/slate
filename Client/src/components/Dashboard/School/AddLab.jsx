import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchExistingLabTypes } from '../ApiHandler/labFunctions';
import { fetchActiveSchools } from '../ApiHandler/schoolFunctions';
import { handleAddLab } from '../ApiHandler/labFunctions';

const AddLab = () => {
    const [labData, setLabData] = useState({
        labName: "",
        labType: "",
        labCapacity: "",
        labDescription: "",
        schoolId: "",
    });

    const [schoolNames, setSchoolNames] = useState([]);
    const [labTypes, setLabTypes] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLabData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchActiveSchools(setSchoolNames);
        fetchExistingLabTypes(setLabTypes);
    }, []);

    return (
        <div className="upload-document-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>Tag Lab to School</h1>
            </header>
            <form className="upload-document-form" onSubmit={(e) => handleAddLab(e, labData, setLabData)}>
                <div className="form-group">
                    <label>Lab Name <m style={{ color: 'red' }}>*</m></label>
                    <input
                        type="text"
                        name="labName"
                        value={labData.labName}
                        onChange={handleChange}
                        placeholder="Enter Lab Name"
                        autoComplete='off'
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Lab Type <m style={{ color: 'red' }}>*</m></label>
                    <select name="labType" value={labData.labType} onChange={handleChange} required>
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
                        name="labCapacity"
                        value={labData.labCapacity}
                        onChange={(e) => {
                            if (/^\d{0,3}$/.test(e.target.value)) {
                                handleChange(e);
                            }
                        }}
                        placeholder="No. of students can be accommodated in this lab"
                        autoComplete='off'
                    />
                </div>
                <div className="form-group">
                    <label>Lab Description <m style={{ color: 'red' }}>*</m></label>
                    <textarea
                        type="text"
                        name="labDescription"
                        value={labData.labDescription}
                        onChange={handleChange}
                        maxLength="500"
                        placeholder="Enter Lab Description"
                        autoComplete='off'
                        required
                    />
                    <label style={{ color: 'red', fontWeight: '350', fontSize: '12px' }}>Maximum Characters: 500</label>
                </div>
                <div className="form-group">
                    <label>School Name <m style={{ color: 'red' }}>*</m></label>
                    <select name="schoolId" value={labData.schoolId} onChange={handleChange} required>
                        <option value="">Select</option>
                        {schoolNames.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.school_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default AddLab;
