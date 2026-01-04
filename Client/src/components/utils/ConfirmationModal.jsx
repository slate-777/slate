import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="cancel-button">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="confirm-button">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
