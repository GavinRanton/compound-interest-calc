/**
 * Calculates compound interest growth over time with monthly contributions.
 * 
 * @param {number} startAmount - Initial principal (P0)
 * @param {number} monthlyContribution - Monthly addition (PMT)
 * @param {number} annualRate - Annual interest rate in percent (e.g., 7 for 7%)
 * @param {number} years - Time horizon in years
 * @returns {Object} result
 * @returns {Array} result.labels - Array of year labels (e.g., "Year 0", "Year 1")
 * @returns {Array} result.balanceData - Array of total balance values per year
 * @returns {Array} result.contributionData - Array of total contribution values per year
 * @returns {number} result.finalBalance - Final total balance
 * @returns {number} result.totalContributed - Total amount contributed
 * @returns {number} result.totalInterest - Total interest earned
 */
export const calculateGrowth = (startAmount, monthlyContribution, annualRate, years) => {
    const r = annualRate / 100;
    const n = 12; // Monthly compounding
    const totalMonths = years * 12;

    let balance = startAmount;
    let totalContributed = startAmount;

    const balanceData = [startAmount];
    const contributionData = [startAmount];
    const labels = ['Year 0'];

    // We'll track yearly data points for the chart to keep it clean
    for (let m = 1; m <= totalMonths; m++) {
        // Apply monthly interest
        balance = balance * (1 + r / n);
        // Add monthly contribution
        balance += monthlyContribution;
        totalContributed += monthlyContribution;

        // Store data point at the end of each year
        if (m % 12 === 0) {
            const year = m / 12;
            labels.push(`Year ${year}`);
            balanceData.push(Math.round(balance));
            contributionData.push(Math.round(totalContributed));
        }
    }

    return {
        labels,
        balanceData,
        contributionData,
        finalBalance: Math.round(balance),
        totalContributed: Math.round(totalContributed),
        totalInterest: Math.round(balance - totalContributed)
    };
};

/**
 * Finds the year where interest earned > total contributions.
 * Note: The user spec defines crossover as "interest earned > contributions".
 * However, usually crossover refers to "interest earned in a period > contribution in that period".
 * Based on the spec: "Crossover year where interest earned > contributions" (Total Interest > Total Contributions? Or Annual Interest > Annual Contribution?)
 * 
 * Re-reading spec:
 * "Crossover year (first time interest > contributions)"
 * "Compute month by month: ... if interest >= contrib ... crossoverMonth = month"
 * 
 * The spec code snippet implies:
 * interest = balance - contrib (This is TOTAL interest accumulated so far)
 * if interest >= contrib (Total Interest >= Total Contributions)
 * 
 * So we are looking for when the accumulated interest exceeds the total principal paid in.
 * 
 * @param {number} startAmount 
 * @param {number} monthlyContribution 
 * @param {number} annualRate 
 * @param {number} years 
 * @returns {number|null} The year number where crossover happens, or null if never.
 */
export const findCrossoverYear = (startAmount, monthlyContribution, annualRate, years) => {
    const r = annualRate / 100;
    const n = 12;
    const totalMonths = years * 12;

    let balance = startAmount;
    let totalContributed = startAmount;

    for (let m = 1; m <= totalMonths; m++) {
        balance = balance * (1 + r / n);
        balance += monthlyContribution;
        totalContributed += monthlyContribution;

        const totalInterest = balance - totalContributed;

        if (totalInterest >= totalContributed) {
            // Return the year (fractional years rounded up or just the current year index)
            // Spec says: crossoverYear = crossoverMonth / 12
            return parseFloat((m / 12).toFixed(1));
        }
    }

    return null;
};

/**
 * Calculates pension drawdown over time.
 * 
 * @param {number} initialPot - Starting amount (from accumulation phase)
 * @param {number} monthlyDrawdown - Amount taken out per month
 * @param {number} annualRate - Annual interest rate in percent
 * @param {number} years - Duration to plan for
 * @param {boolean} takeLumpSum - Whether to take 25% tax-free lump sum at start
 * @returns {Object} result
 */
export const calculateDrawdown = (initialPot, monthlyDrawdown, annualRate, years, takeLumpSum) => {
    const r = annualRate / 100;
    const n = 12;
    const totalMonths = years * 12;

    let balance = takeLumpSum ? initialPot * 0.75 : initialPot;
    let totalWithdrawn = 0;

    // If lump sum taken, that counts as an initial withdrawal? 
    // Usually "living on the value" focuses on the income stream. 
    // But for "Total Withdrawn" stat, maybe we should include it?
    // Let's track it separately or just note it. 
    // For the graph "Withdrawal Amounts", usually implies the cumulative income.
    // Let's start totalWithdrawn at 0 (income stream) but maybe return lumpSum value.

    const balanceData = [Math.round(balance)];
    const withdrawnData = [0];
    const labels = ['Year 0'];

    let interestDeficitYear = null; // When monthly drawdown > monthly interest

    for (let m = 1; m <= totalMonths; m++) {
        // Calculate monthly interest
        const monthlyInterest = balance * (r / n);

        // Check for crossover (first time drawdown exceeds interest)
        // Only relevant if balance > 0
        if (balance > 0 && interestDeficitYear === null && monthlyDrawdown > monthlyInterest) {
            interestDeficitYear = parseFloat((m / 12).toFixed(1));
        }

        // Apply interest
        balance += monthlyInterest;

        // Subtract drawdown
        balance -= monthlyDrawdown;
        totalWithdrawn += monthlyDrawdown;

        // Prevent negative balance
        if (balance < 0) balance = 0;

        // Store yearly data
        if (m % 12 === 0) {
            const year = m / 12;
            labels.push(`Year ${year}`);
            balanceData.push(Math.round(balance));
            withdrawnData.push(Math.round(totalWithdrawn));
        }
    }

    return {
        labels,
        balanceData,
        withdrawnData,
        finalBalance: Math.round(balance),
        totalWithdrawn: Math.round(totalWithdrawn),
        lumpSum: takeLumpSum ? Math.round(initialPot * 0.25) : 0,
        interestDeficitYear
    };
};
