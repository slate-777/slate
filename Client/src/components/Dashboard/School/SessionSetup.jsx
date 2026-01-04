import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Oval } from 'react-loader-spinner'
import { fetchActiveSchools } from '../ApiHandler/schoolFunctions';
import { fetchLabsForSchool } from '../ApiHandler/labFunctions';
import { handleSessionSetup, showSessionSuccessToast, fetchAllSessions, handleDeleteSession, handleEditSessionData } from '../ApiHandler/sessionFunctions';

const API_URL = process.env.REACT_APP_API_URL;

const SessionSetup = () => {
    const [sessionData, setSessionData] = useState({
        sessionTitle: "",
        sessionHost: "",
        sessionDate: "",
        sessionTime: "",
        schoolId: "",
        labId: "",
        sessionDescription: "",
        sessionImages: [],
        // SATHEE KENDRA fields
        centreCode: "",
        state: "",
        district: "",
        satheeMitraName: "",
        schoolType: "",
        schoolTypeOther: "",
        schoolAddress: "",
        principalName: "",
        principalContact: "",
        visitMode: ""
    });
    const [attendeesFile, setAttendeesFile] = useState(null);
    const [schoolNames, setSchoolNames] = useState([]);
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imagePreview, setImagePreview] = useState([]);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [allSessions, setAllSessions] = useState([]);
    const [editingSession, setEditingSession] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'djpqnwbeg';

    // Image viewer functions
    const openImageViewer = (index) => {
        setCurrentImageIndex(index);
        setImageViewerOpen(true);
    };

    const closeImageViewer = () => {
        setImageViewerOpen(false);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % imagePreview.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + imagePreview.length) % imagePreview.length);
    };

    const handleImageSelect = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
        setUploadingImages(true);

        const uploadedUrls = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                    { method: 'POST', body: formData }
                );
                const data = await response.json();

                if (data.error) {
                    console.error('Cloudinary error:', data.error.message);
                    alert(`Upload failed: ${data.error.message}. Please check your Cloudinary settings.`);
                } else {
                    uploadedUrls.push(data.secure_url);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image. Please try again.');
            }
        }

        setSessionData(prev => ({ ...prev, sessionImages: uploadedUrls }));
        setUploadingImages(false);
    };

    const removeImage = (index) => {
        setImagePreview(prev => prev.filter((_, i) => i !== index));
        setSessionData(prev => ({
            ...prev,
            sessionImages: prev.sessionImages.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSessionData((prevData) => {
            if (name === "sessionTime") {
                // Check if sessionTime already has AM/PM, if not, append default "AM"
                const timeValue = value.replace(/AM|PM/, "").trim(); // Remove any existing AM/PM
                const amPm = prevData.sessionTime.includes("PM") ? "PM" : "AM"; // Retain existing AM/PM

                return { ...prevData, sessionTime: `${timeValue} ${amPm}` };
            }

            if (name === "sessionAmPm") {
                // If AM/PM dropdown is changed, update only AM/PM part
                const timeValue = prevData.sessionTime.replace(/AM|PM/, "").trim();
                return { ...prevData, sessionTime: `${timeValue} ${value}` };
            }

            return { ...prevData, [name]: value };
        });

        if (name === "schoolId") {
            fetchLabsForSchool(value, setLabs);
        }
    };

    const loadSessions = () => {
        fetchAllSessions(setAllSessions);
    };

    const handleDelete = (sessionId, sessionTitle) => {
        if (window.confirm(`Are you sure you want to delete "${sessionTitle}"?`)) {
            handleDeleteSession(sessionId, sessionTitle, allSessions, setAllSessions, () => { }, loadSessions);
        }
    };

    const handleEdit = (session) => {
        setEditingSession(session);
        setShowEditModal(true);
    };

    useEffect(() => {
        fetchActiveSchools(setSchoolNames);
        showSessionSuccessToast();
        loadSessions();
    }, []);

    return (
        <div className="upload-document-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>Session Setup</h1>
                {loading ? <Oval height="22" width="22" color="blue" ariaLabel="loading" /> : ''}
            </header>
            <form className="upload-document-form" onSubmit={(e) => handleSessionSetup(e, sessionData, attendeesFile, setLoading)}>
                <div className="form-group">
                    <label>Session Title <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text"
                        name="sessionTitle"
                        value={sessionData.sessionTitle}
                        onChange={handleChange}
                        placeholder="Enter Session Title"
                        autoComplete='off'
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Session Host <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text"
                        name="sessionHost"
                        value={sessionData.sessionHost}
                        onChange={handleChange}
                        placeholder="Enter session host name"
                        autoComplete='off'
                        required
                    />
                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Session Date <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="date"
                            name="sessionDate"
                            value={sessionData.sessionDate}
                            onChange={handleChange}
                            placeholder="Enter Session Date"
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className="form-group geo-location-container">
                        <label>Session Time <span style={{ color: 'red' }}>*</span></label>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="text"
                                name="sessionTime"
                                value={sessionData.sessionTime.replace(/AM|PM/, "").trim()} // Show only time
                                onChange={handleChange}
                                placeholder="Enter Session Time (e.g., 10:30)"
                                autoComplete='off'
                                required
                                style={{ flex: "9" }}
                            />
                            <select
                                name="sessionAmPm"
                                value={sessionData.sessionTime.includes("PM") ? "PM" : "AM"}
                                onChange={handleChange}
                                style={{ flex: "1" }}>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>

                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>School Name <span style={{ color: 'red' }}>*</span></label>
                        <select name="schoolId" value={sessionData.schoolId} onChange={handleChange} required>
                            <option value="">Select</option>
                            {schoolNames.map((school) => (
                                <option key={school.id} value={school.id}>
                                    {school.school_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Lab Name <span style={{ color: 'red' }}>*</span></label>
                        <select name="labId" value={sessionData.labId} onChange={handleChange} required>
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
                    <label>Session Description <span style={{ color: 'red' }}>*</span></label>
                    <textarea
                        type="text"
                        name="sessionDescription"
                        value={sessionData.sessionDescription}
                        onChange={handleChange}
                        maxLength="300"
                        placeholder="Enter Session Description"
                        autoComplete='off'
                        required
                    />
                    <label style={{ color: 'red', fontWeight: '350', fontSize: '12px' }}>Maximum Characters: 300</label>
                </div>

                {/* SATHEE KENDRA Section */}
                <div style={{ marginTop: '30px', marginBottom: '20px', borderTop: '2px solid #007BFF', paddingTop: '20px' }}>
                </div>

                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Centre Code <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="centreCode"
                            value={sessionData.centreCode}
                            onChange={handleChange}
                            placeholder="Enter Centre Code"
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>State <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="state"
                            value={sessionData.state}
                            onChange={handleChange}
                            placeholder="Enter State"
                            autoComplete='off'
                            required
                        />
                    </div>
                </div>

                <div className='in-row-input'>
                    <div className="form-group">
                        <label>District / Block / Zone <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="district"
                            value={sessionData.district}
                            onChange={handleChange}
                            placeholder="Enter District / Block / Zone"
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Name of Coordinator <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="satheeMitraName"
                            value={sessionData.satheeMitraName}
                            onChange={handleChange}
                            placeholder="Enter Coordinator Name"
                            autoComplete='off'
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Type of School Visited <span style={{ color: 'red' }}>*</span></label>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="schoolType"
                                value="Government"
                                checked={sessionData.schoolType === 'Government'}
                                onChange={handleChange}
                                required
                            />
                            <span>Government</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="schoolType"
                                value="Private"
                                checked={sessionData.schoolType === 'Private'}
                                onChange={handleChange}
                            />
                            <span>Private</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="schoolType"
                                value="Aided"
                                checked={sessionData.schoolType === 'Aided'}
                                onChange={handleChange}
                            />
                            <span>Aided</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="schoolType"
                                value="Other"
                                checked={sessionData.schoolType === 'Other'}
                                onChange={handleChange}
                            />
                            <span>Other</span>
                        </label>
                    </div>
                    {sessionData.schoolType === 'Other' && (
                        <input
                            type="text"
                            name="schoolTypeOther"
                            value={sessionData.schoolTypeOther}
                            onChange={handleChange}
                            placeholder="Please specify"
                            autoComplete='off'
                            style={{ marginTop: '10px' }}
                            required
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>School Address <span style={{ color: 'red' }}>*</span></label>
                    <textarea
                        name="schoolAddress"
                        value={sessionData.schoolAddress}
                        onChange={handleChange}
                        placeholder="Enter School Address"
                        autoComplete='off'
                        rows="3"
                        required
                    />
                </div>

                <div className='in-row-input'>
                    <div className="form-group">
                        <label>Principal's Name <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="principalName"
                            value={sessionData.principalName}
                            onChange={handleChange}
                            placeholder="Enter Principal's Name"
                            autoComplete='off'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Principal's / School POC <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="tel"
                            name="principalContact"
                            value={sessionData.principalContact}
                            onChange={handleChange}
                            placeholder="Enter Contact Number"
                            autoComplete='off'
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Mode of Visit <span style={{ color: 'red' }}>*</span></label>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="visitMode"
                                value="In-person"
                                checked={sessionData.visitMode === 'In-person'}
                                onChange={handleChange}
                                required
                            />
                            <span>In-person</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="visitMode"
                                value="Virtual"
                                checked={sessionData.visitMode === 'Virtual'}
                                onChange={handleChange}
                            />
                            <span>Virtual</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="visitMode"
                                value="Phone Call"
                                checked={sessionData.visitMode === 'Phone Call'}
                                onChange={handleChange}
                            />
                            <span>Phone Call</span>
                        </label>
                    </div>
                </div>
                <div className='in-row-input'>
                    <div className="form-group">
                        <label>List Of Invitees <span style={{ color: 'red' }}>*</span></label>
                        <input type="file" accept=".xlsx,.xls" onChange={(e) => { setAttendeesFile(e.target.files[0]) }} required />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px' }}>Download Template</label>
                        <a href={`${API_URL}/uploads/attendees.xlsx`} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF', textDecoration: 'underline' }}>
                            Excel File Format
                        </a>
                    </div>
                </div>
                <div className="form-group">
                    <label>Session Images (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                    />
                    <label style={{ color: '#666', fontWeight: '350', fontSize: '12px' }}>
                        Upload session photos (Max 10 images)
                    </label>
                </div>
                {imagePreview.length > 0 && (
                    <div className="form-group">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                            {imagePreview.map((preview, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '2px solid #ddd',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => openImageViewer(index)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                            zIndex: 2
                                        }}
                                    >
                                        ×
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openImageViewer(index)}
                                        style={{
                                            position: 'absolute',
                                            bottom: '5px',
                                            right: '5px',
                                            background: 'rgba(0,123,255,0.9)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '30px',
                                            height: '30px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                            transition: 'all 0.3s ease',
                                            zIndex: 1
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(0,123,255,1)';
                                            e.currentTarget.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(0,123,255,0.9)';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        <i className='bx bx-show' style={{ fontSize: '18px' }}></i>
                                    </button>
                                </div>
                            ))}
                            {imagePreview.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => openImageViewer(0)}
                                    style={{
                                        background: '#007BFF',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        width: '100px',
                                        height: '100px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#0056b3';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#007BFF';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <i className='bx bx-show' style={{ fontSize: '32px' }}></i>
                                    <span style={{ fontSize: '12px', fontWeight: '600' }}>View All</span>
                                </button>
                            )}
                        </div>
                        {uploadingImages && (
                            <p style={{ color: '#007BFF', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Oval height="16" width="16" color="blue" /> Uploading images to cloud...
                            </p>
                        )}
                    </div>
                )}
                <div className="form-group">
                    <button type="submit" disabled={loading || uploadingImages}>
                        {loading ? 'Submitting...' : uploadingImages ? 'Uploading Images...' : 'Submit'}
                    </button>
                </div>
            </form>
            <div className="usage-instructions">
                <h2>📢 Usage Instructions</h2>
                <ul>
                    <li><i className='bx bx-paper-plane'></i> Download the Excel file format from the given link.</li>
                    <li><i className='bx bx-paper-plane'></i> You must add the students details to it before uploading.</li>
                    <li><i className='bx bx-paper-plane'></i> DO NOT make any changes in the order of columns in the downloaded file. Just update the student details except the “attendance” column.</li>
                    <li><i className='bx bx-paper-plane'></i> You may update the attendance column while closing the session, at later stage.</li>
                    <li><i className='bx bx-paper-plane'></i> Click the eye button (👁️) on any image to view it in full screen.</li>
                </ul>
            </div>

            {/* All Sessions Management */}
            <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    borderBottom: '2px solid #007BFF',
                    paddingBottom: '10px'
                }}>
                    <h2 style={{ color: '#007BFF', margin: 0 }}>📋 All Sessions</h2>
                    <button
                        onClick={loadSessions}
                        style={{
                            background: '#007BFF',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <i className='bx bx-refresh'></i> Refresh
                    </button>
                </div>

                {allSessions.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            background: 'white',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            borderRadius: '8px'
                        }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>ID</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Title</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Host</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Time</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>School</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Lab</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                                    <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allSessions.map((session, index) => (
                                    <tr key={session.id} style={{
                                        borderBottom: '1px solid #dee2e6',
                                        background: index % 2 === 0 ? 'white' : '#f8f9fa'
                                    }}>
                                        <td style={{ padding: '15px' }}>{session.id}</td>
                                        <td style={{ padding: '15px', fontWeight: '500' }}>{session.session_title}</td>
                                        <td style={{ padding: '15px' }}>{session.session_host}</td>
                                        <td style={{ padding: '15px' }}>{new Date(session.session_date).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px' }}>{session.session_time}</td>
                                        <td style={{ padding: '15px' }}>{session.school_name}</td>
                                        <td style={{ padding: '15px' }}>{session.lab_name}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '5px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: session.session_status === 'Completed' ? '#d4edda' : '#fff3cd',
                                                color: session.session_status === 'Completed' ? '#155724' : '#856404'
                                            }}>
                                                {session.session_status || 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleEdit(session)}
                                                    style={{
                                                        background: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 15px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
                                                    title="Edit Session"
                                                >
                                                    <i className='bx bx-edit'></i> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(session.id, session.session_title)}
                                                    style={{
                                                        background: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 15px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
                                                    title="Delete Session"
                                                >
                                                    <i className='bx bx-trash'></i> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <i className='bx bx-calendar-x' style={{ fontSize: '48px', color: '#6c757d' }}></i>
                        <p style={{ color: '#6c757d', marginTop: '10px' }}>No sessions found</p>
                    </div>
                )}
            </div>

            {/* Image Viewer Modal */}
            {imageViewerOpen && imagePreview.length > 0 && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.95)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                    onClick={closeImageViewer}
                >
                    <button
                        onClick={closeImageViewer}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            color: 'white',
                            fontSize: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            zIndex: 10001
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        ×
                    </button>

                    <div
                        style={{
                            position: 'relative',
                            maxWidth: '90%',
                            maxHeight: '90%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {imagePreview.length > 1 && (
                            <button
                                onClick={prevImage}
                                style={{
                                    position: 'absolute',
                                    left: '-60px',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    color: 'white',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <i className='bx bx-chevron-left'></i>
                            </button>
                        )}

                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={imagePreview[currentImageIndex]}
                                alt={`Preview ${currentImageIndex + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    borderRadius: '10px',
                                    boxShadow: '0 10px 50px rgba(0,0,0,0.5)'
                                }}
                            />
                            <div style={{
                                color: 'white',
                                marginTop: '20px',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}>
                                Image {currentImageIndex + 1} of {imagePreview.length}
                            </div>
                        </div>

                        {imagePreview.length > 1 && (
                            <button
                                onClick={nextImage}
                                style={{
                                    position: 'absolute',
                                    right: '-60px',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    color: 'white',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <i className='bx bx-chevron-right'></i>
                            </button>
                        )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {imagePreview.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '10px',
                            padding: '15px',
                            background: 'rgba(0,0,0,0.5)',
                            borderRadius: '10px',
                            maxWidth: '90%',
                            overflowX: 'auto'
                        }}>
                            {imagePreview.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(idx);
                                    }}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: idx === currentImageIndex ? '3px solid white' : '3px solid transparent',
                                        opacity: idx === currentImageIndex ? 1 : 0.6,
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = idx === currentImageIndex ? 1 : 0.6}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Edit Session Modal */}
            {showEditModal && editingSession && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '10px',
                        padding: '30px',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#007BFF' }}>✏️ Edit Session</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#6c757d'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Basic Session Info */}
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Session Title</label>
                            <input
                                type="text"
                                value={editingSession.session_title}
                                onChange={(e) => setEditingSession({ ...editingSession, session_title: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Session Host</label>
                            <input
                                type="text"
                                value={editingSession.session_host}
                                onChange={(e) => setEditingSession({ ...editingSession, session_host: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Session Date</label>
                                <input
                                    type="date"
                                    value={editingSession.session_date ? editingSession.session_date.split('T')[0] : ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, session_date: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Session Time</label>
                                <input
                                    type="text"
                                    value={editingSession.session_time || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, session_time: e.target.value })}
                                    placeholder="e.g., 10:30 AM"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>School</label>
                                <select
                                    value={editingSession.school_id || ''}
                                    onChange={(e) => {
                                        setEditingSession({ ...editingSession, school_id: e.target.value });
                                        fetchLabsForSchool(e.target.value, setLabs);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                >
                                    <option value="">Select School</option>
                                    {schoolNames.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.school_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Lab</label>
                                <select
                                    value={editingSession.lab_id || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, lab_id: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                >
                                    <option value="">Select Lab</option>
                                    {labs.map((lab) => (
                                        <option key={lab.id} value={lab.id}>
                                            {lab.lab_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Session Description</label>
                            <textarea
                                value={editingSession.session_description || ''}
                                onChange={(e) => setEditingSession({ ...editingSession, session_description: e.target.value })}
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px'
                                }}
                            />
                        </div>

                        {/* SATHEE KENDRA Section */}
                        <div style={{ marginTop: '25px', marginBottom: '15px', borderTop: '2px solid #007BFF', paddingTop: '15px' }}>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Centre Code</label>
                                <input
                                    type="text"
                                    value={editingSession.centre_code || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, centre_code: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>State</label>
                                <input
                                    type="text"
                                    value={editingSession.state || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, state: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>District / Block / Zone</label>
                                <input
                                    type="text"
                                    value={editingSession.district || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, district: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Coordinator Name</label>
                                <input
                                    type="text"
                                    value={editingSession.sathee_mitra_name || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, sathee_mitra_name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Type of School Visited</label>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {['Government', 'Private', 'Aided', 'Other'].map(type => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="edit_school_type"
                                            value={type}
                                            checked={editingSession.school_type === type}
                                            onChange={(e) => setEditingSession({ ...editingSession, school_type: e.target.value })}
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                            {editingSession.school_type === 'Other' && (
                                <input
                                    type="text"
                                    value={editingSession.school_type_other || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, school_type_other: e.target.value })}
                                    placeholder="Please specify"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        marginTop: '10px'
                                    }}
                                />
                            )}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>School Address</label>
                            <textarea
                                value={editingSession.school_address || ''}
                                onChange={(e) => setEditingSession({ ...editingSession, school_address: e.target.value })}
                                rows="2"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Principal's Name</label>
                                <input
                                    type="text"
                                    value={editingSession.principal_name || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, principal_name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Principal's Contact</label>
                                <input
                                    type="tel"
                                    value={editingSession.principal_contact || ''}
                                    onChange={(e) => setEditingSession({ ...editingSession, principal_contact: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Mode of Visit</label>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {['In-person', 'Virtual', 'Phone Call'].map(mode => (
                                    <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="edit_visit_mode"
                                            value={mode}
                                            checked={editingSession.visit_mode === mode}
                                            onChange={(e) => setEditingSession({ ...editingSession, visit_mode: e.target.value })}
                                        />
                                        <span>{mode}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Status</label>
                            <select
                                value={editingSession.session_status || 'Pending'}
                                onChange={(e) => setEditingSession({ ...editingSession, session_status: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px'
                                }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                            <button
                                onClick={() => {
                                    handleEditSessionData(
                                        { preventDefault: () => { } },
                                        editingSession.id,
                                        {
                                            session_title: editingSession.session_title,
                                            session_host: editingSession.session_host,
                                            session_date: editingSession.session_date,
                                            session_time: editingSession.session_time,
                                            school_id: editingSession.school_id,
                                            lab_id: editingSession.lab_id,
                                            session_description: editingSession.session_description,
                                            session_status: editingSession.session_status,
                                            centre_code: editingSession.centre_code,
                                            state: editingSession.state,
                                            district: editingSession.district,
                                            sathee_mitra_name: editingSession.sathee_mitra_name,
                                            school_type: editingSession.school_type,
                                            school_type_other: editingSession.school_type_other,
                                            school_address: editingSession.school_address,
                                            principal_name: editingSession.principal_name,
                                            principal_contact: editingSession.principal_contact,
                                            visit_mode: editingSession.visit_mode
                                        },
                                        () => {
                                            setShowEditModal(false);
                                            loadSessions();
                                        }
                                    );
                                }}
                                style={{
                                    flex: 1,
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                💾 Save Changes
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                style={{
                                    flex: 1,
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionSetup;

