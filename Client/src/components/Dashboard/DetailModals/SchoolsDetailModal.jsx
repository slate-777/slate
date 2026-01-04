import React, { useState, useEffect } from 'react';
import { fetchAllSchools, fetchSchoolsPerState } from '../ApiHandler/schoolFunctions';
import './DetailModal.css';

const SchoolsDetailModal = ({ isOpen, onClose }) => {
    const [schools, setSchools] = useState([]);
    const [schoolsPerState, setSchoolsPerState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('school_name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            Promise.all([
                fetchAllSchools(setSchools),
                fetchSchoolsPerState(setSchoolsPerState)
            ]).finally(() => setLoading(false));
        }
    }, [isOpen]);

    const filteredSchools = schools.filter(school =>
        school.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.district?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedSchools = [...filteredSchools].sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        if (sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
    });

    const totalPages = Math.ceil(sortedSchools.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSchools = sortedSchools.slice(startIndex, startIndex + itemsPerPage);

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
                        <i className='bx bxs-school'></i>
                        Schools Details
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
                        Schools List
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <i className='bx bx-bar-chart-alt-2'></i>
                        State Analytics
                    </button>
                </div>

                <div className="modal-content">
                    {loading ? (
                        <div className="loading-spinner">
                            <i className='bx bx-loader-alt bx-spin'></i>
                            <p>Loading schools data...</p>
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
                                                placeholder="Search schools, states, or districts..."
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
                                                <option value="school_name">School Name</option>
                                                <option value="state">State</option>
                                                <option value="district">District</option>
                                                <option value="total_students">Total Students</option>
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
                                        <p>Showing {paginatedSchools.length} of {filteredSchools.length} schools</p>
                                    </div>

                                    <div className="schools-table-container">
                                        <table className="schools-table">
                                            <thead>
                                                <tr>
                                                    <th onClick={() => handleSort('school_name')}>
                                                        School Name
                                                        {sortBy === 'school_name' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('state')}>
                                                        State
                                                        {sortBy === 'state' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('district')}>
                                                        District
                                                        {sortBy === 'district' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th>Contact</th>
                                                    <th onClick={() => handleSort('total_students')}>
                                                        Students
                                                        {sortBy === 'total_students' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedSchools.map((school, index) => (
                                                    <tr key={school.id || index}>
                                                        <td>
                                                            <div className="school-info">
                                                                <strong>{school.school_name}</strong>
                                                                <small>UDISE: {school.udise}</small>
                                                            </div>
                                                        </td>
                                                        <td>{school.state}</td>
                                                        <td>{school.district}</td>
                                                        <td>
                                                            <div className="contact-info">
                                                                <div>{school.contact_person}</div>
                                                                <small>{school.contact_no}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="student-count">
                                                                {school.total_students || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`status-badge ${school.status === 1 ? 'active' : 'inactive'}`}>
                                                                {school.status === 1 ? 'Active' : 'Inactive'}
                                                            </span>
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
                                        <h3>Schools Distribution by State</h3>
                                        <p>Total States with Schools: {schoolsPerState.length}</p>
                                    </div>

                                    <div className="state-analytics-grid">
                                        {schoolsPerState.map((stateData, index) => (
                                            <div key={index} className="state-card">
                                                <div className="state-card-header">
                                                    <h4>{stateData.state}</h4>
                                                    <span className="school-count-badge">
                                                        {stateData.school_count} Schools
                                                    </span>
                                                </div>
                                                <div className="state-progress">
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${(stateData.school_count / Math.max(...schoolsPerState.map(s => s.school_count))) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="state-percentage">
                                                    {((stateData.school_count / schoolsPerState.reduce((sum, s) => sum + s.school_count, 0)) * 100).toFixed(1)}%
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

export default SchoolsDetailModal;