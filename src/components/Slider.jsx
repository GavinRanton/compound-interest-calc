import React from 'react';


const Slider = ({ label, value, onChange, min, max, step = 1, unit = '', formatFn, manualInput = false }) => {

    const displayValue = formatFn ? formatFn(value) : value;

    const handleInputChange = (e) => {
        const val = e.target.value;
        // Allow empty string for typing
        if (val === '') {
            onChange('');
            return;
        }
        const numVal = Number(val);
        if (!isNaN(numVal)) {
            onChange(numVal);
        }
    };

    return (
        <div className="slider-container">
            <div className="slider-header">
                <label className="slider-label">{label}</label>
                {manualInput ? (
                    <div className="slider-input-wrapper">
                        <span className="input-prefix">{unit}</span>
                        <input
                            type="number"
                            value={value}
                            onChange={handleInputChange}
                            className="manual-input"
                        />
                    </div>
                ) : (
                    <span className="slider-value">{unit}{displayValue}</span>
                )}
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={typeof value === 'number' ? Math.min(value, max) : min}
                onChange={(e) => onChange(Number(e.target.value))}
                className="slider-input"
            />
        </div>
    );
};

export default Slider;
