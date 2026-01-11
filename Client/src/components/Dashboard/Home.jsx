import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchSchoolsPerState, fetchSchoolsCount } from './ApiHandler/schoolFunctions';
import { fetchLabsCount } from './ApiHandler/labFunctions';
import { fetchSessionsPerMonth, fetchSessionsCount, fetchLatestSessions } from './ApiHandler/sessionFunctions';
import { fetchLabEquipmentCount, fetchEquipmentCount, FetchLabsWithMostAllocatedEquipment, FetchSchoolsWithMostAllocatedEquipment } from './ApiHandler/equipmentFunctions';
import { fetchArtifactsCounts, fetchTopContributors } from './ApiHandler/artifactsFunctions';
import { fetchSearchesCounts, fetchTopSearchedTags } from './ApiHandler/tagsFunctions';
import { fetchAllocatedUsedSpace } from './ApiHandler/settingsFunctions';
import SchoolsDetailModal from './DetailModals/SchoolsDetailModal';
import LabsDetailModal from './DetailModals/LabsDetailModal';
import EquipmentDetailModal from './DetailModals/EquipmentDetailModal';
import SessionsDetailModal from './DetailModals/SessionsDetailModal';
import SatheeStudentsDetailModal from './DetailModals/SatheeStudentsDetailModal';
import ArtifactsDetailModal from './DetailModals/ArtifactsDetailModal';
import URLsDetailModal from './DetailModals/URLsDetailModal';
import SearchesYearDetailModal from './DetailModals/SearchesYearDetailModal';
import SearchesMonthDetailModal from './DetailModals/SearchesMonthDetailModal';
import Axios from 'axios';

