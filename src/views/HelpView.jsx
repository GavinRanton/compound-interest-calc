import React from 'react';

const HelpView = () => {
    return (
        <main className="main-grid" style={{ display: 'block', maxWidth: '800px', margin: '0 auto' }}>
            <div className="controls-panel">
                <h2>Help & Information ℹ️</h2>

                <div style={{ marginBottom: '30px' }}>
                    <h3>How to use this tool</h3>
                    <ul style={{ lineHeight: '1.6', color: 'var(--secondary-color)' }}>
                        <li><strong>🎓 Learn:</strong> Simple compound interest. Good for kids or quick savings checks.</li>
                        <li><strong>💼 Planner:</strong> Plan for retirement. Use your Age and desired Retirement Age to see if your pot will be big enough.</li>
                        <li><strong>🏡 Live:</strong> Simulate "Drawdown". See how long your money lasts if you withdraw a monthly income.</li>
                    </ul>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h3>Common Questions</h3>
                    <details style={{ marginBottom: '10px', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                        <summary style={{ fontWeight: 600, cursor: 'pointer' }}>What is the "4% Rule"?</summary>
                        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>A common rule of thumb that suggests you can withdraw 4% of your total retirement pot in the first year, and adjust for inflation thereafter, with a high chance of not running out of money for 30 years.</p>
                    </details>
                    <details style={{ marginBottom: '10px', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                        <summary style={{ fontWeight: 600, cursor: 'pointer' }}>What is "Coast FIRE"?</summary>
                        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>The point where you have saved enough that compound interest alone will grow your pot to your retirement target without any further monthly contributions.</p>
                    </details>
                </div>

                <div style={{
                    padding: '20px',
                    background: '#fff5f5',
                    border: '1px solid #fed7d7',
                    borderRadius: '12px',
                    color: '#c53030'
                }}>
                    <h3 style={{ marginTop: 0 }}>⚠️ Important Disclaimer</h3>
                    <p>
                        This calculator is for <strong>educational and illustrative purposes only</strong>.
                        It is not financial advice.
                        Calculations are simple projections and do not account for complex tax rules, changing inflation, fund fees, or market volatility.
                    </p>
                    <p>
                        Always consult a qualified Independent Financial Adviser (IFA) before making significant financial decisions.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default HelpView;
