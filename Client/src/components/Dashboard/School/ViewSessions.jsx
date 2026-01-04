import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditSessionData from './EditSessionData';
import { fetchAllSessions, fetchMySessions } from '../ApiHandler/sessionFunctions';
import { exportToSessionCSV, exportToSessionExcel, exportToPDF, handlePrint } from '../../utils/Utils';
import usePagination from '../../hooks/usePagination';

const ViewSessions = ({ role, showAllEntities }) => {
    const [sessions, setSessions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editSection, setEditSection] = useState(false);
    const [sessionsSection, setSessionsSection] = useState(true);
    const [editFormData, setEditFormData] = useState([]);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (showAllEntities || role === 3) {
            fetchAllSessions(setSessions); // Fetch all sessions
        } else {
            fetchMySessions(setSessions); // Fetch only user sessions
        }
    }, [showAllEntities, role]);

    const filteredSessions = sessions.filter(session =>
        session.session_title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        session.session_host?.toLowerCase()?.includes(searchQuery.toLowerCase())
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
    } = usePagination(filteredSessions, 10);

    const editSessionData = (editData) => {
        setEditFormData(editData);
        setEditSection(true);
        setSessionsSection(false);
    }

    const handleClose = () => {
        setEditSection(false);
        setSessionsSection(true);
    }

    const getSessionTitleClass = (session_status) => {
        if (session_status === 'open') {
            return 'active';
        } else if (session_status === 'closed') {
            return 'archived';
        } else {
            return '';
        }
    };

    const openImageViewer = (images, index = 0) => {
        try {
            const parsedImages = typeof images === 'string' ? JSON.parse(images) : images;
            if (parsedImages && parsedImages.length > 0) {
                setCurrentImages(parsedImages);
                setCurrentImageIndex(index);
                setImageViewerOpen(true);
            }
        } catch (error) {
            console.error('Error parsing images:', error);
        }
    };

    const closeImageViewer = () => {
        setImageViewerOpen(false);
        setCurrentImages([]);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    };

    return (
        <div>
            {editSection && (
                <EditSessionData
                    role={role}
                    editFormData={editFormData}
                    sessions={sessions}
                    setSessions={setSessions}
                    handleClose={handleClose}
                />
            )}
            {sessionsSection && (
                <div className="artifacts-container my-entries-section">
                    <ToastContainer />
                    <header className="artifacts-header">
                        <h1>{(role === 2 || role === 3) ? 'My Sessions' : (showAllEntities ? 'All Sessions' : 'My Sessions')}</h1>
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
                                    <button onClick={() => exportToSessionCSV(filteredSessions, 'DMS Sessions.csv')}>CSV</button>
                                    <button onClick={() => exportToSessionExcel(filteredSessions, 'DMS Sessions.xlsx')}>Excel</button>
                                    <button onClick={() => exportToPDF('.artifacts-table', 'DMS sessions.pdf')}>PDF</button>
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
                                        <th>Session Title</th>
                                        <th>Session Host</th>
                                        <th>Session Date</th>
                                        <th>Setup By</th>
                                        <th>Images</th>
                                        {(role === 1 || role === 3 || !showAllEntities) && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((item, index) => {
                                        const images = item.session_images ? (typeof item.session_images === 'string' ? JSON.parse(item.session_images) : item.session_images) : [];
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className={getSessionTitleClass(item.session_status)}>
                                                        <p>{item.session_title}</p>
                                                    </div>
                                                </td>
                                                <td>{item.session_host}</td>
                                                <td>{item.session_date}</td>
                                                <td>{item.session_setup_by_email}</td>
                                                <td>
                                                    {images.length > 0 ? (
                                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                            <img
                                                                src={images[0]}
                                                                alt="Session"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '5px',
                                                                    cursor: 'pointer',
                                                                    border: '2px solid #ddd'
                                                                }}
                                                                onClick={() => openImageViewer(images, 0)}
                                                            />
                                                            {images.length > 1 && (
                                                                <button
                                                                    onClick={() => openImageViewer(images, 0)}
                                                                    style={{
                                                                        background: '#007BFF',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '5px',
                                                                        padding: '5px 10px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '12px'
                                                                    }}
                                                                >
                                                                    +{images.length - 1} more
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#999' }}>No images</span>
                                                    )}
                                                </td>
                                                {(role === 1 || role === 3 || !showAllEntities) && (
                                                    <td><a href="# " className="edit-link" onClick={() => editSessionData(item)}>{role === 3 ? '🔍 View' : '✏️ Track'}</a></td>
                                                )}
                                            </tr>
                                        );
                                    })}
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

            {/* Image Viewer Modal */}
            {imageViewerOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px'
                    }}
                    onClick={closeImageViewer}
                >
                    <button
                        onClick={closeImageViewer}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            fontSize: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            zIndex: 10001
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                        ×
                    </button>

                    <div
                        style={{
                            position: 'relative',
                            maxWidth: '90%',
                            maxHeight: '90%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {currentImages.length > 1 && (
                            <button
                                onClick={prevImage}
                                style={{
                                    position: 'absolute',
                                    left: '-60px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    zIndex: 10001
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                            >
                                ‹
                            </button>
                        )}

                        <img
                            src={currentImages[currentImageIndex]}
                            alt={`Session ${currentImageIndex + 1}`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '85vh',
                                objectFit: 'contain',
                                borderRadius: '10px',
                                boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)'
                            }}
                        />

                        {currentImages.length > 1 && (
                            <button
                                onClick={nextImage}
                                style={{
                                    position: 'absolute',
                                    right: '-60px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    zIndex: 10001
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                            >
                                ›
                            </button>
                        )}

                        {currentImages.length > 1 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '-40px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    color: 'white',
                                    fontSize: '16px',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    padding: '8px 16px',
                                    borderRadius: '20px'
                                }}
                            >
                                {currentImageIndex + 1} / {currentImages.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSessions;