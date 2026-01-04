import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SchoolsPage.css';
import { fetchAllSchools } from '../ApiHandler/schoolFunctions';

const API_URL = process.env.REACT_APP_API_URL;

const SchoolsPage = () => {
    const [schools, setSchools] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [showLabModal, setShowLabModal] = useState(false);
    const [schoolLabs, setSchoolLabs] = useState([]);
    const [editingLab, setEditingLab] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [labTypes, setLabTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 9;

    // Fetch schools data
    useEffect(() => {
        loadSchools();
        loadLabTypes();
    }, []);

    const loadSchools = async () => {
        try {
            await fetchAllSchools(setSchools);
        } catch (error) {
            console.error('Error loading schools:', error);
            toast.error('Failed to load schools');
        }
    };

    const loadLabTypes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/labs/fetchLabTypes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setLabTypes(data.labTypes);
            }
        } catch (error) {
            console.error('Error loading lab types:', error);
        }
    };

    const loadSchoolLabs = async (schoolId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/labs/fetchLabsForSchool/${schoolId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setSchoolLabs(data.labs);
            }
        } catch (error) {
            console.error('Error loading labs:', error);
            toast.error('Failed to load labs');
        }
    };

    const handleViewLabs = async (school) => {
        setSelectedSchool(school);
        setShowLabModal(true);
        await loadSchoolLabs(school.id);
    };

    const handleEditLab = (lab) => {
        setEditingLab({ ...lab });
    };

    const handleSaveLab = async () => {
        if (!editingLab.lab_name.trim()) {
            toast.error('Lab name is required');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/labs/updateLabData/${editingLab.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    lab_name: editingLab.lab_name,
                    lab_type_id: editingLab.lab_type,
                    lab_capacity: editingLab.lab_capacity || 0,
                    lab_description: editingLab.lab_description || '',
                    school_id: selectedSchool.id
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                toast.success('Lab updated successfully');
                setEditingLab(null);
                await loadSchoolLabs(selectedSchool.id);
            } else {
                toast.error(data.message || 'Failed to update lab');
            }
        } catch (error) {
            console.error('Error updating lab:', error);
            toast.error('Failed to update lab');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingLab(null);
    };

    // Filter logic
    useEffect(() => {
        let filtered = schools;

        if (searchQuery) {
            filtered = filtered.filter(school =>
                school.school_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                school.udise?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (stateFilter) {
            filtered = filtered.filter(school => school.state === stateFilter);
        }

        if (statusFilter !== 'all') {
            const statusValue = statusFilter === 'active' ? 1 : 0;
            filtered = filtered.filter(school => school.school_status === statusValue);
        }

        setFilteredSchools(filtered);
        setCurrentPage(1);
    }, [searchQuery, stateFilter, statusFilter, schools]);

    // Get unique states from schools
    const uniqueStates = [...new Set(schools.map(s => s.state))].filter(Boolean).sort();

    // Pagination
    const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSchools = filteredSchools.slice(startIndex, startIndex + itemsPerPage);

    const handleReset = () => {
        setSearchQuery('');
        setStateFilter('');
        setStatusFilter('all');
    };

    return (
        <div className="schools-page">
            <ToastContainer />
            {/* Header */}
            <div className="schools-page__header">
                <div className="schools-page__header-content">
                    <h1 className="schools-page__title">
                        <i className='bx bxs-school'></i>
                        Schools & Labs Management
                    </h1>
                    <div className="schools-page__stats">
                        <div className="schools-page__stat">
                            <div className="schools-page__stat-label">Total Schools</div>
                            <div className="schools-page__stat-value">{schools.length}</div>
                        </div>
                        <div className="schools-page__stat">
                            <div className="schools-page__stat-label">Active</div>
                            <div className="schools-page__stat-value">
                                {schools.filter(s => s.school_status === 1).length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="schools-page__filters">
                <div className="schools-page__filters-row">
                    <div className="schools-page__filter-group">
                        <label className="schools-page__filter-label">Search</label>
                        <input
                            type="text"
                            className="schools-page__filter-input"
                            placeholder="Search by name or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="schools-page__filter-group">
                        <label className="schools-page__filter-label">State</label>
                        <select
                            className="schools-page__filter-select"
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                        >
                            <option value="">All States</option>
                            {uniqueStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                    <div className="schools-page__filter-group">
                        <label className="schools-page__filter-label">Status</label>
                        <select
                            className="schools-page__filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="schools-page__filter-actions">
                        <button className="schools-page__btn schools-page__btn--secondary" onClick={handleReset}>
                            <i className='bx bx-reset'></i>
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Schools Grid */}
            {currentSchools.length > 0 ? (
                <>
                    <div className="schools-page__grid">
                        {currentSchools.map((school) => (
                            <div key={school.id} className="schools-page__card">
                                <div className="schools-page__card-header">
                                    <h3 className="schools-page__card-title">{school.school_name}</h3>
                                    <p className="schools-page__card-subtitle">UDISE: {school.udise}</p>
                                </div>
                                <div className="schools-page__card-body">
                                    <div className="schools-page__card-info">
                                        <div className="schools-page__card-info-item">
                                            <i className='bx bx-map schools-page__card-info-icon'></i>
                                            <div className="schools-page__card-info-content">
                                                <div className="schools-page__card-info-label">Location</div>
                                                <div className="schools-page__card-info-value">
                                                    {school.district}, {school.state}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schools-page__card-info-item">
                                            <i className='bx bx-user schools-page__card-info-icon'></i>
                                            <div className="schools-page__card-info-content">
                                                <div className="schools-page__card-info-label">Contact Person</div>
                                                <div className="schools-page__card-info-value">{school.primary_contact_person || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="schools-page__card-info-item">
                                            <i className='bx bx-phone schools-page__card-info-icon'></i>
                                            <div className="schools-page__card-info-content">
                                                <div className="schools-page__card-info-label">Contact</div>
                                                <div className="schools-page__card-info-value">{school.contact_no || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="schools-page__card-info-item">
                                            <i className='bx bx-envelope schools-page__card-info-icon'></i>
                                            <div className="schools-page__card-info-content">
                                                <div className="schools-page__card-info-label">Email</div>
                                                <div className="schools-page__card-info-value">{school.school_email_id || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="schools-page__card-info-item">
                                            <i className='bx bx-group schools-page__card-info-icon'></i>
                                            <div className="schools-page__card-info-content">
                                                <div className="schools-page__card-info-label">Students</div>
                                                <div className="schools-page__card-info-value">{school.total_students || 'N/A'} Students</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="schools-page__card-footer">
                                    <span className={`schools-page__card-badge schools-page__card-badge--${school.school_status === 1 ? 'active' : 'inactive'}`}>
                                        {school.school_status === 1 ? '✓ Active' : '✕ Inactive'}
                                    </span>
                                    <div className="schools-page__card-actions">
                                        <button
                                            className="schools-page__card-action-btn"
                                            title="Manage Labs"
                                            onClick={() => handleViewLabs(school)}
                                        >
                                            <i className='bx bx-test-tube'></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="schools-page__pagination">
                            <button
                                className="schools-page__pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                <i className='bx bx-chevron-left'></i> Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`schools-page__pagination-btn ${currentPage === page ? 'schools-page__pagination-btn--active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="schools-page__pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next <i className='bx bx-chevron-right'></i>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="schools-page__empty">
                    <i className='bx bx-search-alt schools-page__empty-icon'></i>
                    <h3 className="schools-page__empty-title">No Schools Found</h3>
                    <p className="schools-page__empty-text">Try adjusting your filters or search query</p>
                </div>
            )}

            {/* Lab Management Modal */}
            {showLabModal && selectedSchool && (
                <div className="modal-overlay" onClick={() => setShowLabModal(false)}>
                    <div className="lab-modal" onClick={e => e.stopPropagation()}>
                        <div className="lab-modal__header">
                            <h2>
                                <i className='bx bx-test-tube'></i>
                                Labs for {selectedSchool.school_name}
                            </h2>
                            <button className="close-btn" onClick={() => setShowLabModal(false)}>
                                <i className='bx bx-x'></i>
                            </button>
                        </div>
                        <div className="lab-modal__content">
                            {schoolLabs.length === 0 ? (
                                <div className="lab-modal__empty">
                                    <i className='bx bx-info-circle'></i>
                                    <p>No labs found for this school</p>
                                </div>
                            ) : (
                                <div className="lab-modal__list">
                                    {schoolLabs.map((lab) => (
                                        <div key={lab.id} className="lab-item">
                                            {editingLab && editingLab.id === lab.id ? (
                                                <div className="lab-item__edit">
                                                    <div className="lab-item__edit-field">
                                                        <label>Lab Name</label>
                                                        <input
                                                            type="text"
                                                            value={editingLab.lab_name}
                                                            onChange={(e) => setEditingLab({ ...editingLab, lab_name: e.target.value })}
                                                            placeholder="Enter lab name"
                                                        />
                                                    </div>
                                                    <div className="lab-item__edit-actions">
                                                        <button
                                                            className="btn-save"
                                                            onClick={handleSaveLab}
                                                            disabled={loading}
                                                        >
                                                            <i className='bx bx-check'></i>
                                                            {loading ? 'Saving...' : 'Save'}
                                                        </button>
                                                        <button
                                                            className="btn-cancel"
                                                            onClick={handleCancelEdit}
                                                            disabled={loading}
                                                        >
                                                            <i className='bx bx-x'></i>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="lab-item__view">
                                                    <div className="lab-item__info">
                                                        <h4>{lab.lab_name}</h4>
                                                        <span className="lab-item__id">Lab ID: {lab.id}</span>
                                                    </div>
                                                    <button
                                                        className="lab-item__edit-btn"
                                                        onClick={() => handleEditLab(lab)}
                                                        title="Edit Lab Name"
                                                    >
                                                        <i className='bx bx-edit'></i>
                                                        Edit
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolsPage;
