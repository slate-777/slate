import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditEquipmentData from './EditEquipmentData';
import { fetchAllEquipments, fetchMyEquipments } from '../ApiHandler/equipmentFunctions';
import { exportToEquipmentCSV, exportToEquipmentExcel, exportToPDF, handlePrint } from '../../utils/Utils';
import usePagination from '../../hooks/usePagination';

const ViewEquipments = ({ role, showAllEntities }) => {
  const [equipments, setEquipments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editSection, setEditSection] = useState(false);
  const [equipmentsSection, setEquipmentsSection] = useState(true);
  const [editFormData, setEditFormData] = useState([]);

  useEffect(() => {
    if (showAllEntities || role === 3) {
      fetchAllEquipments(setEquipments); // Fetch all equipments
    } else {
      fetchMyEquipments(setEquipments); // Fetch only user equipments
    }
  }, [showAllEntities, role]);

  const statusQuery = searchQuery.toLowerCase();
  const filteredEquipments = equipments.filter(equipment => {
    const statusString = Number(equipment.equipment_status) === 1 ? "enabled" : "disabled";
    return (
      equipment.equipment_name?.toLowerCase()?.includes(statusQuery) ||
      equipment.equipment_type?.toLowerCase()?.includes(statusQuery) ||
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
  } = usePagination(filteredEquipments, 10);

  const getTitleClass = (status) => {
    if (status === 1) {
      return 'active';
    } else if (status === 0) {
      return 'archived';
    } else {
      return '';
    }
  };

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
        <EditEquipmentData
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
            <h1>{(role === 2 || role === 3) ? 'My Equipment' : (showAllEntities ? 'All Equipment' : 'My Equipment')}</h1>
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
                  <button onClick={() => exportToEquipmentCSV(filteredEquipments, 'DMS Equipments.csv')}>CSV</button>
                  <button onClick={() => exportToEquipmentExcel(filteredEquipments, 'DMS Equipments.xlsx')}>Excel</button>
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
                    <th>Equipment Quantity</th>
                    <th>Warranty Status</th>
                    <th>Added By</th>
                    <th>Added On</th>
                    <th>Status</th>
                    {(role === 1 || role === 3 || !showAllEntities) && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((item, index) => (
                    <tr key={index}>
                      <td className={getTitleClass(item.equipment_status)}>
                        <div className="tooltip">
                          <p>{item.equipment_name}</p>
                        </div>
                      </td>
                      <td>{item.equipment_quantity}</td>
                      <td>{item.warranty_status}</td>
                      <td>{item.equipment_added_by_owner}</td>
                      <td className="date">{item.equipment_added_on.split('T')[0]}</td>
                      <td>
                        {item.equipment_status === 1 ? (
                          <span style={{ color: 'green' }}>Enabled</span>
                        ) : (
                          <span style={{ color: 'red' }}>Disabled</span>
                        )}
                      </td>
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

export default ViewEquipments;
