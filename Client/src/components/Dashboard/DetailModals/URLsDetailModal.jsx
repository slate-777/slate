import { useState, useEffect } from 'react';
import { fetchAllArtifacts } from '../ApiHandler/artifactsFunctions';
import './DetailModal.css';

const URLsDetailModal = ({ isOpen, onClose }) => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetchAllArtifacts((artifacts) => {
                const urlArtifacts = artifacts.filter(item => item.doc_format === 'url');
                setUrls(urlArtifacts);
                setLoading(false);
            });
        }
    }, [isOpen]);

    const filteredUrls = urls.filter(url =>
        url.doc_nm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.owner_author_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.doc_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.tag_names?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className='bx bx-link'></i>
                        Shared URLs Details
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className='bx bx-x'></i>
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
                                    placeholder="Search URLs by title, author, or URL..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="results-info">
                                <p>Showing {filteredUrls.length} of {urls.length} URLs</p>
                            </div>
                            <div className="table-container">
                                <table className="detail-table">
                                    <thead>
                                        <tr>
                                            <th>URL Title</th>
                                            <th>URL</th>
                                            <th>Shared By</th>
                                            <th>Tags</th>
                                            <th>Date Shared</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUrls.length > 0 ? (
                                            filteredUrls.map((url, index) => (
                                                <tr key={index} className="artifact-row">
                                                    <td>
                                                        <div className="artifact-title">
                                                            <span className="title-icon">🔗</span>
                                                            <span className="title-text">{url.doc_nm}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <a
                                                            href={url.doc_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="url-link"
                                                            style={{
                                                                color: '#667eea',
                                                                textDecoration: 'none',
                                                                wordBreak: 'break-all',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '5px'
                                                            }}
                                                        >
                                                            {url.doc_url}
                                                            <i className='bx bx-link-external' style={{ fontSize: '1rem' }}></i>
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <div className="author-info">
                                                            <i className='bx bx-user'></i>
                                                            {url.owner_author_id}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="tags-container">
                                                            {url.tag_names ? (
                                                                url.tag_names.split(',').map((tag, i) => (
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
                                                            {url.date_uploaded ? new Date(url.date_uploaded).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="no-data">No URLs shared yet</td>
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

export default URLsDetailModal;
