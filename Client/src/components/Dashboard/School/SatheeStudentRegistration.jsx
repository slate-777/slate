import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Oval } from 'react-loader-spinner';
import Axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const SatheeStudentRegistration = () => {
    const [studentData, setStudentData] = useState({
        studentName: '',
        schoolName: '',
        mobileNumber: '',
        email: '',
        courseOpted: ''
    });
    const [loading, setLoading] = useState(false);
    const [allStudents, setAllStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAllStudents();
    }, []);

    const fetchAllStudents = async () => {
        try {
            const response = await Axios.get(`${API_URL}/sathee-students/all`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            if (response.data.status === 'success') {
                setAllStudents(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            const payload = {
                studentName: studentData.studentName,
                schoolName: studentData.schoolName,
                mobileNumber: studentData.mobileNumber || null,
                email: studentData.email || null,
                courseOpted: studentData.courseOpted || null
            };

            console.log('Submitting payload:', payload);

            if (isEditing) {
                response = await Axios.put(`${API_URL}/sathee-students/${editingId}`, payload, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
            } else {
                response = await Axios.post(`${API_URL}/sathee-students/register`, payload, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
            }

            if (response.data.status === 'success') {
                toast.success(response.data.message, { position: 'top-center' });
                setStudentData({
                    studentName: '',
                    schoolName: '',
                    mobileNumber: '',
                    email: '',
                    courseOpted: ''
                });
                setIsEditing(false);
                setEditingId(null);
                fetchAllStudents();
            } else {
                toast.error(response.data.message, { position: 'top-center' });
            }
        } catch (error) {
            console.error('Error saving student:', error);
            console.error('Error response:', error.response?.data);
            const errorMsg = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'register'} student!`;
            toast.error(errorMsg, { position: 'top-center' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (student) => {
        console.log('Editing student:', student);
        setStudentData({
            studentName: student.student_name,
            schoolName: student.school_name || '',
            mobileNumber: student.mobile_number || '',
            email: student.email || '',
            courseOpted: student.course_opted || ''
        });
        setEditingId(student.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setStudentData({
            studentName: '',
            schoolName: '',
            mobileNumber: '',
            email: '',
            courseOpted: ''
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleDelete = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await Axios.delete(`${API_URL}/sathee-students/${studentId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (response.data.status === 'success') {
                    toast.success(response.data.message, { position: 'top-center' });
                    fetchAllStudents();
                } else {
                    toast.error(response.data.message, { position: 'top-center' });
                }
            } catch (error) {
                console.error('Error deleting student:', error);
                toast.error('Failed to delete student!', { position: 'top-center' });
            }
        }
    };

    const filteredStudents = allStudents.filter(student =>
        student.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.school_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.mobile_number?.includes(searchQuery) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="upload-document-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>{isEditing ? '✏️ Edit Student' : '🎓 Sathee Student Registration'}</h1>
                {loading && <Oval height="22" width="22" color="blue" ariaLabel="loading" />}
            </header>

            <form className="upload-document-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Student Name <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text"
                        name="studentName"
                        value={studentData.studentName}
                        onChange={handleChange}
                        placeholder="Enter Student Name"
                        autoComplete="off"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>School <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text"
                        name="schoolName"
                        value={studentData.schoolName}
                        onChange={handleChange}
                        placeholder="Enter School Name"
                        autoComplete="off"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Course Opted (Optional)</label>
                    <input
                        type="text"
                        name="courseOpted"
                        value={studentData.courseOpted}
                        onChange={handleChange}
                        placeholder="Enter Course Name (e.g., AI/ML, Robotics, 3D Printing)"
                        autoComplete="off"
                    />
                </div>

                <div className="in-row-input">
                    <div className="form-group">
                        <label>Mobile Number (Optional)</label>
                        <input
                            type="tel"
                            name="mobileNumber"
                            value={studentData.mobileNumber}
                            onChange={handleChange}
                            placeholder="Enter Mobile Number"
                            autoComplete="off"
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit mobile number"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email (Optional)</label>
                        <input
                            type="email"
                            name="email"
                            value={studentData.email}
                            onChange={handleChange}
                            placeholder="Enter Email Address"
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
                    <button type="submit" disabled={loading} style={{ flex: 1 }}>
                        {loading ? (isEditing ? 'Updating...' : 'Registering...') : (isEditing ? 'Update Student' : 'Register Student')}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            style={{
                                flex: 1,
                                background: '#6c757d',
                                color: 'white'
                            }}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {/* All Students List */}
            <div style={{ marginTop: '40px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    borderBottom: '2px solid #007BFF',
                    paddingBottom: '10px',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <h2 style={{ color: '#007BFF', margin: 0 }}>📋 Registered Students ({allStudents.length})</h2>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '10px 15px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                width: '300px'
                            }}
                        />
                        <button
                            onClick={async () => {
                                try {
                                    const response = await Axios.get(`${API_URL}/sathee-students/download/excel`, {
                                        headers: {
                                            Authorization: localStorage.getItem('token')
                                        },
                                        responseType: 'blob'
                                    });

                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', 'Sathee_Students_Report.xlsx');
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                    toast.success('Excel file downloaded successfully!', { position: 'top-center' });
                                } catch (error) {
                                    console.error('Error downloading Excel:', error);
                                    toast.error('Failed to download Excel file!', { position: 'top-center' });
                                }
                            }}
                            style={{
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: '500',
                                whiteSpace: 'nowrap'
                            }}
                            title="Download all students as Excel"
                        >
                            <i className='bx bx-download'></i> Download Excel
                        </button>
                    </div>
                </div>

                {filteredStudents.length > 0 ? (
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
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Student Name</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>School</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Course Opted</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Mobile Number</th>
                                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                                    <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr key={student.id} style={{
                                        borderBottom: '1px solid #dee2e6',
                                        background: index % 2 === 0 ? 'white' : '#f8f9fa'
                                    }}>
                                        <td style={{ padding: '15px' }}>{student.id}</td>
                                        <td style={{ padding: '15px', fontWeight: '500' }}>{student.student_name}</td>
                                        <td style={{ padding: '15px' }}>{student.school_name}</td>
                                        <td style={{ padding: '15px' }}>{student.course_opted || 'N/A'}</td>
                                        <td style={{ padding: '15px' }}>{student.mobile_number || 'N/A'}</td>
                                        <td style={{ padding: '15px' }}>{student.email || 'N/A'}</td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    style={{
                                                        background: '#007BFF',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 15px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
                                                    title="Edit Student"
                                                >
                                                    <i className='bx bx-edit'></i> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    style={{
                                                        background: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 15px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
                                                    title="Delete Student"
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
                        <i className='bx bx-user-x' style={{ fontSize: '48px', color: '#6c757d' }}></i>
                        <p style={{ color: '#6c757d', marginTop: '10px' }}>
                            {searchQuery ? 'No students found matching your search' : 'No students registered yet'}
                        </p>
                    </div>
                )}
            </div>

            <div className="usage-instructions">
                <h2>📢 Usage Instructions</h2>
                <ul>
                    <li><i className='bx bx-info-circle'></i> Student Name and School are required fields</li>
                    <li><i className='bx bx-info-circle'></i> Mobile Number and Email are optional but recommended</li>
                    <li><i className='bx bx-info-circle'></i> Mobile number should be 10 digits</li>
                    <li><i className='bx bx-info-circle'></i> All registered students will be displayed in the table below</li>
                </ul>
            </div>
        </div>
    );
};

export default SatheeStudentRegistration;
