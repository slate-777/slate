import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Oval } from 'react-loader-spinner';
import './ManageGrievances.css';

const API_URL = process.env.REACT_APP_API_URL;

const ManageGrievances = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [updateData, setUpdateData] = useState({
        status: '',
        remarks: ''
    });

    const statusOptions = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

    const actionLabels = {
        'repair_replacement': '🔧 Repair / Replacement',
        'technical_support': '📞 Technical Support',
        'training': '🧑‍🏫 Training Required',
        'documentation': '📄 Documentation',
        'vendor_intervention': '🏷 Vendor Intervention',
        'urgent_escalation': '🚨 Urgent Escalation'
    };

    useEffect(() => {
        fetchAllGrievances();
    }, []);

    const fetchAllGrievances = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/grievances/all-grievances`, {
                headers: { 'Authorization': token }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setGrievances(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch grievances');
            }
        } catch (error) {
            console.error('Error fetching grievances:', error);
            toast.error('Failed to fetch grievances');
        } finally {
            setLoading(false);
        }
    };

    const handleViewGrievance = (grievance) => {
        setSelectedGrievance(grievance);
        setUpdateData({
            status: grievance.status || 'Pending',
            remarks: grievance.remarks || ''
        });
        setShowModal(true);
    };

    const handleUpdateStatus = async () => {
        if (!updateData.status) {
            toast.error('Please select a status');
            return;
        }

        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/grievances/update-status/${selectedGrievance.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();
            if (data.status === 'success') {
                toast.success('Grievance status updated successfully');
                setShowModal(false);
                fetchAllGrievances();
            } else {
                toast.error(data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'status-pending';
            case 'in progress': return 'status-progress';
            case 'resolved': return 'status-resolved';
            case 'closed': return 'status-closed';
            default: return 'status-pending';
        }
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'low': return 'priority-low';
            case 'medium': return 'priority-medium';
            case 'high': return 'priority-high';
            case 'critical': return 'priority-critical';
            default: return 'priority-medium';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter grievances
    const filteredGrievances = grievances.filter(g => {
        const matchesStatus = filterStatus === 'all' || g.status?.toLowerCase() === filterStatus.toLowerCase();
        const matchesPriority = filterPriority === 'all' || g.priority?.toLowerCase() === filterPriority.toLowerCase();
        const matchesSearch = searchQuery === '' ||
            g.grievance_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.issue_category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
    });

    // Stats
    const stats = {
        total: grievances.length,
        pending: grievances.filter(g => g.status === 'Pending').length,
        inProgress: grievances.filter(g => g.status === 'In Progress').length,
        resolved: grievances.filter(g => g.status === 'Resolved').length,
        critical: grievances.filter(g => g.priority === 'Critical').length
    };

    return (
        <div className="manage-grievances-container">
            <ToastContainer />

            <header className="grievances-header">
                <div className="header-content">
                    <h1>
                        <i className='bx bx-support'></i>
                        Grievance Management
                    </h1>
                    <p>View and manage all user grievances</p>
                </div>
                <button className="refresh-btn" onClick={fetchAllGrievances} disabled={loading}>
                    <i className={`bx bx-refresh ${loading ? 'spin' : ''}`}></i>
                    Refresh
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grievance-stats-grid">
                <div className="grievance-stat-card total">
                    <div className="stat-icon"><i className='bx bx-list-ul'></i></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Grievances</span>
                    </div>
                </div>
                <div className="grievance-stat-card pending">
                    <div className="stat-icon"><i className='bx bx-time'></i></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                </div>
                <div className="grievance-stat-card progress">
                    <div className="stat-icon"><i className='bx bx-loader'></i></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.inProgress}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>
                <div className="grievance-stat-card resolved">
                    <div className="stat-icon"><i className='bx bx-check-circle'></i></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.resolved}</span>
                        <span className="stat-label">Resolved</span>
                    </div>
                </div>
                <div className="grievance-stat-card critical">
                    <div className="stat-icon"><i className='bx bx-error'></i></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.critical}</span>
                        <span className="stat-label">Critical</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="search-box">
                    <i className='bx bx-search'></i>
                    <input
                        type="text"
                        placeholder="Search by ID, email, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All Status</option>
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                        <option value="all">All Priority</option>
                        {priorityOptions.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grievances Table */}
            {loading ? (
                <div className="loading-container">
                    <Oval height="50" width="50" color="#3b82f6" />
                    <p>Loading grievances...</p>
                </div>
            ) : filteredGrievances.length === 0 ? (
                <div className="empty-state">
                    <i className='bx bx-inbox'></i>
                    <h3>No Grievances Found</h3>
                    <p>No grievances match your current filters</p>
                </div>
            ) : (
                <div className="grievances-table-container">
                    <table className="grievances-table">
                        <thead>
                            <tr>
                                <th>Grievance ID</th>
                                <th>User</th>
                                <th>Category</th>
                                <th>Action Required</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGrievances.map((grievance) => (
                                <tr key={grievance.id}>
                                    <td className="grievance-id">{grievance.grievance_id}</td>
                                    <td>
                                        <div className="user-info">
                                            <span className="username">{grievance.username || 'N/A'}</span>
                                            <span className="email">{grievance.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="category-info">
                                            <span className="category">{grievance.issue_category}</span>
                                            <span className="sub-category">{grievance.issue_sub_category}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="action-badge">
                                            {actionLabels[grievance.action_required] || grievance.action_required}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`priority-badge ${getPriorityBadgeClass(grievance.priority)}`}>
                                            {grievance.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeClass(grievance.status)}`}>
                                            {grievance.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="date">{formatDate(grievance.created_at)}</td>
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => handleViewGrievance(grievance)}
                                        >
                                            <i className='bx bx-show'></i>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {showModal && selectedGrievance && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="grievance-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <i className='bx bx-detail'></i>
                                Grievance Details
                            </h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <i className='bx bx-x'></i>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="grievance-id-section">
                                <span className="label">Grievance ID</span>
                                <span className="value">{selectedGrievance.grievance_id}</span>
                            </div>

                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="label">Submitted By</span>
                                    <span className="value">{selectedGrievance.username || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Email</span>
                                    <span className="value">{selectedGrievance.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Issue Category</span>
                                    <span className="value">{selectedGrievance.issue_category}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Sub-Category</span>
                                    <span className="value">{selectedGrievance.issue_sub_category}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Action Required</span>
                                    <span className="value">{actionLabels[selectedGrievance.action_required] || selectedGrievance.action_required}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Priority</span>
                                    <span className={`priority-badge ${getPriorityBadgeClass(selectedGrievance.priority)}`}>
                                        {selectedGrievance.priority}
                                    </span>
                                </div>
                                {selectedGrievance.school_name && (
                                    <div className="detail-item">
                                        <span className="label">School</span>
                                        <span className="value">{selectedGrievance.school_name}</span>
                                    </div>
                                )}
                                {selectedGrievance.lab_name && (
                                    <div className="detail-item">
                                        <span className="label">Lab</span>
                                        <span className="value">{selectedGrievance.lab_name}</span>
                                    </div>
                                )}
                                {selectedGrievance.equipment_name && (
                                    <div className="detail-item">
                                        <span className="label">Equipment</span>
                                        <span className="value">{selectedGrievance.equipment_name}</span>
                                    </div>
                                )}
                                <div className="detail-item">
                                    <span className="label">Submitted On</span>
                                    <span className="value">{formatDate(selectedGrievance.created_at)}</span>
                                </div>
                            </div>

                            <div className="description-section">
                                <span className="label">Description</span>
                                <p className="description">{selectedGrievance.description}</p>
                            </div>

                            <div className="update-section">
                                <h3>Update Status</h3>
                                <div className="update-form">
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            value={updateData.status}
                                            onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                                        >
                                            {statusOptions.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Remarks / Resolution Notes</label>
                                        <textarea
                                            value={updateData.remarks}
                                            onChange={(e) => setUpdateData({ ...updateData, remarks: e.target.value })}
                                            placeholder="Add notes about the resolution or action taken..."
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="update-btn"
                                onClick={handleUpdateStatus}
                                disabled={updating}
                            >
                                {updating ? (
                                    <>
                                        <Oval height="16" width="16" color="white" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className='bx bx-check'></i>
                                        Update Status
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageGrievances;