const Home = ({ handleClick, setIsSidebarOpen }) => {
    const [totalDocsCount, setTotalDocsCount] = useState(0);
    const [totalUrlsCount, setTotalUrlsCount] = useState(0);
    const [totalSearches, setTotalSearches] = useState(0);
    const [currentMonthSearches, setCurrentMonthSearches] = useState(0);
    const [usedSpace, setUsedSpace] = useState(0);
    const [totalAllocatedSpace, setTotalAllocatedSpace] = useState(0);
    const [searchedTags, setSearchedTags] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [schoolsData, setSchoolsData] = useState([]);
    const [sessionData, setSessionData] = useState([]);
    const [labEquipmentData, setLabEquipmentData] = useState([]);
    const [totalSchoolsCount, setTotalSchoolsCount] = useState(0);
    const [totalLabsCount, setTotalLabsCount] = useState(0);
    const [totalEquipmentCount, setTotalEquipmentCount] = useState(0);
    const [totalSessionsCount, setTotalSessionsCount] = useState(0);
    const [totalSatheeStudents, setTotalSatheeStudents] = useState(0);
    const [labsWithMostAllocatedEquipment, setLabsWithMostAllocatedEquipment] = useState([]);
    const [schoolsWithMostAllocatedEquipment, setSchoolsWithMostAllocatedEquipment] = useState([]);
    const [latestSessions, setLatestSessions] = useState([]);

    // Modal states
    const [schoolsModalOpen, setSchoolsModalOpen] = useState(false);
    const [labsModalOpen, setLabsModalOpen] = useState(false);
    const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
    const [sessionsModalOpen, setSessionsModalOpen] = useState(false);
    const [satheeStudentsModalOpen, setSatheeStudentsModalOpen] = useState(false);
    const [artifactsModalOpen, setArtifactsModalOpen] = useState(false);
    const [urlsModalOpen, setUrlsModalOpen] = useState(false);
    const [searchesYearModalOpen, setSearchesYearModalOpen] = useState(false);
    const [searchesMonthModalOpen, setSearchesMonthModalOpen] = useState(false);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [selectedSessionImages, setSelectedSessionImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Function to open image viewer
    const openImageViewer = (images) => {
        setSelectedSessionImages(images);
        setCurrentImageIndex(0);
        setImageViewerOpen(true);
    };

    // Function to close image viewer
    const closeImageViewer = () => {
        setImageViewerOpen(false);
        setSelectedSessionImages([]);
        setCurrentImageIndex(0);
    };

    // Function to navigate images
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % selectedSessionImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + selectedSessionImages.length) % selectedSessionImages.length);
    };

    // Function to close sidebar when clicking stats (all screen sizes)
    const handleStatsClick = (modalSetter) => {
        // Close sidebar on all screen sizes to prevent overlap
        if (setIsSidebarOpen) {
            setIsSidebarOpen(false);
        }
        modalSetter(true);
    };

    // Fetch Sathee Students count
    const fetchSatheeStudentsCount = async () => {
        try {
            const response = await Axios.get(`${process.env.REACT_APP_API_URL}/sathee-students/count`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            if (response.data.status === 'success') {
                setTotalSatheeStudents(response.data.data.total_students);
            }
        } catch (error) {
            console.error('Error fetching Sathee students count:', error);
        }
    };

    useEffect(() => {
        fetchArtifactsCounts(setTotalDocsCount, setTotalUrlsCount);
        fetchSearchesCounts(setTotalSearches, setCurrentMonthSearches);
        fetchAllocatedUsedSpace(setTotalAllocatedSpace, setUsedSpace, null, null, null);
        fetchTopSearchedTags(setSearchedTags);
        fetchTopContributors(setContributors);
        fetchSchoolsPerState(setSchoolsData);
        fetchSessionsPerMonth(setSessionData);
        fetchLabEquipmentCount(setLabEquipmentData);
        fetchSchoolsCount(setTotalSchoolsCount);
        fetchLabsCount(setTotalLabsCount);
        fetchEquipmentCount(setTotalEquipmentCount);
        fetchSessionsCount(setTotalSessionsCount);
        FetchLabsWithMostAllocatedEquipment(setLabsWithMostAllocatedEquipment);
        FetchSchoolsWithMostAllocatedEquipment(setSchoolsWithMostAllocatedEquipment);
        fetchLatestSessions(setLatestSessions, 6);
        fetchSatheeStudentsCount();
    }, []);

    const usedSpacePercentage = totalAllocatedSpace > 0 ? (usedSpace / totalAllocatedSpace) * 100 : 0;

    const pieColors = [
        "#8884d8", "#82ca9d", "#ff7300", "#d0ed57", "#ff6666", "#a4de6c", "#d84315",
        "#1e88e5", "#8e24aa", "#ffb74d", "#4caf50", "#ff5252", "#66bb6a", "#ef5350",
        "#ab47bc", "#5c6bc0", "#ffa726", "#26a69a", "#ec407a", "#8d6e63", "#ffeb3b",
        "#ff9800", "#ffcc80", "#cddc39", "#009688", "#03a9f4", "#ff4081", "#00bcd4"
    ];

    const stateAbbreviations = {
        'Andhra Pradesh': 'AP',
        'Arunachal': 'AR',
        'Assam': 'AS',
        'Bihar': 'BR',
        'Chhattisgarh': 'CG',
        'Goa': 'GA',
        'Gujrat': 'GJ',
        'Haryana': 'HR',
        'Himachal Pradesh': 'HP',
        'Jharkhand': 'JH',
        'Karnataka': 'KA',
        'Kerala': 'KL',
        'Madhya Pradesh': 'MP',
        'Maharashtra': 'MH',
        'Manipur': 'MN',
        'Meghalaya': 'ML',
        'Mizoram': 'MZ',
        'Nagaland': 'NL',
        'Odisha': 'OD',
        'Punjab': 'PB',
        'Rajasthan': 'RJ',
        'Sikkim': 'SK',
        'Tamil Nadu': 'TN',
        'Telangana': 'TS',
        'Tripura': 'TR',
        'Uttar Pradesh': 'UP',
        'Uttarakhand': 'UK',
        'West Bengal': 'WB',
        'Andaman and Nicobar Islands': 'ANI',
        'Chandigarh': 'CH',
        'Dadra and Nagar Haveli and Daman and Diu': 'DNHDD',
        'Delhi': 'DL',
        'Jammu and Kashmir': 'JK',
        'Ladakh': 'LA',
        'Lakshadweep': 'LD',
        'Puducherry': 'PY'
    };

    const formatMonth = (month) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = parseInt(month.split("-")[1], 10) - 1;
        return months[monthIndex];
    };

    // Transform data for pie charts
    const schoolsPieData = schoolsData.map(item => ({
        name: item.state,
        value: item.school_count
    }));

    const sessionsPieData = sessionData.map(item => ({
        name: formatMonth(item.month),
        value: item.session_count
    }));

    return (
        <main>
            <ul className="box-info">
                <li onClick={() => handleStatsClick(setSchoolsModalOpen)} style={{ cursor: 'pointer' }}>
                    <i className='bx bxs-school'></i>
                    <span className="text">
                        <h4>Total Schools</h4>
                        <p>{totalSchoolsCount}</p>
                    </span>
                </li>
                <li onClick={() => handleStatsClick(setLabsModalOpen)} style={{ cursor: 'pointer' }}>
                    <i className='bx bx-test-tube'></i>
                    <span className="text">
                        <h4>Total Labs</h4>
                        <p>{totalLabsCount}</p>
                    </span>
                </li>
                <li onClick={() => handleStatsClick(setEquipmentModalOpen)} style={{ cursor: 'pointer' }}>
                    <i className='bx bx-box'></i>
                    <span className="text">
                        <h4>Total Available Equipment</h4>
                        <p>{totalEquipmentCount}</p>
                    </span>
                </li>
                <li onClick={() => handleStatsClick(setSessionsModalOpen)} style={{ cursor: 'pointer' }}>
                    <i className='bx bx-calendar'></i>
                    <span className="text">
                        <h4>Total Sessions Conducted</h4>
                        <p>{totalSessionsCount}</p>
                    </span>
                </li>
                <li onClick={() => handleStatsClick(setSatheeStudentsModalOpen)} style={{ cursor: 'pointer' }}>
                    <i className='bx bx-user-plus'></i>
                    <span className="text">
                        <h4>Total Sathee Registration</h4>
                        <p>{totalSatheeStudents}</p>
                    </span>
                </li>
            </ul>
            <div className="table-data">
                <div className="order">
                    <div className="head">
                        <h3>Schools Distribution by State</h3>
                    </div>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={schoolsPieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${stateAbbreviations[name] || name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={window.innerWidth <= 768 ? 80 : 120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {schoolsPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    wrapperStyle={{ fontSize: '12px', maxHeight: '350px', overflowY: 'auto' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="order">
                    <div className="head">
                        <h3>Sessions Distribution Per Month</h3>
                    </div>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sessionsPieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={window.innerWidth <= 768 ? 80 : 120}
                                    fill="#82ca9d"
                                    dataKey="value"
                                >
                                    {sessionsPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    wrapperStyle={{ fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Latest Sessions Section */}
            <div className="table-data" style={{ marginBottom: '20px' }}>
                <div className="order" style={{ gridColumn: '1 / -1' }}>
                    <div className="head">
                        <h3>🎓 Latest Sessions</h3>
                    </div>
                    {latestSessions.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px',
                            padding: '20px 0'
                        }}>
                            {latestSessions.map((session) => (
                                <div key={session.id} style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    color: 'white',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                                    }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-50px',
                                        right: '-50px',
                                        width: '150px',
                                        height: '150px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%'
                                    }}></div>

                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '15px'
                                        }}>
                                            <h4 style={{
                                                margin: 0,
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                lineHeight: '1.4',
                                                flex: 1
                                            }}>
                                                {session.session_title}
                                            </h4>
                                            <span style={{
                                                background: session.session_status === 'Completed' ? '#10b981' : '#f59e0b',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                marginLeft: '10px',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {session.session_status || 'Pending'}
                                            </span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '10px',
                                            fontSize: '14px',
                                            opacity: 0.95
                                        }}>
                                            <i className='bx bx-user' style={{ fontSize: '16px' }}></i>
                                            <span>{session.session_host}</span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '10px',
                                            fontSize: '14px',
                                            opacity: 0.95
                                        }}>
                                            <i className='bx bx-calendar' style={{ fontSize: '16px' }}></i>
                                            <span>{new Date(session.session_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span>
                                            <span style={{ margin: '0 5px' }}>•</span>
                                            <i className='bx bx-time' style={{ fontSize: '16px' }}></i>
                                            <span>{session.session_time}</span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '10px',
                                            fontSize: '14px',
                                            opacity: 0.95
                                        }}>
                                            <i className='bx bxs-school' style={{ fontSize: '16px' }}></i>
                                            <span>{session.school_name}</span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '15px',
                                            fontSize: '14px',
                                            opacity: 0.95
                                        }}>
                                            <i className='bx bx-test-tube' style={{ fontSize: '16px' }}></i>
                                            <span>{session.lab_name}</span>
                                        </div>

                                        {/* Session Details */}
                                        {(session.centre_code || session.state || session.district) && (
                                            <div style={{
                                                background: 'rgba(255,255,255,0.15)',
                                                borderRadius: '10px',
                                                padding: '12px',
                                                marginBottom: '15px',
                                                fontSize: '13px'
                                            }}>
                                                {session.centre_code && (
                                                    <div style={{ marginBottom: '5px', opacity: 0.95 }}>
                                                        <strong>Centre:</strong> {session.centre_code}
                                                    </div>
                                                )}
                                                {session.state && (
                                                    <div style={{ marginBottom: '5px', opacity: 0.95 }}>
                                                        <strong>State:</strong> {session.state}
                                                    </div>
                                                )}
                                                {session.district && (
                                                    <div style={{ marginBottom: '5px', opacity: 0.95 }}>
                                                        <strong>District:</strong> {session.district}
                                                    </div>
                                                )}
                                                {session.sathee_mitra_name && (
                                                    <div style={{ marginBottom: '5px', opacity: 0.95 }}>
                                                        <strong>Coordinator:</strong> {session.sathee_mitra_name}
                                                    </div>
                                                )}
                                                {session.school_type && (
                                                    <div style={{ marginBottom: '5px', opacity: 0.95 }}>
                                                        <strong>School Type:</strong> {session.school_type}{session.school_type === 'Other' && session.school_type_other ? ` (${session.school_type_other})` : ''}
                                                    </div>
                                                )}
                                                {session.visit_mode && (
                                                    <div style={{ marginBottom: '5px', opacity: 0.95 }}>
                                                        <strong>Visit Mode:</strong> {session.visit_mode}
                                                    </div>
                                                )}
                                                {session.principal_name && (
                                                    <div style={{ marginBottom: '5px', opacity: 0.95 }}>
                                                        <strong>Principal:</strong> {session.principal_name}
                                                        {session.principal_contact && ` (${session.principal_contact})`}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {session.session_description && (
                                            <p style={{
                                                margin: '0 0 15px 0',
                                                fontSize: '13px',
                                                opacity: 0.9,
                                                lineHeight: '1.5',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {session.session_description}
                                            </p>
                                        )}

                                        {session.session_images && JSON.parse(session.session_images || '[]').length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                gap: '5px',
                                                marginBottom: '15px',
                                                flexWrap: 'wrap',
                                                alignItems: 'center'
                                            }}>
                                                {JSON.parse(session.session_images).slice(0, 3).map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`Session ${idx + 1}`}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            border: '2px solid rgba(255,255,255,0.3)',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => openImageViewer(JSON.parse(session.session_images))}
                                                    />
                                                ))}
                                                {JSON.parse(session.session_images).length > 3 && (
                                                    <div
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            borderRadius: '8px',
                                                            background: 'rgba(255,255,255,0.2)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => openImageViewer(JSON.parse(session.session_images))}
                                                    >
                                                        +{JSON.parse(session.session_images).length - 3}
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => openImageViewer(JSON.parse(session.session_images))}
                                                    title="View Images"
                                                    style={{
                                                        background: 'rgba(255,255,255,0.2)',
                                                        border: '2px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '8px',
                                                        width: '60px',
                                                        height: '60px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <i className='bx bx-show' style={{ fontSize: '24px', color: 'white' }}></i>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const images = JSON.parse(session.session_images);
                                                        images.forEach((imgUrl, idx) => {
                                                            const link = document.createElement('a');
                                                            link.href = imgUrl;
                                                            link.download = `${session.session_title.replace(/[^a-zA-Z0-9]/g, '_')}_image_${idx + 1}.jpg`;
                                                            link.target = '_blank';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        });
                                                    }}
                                                    title="Download All Images"
                                                    style={{
                                                        background: 'rgba(16, 185, 129, 0.8)',
                                                        border: '2px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '8px',
                                                        width: '60px',
                                                        height: '60px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(16, 185, 129, 1)';
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.8)';
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <i className='bx bx-download' style={{ fontSize: '24px', color: 'white' }}></i>
                                                </button>
                                            </div>
                                        )}

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingTop: '15px',
                                            borderTop: '1px solid rgba(255,255,255,0.2)'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '14px',
                                                fontWeight: '600'
                                            }}>
                                                <i className='bx bx-group' style={{ fontSize: '18px' }}></i>
                                                <span>{session.total_students} Students</span>
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                opacity: 0.8
                                            }}>
                                                {new Date(session.session_setup_on).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#999'
                        }}>
                            <i className='bx bx-calendar-x' style={{ fontSize: '48px', marginBottom: '10px' }}></i>
                            <p>No sessions available yet</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="table-data" style={{ marginBottom: '20px' }}>
                <div className="order">
                    <div className="head">
                        <h3>Lab Equipment Allocation</h3>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Lab Name</th>
                                <th>Equipment Names</th>
                                <th>Equipment Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labEquipmentData.map((lab, index) => (
                                <tr key={index}>
                                    <td>{lab.lab_name}</td>
                                    <td>{lab.equipment_names.length > 0 ? lab.equipment_names.join(", ") : "No Equipment"}</td>
                                    <td>{lab.equipment_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="table-data" style={{ marginBottom: '20px' }}>
                <div className="order">
                    <div className="head">
                        <h3>Schools with the most allocated equipment</h3>
                    </div>
                    <table>
                        <tbody>
                            {schoolsWithMostAllocatedEquipment.map((school, index) => (
                                <tr key={index}>
                                    <td>
                                        <p>{school.school_name}</p>
                                    </td>
                                    <td>
                                        <p className="count">{school.total_allocated}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="order">
                    <div className="head">
                        <h3>Labs with the most allocated equipment</h3>
                    </div>
                    <table>
                        <tbody>
                            {labsWithMostAllocatedEquipment.map((lab, index) => (
                                <tr key={index}>
                                    <td>
                                        <p>{lab.lab_name}</p>
                                    </td>
                                    <td>
                                        <p className="count">{lab.total_allocated}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ul className="box-info">
                <li onClick={() => handleStatsClick(setArtifactsModalOpen)} style={{ cursor: 'pointer' }}>
                    <i className='bx bx-store-alt'></i>
                    <span className="text">
                        <h4>Total Artifacts(Docs)</h4>
                        <p>{totalDocsCount}</p>
                    </span>
                </li>
                <li onClick={() => handleStatsClick(setUrlsModalOpen)} style={{ cursor: 'pointer' }}>
                    <i className='bx bx-link' ></i>
                    <span className="text">
                        <h4>Total URLs Shared</h4>
                        <p>{totalUrlsCount}</p>
                    </span>
                </li>
                <li onClick={() => handleStatsClick(setSearchesYearModalOpen)} style={{ cursor: 'pointer' }}>
                    <i className='bx bx-search'></i>
                    <span className="text">
                        <h4>Searches in {new Date().getFullYear()}</h4>
                        <p>{totalSearches}</p>
                    </span>
                </li>
                <li onClick={() => handleStatsClick(setSearchesMonthModalOpen)} style={{ cursor: 'pointer' }}>
                    <i className='bx bx-search-alt'></i>
                    <span className="text">
                        <h4>Searches in {new Date().toLocaleString('default', { month: 'long' })} '{new Date().getFullYear()}</h4>
                        <p>{currentMonthSearches}</p>
                    </span>
                </li>
            </ul>
            <div className='table-data'>
                <div className='order'>
                    <div className='space-text'>
                        <p>Allocated Space: {(totalAllocatedSpace).toFixed(2)}GB</p>
                        {/* <p>Available Space : {(totalAllocatedSpace - usedSpace).toFixed(2)} GB</p> */}
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${usedSpacePercentage}%` }}>
                            {usedSpacePercentage.toFixed(2)}% used
                        </div>
                    </div>
                </div>
                {/* <div className='order'>
                </div> */}
            </div>
            <div className="table-data">
                <div className="order">
                    <div className="head">
                        <h3>Top 10 Searched Tags</h3>
                    </div>
                    <table>
                        <tbody>
                            {searchedTags.map(tag => (
                                <tr key={tag.tag_name}>
                                    <td>
                                        <p>{tag.tag_name}</p>
                                    </td>
                                    <td>
                                        <p className="count">{tag.search_count}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="order">
                    <div className="head">
                        <h3>Top 10 Contributers</h3>
                    </div>
                    <table>
                        <tbody>
                            {contributors.map(contributor => (
                                <tr key={contributor.owner_author_id}>
                                    <td>
                                        <p>{contributor.owner_author_id}</p>
                                    </td>
                                    <td className='count'>{contributor.doc_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modals */}
            <SchoolsDetailModal
                isOpen={schoolsModalOpen}
                onClose={() => setSchoolsModalOpen(false)}
            />
            <LabsDetailModal
                isOpen={labsModalOpen}
                onClose={() => setLabsModalOpen(false)}
            />
            <EquipmentDetailModal
                isOpen={equipmentModalOpen}
                onClose={() => setEquipmentModalOpen(false)}
            />
            <SessionsDetailModal
                isOpen={sessionsModalOpen}
                onClose={() => setSessionsModalOpen(false)}
            />
            <ArtifactsDetailModal
                isOpen={artifactsModalOpen}
                onClose={() => setArtifactsModalOpen(false)}
            />
            <URLsDetailModal
                isOpen={urlsModalOpen}
                onClose={() => setUrlsModalOpen(false)}
            />
            <SearchesYearDetailModal
                isOpen={searchesYearModalOpen}
                onClose={() => setSearchesYearModalOpen(false)}
            />
            <SearchesMonthDetailModal
                isOpen={searchesMonthModalOpen}
                onClose={() => setSearchesMonthModalOpen(false)}
            />

            {/* Image Viewer Modal */}
            {imageViewerOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.95)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            color: 'white',
                            fontSize: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            zIndex: 10001
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
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
                        {selectedSessionImages.length > 1 && (
                            <button
                                onClick={prevImage}
                                style={{
                                    position: 'absolute',
                                    left: '-60px',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    color: 'white',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <i className='bx bx-chevron-left'></i>
                            </button>
                        )}

                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={selectedSessionImages[currentImageIndex]}
                                alt={`Session ${currentImageIndex + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    borderRadius: '10px',
                                    boxShadow: '0 10px 50px rgba(0,0,0,0.5)'
                                }}
                            />
                            <div style={{
                                color: 'white',
                                marginTop: '20px',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}>
                                Image {currentImageIndex + 1} of {selectedSessionImages.length}
                            </div>
                        </div>

                        {selectedSessionImages.length > 1 && (
                            <button
                                onClick={nextImage}
                                style={{
                                    position: 'absolute',
                                    right: '-60px',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    color: 'white',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <i className='bx bx-chevron-right'></i>
                            </button>
                        )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {selectedSessionImages.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '10px',
                            padding: '15px',
                            background: 'rgba(0,0,0,0.5)',
                            borderRadius: '10px',
                            maxWidth: '90%',
                            overflowX: 'auto'
                        }}>
                            {selectedSessionImages.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(idx);
                                    }}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: idx === currentImageIndex ? '3px solid white' : '3px solid transparent',
                                        opacity: idx === currentImageIndex ? 1 : 0.6,
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = idx === currentImageIndex ? 1 : 0.6}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Detail Modals */}
            <SchoolsDetailModal isOpen={schoolsModalOpen} onClose={() => setSchoolsModalOpen(false)} />
            <LabsDetailModal isOpen={labsModalOpen} onClose={() => setLabsModalOpen(false)} />
            <EquipmentDetailModal isOpen={equipmentModalOpen} onClose={() => setEquipmentModalOpen(false)} />
            <SessionsDetailModal isOpen={sessionsModalOpen} onClose={() => setSessionsModalOpen(false)} />
            <SatheeStudentsDetailModal isOpen={satheeStudentsModalOpen} onClose={() => setSatheeStudentsModalOpen(false)} />
            <ArtifactsDetailModal isOpen={artifactsModalOpen} onClose={() => setArtifactsModalOpen(false)} />
            <URLsDetailModal isOpen={urlsModalOpen} onClose={() => setUrlsModalOpen(false)} />
            <SearchesYearDetailModal isOpen={searchesYearModalOpen} onClose={() => setSearchesYearModalOpen(false)} />
            <SearchesMonthDetailModal isOpen={searchesMonthModalOpen} onClose={() => setSearchesMonthModalOpen(false)} />
        </main>
    );
};

export default Home;