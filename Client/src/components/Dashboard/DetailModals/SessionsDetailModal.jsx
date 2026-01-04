import React, { useState, useEffect } from 'react';
import { fetchAllSessions, fetchSessionsPerMonth } from '../ApiHandler/sessionFunctions';
import './DetailModal.css';

const SessionsDetailModal = ({ isOpen, onClose }) => {
    const [sessions, setSessions] = useState([]);
    const [sessionsPerMonth, setSessionsPerMonth] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('session_date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all');
    const itemsPerPage = 10;

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            Promise.all([
                fetchAllSessions(setSessions),
                fetchSessionsPerMonth(setSessionsPerMonth)
            ]).finally(() => setLoading(false));
        }
    }, [isOpen]);

    const filteredSessions = sessions.filter(session => {
        const matchesSearch =
            session.session_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.session_host?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.lab_name?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === 'all') return matchesSearch;

        const sessionDate = new Date(session.session_date);
        const today = new Date();

        if (filterStatus === 'upcoming') {
            return matchesSearch && sessionDate > today;
        } else if (filterStatus === 'completed') {
            return matchesSearch && sessionDate <= today;
        }

        return matchesSearch;
    });

    const sortedSessions = [...filteredSessions].sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';

        if (sortBy === 'session_date') {
            const dateA = new Date(aValue);
            const dateB = new Date(bValue);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
    });

    const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSessions = sortedSessions.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // Analytics data
    const sessionsByHost = sessions.reduce((acc, session) => {
        const host = session.session_host || 'Unknown';
        acc[host] = (acc[host] || 0) + 1;
        return acc;
    }, {});

    const sessionsBySchool = sessions.reduce((acc, session) => {
        const school = session.school_name || 'Unknown';
        acc[school] = (acc[school] || 0) + 1;
        return acc;
    }, {});

    const getSessionStatus = (sessionDate) => {
        const today = new Date();
        const session = new Date(sessionDate);
        return session > today ? 'upcoming' : 'completed';
    };

    const formatMonth = (month) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = parseInt(month.split("-")[1], 10) - 1;
        return months[monthIndex];
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className='bx bx-calendar'></i>
                        Sessions Details
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className='bx bx-x'></i>
                    </button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => handleTabChange('list')}
                    >
                        <i className='bx bx-list-ul'></i>
                        Sessions List
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
                        onClick={() => handleTabChange('monthly')}
                    >
                        <i className='bx bx-calendar-event'></i>
                        Monthly View
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => handleTabChange('analytics')}
                    >
                        <i className='bx bx-bar-chart-alt-2'></i>
                        Session Analytics
                    </button>
                </div>

                <div className="modal-content">
                    {loading ? (
                        <div className="loading-spinner">
                            <i className='bx bx-loader-alt bx-spin'></i>
                            <p>Loading sessions data...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'list' && (
                                <div className="sessions-list-tab">
                                    <div className="controls-section">
                                        <div className="search-box">
                                            <i className='bx bx-search'></i>
                                            <input
                                                type="text"
                                                placeholder="Search sessions, hosts, schools, or labs..."
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                        </div>
                                        <div className="filter-controls">
                                            <select
                                                value={filterStatus}
                                                onChange={(e) => {
                                                    setFilterStatus(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <option value="all">All Sessions</option>
                                                <option value="upcoming">Upcoming</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                        <div className="sort-controls">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                            >
                                                <option value="session_date">Date</option>
                                                <option value="session_title">Title</option>
                                                <option value="session_host">Host</option>
                                                <option value="school_name">School</option>
                                            </select>
                                            <button
                                                className="sort-order-btn"
                                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                            >
                                                <i className={`bx bx-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="results-info">
                                        <p>Showing {paginatedSessions.length} of {filteredSessions.length} sessions</p>
                                    </div>

                                    <div className="sessions-table-container">
                                        <table className="sessions-table">
                                            <thead>
                                                <tr>
                                                    <th onClick={() => handleSort('session_title')}>
                                                        Session Title
                                                        {sortBy === 'session_title' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('session_host')}>
                                                        Host
                                                        {sortBy === 'session_host' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('session_date')}>
                                                        Date & Time
                                                        {sortBy === 'session_date' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th onClick={() => handleSort('school_name')}>
                                                        School
                                                        {sortBy === 'school_name' && (
                                                            <i className={`bx bx-chevron-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </th>
                                                    <th>Lab</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedSessions.map((session, index) => (
                                                    <tr key={session.id || index}>
                                                        <td>
                                                            <div className="session-info">
                                                                <strong>{session.session_title}</strong>
                                                                <small>{session.session_description}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="host-info">
                                                                <i className='bx bx-user'></i>
                                                                {session.session_host}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="datetime-info">
                                                                <div className="date">
                                                                    <i className='bx bx-calendar'></i>
                                                                    {new Date(session.session_date).toLocaleDateString()}
                                                                </div>
                                                                <div className="time">
                                                                    <i className='bx bx-time'></i>
                                                                    {session.session_time}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{session.school_name}</td>
                                                        <td>
                                                            <span className="lab-badge">
                                                                {session.lab_name}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`status-badge ${getSessionStatus(session.session_date)}`}>
                                                                {getSessionStatus(session.session_date)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="pagination">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <i className='bx bx-chevron-left'></i>
                                            </button>
                                            <span>Page {currentPage} of {totalPages}</span>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                            >
                                                <i className='bx bx-chevron-right'></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'monthly' && (
                                <div className="monthly-tab">
                                    <div className="monthly-header">
                                        <h3>Sessions Per Month</h3>
                                        <p>Monthly session distribution over time</p>
                                    </div>

                                    <div className="monthly-chart-container">
                                        <div className="monthly-stats-grid">
                                            {sessionsPerMonth.map((monthData, index) => (
                                                <div key={index} className="month-card">
                                                    <div className="month-header">
                                                        <h4>{formatMonth(monthData.month)}</h4>
                                                        <span className="session-count-badge">
                                                            {monthData.session_count} Sessions
                                                        </span>
                                                    </div>
                                                    <div className="month-progress">
                                                        <div
                                                            className="progress-bar"
                                                            style={{
                                                                width: `${(monthData.session_count / Math.max(...sessionsPerMonth.map(m => m.session_count))) * 100}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="month-percentage">
                                                        {((monthData.session_count / sessionsPerMonth.reduce((sum, m) => sum + m.session_count, 0)) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'analytics' && (
                                <div className="analytics-tab">
                                    <div className="analytics-header">
                                        <h3>Session Analytics</h3>
                                        <p>Detailed analysis of session patterns and distribution</p>
                                    </div>

                                    <div className="analytics-grid">
                                        <div className="analytics-section">
                                            <h4>Top Session Hosts</h4>
                                            <div className="host-stats">
                                                {Object.entries(sessionsByHost)
                                                    .sort(([, a], [, b]) => b - a)
                                                    .slice(0, 10)
                                                    .map(([host, count]) => (
                                                        <div key={host} className="host-item">
                                                            <div className="host-info">
                                                                <span className="host-name">{host}</span>
                                                                <span className="host-count">{count} sessions</span>
                                                            </div>
                                                            <div className="host-progress">
                                                                <div
                                                                    className="progress-bar"
                                                                    style={{
                                                                        width: `${(count / Math.max(...Object.values(sessionsByHost))) * 100}%`
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        <div className="analytics-section">
                                            <h4>Sessions by School</h4>
                                            <div className="school-stats">
                                                {Object.entries(sessionsBySchool)
                                                    .sort(([, a], [, b]) => b - a)
                                                    .slice(0, 10)
                                                    .map(([school, count]) => (
                                                        <div key={school} className="school-item">
                                                            <div className="school-info">
                                                                <span className="school-name">{school}</span>
                                                                <span className="school-count">{count} sessions</span>
                                                            </div>
                                                            <div className="school-progress">
                                                                <div
                                                                    className="progress-bar"
                                                                    style={{
                                                                        width: `${(count / Math.max(...Object.values(sessionsBySchool))) * 100}%`
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="summary-stats">
                                        <div className="stat-card">
                                            <i className='bx bx-calendar-event'></i>
                                            <div className="stat-info">
                                                <h4>Total Sessions</h4>
                                                <p>{sessions.length}</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <i className='bx bx-user-check'></i>
                                            <div className="stat-info">
                                                <h4>Unique Hosts</h4>
                                                <p>{Object.keys(sessionsByHost).length}</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <i className='bx bx-building'></i>
                                            <div className="stat-info">
                                                <h4>Schools Involved</h4>
                                                <p>{Object.keys(sessionsBySchool).length}</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <i className='bx bx-trending-up'></i>
                                            <div className="stat-info">
                                                <h4>Avg Sessions/Month</h4>
                                                <p>
                                                    {sessionsPerMonth.length > 0
                                                        ? Math.round(sessionsPerMonth.reduce((sum, m) => sum + m.session_count, 0) / sessionsPerMonth.length)
                                                        : 0
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionsDetailModal;