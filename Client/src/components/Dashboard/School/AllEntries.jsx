import React, { useState } from 'react';
import ViewSchools from './ViewSchools';
import ViewLabs from './ViewLabs';
import ViewEquipments from './ViewEquipments';
import ViewAllocatedEquipments from './ViewAllocatedEquipments'
import ViewSessions from './ViewSessions';
import ViewSatheeStudents from './ViewSatheeStudents';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllEntries = ({ role }) => {
    const [activeComponent, setActiveComponent] = useState('schools');
    const [showAllEntities, setShowAllEntities] = useState(role === 3);  // Global toggle for all entities

    const renderComponent = () => {
        switch (activeComponent) {
            case 'schools':
                return <ViewSchools role={role} showAllEntities={showAllEntities} />;
            case 'labs':
                return <ViewLabs role={role} showAllEntities={showAllEntities} />;
            case 'equipments':
                return <ViewEquipments role={role} showAllEntities={showAllEntities} />;
            case 'allocatedEquipments':
                return <ViewAllocatedEquipments role={role} showAllEntities={showAllEntities} />;
            case 'sessions':
                return <ViewSessions role={role} showAllEntities={showAllEntities} />;
            case 'satheeStudents':
                return <ViewSatheeStudents role={role} showAllEntities={showAllEntities} />;
            default:
                return <ViewSchools role={role} showAllEntities={showAllEntities} />;
        }
    };

    return (
        <div className="my-entries-container">
            <ToastContainer />

            {role === 1 && (
                <div className="global-toggle">
                    <span className="toggle-switch-text">My Entities</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={showAllEntities}
                            onChange={() => setShowAllEntities(!showAllEntities)}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="toggle-switch-text">All Entities</span>
                </div>
            )}

            <div className="switch-buttons">
                <button
                    className={activeComponent === 'schools' ? 'active' : ''}
                    onClick={() => setActiveComponent('schools')}
                >
                    Schools
                </button>
                <button
                    className={activeComponent === 'labs' ? 'active' : ''}
                    onClick={() => setActiveComponent('labs')}
                >
                    Labs
                </button>
                <button
                    className={activeComponent === 'equipments' ? 'active' : ''}
                    onClick={() => setActiveComponent('equipments')}
                >
                    Equipment
                </button>
                <button
                    className={activeComponent === 'allocatedEquipments' ? 'active' : ''}
                    onClick={() => setActiveComponent('allocatedEquipments')}
                >
                    Allocated Equipment
                </button>
                <button
                    className={activeComponent === 'sessions' ? 'active' : ''}
                    onClick={() => setActiveComponent('sessions')}
                >
                    Sessions
                </button>
                <button
                    className={activeComponent === 'satheeStudents' ? 'active' : ''}
                    onClick={() => setActiveComponent('satheeStudents')}
                >
                    Sathee Students
                </button>
            </div>
            <div className="component-container">
                {renderComponent()}
            </div>
        </div>
    );
};

export default AllEntries;