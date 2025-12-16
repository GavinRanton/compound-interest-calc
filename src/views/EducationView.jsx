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
    openModal, formatCurrency, formatPercent, formatYears
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
