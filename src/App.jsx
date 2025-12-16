import React, { useState, useMemo, useEffect } from 'react';
import ReactGA from "react-ga4";
import Tabs from './components/Tabs';
import InfoModal from './components/InfoModal';
import Slider from './components/Slider'; // For settings
// Import Views
import EducationView from './views/EducationView';
import PlannerView from './views/PlannerView';
import DrawdownView from './views/DrawdownView';
import HelpView from './views/HelpView';
import { calculateGrowth, findCrossoverYear, calculateDrawdown, findCoastFireYear } from './utils/interestMath';
import './App.css';

// Initialize Google Analytics with User ID
ReactGA.initialize("G-L0LWQVG5C3");

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('education');

  // Track Page Views on Tab Change
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: `/${activeTab}`, title: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) });
  }, [activeTab]);

  // State for Accumulation Phase (Shared Source of Truth)
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

  // State for Decumulation Phase
  const [drawdownAmount, setDrawdownAmount] = useState(2000);
  const [drawdownRate, setDrawdownRate] = useState(5);
  const [drawdownYears, setDrawdownYears] = useState(20);
  const [takeLumpSum, setTakeLumpSum] = useState(false);
  const [lumpSumPercentage, setLumpSumPercentage] = useState(25); // New State

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
    interestDeficitYear,
    ruinYear
  } = useMemo(() =>
    calculateDrawdown(finalBalance, drawdownAmount, drawdownRate, drawdownYears, takeLumpSum, lumpSumPercentage),
    [finalBalance, drawdownAmount, drawdownRate, drawdownYears, takeLumpSum, lumpSumPercentage]
  );

  // Track Ruin Warning
  useEffect(() => {
    if (ruinYear) {
      ReactGA.event({
        category: "Drawdown",
        action: "ruin_warning_shown",
        label: `Ruin Year: ${ruinYear}`
      });
    }
  }, [ruinYear]);

  // Formatters
  const formatCurrency = (val) => `${currency}${val.toLocaleString()}`;
  const formatPercent = (val) => `${val}%`;
  const formatYears = (val) => `${val} yrs`;

  // Props to pass to views
  const commonProps = {
    startAmount, setStartAmount,
    monthlyContribution, setMonthlyContribution,
    annualRate, setAnnualRate,
    years, setYears,
    currency,
    growthLabels, growthBalanceData, growthContributionData,
    finalBalance, totalContributed, totalInterest,
    crossoverYear, coastFireYear,
    comparisonBalanceData, comparisonFinalBalance,
    showComparison, setShowComparison,
    scenarioBDelay, setScenarioBDelay,
    openModal,
    onNavigate: setActiveTab,
    formatCurrency, formatPercent, formatYears,
    // Global Settings Props
    setCurrency,
    isInflationAdjusted, setIsInflationAdjusted,
    inflationRate, setInflationRate
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Watch Your Money Grow 🌱</h1>
        <p>See how compound interest {isInflationAdjusted ? "(and inflation)" : ""} makes your savings explode!</p>

        {/* Navigation Tabs */}
        <div style={{ marginTop: '30px' }}>
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Global Settings moved to Sidebar in views */}
      </header>

      {/* Views */}
      {activeTab === 'education' && <EducationView {...commonProps} />}

      {activeTab === 'planner' && <PlannerView {...commonProps} />}

      {activeTab === 'drawdown' && (
        <DrawdownView
          drawdownAmount={drawdownAmount} setDrawdownAmount={setDrawdownAmount}
          drawdownRate={drawdownRate} setDrawdownRate={setDrawdownRate}
          drawdownYears={drawdownYears} setDrawdownYears={setDrawdownYears}
          takeLumpSum={takeLumpSum} setTakeLumpSum={setTakeLumpSum}
          lumpSumPercentage={lumpSumPercentage} setLumpSumPercentage={setLumpSumPercentage}
          currency={currency}
          drawdownLabels={drawdownLabels}
          drawdownBalanceData={drawdownBalanceData}
          drawdownWithdrawnData={drawdownWithdrawnData}
          drawdownFinalBalance={drawdownFinalBalance}
          drawdownTotalWithdrawn={drawdownTotalWithdrawn}
          lumpSum={lumpSum}
          interestDeficitYear={interestDeficitYear}
          ruinYear={ruinYear}
          finalBalance={finalBalance}
          openModal={openModal}
          formatCurrency={formatCurrency}
          formatPercent={formatPercent}
          formatYears={formatYears}
        />
      )}

      {activeTab === 'help' && <HelpView />}

      <InfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
      />

      {/* Sticky Mobile Footer */}
      <div className="mobile-sticky-footer">
        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Projected Pot</div>
        <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{formatCurrency(finalBalance)}</div>
      </div>

      {/* Global Trust Footer */}
      <footer style={{
        marginTop: '60px',
        padding: '30px 20px 80px', // Extra padding at bottom for mobile sticky footer space
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.85rem',
        borderTop: '1px solid #e2e8f0'
      }}>
        <p style={{ marginBottom: '10px' }}>
          <strong>Disclaimer:</strong> This tool is for educational purposes only and does not constitute financial advice. <br />
          Projections are estimates and actual investment returns will vary.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a href="/privacy.html" style={{ color: '#64748b', textDecoration: 'underline' }}>Privacy Policy</a>
          <a href="/terms.html" style={{ color: '#64748b', textDecoration: 'underline' }}>Terms & Disclaimer</a>
        </div>
        <p style={{ marginTop: '20px', fontSize: '0.75rem', opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} Compound Interest Visualiser
        </p>
      </footer>

    </div>
  );
}

export default App;
