import React from 'react';
import Slider from '../components/Slider';
import SummaryTile from '../components/SummaryTile';
import GrowthChart from '../components/GrowthChart';

const EducationView = ({
    startAmount, setStartAmount,
    monthlyContribution, setMonthlyContribution,
    annualRate, setAnnualRate,
    years, setYears,
    currency,
    growthLabels, growthBalanceData, growthContributionData,
    finalBalance, totalContributed, totalInterest,
    crossoverYear, coastFireYear,
    comparisonBalanceData,
    showComparison, setShowComparison, scenarioBDelay, setScenarioBDelay,
    openModal, formatCurrency, formatPercent, formatYears,
    setCurrency, isInflationAdjusted, setIsInflationAdjusted, inflationRate, setInflationRate
}) => {
    return (
        <main className="main-grid">
            <section className="controls-panel">
                <h2>Adjust Your Plan</h2>

                <Slider
                    label="Starting Amount"
                    value={startAmount}
                    onChange={setStartAmount}
                    min={0} max={10000} step={100}
                    unit={currency}
                    formatFn={(v) => v.toLocaleString()}
                    manualInput={true}
                />

                <Slider
                    label="Monthly Save"
                    value={monthlyContribution}
                    onChange={setMonthlyContribution}
                    min={0} max={4000} step={10}
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

                <Slider
                    label="Time Horizon"
                    value={years}
                    onChange={setYears}
                    min={1} max={50} step={1}
                    unit=""
                    formatFn={formatYears}
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

                <div className="setting-group" style={{ marginTop: '15px' }}>
                    <label className="checkbox-label" style={{ marginBottom: showComparison ? '10px' : '0' }}>
                        <input
                            type="checkbox"
                            checked={showComparison}
                            onChange={(e) => setShowComparison(e.target.checked)}
                        />
                        Compare vs Delay? 🆚
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
                            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#856404', marginTop: '5px' }}>
                                Loss: <strong>{formatCurrency(finalBalance - (comparisonBalanceData ? comparisonBalanceData[comparisonBalanceData.length - 1] : 0))}</strong>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="viz-panel">
                <div className="summary-grid">
                    <SummaryTile
                        label="Final Value"
                        value={formatCurrency(finalBalance)}
                        highlight={true}
                    />
                    <SummaryTile
                        label="You Paid In"
                        value={formatCurrency(totalContributed)}
                    />
                    <SummaryTile
                        label="Interest Earned"
                        value={formatCurrency(totalInterest)}
                    />
                    <SummaryTile
                        label="Crossover Year"
                        value={crossoverYear ? `Year ${crossoverYear}` : 'Not yet'}
                        subtext={crossoverYear ? "Interest > Contributions!" : "Keep saving!"}
                        highlight={!!crossoverYear}
                        onInfoClick={() => openModal('crossover')}
                    />
                    <SummaryTile
                        label="Coast FIRE 🏖️"
                        value={coastFireYear ? `Year ${coastFireYear}` : 'Not yet'}
                        subtext={coastFireYear ? "Stop saving & still hit target!" : "Keep going!"}
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
                        comparisonBalanceData={comparisonBalanceData}
                    />
                </div>

                {crossoverYear && (
                    <div className="kid-mode-message">
                        🎉 <strong>Interest Takeover!</strong> From Year {crossoverYear} onward, your money is earning more than you are adding!
                    </div>
                )}
            </section>
        </main>
    );
};

export default EducationView;
