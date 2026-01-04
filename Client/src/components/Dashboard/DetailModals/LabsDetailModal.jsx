import React, { useState, useEffect } from 'react';
import { fetchAllLabs } from '../ApiHandler/labFunctions';
import { fetchLabEquipmentCount } from '../ApiHandler/equipmentFunctions';
import './DetailModal.css';

const LabsDetailModal = ({ isOpen, onClose }) => {
    const [labs, setLabs] = useState([]);
    const [labEquipmentData, setLabEquipmentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('lab_name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            Promise.all([
                fetchAllLabs(setLabs),
                fetchLabEquipmentCount(setLabEquipmentData)
            ]).finally(() => setLoading(false));
        }
    }, [isOpen]);

    const filteredLabs = labs.filter(lab =>
        lab.lab_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.lab_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.school_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedLabs = [...filteredLabs].sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        if (sortBy === 'lab_capacity') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
    });

    const totalPages = Math.ceil(sortedLabs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLabs = sortedLabs.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Group labs by type for analytics
    const labsByType = labs.reduce((acc, lab) => {
        const type = lab.lab_type || 'Unknown';
        if (!acc[type]) {
            acc[type] = { count: 0, totalCapacity: 0 };
        }
        acc[type].count++;
        acc[type].totalCapacity += parseInt(lab.lab_capacity) || 0;
        return acc;
    }, {});

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className='bx bx-test-tube'></i>
                        Labs Details
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
                        Labs List
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('equipment')}
                    >
                        <i className='bx bx-box'></i>
                        Equipment Allocation
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <i className='bx bx-bar-chart-alt-2'></i>
                        Lab Analytics
                    </button>
                </div>

                <div className="modal-content">
                    {loading ? (
                        <div className="loading-spinner">
                            <i className='bx bx-loader-alt bx-spin'></i>
                            <p>Loading labs data...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'list' && (
                                <div className="labs-list-tab">
                                    <div className="controls-section">
                                        <div className="search-box">
                                            <i className='bx bx-search'></i>
                                            <input
                                                type="text"
                                                placeholder="Search labs, types, or schools..."
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
                                                <option value="lab_name">Lab Name</option>
                                                <option value="lab_type">Lab Type</option>
                                                <option value="school_name">School</option>
                                                <option value="lab_capacity">Capacity</option>
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
                                        <p>Showing {paginatedLabs.length} of {filteredLabs.length} labs</p>
                                    </div>

                                    <div className="labs-table-container">
                                        <table className="labs-table">
                                            <thead>
                                                <tr>
                                                    <th onClick={() => handleSort('lab_name')}>
                                                        Lab Name
                                                        {sortBy === 'lab_name' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('lab_type')}>
                                                        Type
                                                        {sortBy === 'lab_type' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('school_name')}>
                                                        School
                                                        {sortBy === 'school_name' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('lab_capacity')}>
                                                        Capacity
                                                        {sortBy === 'lab_capacity' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th>Description</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedLabs.map((lab, index) => (
                                                    <tr key={lab.id || index}>
                                                        <td>
                                                            <div className="lab-info">
                                                                <strong>{lab.lab_name}</strong>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="lab-type-badge">
                                                                {lab.lab_type}
                                                            </span>
                                                        </td>
                                                        <td>{lab.school_name}</td>
                                                        <td>
                                                            <span className="capacity-badge">
                                                                {lab.lab_capacity} students
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="description-text">
                                                                {lab.lab_description || 'No description'}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`status-badge ${lab.status === 1 ? 'active' : 'inactive'}`}>
                                                                {lab.status === 1 ? 'Active' : 'Inactive'}
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

                            {activeTab === 'equipment' && (
                                <div className="equipment-tab">
                                    <div className="equipment-header">
                                        <h3>Lab Equipment Allocation</h3>
                                        <p>Equipment distribution across all labs</p>
                                    </div>

                                    <div className="equipment-table-container">
                                        <table className="equipment-table">
                                            <thead>
                                                <tr>
                                                    <th>Lab Name</th>
                                                    <th>Equipment Types</th>
                                                    <th>Total Equipment</th>
                                                    <th>Allocation Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {labEquipmentData.map((lab, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <strong>{lab.lab_name}</strong>
                                                        </td>
                                                        <td>
                                                            <div className="equipment-names">
                                                                {lab.equipment_names && lab.equipment_names.length > 0 ? (
                                                                    lab.equipment_names.map((name, idx) => (
                                                                        <span key={idx} className="equipment-tag">
                                                                            {name}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="no-equipment">No Equipment</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="equipment-count-badge">
                                                                {lab.equipment_count}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`allocation-status ${lab.equipment_count > 0 ? 'allocated' : 'empty'}`}>
                                                                {lab.equipment_count > 0 ? 'Equipped' : 'Empty'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'analytics' && (
                                <div className="analytics-tab">
                                    <div className="analytics-header">
                                        <h3>Lab Type Distribution</h3>
                                        <p>Analysis of lab types and their capacities</p>
                                    </div>

                                    <div className="lab-type-analytics">
                                        {Object.entries(labsByType).map(([type, data]) => (
                                            <div key={type} className="lab-type-card">
                                                <div className="lab-type-header">
                                                    <h4>{type}</h4>
                                                    <div className="lab-type-stats">
                                                        <span className="lab-count">{data.count} Labs</span>
                                                        <span className="total-capacity">{data.totalCapacity} Total Capacity</span>
                                                    </div>
                                                </div>
                                                <div className="lab-type-progress">
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${(data.count / labs.length) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="lab-type-percentage">
                                                    {((data.count / labs.length) * 100).toFixed(1)}% of all labs
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="capacity-summary">
                                        <h4>Capacity Summary</h4>
                                        <div className="summary-stats">
                                            <div className="stat-item">
                                                <span className="stat-label">Total Labs:</span>
                                                <span className="stat-value">{labs.length}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Total Capacity:</span>
                                                <span className="stat-value">
                                                    {labs.reduce((sum, lab) => sum + (parseInt(lab.lab_capacity) || 0), 0)} students
                                                </span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Average Capacity:</span>
                                                <span className="stat-value">
                                                    {Math.round(labs.reduce((sum, lab) => sum + (parseInt(lab.lab_capacity) || 0), 0) / labs.length)} students
                                                </span>
                                            </div>
                                        </div>
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

export default LabsDetailModal;