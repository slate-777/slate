import React, { useState, useEffect } from 'react';
import { fetchAllEquipments, fetchAllAllocatedEquipments } from '../ApiHandler/equipmentFunctions';
import './DetailModal.css';

const EquipmentDetailModal = ({ isOpen, onClose }) => {
    const [equipment, setEquipment] = useState([]);
    const [allocatedEquipment, setAllocatedEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('available');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('equipment_name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            Promise.all([
                fetchAllEquipments(setEquipment),
                fetchAllAllocatedEquipments(setAllocatedEquipment)
            ]).finally(() => setLoading(false));
        }
    }, [isOpen]);

    const getFilteredData = () => {
        const data = activeTab === 'available' ? equipment : allocatedEquipment;
        return data.filter(item =>
            item.equipment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lab_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getSortedData = () => {
        const filtered = getFilteredData();
        return [...filtered].sort((a, b) => {
            const aValue = a[sortBy] || '';
            const bValue = b[sortBy] || '';

            if (['equipment_quantity', 'allocated_quantity'].includes(sortBy)) {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (sortOrder === 'asc') {
                return aValue.localeCompare(bValue);
            }
            return bValue.localeCompare(aValue);
        });
    };

    const sortedData = getSortedData();
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchTerm('');
    };

    // Analytics data
    const equipmentByType = equipment.reduce((acc, item) => {
        const name = item.equipment_name || 'Unknown';
        if (!acc[name]) {
            acc[name] = { total: 0, allocated: 0 };
        }
        acc[name].total += parseInt(item.equipment_quantity) || 0;
        return acc;
    }, {});

    // Add allocated quantities
    allocatedEquipment.forEach(item => {
        const name = item.equipment_name || 'Unknown';
        if (equipmentByType[name]) {
            equipmentByType[name].allocated += parseInt(item.allocated_quantity) || 0;
        }
    });

    const warrantyStatus = equipment.reduce((acc, item) => {
        const status = item.warranty_status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className='bx bx-box'></i>
                        Equipment Details
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className='bx bx-x'></i>
                    </button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
                        onClick={() => handleTabChange('available')}
                    >
                        <i className='bx bx-package'></i>
                        Available Equipment
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'allocated' ? 'active' : ''}`}
                        onClick={() => handleTabChange('allocated')}
                    >
                        <i className='bx bx-transfer'></i>
                        Allocated Equipment
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => handleTabChange('analytics')}
                    >
                        <i className='bx bx-bar-chart-alt-2'></i>
                        Equipment Analytics
                    </button>
                </div>

                <div className="modal-content">
                    {loading ? (
                        <div className="loading-spinner">
                            <i className='bx bx-loader-alt bx-spin'></i>
                            <p>Loading equipment data...</p>
                        </div>
                    ) : (
                        <>
                            {(activeTab === 'available' || activeTab === 'allocated') && (
                                <div className="equipment-list-tab">
                                    <div className="controls-section">
                                        <div className="search-box">
                                            <i className='bx bx-search'></i>
                                            <input
                                                type="text"
                                                placeholder={`Search ${activeTab} equipment...`}
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
                                                <option value="equipment_name">Equipment Name</option>
                                                {activeTab === 'available' && (
                                                    <>
                                                        <option value="equipment_quantity">Quantity</option>
                                                        <option value="warranty_status">Warranty</option>
                                                    </>
                                                )}
                                                {activeTab === 'allocated' && (
                                                    <>
                                                        <option value="allocated_quantity">Allocated Quantity</option>
                                                        <option value="school_name">School</option>
                                                        <option value="lab_name">Lab</option>
                                                    </>
                                                )}
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
                                        <p>Showing {paginatedData.length} of {sortedData.length} items</p>
                                    </div>

                                    <div className="equipment-table-container">
                                        <table className="equipment-table">
                                            <thead>
                                                <tr>
                                                    <th onClick={() => handleSort('equipment_name')}>
                                                        Equipment Name
                                                        {sortBy === 'equipment_name' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    {activeTab === 'available' && (
                                                        <>
                                                            <th onClick={() => handleSort('equipment_quantity')}>
                                                                Quantity
                                                                {sortBy === 'equipment_quantity' && (
                                                                    <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                                )}
                                                            </th>
                                                            <th>Serial Number</th>
                                                            <th onClick={() => handleSort('warranty_status')}>
                                                                Warranty
                                                                {sortBy === 'warranty_status' && (
                                                                    <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                                )}
                                                            </th>
                                                            <th>Expiry Date</th>
                                                        </>
                                                    )}
                                                    {activeTab === 'allocated' && (
                                                        <>
                                                            <th onClick={() => handleSort('school_name')}>
                                                                School
                                                                {sortBy === 'school_name' && (
                                                                    <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                                )}
                                                            </th>
                                                            <th onClick={() => handleSort('lab_name')}>
                                                                Lab
                                                                {sortBy === 'lab_name' && (
                                                                    <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                                )}
                                                            </th>
                                                            <th onClick={() => handleSort('allocated_quantity')}>
                                                                Allocated Qty
                                                                {sortBy === 'allocated_quantity' && (
                                                                    <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                                )}
                                                            </th>
                                                            <th>Allocation Date</th>
                                                        </>
                                                    )}
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedData.map((item, index) => (
                                                    <tr key={item.id || index}>
                                                        <td>
                                                            <div className="equipment-info">
                                                                <strong>{item.equipment_name}</strong>
                                                                <small>{item.equipment_description}</small>
                                                            </div>
                                                        </td>
                                                        {activeTab === 'available' && (
                                                            <>
                                                                <td>
                                                                    <span className="quantity-badge">
                                                                        {item.equipment_quantity}
                                                                    </span>
                                                                </td>
                                                                <td>{item.serial_number || 'N/A'}</td>
                                                                <td>
                                                                    <span className={`warranty-badge ${item.warranty_status?.toLowerCase()}`}>
                                                                        {item.warranty_status}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                                                                </td>
                                                            </>
                                                        )}
                                                        {activeTab === 'allocated' && (
                                                            <>
                                                                <td>{item.school_name}</td>
                                                                <td>{item.lab_name}</td>
                                                                <td>
                                                                    <span className="allocated-quantity-badge">
                                                                        {item.allocated_quantity}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {item.allocation_date ? new Date(item.allocation_date).toLocaleDateString() : 'N/A'}
                                                                </td>
                                                            </>
                                                        )}
                                                        <td>
                                                            <span className={`status-badge ${item.status === 1 ? 'active' : 'inactive'}`}>
                                                                {item.status === 1 ? 'Active' : 'Inactive'}
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
                                        <h3>Equipment Analytics</h3>
                                        <p>Overview of equipment inventory and allocation</p>
                                    </div>

                                    <div className="analytics-grid">
                                        <div className="analytics-section">
                                            <h4>Equipment by Type</h4>
                                            <div className="equipment-type-list">
                                                {Object.entries(equipmentByType).map(([type, data]) => (
                                                    <div key={type} className="equipment-type-item">
                                                        <div className="equipment-type-header">
                                                            <span className="type-name">{type}</span>
                                                            <div className="type-stats">
                                                                <span className="total-count">Total: {data.total}</span>
                                                                <span className="allocated-count">Allocated: {data.allocated}</span>
                                                            </div>
                                                        </div>
                                                        <div className="allocation-progress">
                                                            <div
                                                                className="progress-bar"
                                                                style={{
                                                                    width: `${data.total > 0 ? (data.allocated / data.total) * 100 : 0}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="allocation-percentage">
                                                            {data.total > 0 ? ((data.allocated / data.total) * 100).toFixed(1) : 0}% allocated
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="analytics-section">
                                            <h4>Warranty Status Distribution</h4>
                                            <div className="warranty-stats">
                                                {Object.entries(warrantyStatus).map(([status, count]) => (
                                                    <div key={status} className="warranty-item">
                                                        <span className={`warranty-badge ${status.toLowerCase()}`}>
                                                            {status}
                                                        </span>
                                                        <span className="warranty-count">{count} items</span>
                                                        <div className="warranty-progress">
                                                            <div
                                                                className="progress-bar"
                                                                style={{
                                                                    width: `${(count / equipment.length) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="summary-stats">
                                        <div className="stat-card">
                                            <i className='bx bx-package'></i>
                                            <div className="stat-info">
                                                <h4>Total Equipment Types</h4>
                                                <p>{Object.keys(equipmentByType).length}</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <i className='bx bx-box'></i>
                                            <div className="stat-info">
                                                <h4>Total Equipment Items</h4>
                                                <p>{equipment.reduce((sum, item) => sum + (parseInt(item.equipment_quantity) || 0), 0)}</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <i className='bx bx-transfer'></i>
                                            <div className="stat-info">
                                                <h4>Total Allocated</h4>
                                                <p>{allocatedEquipment.reduce((sum, item) => sum + (parseInt(item.allocated_quantity) || 0), 0)}</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <i className='bx bx-check-circle'></i>
                                            <div className="stat-info">
                                                <h4>Allocation Rate</h4>
                                                <p>
                                                    {equipment.length > 0
                                                        ? ((allocatedEquipment.length / equipment.length) * 100).toFixed(1)
                                                        : 0
                                                    }%
                                                </p>
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

export default EquipmentDetailModal;