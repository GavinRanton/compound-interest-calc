import React, { useEffect, useState } from 'react';
import Slider from '../components/Slider';
import SummaryTile from '../components/SummaryTile';
import GrowthChart from '../components/GrowthChart';

const PlannerView = ({
    startAmount, setStartAmount,
    monthlyContribution, setMonthlyContribution,
    annualRate, setAnnualRate,
    years, setYears,
    currency,
    growthLabels, growthBalanceData, growthContributionData,
    comparisonBalanceData, finalBalance, comparisonFinalBalance,
    totalContributed, totalInterest,
    crossoverYear, coastFireYear,
    showComparison, setShowComparison, scenarioBDelay, setScenarioBDelay,
    openModal, onNavigate, formatCurrency, formatPercent, formatYears,
    setCurrency, isInflationAdjusted, setIsInflationAdjusted, inflationRate, setInflationRate
}) => {
    // Local state for Age based planning
    // We initialise local state based on the global state prop 'years'
    // Default: Start at 30, Retire at (30 + years)
    const [currentAge, setCurrentAge] = useState(30);
    const [retireAge, setRetireAge] = useState(30 + Number(years));

    // Sync effect: When Age sliders change, update global years
    useEffect(() => {
        const c = Number(currentAge);
        const r = Number(retireAge);
        const newHorizon = r - c;
        if (newHorizon > 0 && newHorizon !== years) {
            setYears(newHorizon);
        }
    }, [currentAge, retireAge, setYears, years]);

    return (
        <main className="main-grid">
            <section className="controls-panel">
                <h2>Retirement Planner 💼</h2>
                <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
                    Planning based on your age gap.
                </p>

                <Slider
                    label="Current Age"
                    value={currentAge}
                    onChange={setCurrentAge}
                    min={18} max={80} step={1}
                    unit=""
                    formatFn={(v) => `${v} y/o`}
                />

                <Slider
                    label="Retirement Age"
                    value={retireAge}
                    onChange={setRetireAge}
                    min={currentAge + 1} max={90} step={1}
                    unit=""
                    formatFn={(v) => `${v} y/o`}
                />

                <div className="setting-group" style={{
                    padding: '10px',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0'
                }}>
                    <span style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>
                        Time to Grow: {retireAge - currentAge} Years
                    </span>
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

                <Slider
                    label="Current Pension Pot"
                    value={startAmount}
                    onChange={setStartAmount}
                    min={0} max={1000000} step={1000}
                    unit={currency}
                    formatFn={(v) => v.toLocaleString()}
                    manualInput={true}
                />

                <Slider
                    label="Monthly Contribution"
                    value={monthlyContribution}
                    onChange={setMonthlyContribution}
                    min={0} max={10000} step={50}
                    unit={currency}
                    formatFn={(v) => v.toLocaleString()}
                />

                <Slider
                    label="Interest Rate"
                    value={annualRate}
                    onChange={setAnnualRate}
                    min={0} max={15} step={0.5}
                    unit=""
                    formatFn={formatPercent}
                />

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

                <h3>Settings ⚙️</h3>

                <div className="setting-group" style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Currency</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', width: '100%' }}
                    >
                        <option value="£">GBP (£)</option>
                        <option value="$">USD ($)</option>
                        <option value="€">EUR (€)</option>
                    </select>
                </div>

                <div className="setting-group">
                    <label className="checkbox-label" style={{ marginBottom: isInflationAdjusted ? '10px' : '0' }}>
                        <input
                            type="checkbox"
                            checked={isInflationAdjusted}
                            onChange={(e) => setIsInflationAdjusted(e.target.checked)}
                        />
                        Adjust for Inflation?
                    </label>

                    {isInflationAdjusted && (
                        <Slider
                            label="Inflation Rate"
                            value={inflationRate}
                            onChange={setInflationRate}
                            min={0} max={15} step={0.5}
                            unit="%"
                            formatFn={(v) => `${v}%`}
                        />
                    )}
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

                <div className="control-group" style={{ marginBottom: '10px' }}>
                    <label className="checkbox-label" style={{ marginBottom: showComparison ? '15px' : '0' }}>
                        <input
                            type="checkbox"
                            checked={showComparison}
                            onChange={(e) => setShowComparison(e.target.checked)}
                        />
                        Show Cost of Delay? ⏱️
                    </label>

                    {showComparison && (
                        <div style={{ marginTop: '10px', paddingLeft: '10px', borderLeft: '3px solid #f59e0b' }}>
                            <Slider
                                label="Delay Start by"
                                value={scenarioBDelay}
                                onChange={setScenarioBDelay}
                                min={1} max={10} step={1}
                                unit=" yrs"
                                formatFn={(v) => `${v} yrs`}
                            />
                        </div>
                    )}
                </div>
            </section>

            <section className="viz-panel">
                <div className="summary-grid">
                    <SummaryTile
                        label={`Pot at Age ${retireAge}`}
                        value={formatCurrency(finalBalance)}
                        highlight={true}
                        subtext="Projected Total"
                    />
                    <SummaryTile
                        label="Likely Income/Yr"
                        value={formatCurrency(Math.round(finalBalance * 0.04))} // 4% rule approximation
                        subtext="Based on 4% rule"
                    />
                    <SummaryTile
                        label="Interest Earned"
                        value={formatCurrency(totalInterest)}
                    />
                    {showComparison && (
                        <SummaryTile
                            label="Cost of Waiting"
                            value={
                                <span style={{ color: '#ef4444' }}>
                                    -{formatCurrency(finalBalance - comparisonFinalBalance)}
                                </span>
                            }
                            subtext={`Loss from waiting ${scenarioBDelay} years`}
                        />
                    )}
                </div>

                <div className="chart-container">
                    <GrowthChart
                        labels={growthLabels}
                        balanceData={growthBalanceData}
                        contributionData={growthContributionData}
                        crossoverYear={null} // Hide crossover on planner
                        comparisonBalanceData={comparisonBalanceData}
                    />
                </div>

                {/* Smart Link to Drawdown */}
                <button
                    onClick={() => onNavigate('drawdown')}
                    className="planner-link-btn"
                    style={{
                        marginTop: '20px',
                        width: '100%',
                        padding: '15px',
                        background: 'var(--primary-gradient)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer',
                        textAlign: 'left'
                    }}>
                    <div>
                        <strong style={{ fontSize: '1.1rem' }}>What does {formatCurrency(finalBalance)} get you?</strong>
                        <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Simulate your retirement lifestyle now.</div>
                    </div>
                    {/* We can't easily link to tab here without parent callback, but visual cue is good. 
                        In App.jsx we can pass a 'switchToDrawdown' prop later if needed.
                    */}
                </button>

            </section>
        </main>
    );
};

export default PlannerView;
