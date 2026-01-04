import { useState, useEffect } from 'react';
import Axios from 'axios';
import './DetailModal.css';

const API_URL = process.env.REACT_APP_API_URL;

const SatheeStudentsDetailModal = ({ isOpen, onClose }) => {
    const [students, setStudents] = useState([]);
    const [studentsPerSchool, setStudentsPerSchool] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('student_name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await Axios.get(`${API_URL}/sathee-students/all`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            if (response.data.status === 'success') {
                setStudents(response.data.data);
                calculateStudentsPerSchool(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStudentsPerSchool = (studentsData) => {
        const schoolMap = {};
        studentsData.forEach(student => {
            const schoolName = student.school_name || 'Unknown School';
            if (!schoolMap[schoolName]) {
                schoolMap[schoolName] = 0;
            }
            schoolMap[schoolName]++;
        });

        const schoolsArray = Object.entries(schoolMap).map(([school, count]) => ({
            school_name: school,
            student_count: count
        })).sort((a, b) => b.student_count - a.student_count);

        setStudentsPerSchool(schoolsArray);
    };

    const filteredStudents = students.filter(student =>
        student.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course_opted?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobile_number?.includes(searchTerm) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedStudents = [...filteredStudents].sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        if (sortOrder === 'asc') {
            return aValue.toString().localeCompare(bValue.toString());
        }
        return bValue.toString().localeCompare(aValue.toString());
    });

    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedStudents = sortedStudents.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className='bx bx-user-plus'></i>
                        Sathee Students Details
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className='bx bx-x'></i>
                    </button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        <i className='bx bx-list-ul'></i>
                        Students List
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <i className='bx bx-bar-chart-alt-2'></i>
                        School Analytics
                    </button>
                </div>

                <div className="modal-content">
                    {loading ? (
                        <div className="loading-spinner">
                            <i className='bx bx-loader-alt bx-spin'></i>
                            <p>Loading students data...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'list' && (
                                <div className="schools-list-tab">
                                    <div className="controls-section">
                                        <div className="search-box">
                                            <i className='bx bx-search'></i>
                                            <input
                                                type="text"
                                                placeholder="Search students, schools, course, mobile, or email..."
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                        </div>
                                        <div className="sort-controls">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                            >
                                                <option value="student_name">Student Name</option>
                                                <option value="school_name">School</option>
                                                <option value="course_opted">Course Opted</option>
                                                <option value="created_at">Registration Date</option>
                                            </select>
                                            <button
                                                className="sort-order-btn"
                                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                            >
                                                <i className={`bx bx-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="results-info">
                                        <p>Showing {paginatedStudents.length} of {filteredStudents.length} students</p>
                                    </div>

                                    <div className="schools-table-container">
                                        <table className="schools-table">
                                            <thead>
                                                <tr>
                                                    <th onClick={() => handleSort('student_name')}>
                                                        Student Name
                                                        {sortBy === 'student_name' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('school_name')}>
                                                        School
                                                        {sortBy === 'school_name' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('course_opted')}>
                                                        Course Opted
                                                        {sortBy === 'course_opted' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th>Mobile Number</th>
                                                    <th>Email</th>
                                                    <th onClick={() => handleSort('created_at')}>
                                                        Registration Date
                                                        {sortBy === 'created_at' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedStudents.map((student, index) => (
                                                    <tr key={student.id || index}>
                                                        <td>
                                                            <div className="school-info">
                                                                <strong>{student.student_name}</strong>
                                                                <small>ID: {student.id}</small>
                                                            </div>
                                                        </td>
                                                        <td>{student.school_name}</td>
                                                        <td>{student.course_opted || 'N/A'}</td>
                                                        <td>{student.mobile_number || 'N/A'}</td>
                                                        <td>{student.email || 'N/A'}</td>
                                                        <td>
                                                            {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="pagination">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <i className='bx bx-chevron-left'></i>
                                            </button>
                                            <span>Page {currentPage} of {totalPages}</span>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                            >
                                                <i className='bx bx-chevron-right'></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'analytics' && (
                                <div className="analytics-tab">
                                    <div className="analytics-header">
                                        <h3>Students Distribution by School</h3>
                                        <p>Total Schools with Students: {studentsPerSchool.length}</p>
                                    </div>

                                    <div className="state-analytics-grid">
                                        {studentsPerSchool.map((schoolData, index) => (
                                            <div key={index} className="state-card">
                                                <div className="state-card-header">
                                                    <h4>{schoolData.school_name}</h4>
                                                    <span className="school-count-badge">
                                                        {schoolData.student_count} Students
                                                    </span>
                                                </div>
                                                <div className="state-progress">
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${(schoolData.student_count / Math.max(...studentsPerSchool.map(s => s.student_count))) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="state-percentage">
                                                    {((schoolData.student_count / studentsPerSchool.reduce((sum, s) => sum + s.student_count, 0)) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SatheeStudentsDetailModal;
