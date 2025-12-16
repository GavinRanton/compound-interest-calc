import React, { useState, useMemo } from 'react';
import Slider from './components/Slider';
import SummaryTile from './components/SummaryTile';
import GrowthChart from './components/GrowthChart';
import DrawdownChart from './components/DrawdownChart';
import InfoModal from './components/InfoModal';
import { calculateGrowth, findCrossoverYear, calculateDrawdown, findCoastFireYear } from './utils/interestMath';
import './App.css';

function App() {
  // State for Accumulation Phase
  const [startAmount, setStartAmount] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(50);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(30);

  // Global Settings
  const [currency, setCurrency] = useState('£');
  const [inflationRate, setInflationRate] = useState(3);
  const [isInflationAdjusted, setIsInflationAdjusted] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [scenarioBDelay, setScenarioBDelay] = useState(10);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const openModal = (type) => {
    let content = { title: '', content: '' };
    switch (type) {
      case 'crossover':
        content = {
          title: 'What is the "Crossover Year"? 🚀',
          content: 'This is the magic moment where your money starts working harder than you do! In this year, the annual interest earned on your pot becomes larger than your total annual contributions. Calculated as: Annual Interest > Annual Contributions.'
        };
        break;
      case 'coast':
        content = {
          title: 'What is Coast FIRE? 🏖️',
          content: 'Coast FIRE (Financial Independence, Retire Early) is the point where you have saved enough that you no longer need to contribute another penny to reach your retirement goal. Your existing pot will grow purely through compound interest to hit your target by the time you retire.'
        };
        break;
      case 'deficit':
        content = {
          title: 'Interest Deficit Year 📉',
          content: 'This is the warning point where your annual withdrawals start exceeding the interest your pot earns. From this year onwards, you are eating into your principal balance, accelerating the depletion of your pot.'
        };
        break;
      default:
        break;
    }
    setModalContent(content);
    setModalOpen(true);
  };

  // State for Drawdown Phase
  const [drawdownAmount, setDrawdownAmount] = useState(2000);
  const [drawdownRate, setDrawdownRate] = useState(5);
  const [drawdownYears, setDrawdownYears] = useState(25);
  const [takeLumpSum, setTakeLumpSum] = useState(false);

  // Derived state (Accumulation)
  const {
    labels: growthLabels,
    balanceData: growthBalanceData,
    contributionData: growthContributionData,
    finalBalance,
    totalContributed,
    totalInterest
  } = useMemo(() =>
    calculateGrowth(startAmount, monthlyContribution, annualRate, years, inflationRate, isInflationAdjusted),
    [startAmount, monthlyContribution, annualRate, years, inflationRate, isInflationAdjusted]
  );

  const {
    balanceData: comparisonBalanceData,
    finalBalance: comparisonFinalBalance
  } = useMemo(() => {
    if (!showComparison) return { balanceData: null, finalBalance: null };
    return calculateGrowth(startAmount, monthlyContribution, annualRate, years, inflationRate, isInflationAdjusted, scenarioBDelay);
  }, [startAmount, monthlyContribution, annualRate, years, inflationRate, isInflationAdjusted, showComparison, scenarioBDelay]);

  const crossoverYear = useMemo(() =>
    findCrossoverYear(startAmount, monthlyContribution, annualRate, years),
    [startAmount, monthlyContribution, annualRate, years]
  );

  const coastFireYear = useMemo(() =>
    findCoastFireYear(growthBalanceData, annualRate, years, finalBalance),
    [growthBalanceData, annualRate, years, finalBalance]
  );

  // Derived state (Drawdown)
  const {
    labels: drawdownLabels,
    balanceData: drawdownBalanceData,
    withdrawnData: drawdownWithdrawnData,
    finalBalance: drawdownFinalBalance,
    totalWithdrawn: drawdownTotalWithdrawn,
    lumpSum,
    interestDeficitYear
  } = useMemo(() =>
    calculateDrawdown(finalBalance, drawdownAmount, drawdownRate, drawdownYears, takeLumpSum),
    [finalBalance, drawdownAmount, drawdownRate, drawdownYears, takeLumpSum]
  );

  // Formatters
  const formatCurrency = (val) => `${currency}${val.toLocaleString()}`;
  const formatPercent = (val) => `${val}%`;
  const formatYears = (val) => `${val} yrs`;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Watch Your Money Grow 🌱</h1>
        <p>See how compound interest {isInflationAdjusted ? "(and inflation)" : ""} makes your savings explode!</p>

        <div className="settings-bar" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="setting-group">
            <label style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Currency: </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            >
              <option value="£">GBP (£)</option>
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
            </select>
          </div>

          <div className="setting-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label className="checkbox-label" style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={isInflationAdjusted}
                onChange={(e) => setIsInflationAdjusted(e.target.checked)}
              />
              Adjust for Inflation?
            </label>
          </div>

          <div className="setting-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label className="checkbox-label" style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={showComparison}
                onChange={(e) => setShowComparison(e.target.checked)}
              />
              Compare vs Delay? 🆚
            </label>
          </div>
        </div>

        {isInflationAdjusted && (
          <div style={{ maxWidth: '400px', margin: '20px auto 10px' }}>
            <Slider
              label="Inflation Rate"
              value={inflationRate}
              onChange={setInflationRate}
              min={0} max={15} step={0.5}
              unit="%"
              formatFn={(v) => `${v}%`}
            />
          </div>
        )}

        {showComparison && (
          <div style={{ maxWidth: '400px', margin: '10px auto 0', background: '#fff3cd', padding: '15px', borderRadius: '12px', border: '1px solid #ffeeba' }}>
            <Slider
              label="Delay Start by (Years)"
              value={scenarioBDelay}
              onChange={setScenarioBDelay}
              min={1} max={20} step={1}
              unit=" yrs"
              formatFn={(v) => `${v} yrs`}
            />
            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#856404' }}>
              <strong>Cost of waiting {scenarioBDelay} years:</strong> <br />
              You lose {formatCurrency(finalBalance - comparisonFinalBalance)}! 😱
            </div>
          </div>
        )}
      </header>

      <main className="main-grid">
        {/* Left Panel: Controls */}
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

        {/* Right Panel: Visualization */}
        <section className="viz-panel">

          {/* Summary Tiles */}
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

          {/* Chart */}
          <div className="chart-container">
            <GrowthChart
              labels={growthLabels}
              balanceData={growthBalanceData}
              contributionData={growthContributionData}
              crossoverYear={crossoverYear}
              comparisonBalanceData={comparisonBalanceData}
            />
          </div>

          {/* Kid Mode Message */}
          {crossoverYear && (
            <div className="kid-mode-message">
              🎉 <strong>Interest Takeover!</strong> From Year {crossoverYear} onward, your money is earning more than you are adding!
            </div>
          )}
        </section>
      </main>

      {/* Drawdown Section */}
      <header className="app-header" style={{ marginTop: '4rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
        <h1>Living on the Value 🏡</h1>
        <p>Can you live off your pot? Simulate your retirement drawdown.</p>
      </header>

      <main className="main-grid">
        {/* Left Panel: Drawdown Controls */}
        <section className="controls-panel">
          <h2>Retirement Plan</h2>

          <div className="control-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={takeLumpSum}
                onChange={(e) => setTakeLumpSum(e.target.checked)}
              />
              Take 25% Tax-Free Lump Sum
            </label>
            {takeLumpSum && <div className="lump-sum-display">You take: <strong>{formatCurrency(lumpSum)}</strong></div>}
          </div>

          <Slider
            label="Monthly Withdrawal"
            value={drawdownAmount}
            onChange={setDrawdownAmount}
            min={500} max={10000} step={100}
            unit={currency}
            formatFn={(v) => v.toLocaleString()}
          />
          <div className="annual-withdrawal-display">
            Annual Income: <strong>{formatCurrency(drawdownAmount * 12)}</strong>
          </div>

          <Slider
            label="Interest Rate (Retirement)"
            value={drawdownRate}
            onChange={setDrawdownRate}
            min={0} max={10} step={0.5}
            unit=""
            formatFn={formatPercent}
          />

          <Slider
            label="Drawdown Years"
            value={drawdownYears}
            onChange={setDrawdownYears}
            min={5} max={40} step={1}
            unit=""
            formatFn={formatYears}
          />
        </section>

        {/* Right Panel: Drawdown Visualization */}
        <section className="viz-panel">
          <div className="summary-grid">
            <SummaryTile
              label="Starting Pot"
              value={formatCurrency(takeLumpSum ? finalBalance - lumpSum : finalBalance)}
              subtext={takeLumpSum ? "(After Lump Sum)" : ""}
            />
            <SummaryTile
              label="Total Withdrawn"
              value={formatCurrency(drawdownTotalWithdrawn)}
              highlight={true}
            />
            <SummaryTile
              label="Final Pot Value"
              value={formatCurrency(drawdownFinalBalance)}
              subtext={drawdownFinalBalance === 0 ? "Ran out of money!" : "Legacy left"}
              highlight={drawdownFinalBalance > 0}
            />
            <SummaryTile
              label="Interest Deficit"
              value={interestDeficitYear ? `Year ${interestDeficitYear}` : 'Never'}
              subtext={interestDeficitYear ? "Withdrawal > Interest" : "Sustainable!"}
              onInfoClick={() => openModal('deficit')}
            />
          </div>

          <div className="chart-container">
            <DrawdownChart
              labels={drawdownLabels}
              balanceData={drawdownBalanceData}
              withdrawnData={drawdownWithdrawnData}
              interestDeficitYear={interestDeficitYear}
            />
          </div>
        </section>
      </main>

      <InfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </div>
  );
}

export default App;
