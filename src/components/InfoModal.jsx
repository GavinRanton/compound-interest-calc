import React, { useEffect } from 'react';

const InfoModal = ({ isOpen, onClose, title, content }) => {
    // Close on escape key
    useEffect(() => {
        if (!isOpen) return; // Early return inside hook callback is fine
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

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
