import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserState } from '../ApiHandler/usersFunctions';
import { handleAddSchool, fetchStates, fetchDistricts } from '../ApiHandler/schoolFunctions';

const AddSchool = ({ role }) => {
    const [userState, setUserState] = useState("");
    const [schoolData, setSchoolData] = useState({
        schoolName: "",
        udise: "",
        state: "",
        district: "",
        pincode: "",
        address: "",
        geoLocation: "",
        schoolEmail: "",
        contactPerson: "",
        contactNo: "",
        totalStudents: ""
    });
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        fetchUserState(setUserState);
        fetchStates(setStates);
    }, []);

    // Sync userState with schoolData.state when role is not 1
    useEffect(() => {
        if (role !== 1 && userState) {
            setSchoolData((prevData) => ({
                ...prevData,
                state: userState,
            }));
            fetchDistricts(userState, setDistricts);

        }
    }, [role, userState]);

    const handleChange = async (e) => {
        const { name, value } = e.target;

        setSchoolData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "state") {
            await fetchDistricts(value, setDistricts);
        }
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                setSchoolData(prevData => ({
                    ...prevData,
                    geoLocation: `${latitude}, ${longitude}`
                }));
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="upload-document-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>Add School</h1>
            </header>
            <form className="upload-document-form" onSubmit={(e) => handleAddSchool(e, schoolData, setSchoolData)}>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>School Name <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="text"
                            name="schoolName"
                            value={schoolData.schoolName}
                            onChange={handleChange}
                            maxLength={150}
                            placeholder="Enter School Name"
                            autoComplete='off'
                            required
                        />
                        <label style={{ color: 'red', fontWeight: '350', fontSize: '12px' }}>Maximum Characters: 150</label>
                    </div>
                    <div className="form-group">
                        <label>UDISE <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="text"
                            name="udise"
                            value={schoolData.udise}
                            onChange={(e) => {
                                if (/^\d{0,11}$/.test(e.target.value)) {
                                    handleChange(e);
                                }
                            }}
                            placeholder="Enter UDISE"
                            autoComplete="off"
                            required
                        />
                    </div>

                </div>
                <div className='in-row-input'>
                    {(role === 1 ? (
                        <div className="form-group">
                            <label>State <m style={{ color: 'red' }}>*</m></label>
                            <select
                                name="state"
                                value={schoolData.state}
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
                            value={schoolData.district}
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
                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Pincode <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="text"
                            name="pincode"
                            value={schoolData.pincode}
                            onChange={(e) => {
                                if (/^\d{0,6}$/.test(e.target.value)) {
                                    handleChange(e);
                                }
                            }}
                            placeholder="Enter Pincode"
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="text"
                            name="address"
                            value={schoolData.address}
                            onChange={handleChange}
                            placeholder="Enter School Address"
                            autoComplete='off'
                            required
                        />
                    </div>
                </div>
                <div className='in-row-input'>
                    <div className="form-group geo-location-container">
                        <label>Geo Location</label>
                        <input
                            type="text"
                            name="geoLocation"
                            value={schoolData.geoLocation}
                            onChange={handleChange}
                            placeholder="Longitude and Latitude"
                            autoComplete='off'
                        />
                        <a href="# " type="button" className="get-location-button" onClick={handleGetLocation}><i class='bx bx-map-pin' ></i></a>
                    </div>
                    <div className="form-group">
                        <label>School Email ID</label>
                        <input
                            type="email"
                            name="schoolEmail"
                            value={schoolData.schoolEmail}
                            onChange={handleChange}
                            placeholder="Enter School Email ID (Optional)"
                            autoComplete='off'
                        />
                    </div>
                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Primary Contact Person <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="text"
                            name="contactPerson"
                            value={schoolData.contactPerson}
                            onChange={handleChange}
                            maxLength={75}
                            placeholder="Primary Contact Person"
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact No <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="tel"
                            name="contactNo"
                            value={schoolData.contactNo}
                            onChange={handleChange}
                            placeholder="Primary Contact Person"
                            autoComplete='off'
                            maxLength={10}
                            required
                        />
                    </div>
                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Total Students <m style={{ color: 'red' }}>*</m></label>
                        <input
                            type="number"
                            name="totalStudents"
                            value={schoolData.totalStudents}
                            onChange={(e) => {
                                if (/^\d{0,4}$/.test(e.target.value)) {
                                    handleChange(e);
                                }
                            }}
                            placeholder="Enter total no of students"
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className="form-group">
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default AddSchool;
