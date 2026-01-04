import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Oval } from 'react-loader-spinner';
import './Grievance.css';

const API_URL = process.env.REACT_APP_API_URL;

const Grievance = () => {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [grievanceId, setGrievanceId] = useState('');
    const [myGrievances, setMyGrievances] = useState([]);
    const [activeTab, setActiveTab] = useState('submit');
    const [formData, setFormData] = useState({
        issueCategory: '',
        issueSubCategory: '',
        actionRequired: '',
        schoolName: '',
        labName: '',
        equipmentName: '',
        description: '',
        priority: 'Medium'
    });

    // Issue Categories with Sub-categories
    const issueCategories = {
        'Faulty Equipment': [
            'Not powering ON',
            'Physically damaged',
            'Missing accessories',
            'Incorrect item supplied',
            'Warranty / replacement issue',
            'Other equipment issue'
        ],
        'Device Usage Issue': [
            'Software not working',
            'Login / configuration issue',
            'Connectivity problem',
            'Compatibility issue',
            'User requires operational guidance',
            'Other device issue'
        ],
        'Mentor Training Issue': [
            'Mentor not trained on specific equipment',
            'Incomplete training session',
            'Training material not provided',
            'Request for refresher training',
            'Mentor unavailability',
            'Other training issue'
        ]
    };

    // Action Required Options
    const actionOptions = [
        { value: 'repair_replacement', label: '🔧 Repair / Replacement Required', icon: 'bx-wrench' },
        { value: 'technical_support', label: '📞 Technical Support Call Required', icon: 'bx-phone-call' },
        { value: 'training', label: '🧑‍🏫 Training / Re-training Required', icon: 'bx-chalkboard' },
        { value: 'documentation', label: '📄 Documentation / Manual Required', icon: 'bx-file' },
        { value: 'vendor_intervention', label: '🏷 Vendor Intervention Required', icon: 'bx-store' },
        { value: 'urgent_escalation', label: '🚨 Urgent Escalation', icon: 'bx-error' }
    ];

    const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

    useEffect(() => {
        if (activeTab === 'history') {
            fetchMyGrievances();
        }
    }, [activeTab]);

    const fetchMyGrievances = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/grievances/my-grievances`, {
                headers: { 'Authorization': token }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setMyGrievances(data.data);
            }
        } catch (error) {
            console.error('Error fetching grievances:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            // Reset sub-category when category changes
            if (name === 'issueCategory') {
                return { ...prev, [name]: value, issueSubCategory: '' };
            }
            return { ...prev, [name]: value };
        });
    };

    const generateGrievanceId = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(10000 + Math.random() * 90000);
        return `SLT-GR-${year}-${random}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.issueCategory || !formData.issueSubCategory || !formData.actionRequired || !formData.description) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);
        const newGrievanceId = generateGrievanceId();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/grievances/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    ...formData,
                    grievanceId: newGrievanceId
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                setGrievanceId(newGrievanceId);
                setShowSuccess(true);
                setFormData({
                    issueCategory: '',
                    issueSubCategory: '',
                    actionRequired: '',
                    schoolName: '',
                    labName: '',
                    equipmentName: '',
                    description: '',
                    priority: 'Medium'
                });
            } else {
                toast.error(data.message || 'Failed to submit grievance');
            }
        } catch (error) {
            console.error('Error submitting grievance:', error);
            toast.error('Failed to submit grievance. Please try again.');
        } finally {
            setLoading(false);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (showSuccess) {
        return (
            <div className="grievance-container">
                <div className="success-modal">
                    <div className="success-icon">
                        <i className='bx bx-check-circle'></i>
                    </div>
                    <h2>Grievance Submitted Successfully!</h2>
                    <div className="grievance-id-box">
                        <span className="label">Your Grievance ID</span>
                        <span className="id">{grievanceId}</span>
                    </div>
                    <p className="success-message">
                        Our team will contact you shortly. You can track your grievance status using the ID above.
                    </p>
                    <div className="success-actions">
                        <button
                            className="btn-primary"
                            onClick={() => {
                                setShowSuccess(false);
                                setActiveTab('history');
                            }}
                        >
                            <i className='bx bx-history'></i>
                            View My Grievances
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => setShowSuccess(false)}
                        >
                            <i className='bx bx-plus'></i>
                            Submit Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grievance-container">
            <ToastContainer />
            <header className="grievance-header">
                <h1>
                    <i className='bx bx-support'></i>
                    Grievance Portal
                </h1>
                <p>Report issues related to equipment, devices, or training</p>
            </header>

            <div className="grievance-tabs">
                <button
                    className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('submit')}
                >
                    <i className='bx bx-edit'></i>
                    Submit Grievance
                </button>
                <button
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <i className='bx bx-history'></i>
                    My Grievances
                </button>
            </div>

            {activeTab === 'submit' ? (
                <form className="grievance-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3><i className='bx bx-category'></i> Issue Details</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Issue Category <span className="required">*</span></label>
                                <select
                                    name="issueCategory"
                                    value={formData.issueCategory}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Issue Category</option>
                                    {Object.keys(issueCategories).map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Issue Sub-Category <span className="required">*</span></label>
                                <select
                                    name="issueSubCategory"
                                    value={formData.issueSubCategory}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.issueCategory}
                                >
                                    <option value="">Select Sub-Category</option>
                                    {formData.issueCategory && issueCategories[formData.issueCategory]?.map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Action Required <span className="required">*</span></label>
                                <select
                                    name="actionRequired"
                                    value={formData.actionRequired}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Action Required</option>
                                    {actionOptions.map(action => (
                                        <option key={action.value} value={action.value}>
                                            {action.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Priority Level</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    {priorityOptions.map(priority => (
                                        <option key={priority} value={priority}>{priority}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3><i className='bx bx-map-pin'></i> Location Details (Optional)</h3>

                        <div className="form-row three-col">
                            <div className="form-group">
                                <label>School Name</label>
                                <input
                                    type="text"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    placeholder="Enter school name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Lab Name</label>
                                <input
                                    type="text"
                                    name="labName"
                                    value={formData.labName}
                                    onChange={handleChange}
                                    placeholder="Enter lab name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Equipment Name</label>
                                <input
                                    type="text"
                                    name="equipmentName"
                                    value={formData.equipmentName}
                                    onChange={handleChange}
                                    placeholder="Enter equipment name"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3><i className='bx bx-detail'></i> Description</h3>

                        <div className="form-group">
                            <label>Describe your issue in detail <span className="required">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Please provide detailed information about the issue you're facing..."
                                rows="5"
                                required
                                maxLength="1000"
                            />
                            <span className="char-count">{formData.description.length}/1000 characters</span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Oval height="18" width="18" color="white" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <i className='bx bx-send'></i>
                                    Submit Grievance
                                </>
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grievance-history">
                    {myGrievances.length === 0 ? (
                        <div className="no-grievances">
                            <i className='bx bx-check-circle'></i>
                            <h3>No Grievances Found</h3>
                            <p>You haven't submitted any grievances yet.</p>
                            <button
                                className="btn-primary"
                                onClick={() => setActiveTab('submit')}
                            >
                                <i className='bx bx-plus'></i>
                                Submit Your First Grievance
                            </button>
                        </div>
                    ) : (
                        <div className="grievance-list">
                            {myGrievances.map((grievance, index) => (
                                <div key={index} className="grievance-card">
                                    <div className="grievance-card-header">
                                        <span className="grievance-id">{grievance.grievance_id}</span>
                                        <span className={`status-badge ${getStatusBadgeClass(grievance.status)}`}>
                                            {grievance.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="grievance-card-body">
                                        <div className="grievance-info">
                                            <div className="info-item">
                                                <i className='bx bx-category'></i>
                                                <span>{grievance.issue_category}</span>
                                            </div>
                                            <div className="info-item">
                                                <i className='bx bx-subdirectory-right'></i>
                                                <span>{grievance.issue_sub_category}</span>
                                            </div>
                                            <div className="info-item">
                                                <i className='bx bx-wrench'></i>
                                                <span>{actionOptions.find(a => a.value === grievance.action_required)?.label || grievance.action_required}</span>
                                            </div>
                                        </div>
                                        <p className="grievance-description">{grievance.description}</p>
                                        <div className="grievance-meta">
                                            <span className={`priority-badge priority-${grievance.priority?.toLowerCase()}`}>
                                                {grievance.priority}
                                            </span>
                                            <span className="date">
                                                <i className='bx bx-calendar'></i>
                                                {formatDate(grievance.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Grievance;
