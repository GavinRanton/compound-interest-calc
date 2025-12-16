import React, { useEffect } from 'react';

const InfoModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h3 className="modal-title">{title}</h3>
                <div className="modal-body">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
