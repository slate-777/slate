import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditEquipmentAllocation from './EditEquipmentAllocation';
import { fetchAllAllocatedEquipments, fetchMyAllocatedEquipments } from '../ApiHandler/equipmentFunctions';
import { exportToAllocatedEquipmentCSV, exportToAllocatedEquipmentExcel, exportToPDF, handlePrint } from '../../utils/Utils';
import usePagination from '../../hooks/usePagination';

const ViewAllocatedEquipments = ({ role, showAllEntities }) => {
    const [equipments, setEquipments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editSection, setEditSection] = useState(false);
    const [equipmentsSection, setEquipmentsSection] = useState(true);
    const [editFormData, setEditFormData] = useState([]);

    useEffect(() => {
        if (showAllEntities || role === 3) {
            fetchAllAllocatedEquipments(setEquipments); // Fetch all equipments
        } else {
            fetchMyAllocatedEquipments(setEquipments); // Fetch only user equipments 
        }
    }, [showAllEntities, role]);

    const filteredEquipments = equipments.filter(equipment =>
        equipment.equipment_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        equipment.school_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        equipment.lab_name?.toLowerCase()?.includes(searchQuery.toLowerCase())
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
    } = usePagination(filteredEquipments, 10);

    const editEquipmentData = (editData) => {
        setEditFormData(editData);
        setEditSection(true);
        setEquipmentsSection(false);
    };

    const handleClose = () => {
        setEditSection(false);
        setEquipmentsSection(true);
    };

    return (
        <div>
            {editSection && (
                <EditEquipmentAllocation
                    role={role}
                    editFormData={editFormData}
                    // equipments={equipments}
                    // setEquipments={setEquipments}
                    handleClose={handleClose}
                />
            )}
            {equipmentsSection && (
                <div className="artifacts-container my-entries-section">
                    <ToastContainer />
                    <header className="artifacts-header">
                        <h1>{(role === 2 || role === 3) ? 'My Allocated Equipment' : (showAllEntities ? 'All Allocated Equipment' : 'My Allocated Equipment')}</h1>
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
                                    <button onClick={() => exportToAllocatedEquipmentCSV(filteredEquipments, 'DMS Allocated Equipments.csv')}>CSV</button>
                                    <button onClick={() => exportToAllocatedEquipmentExcel(filteredEquipments, 'DMS Allocated Equipments.xlsx')}>Excel</button>
                                    <button onClick={() => exportToPDF('.artifacts-table', 'DMS Equipments.pdf')}>PDF</button>
                                    <button onClick={() => handlePrint('.artifacts-table-container')}>Print</button>
                                </div>
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
                                        <th>Equipment Name</th>
                                        <th>School Name</th>
                                        <th>School State</th>
                                        <th>Lab Name</th>
                                        <th>Allocated Quantity</th>
                                        <th>Allocated By</th>
                                        <th>Allocated On</th>
                                        {(role === 1 || role === 3 || !showAllEntities) && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="tooltip">
                                                    <p>{item.equipment_name}</p>
                                                </div>
                                            </td>
                                            <td>{item.school_name}</td>
                                            <td>{item.school_state}, {item.school_district}</td>
                                            <td>{item.lab_name}</td>
                                            <td>{item.allocated_quantity}</td>
                                            <td>{item.allocated_by_email}</td>
                                            <td className="date">{item.allocated_on.split('T')[0]}</td>
                                            {(role === 1 || role === 3 || !showAllEntities) && (
                                                <td><a href="# " className="edit-link" onClick={() => editEquipmentData(item)}>{role === 3 ? '🔍 View' : '✏️ Edit'}</a></td>
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
            )}
        </div>
    );
};

export default ViewAllocatedEquipments;