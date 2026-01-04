import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditLabData from './EditLabData'
import { fetchAllLabs, fetchMyLabs } from '../ApiHandler/labFunctions';
import { exportToLabCSV, exportToLabExcel, exportToPDF, handlePrint } from '../../utils/Utils';
import usePagination from '../../hooks/usePagination';

const ViewLabs = ({ role, showAllEntities }) => {
  const [labs, setLabs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editSection, setEditSection] = useState(false);
  const [labsSection, setLabsSection] = useState(true);
  const [editFormData, setEditFormData] = useState([]);

  useEffect(() => {
    if (showAllEntities || role === 3) {
      fetchAllLabs(setLabs); // Fetch all labs
    } else {
      fetchMyLabs(setLabs); // Fetch only user labs
    }
  }, [showAllEntities, role]);

  const statusQuery = searchQuery.toLowerCase();
  const filteredLabs = labs.filter(lab => {
    const statusString = Number(lab.lab_status) === 1 ? "enabled" : "disabled";
    return (
      lab.lab_name?.toLowerCase()?.includes(statusQuery) ||
      lab.lab_school?.toLowerCase()?.includes(statusQuery) ||
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
  } = usePagination(filteredLabs, 10);

  const getTitleClass = (status) => {
    if (status === 1) {
      return 'active';
    } else if (status === 0) {
      return 'archived';
    } else {
      return '';
    }
  };

  const editLabData = (editData) => {
    setEditFormData(editData);
    setEditSection(true);
    setLabsSection(false);
  }

  const handleClose = () => {
    setEditSection(false);
    setLabsSection(true);
  }

  return (
    <div>
      {editSection && (
        <EditLabData
          role={role}
          editFormData={editFormData}
          // labs={labs}
          // setLabs={setLabs}
          handleClose={handleClose}
        />
      )}
      {labsSection && (
        <div className="artifacts-container my-entries-section">
          <ToastContainer />
          <header className="artifacts-header">
            <h1>{role === 2 || role === 3 ? 'My Labs' : (showAllEntities ? 'All Labs' : 'My Labs')}</h1>
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
                  <button onClick={() => exportToLabCSV(filteredLabs, 'DMS Labs.csv')}>CSV</button>
                  <button onClick={() => exportToLabExcel(filteredLabs, 'DMS Labs.xlsx')}>Excel</button>
                  <button onClick={() => exportToPDF('.artifacts-table', 'DMS Labs.pdf')}>PDF</button>
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
                    <th>Lab Name</th>
                    <th>School</th>
                    <th>Added By</th>
                    <th>Added On</th>
                    <th>Status</th>
                    {(role === 1 || role === 3 || !showAllEntities) && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((item, index) => (
                    <tr key={index}>
                      <td className={getTitleClass(item.lab_status)}>
                        <div className="tooltip">
                          <p>{item.lab_name}</p>
                          <span className="tooltiptext">{item.lab_type}</span>
                        </div>
                      </td>
                      <td>{item.lab_school}</td>
                      <td>{item.lab_added_by_owner}</td>
                      <td className="date">{item.lab_added_on.split('T')[0]}</td>
                      <td>
                        {item.lab_status === 1 ? (
                          <span style={{ color: 'green' }}>Enabled</span>
                        ) : (
                          <span style={{ color: 'red' }}>Disabled</span>
                        )}
                      </td>
                      {(role === 1 || role === 3 || !showAllEntities) && (
                        <td><a href="# " className="edit-link" onClick={() => editLabData(item)}>{role === 3 ? '🔍 View' : '✏️ Edit'}</a></td>
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

export default ViewLabs;
