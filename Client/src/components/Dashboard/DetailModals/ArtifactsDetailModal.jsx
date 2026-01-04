import { useState, useEffect } from 'react';
import { fetchAllArtifacts } from '../ApiHandler/artifactsFunctions';
import './DetailModal.css';

const ArtifactsDetailModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetchAllArtifacts(setArtifacts);
            setLoading(false);
        }
    }, [isOpen]);

    const handleDownload = (artifact) => {
        if (artifact.doc_format === 'url') {
            window.open(artifact.doc_url, '_blank');
        } else {
            // Properly encode the filename for the URL
            const encodedFilename = encodeURIComponent(artifact.doc_nm);
            const downloadUrl = `${API_URL}/uploads/${encodedFilename}`;

            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = artifact.doc_nm; // Original filename for download
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const docs = artifacts.filter(item => item.doc_format === 'document');
    const urls = artifacts.filter(item => item.doc_format === 'url');

    const getFilteredArtifacts = () => {
        let filtered = artifacts;
        if (activeTab === 'docs') {
            filtered = docs;
        } else if (activeTab === 'urls') {
            filtered = urls;
        }

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.doc_nm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.owner_author_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tag_names?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.doctype_nm?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredArtifacts = getFilteredArtifacts();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className='bx bx-folder-open'></i>
                        Artifacts Details
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className='bx bx-x'></i>
                    </button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={activeTab === 'all' ? 'active' : ''}
                        onClick={() => setActiveTab('all')}
                    >
                        <i className='bx bx-folder'></i>
                        All
                        <span>{artifacts.length}</span>
                    </button>
                    <button
                        className={activeTab === 'docs' ? 'active' : ''}
                        onClick={() => setActiveTab('docs')}
                    >
                        <i className='bx bx-file'></i>
                        Documents
                        <span>{docs.length}</span>
                    </button>
                    <button
                        className={activeTab === 'urls' ? 'active' : ''}
                        onClick={() => setActiveTab('urls')}
                    >
                        <i className='bx bx-link-alt'></i>
                        URLs
                        <span>{urls.length}</span>
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <>
                            <div className="search-box">
                                <i className='bx bx-search'></i>
                                <input
                                    type="text"
                                    placeholder="Search by title, author, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="results-info">
                                <p>Showing {filteredArtifacts.length} of {artifacts.length} artifacts</p>
                            </div>
                            <div className="table-container">
                                <table className="detail-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '80px' }}>Type</th>
                                            <th>Title</th>
                                            <th style={{ width: '200px' }}>Author</th>
                                            <th style={{ width: '200px' }}>Tags</th>
                                            <th style={{ width: '120px' }}>Date</th>
                                            <th style={{ width: '100px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredArtifacts.length > 0 ? (
                                            filteredArtifacts.map((artifact, index) => (
                                                <tr key={index} className="artifact-row">
                                                    <td>
                                                        <span className={`badge ${artifact.doc_format === 'document' ? 'doc-badge' : 'url-badge'}`}>
                                                            {artifact.doc_format === 'url' ? 'URL' : 'DOC'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="artifact-title">
                                                            <span className="title-icon">
                                                                {artifact.doc_format === 'url' ? '🔗' : '📄'}
                                                            </span>
                                                            <span className="title-text">{artifact.doc_nm}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="author-info">
                                                            <i className='bx bx-user'></i>
                                                            {artifact.owner_author_id}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="tags-container">
                                                            {artifact.tag_names ? (
                                                                artifact.tag_names.split(',').map((tag, i) => (
                                                                    <span key={i} className="tag-chip">{tag.trim()}</span>
                                                                ))
                                                            ) : (
                                                                <span className="no-tags">No tags</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="date-info">
                                                            <i className='bx bx-calendar'></i>
                                                            {artifact.date_uploaded ? new Date(artifact.date_uploaded).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="download-btn"
                                                            onClick={() => handleDownload(artifact)}
                                                            title={artifact.doc_format === 'url' ? 'Open URL' : 'Download'}
                                                        >
                                                            <i className={`bx ${artifact.doc_format === 'url' ? 'bx-link-external' : 'bx-download'}`}></i>
                                                            {artifact.doc_format === 'url' ? 'Open' : 'Download'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="no-data">No artifacts found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtifactsDetailModal;
