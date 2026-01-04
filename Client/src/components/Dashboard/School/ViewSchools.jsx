import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditSchoolData from './EditSchoolData';
import { fetchAllSchools, fetchMySchools } from '../ApiHandler/schoolFunctions';
import { exportToSchoolCSV, exportToSchoolExcel, exportToPDF, handlePrint } from '../../utils/Utils';
import usePagination from '../../hooks/usePagination';

const ViewSchools = ({ role, showAllEntities }) => {
    const [schools, setSchools] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editSection, setEditSection] = useState(false);
    const [schoolsSection, setSchoolsSection] = useState(true);
    const [editFormData, setEditFormData] = useState([]);

    useEffect(() => {
        if (showAllEntities || role === 3) {
            fetchAllSchools(setSchools); // Fetch all schools
        } else {
            fetchMySchools(setSchools); // Fetch only user schools
        }
    }, [showAllEntities, role]);

    const statusQuery = searchQuery.toLowerCase();
    const filteredSchools = schools.filter(school => {
        const statusString = Number(school.school_status) === 1 ? "enabled" : "disabled";
        return (
            school.school_name?.toLowerCase()?.includes(statusQuery) ||
            school.school_email_id?.toLowerCase()?.includes(statusQuery) ||
            statusString.includes(statusQuery)
        );
    });

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
    } = usePagination(filteredSchools, 10);

    const getTitleClass = (status) => {
        if (status === 1) {
            return 'active';
        } else if (status === 0) {
            return 'archived';
        } else {
            return '';
        }
    };

    const editSchoolData = (editData) => {
        setEditFormData(editData);
        setEditSection(true);
        setSchoolsSection(false);
    }

    const handleClose = () => {
        setEditSection(false);
        setSchoolsSection(true);
    }

    return (
        <div>
            {editSection && (
                <EditSchoolData
                    role={role}
                    editFormData={editFormData}
                    // schools={schools}
                    // setSchools={setSchools}
                    handleClose={handleClose}
                />
            )}
            {schoolsSection && (
                <div className="artifacts-container my-entries-section">
                    <ToastContainer />
                    <header className="artifacts-header">
                        <h1>{(role === 2 || role === 3) ? 'My Schools' : (showAllEntities ? 'All Schools' : 'My Schools')}</h1>
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
                                    <button onClick={() => exportToSchoolCSV(filteredSchools, 'DMS Schools.csv')}>CSV</button>
                                    <button onClick={() => exportToSchoolExcel(filteredSchools, 'DMS Schools.xlsx')}>Excel</button>
                                    <button onClick={() => exportToPDF('.artifacts-table', 'DMS Schools.pdf')}>PDF</button>
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
                                        <th>School Name</th>
                                        <th>School State</th>
                                        <th>Added By</th>
                                        <th>Added On</th>
                                        <th>Status</th>
                                        {(role === 1 || role === 3 || !showAllEntities) && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((item, index) => (
                                        <tr key={index}>
                                            <td className={getTitleClass(item.school_status)}>
                                                <div className="tooltip">
                                                    <p>{item.school_name}</p>
                                                </div>
                                            </td>
                                            <td>{item.state}</td>
                                            <td>{item.on_boarded_by_owner}</td>
                                            <td className="date">{item.on_boarded_on.split('T')[0]}</td>
                                            <td>
                                                {item.school_status === 1 ? (
                                                    <span style={{ color: 'green' }}>Enabled</span>
                                                ) : (
                                                    <span style={{ color: 'red' }}>Disabled</span>
                                                )}
                                            </td>
                                            {(role === 1 || role === 3 || !showAllEntities) && (
                                                <td><a href="# " className="edit-link" onClick={() => editSchoolData(item)}>{role === 3 ? '�� View' : '✏️ Edit'}</a></td>
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

export default ViewSchools;
