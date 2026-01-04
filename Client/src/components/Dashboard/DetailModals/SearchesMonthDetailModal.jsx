import { useState, useEffect } from 'react';
import { fetchTopSearchedTags } from '../ApiHandler/tagsFunctions';
import './DetailModal.css';

const SearchesMonthDetailModal = ({ isOpen, onClose }) => {
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetchTopSearchedTags((tags) => {
                setSearches(tags);
                setLoading(false);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className='bx bx-search-alt-2'></i>
                        Searches in {currentMonth} '{currentYear}
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className='bx bx-x'></i>
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <div className="table-container">
                            <div className="search-analytics-banner">
                                <h3>
                                    <i className='bx bx-calendar-check'></i>
                                    Search Analytics for {currentMonth} '{currentYear}
                                </h3>
                                <p>
                                    Showing the most searched tags this month. Total searches: <strong>{searches.reduce((sum, s) => sum + s.search_count, 0)}</strong>
                                </p>
                            </div>
                            <table className="detail-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Search Tag</th>
                                        <th>Search Count</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searches.length > 0 ? (
                                        searches.map((search, index) => {
                                            const totalSearches = searches.reduce((sum, s) => sum + s.search_count, 0);
                                            const percentage = ((search.search_count / totalSearches) * 100).toFixed(1);
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <span className="search-rank-badge">#{index + 1}</span>
                                                    </td>
                                                    <td>
                                                        <span className="search-tag-name">{search.tag_name}</span>
                                                    </td>
                                                    <td>
                                                        <span className="search-count-badge">{search.search_count} times</span>
                                                    </td>
                                                    <td>
                                                        <div className="search-progress-container">
                                                            <div className="search-progress-bar-wrapper">
                                                                <div className="search-progress-bar month" style={{ width: `${percentage}%` }}>
                                                                    {percentage > 15 ? `${percentage}%` : ''}
                                                                </div>
                                                            </div>
                                                            <span className="search-percentage-text">{percentage}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="no-data">No searches found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchesMonthDetailModal;
