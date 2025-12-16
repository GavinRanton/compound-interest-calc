import React from 'react';
import Slider from '../components/Slider';
import SummaryTile from '../components/SummaryTile';
import DrawdownChart from '../components/DrawdownChart';

const DrawdownView = ({
    drawdownAmount, setDrawdownAmount,
    drawdownRate, setDrawdownRate,
    drawdownYears, setDrawdownYears,
    takeLumpSum, setTakeLumpSum,
    currency,
    drawdownLabels, drawdownBalanceData, drawdownWithdrawnData,
    drawdownFinalBalance, drawdownTotalWithdrawn,
    lumpSum, interestDeficitYear,
    finalBalance, // From Accumulation phase, used as starting pot
    openModal, formatCurrency, formatPercent, formatYears
}) => {
    return (
        <main className="main-grid">
            <section className="controls-panel">
                <h2>Retirement Plan 🏡</h2>
                <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
                    Based on your pot of <strong>{formatCurrency(finalBalance)}</strong>
                </p>

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
                    min={500} max={15000} step={100}
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
    );
};

export default DrawdownView;
