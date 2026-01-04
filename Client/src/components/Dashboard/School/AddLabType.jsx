import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleAddLabType, fetchExistingLabTypes, handleDeleteLabType, handleUpdateLabType } from '../ApiHandler/labFunctions';
import usePagination from '../../hooks/usePagination';

const AddLabType = () => {
    const [labType, setLabType] = useState("");
    const [existingLabTypes, setExistingLabTypes] = useState([]);
    const [editingLabType, setEditingLabType] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const loadLabTypes = () => {
        fetchExistingLabTypes(setExistingLabTypes);
    };

    useEffect(() => {
        loadLabTypes();
    }, []);

    // const filteredExistingLabTypes = existingLabTypes.filter((existingLabType) =>
    //     existingLabType.lab_type?.toLowerCase().includes(searchQuery.toLowerCase())
    // );

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
    } = usePagination(existingLabTypes, 10);

    return (
        <div className="upload-document-container">
            <ToastContainer />
            <header className="upload-document-header">
                <h1>Add Lab Type</h1>
            </header>
            <form className="upload-document-form" onSubmit={(e) => { handleAddLabType(e, labType, setLabType) }}>
                <div className="form-group">
                    <label htmlFor="labTypeInput">Lab Type <m style={{ color: 'red' }}>*</m></label>
                    <input
                        id="labTypeInput"
                        type="text"
                        name="labType"
                        value={labType}
                        onChange={(e) => setLabType(e.target.value)}
                        maxLength={150}
                        placeholder="Enter Lab Type"
                        autoComplete="off"
                        required
                    />
                    <label style={{ color: 'red', fontWeight: '350', fontSize: '12px' }}>Maximum Characters: 150</label>
                </div>
                <div className="form-group">
                    <button type="submit">Submit</button>
                </div>
            </form>
            <div className="artifacts-container" style={{ padding: '20px 0 0 0' }}>
                <header className="artifacts-header">
                    <h1>Existing Lab Types</h1>
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
                        <th colSpan="4">
                            <div className="table-buttons">
                            </div>
                        </th>
                        {/* <th className='user-search'>
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Type here..."
                            className="user-search-bar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </th> */}
                    </div>
                    <div className="artifacts-table-view">
                        <table className="artifacts-table">
                            <thead>
                                <tr>
                                    <th>Lab Type</th>
                                    <th>Added By</th>
                                    <th>Added On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.lab_type_name}</td>
                                        <td>{item.lab_type_added_by_email}</td>
                                        <td className="date">{item.lab_type_added_on.split('T')[0]}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => {
                                                        setEditingLabType(item);
                                                        setShowEditModal(true);
                                                    }}
                                                    style={{
                                                        background: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '6px 12px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
                                                >
                                                    <i className='bx bx-edit'></i> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Are you sure you want to delete "${item.lab_type_name}"?`)) {
                                                            handleDeleteLabType(item.lab_type_id, item.lab_type_name, loadLabTypes);
                                                        }
                                                    }}
                                                    style={{
                                                        background: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '6px 12px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
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
            <div className="usage-instructions">
                <h2>📢 Usage Instructions</h2>
                <ul>
                    <li><i className='bx bx-paper-plane'></i> This section is used for adding new lab types.</li>
                    <li><i className='bx bx-edit'></i> Click Edit to modify an existing lab type.</li>
                    <li><i className='bx bx-trash'></i> Click Delete to remove a lab type.</li>
                </ul>
            </div>

            {/* Edit Modal */}
            {showEditModal && editingLabType && (
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
                        maxWidth: '500px',
                        width: '100%'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#007BFF' }}>✏️ Edit Lab Type</h2>
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

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Lab Type Name</label>
                            <input
                                type="text"
                                value={editingLabType.lab_type_name}
                                onChange={(e) => setEditingLabType({ ...editingLabType, lab_type_name: e.target.value })}
                                maxLength={150}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button
                                onClick={() => {
                                    handleUpdateLabType(
                                        editingLabType.lab_type_id,
                                        editingLabType.lab_type_name,
                                        () => {
                                            setShowEditModal(false);
                                            loadLabTypes();
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

export default AddLabType;