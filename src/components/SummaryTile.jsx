import React from 'react';


const SummaryTile = ({ label, value, subtext, highlight = false, onInfoClick }) => {
    return (
        <div className={`summary-tile ${highlight ? 'highlight' : ''}`}>
            <div className="tile-label">
                {label}
                {onInfoClick && (
                    <button
                        className="info-icon-btn"
                        onClick={(e) => { e.stopPropagation(); onInfoClick(); }}
                        aria-label="More info"
                    >
                        i
                    </button>
                )}
            </div>
            <div className="tile-value">{value}</div>
            {subtext && <div className="tile-subtext">{subtext}</div>}
        </div>
    );
};

export default SummaryTile;
