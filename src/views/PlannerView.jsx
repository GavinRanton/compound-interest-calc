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
    finalBalance, totalContributed, totalInterest,
    crossoverYear, coastFireYear,
    openModal, formatCurrency, formatPercent, formatYears
}) => {
    // Local state for Age based planning
    // We initialise local state based on the global state prop 'years'
    // Default: Start at 30, Retire at (30 + years)
    const [currentAge, setCurrentAge] = useState(30);
    const [retireAge, setRetireAge] = useState(30 + years);

    // Sync effect: When Age sliders change, update global years
    useEffect(() => {
        const newHorizon = retireAge - currentAge;
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
                    label="Expected Return"
                    value={annualRate}
                    onChange={setAnnualRate}
                    min={0} max={15} step={0.5}
                    unit=""
                    formatFn={formatPercent}
                />
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
                    <SummaryTile
                        label="Coast FIRE 🏖️"
                        value={coastFireYear ? `Age ${currentAge + coastFireYear}` : 'Not yet'}
                        subtext={coastFireYear ? "Stop saving early!" : "Keep going!"}
                        highlight={!!coastFireYear}
                        onInfoClick={() => openModal('coast')}
                    />
                </div>

                <div className="chart-container">
                    <GrowthChart
                        labels={growthLabels}
                        balanceData={growthBalanceData}
                        contributionData={growthContributionData}
                        crossoverYear={crossoverYear}
                    />
                </div>

                {/* Smart Link to Drawdown */}
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: 'var(--primary-gradient)',
                    borderRadius: '12px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}>
                    <div>
                        <strong style={{ fontSize: '1.1rem' }}>What does {formatCurrency(finalBalance)} get you?</strong>
                        <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Simulate your retirement lifestyle now.</div>
                    </div>
                    {/* We can't easily link to tab here without parent callback, but visual cue is good. 
                        In App.jsx we can pass a 'switchToDrawdown' prop later if needed.
                    */}
                </div>

            </section>
        </main>
    );
};

export default PlannerView;
