import React from 'react';


const SummaryTile = ({ label, value, subtext, highlight = false }) => {
    return (
        <div className={`summary-tile ${highlight ? 'highlight' : ''}`}>
            <div className="tile-label">{label}</div>
            <div className="tile-value">{value}</div>
            {subtext && <div className="tile-subtext">{subtext}</div>}
        </div>
    );
};

export default SummaryTile;
