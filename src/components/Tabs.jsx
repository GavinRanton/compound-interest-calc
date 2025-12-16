import React from 'react';

const Tabs = ({ activeTab, onTabChange }) => {
    return (
        <div className="tabs-container">
            <button
                className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => onTabChange('education')}
            >
                🎓 Learn
            </button>
            <button
                className={`tab-btn ${activeTab === 'planner' ? 'active' : ''}`}
                onClick={() => onTabChange('planner')}
            >
                💼 Planner
            </button>
            <button
                className={`tab-btn ${activeTab === 'drawdown' ? 'active' : ''}`}
                onClick={() => onTabChange('drawdown')}
            >
                🏡 Live
            </button>
            <button
                className={`tab-btn ${activeTab === 'help' ? 'active' : ''}`}
                onClick={() => onTabChange('help')}
            >
                ❓ Help
            </button>
        </div>
    );
};

export default Tabs;
