import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
import usePagination from '../../hooks/usePagination';

const API_URL = process.env.REACT_APP_API_URL;

const ViewSatheeStudents = ({ role, showAllEntities }) => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchStudents();
    }, [showAllEntities, role]);

    const fetchStudents = async () => {
        try {
            const response = await Axios.get(`${API_URL}/sathee-students/all`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            if (response.data.status === 'success') {
                setStudents(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to fetch students!', { position: 'top-center' });
        }
    };

    const handleDelete = async (studentId, studentName) => {
        if (window.confirm(`Are you sure you want to delete "${studentName}"?`)) {
            try {
                const response = await Axios.delete(`${API_URL}/sathee-students/${studentId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (response.data.status === 'success') {
                    toast.success(response.data.message, { position: 'top-center' });
                    fetchStudents();
                } else {
                    toast.error(response.data.message, { position: 'top-center' });
                }
            } catch (error) {
                console.error('Error deleting student:', error);
                toast.error('Failed to delete student!', { position: 'top-center' });
            }
        }
    };

    const filteredStudents = students.filter(student =>
        student.student_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        student.school_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        student.mobile_number?.includes(searchQuery) ||
        student.email?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );

    const {
        currentPage,
        entriesPerPage,
        currentEntries,
        handlePageChange,
        handleEntriesChange,
        totalEntries,
        startEntry,
        endEntry,
        totalPages
    } = usePagination(filteredStudents, 10);

    return (
        <div className="artifacts-container my-entries-section">
            <ToastContainer />
            <header className="artifacts-header">
                <h1>{showAllEntities ? 'All Sathee Students' : 'My Sathee Students'}</h1>
            </header>
            <div className="artifacts-table-container">
                <div className='header-select-entries'>
                    <th className='select-entries'>Show
                        <select onChange={handleEntriesChange} value={entriesPerPage}>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>entries
                    </th>
                    <th className='user-search'>
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Type here..."
                            className="user-search-bar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </th>
                </div>
                <div className="artifacts-table-view">
                    <table className="artifacts-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Student Name</th>
                                <th>School</th>
                                <th>Mobile Number</th>
                                <th>Email</th>
                                <th>Registration Date</th>
                                {(role === 1 || !showAllEntities) && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentEntries.map((student, index) => (
                                <tr key={index}>
                                    <td>{student.id}</td>
                                    <td>
                                        <div>
                                            <p style={{ fontWeight: '600', margin: 0 }}>{student.student_name}</p>
                                        </div>
                                    </td>
                                    <td>{student.school_name}</td>
                                    <td>{student.mobile_number || 'N/A'}</td>
                                    <td>{student.email || 'N/A'}</td>
                                    <td>
                                        {student.created_at ? new Date(student.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </td>
                                    {(role === 1 || !showAllEntities) && (
                                        <td>
                                            <a
                                                href="# "
                                                className="edit-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDelete(student.id, student.student_name);
                                                }}
                                                style={{ color: '#dc3545' }}
                                            >
                                                🗑️ Delete
                                            </a>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination">
                    <p>Showing {startEntry} to {endEntry} of {totalEntries} entries</p>
                    <div className="pagination-buttons">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={currentPage === i + 1 ? "active" : ""}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewSatheeStudents;
