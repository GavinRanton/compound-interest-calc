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
export const calculateGrowth = (startAmount, monthlyContribution, annualRate, years, inflationRate = 0, adjustForInflation = false, delayYears = 0) => {
    const r = annualRate / 100;
    const n = 12; // Monthly compounding
    const totalMonths = years * 12;
    const delayMonths = delayYears * 12;

    let balance = startAmount;
    let totalContributed = startAmount;

    // Initial data point
    const balanceData = [startAmount];
    const contributionData = [startAmount];
    const labels = ['Year 0'];

    // Handle initial delay if any (balance just sits there? or starts at 0? Spec: "Delay Start")
    // If "Delay Start", we assume they hold the cash? Or they haven't started saving yet.
    // Let's assume they haven't started saving yet, so balance is 0 until delay is over.
    // BUT what about "Starting Amount"? Usually that exists at T=0.
    // If I delay starting, does my "Starting Amount" sit in a shoe box? Or do I only invest it at Year X?
    // User goal: "Cost of Delay". Usually means: Option A (Start Now), Option B (Start in 10 years).
    // Option B: For first 10 years, balance is 0. Then at year 10, we dump in "Starting Amount" (if applicable) and start monthly.

    if (delayYears > 0) {
        balance = 0;
        totalContributed = 0;
        // Reset initial data points to 0 if delayed
        balanceData[0] = 0;
        contributionData[0] = 0;
    }

    for (let m = 1; m <= totalMonths; m++) {
        // If we are still in the delay period
        if (m <= delayMonths) {
            // Do nothing? Or maybe just append 0s at year end.
            if (m % 12 === 0) {
                const year = m / 12;
                labels.push(`Year ${year}`);
                balanceData.push(0);
                contributionData.push(0);
            }
            continue;
        }

        // If we just finished delay period, add starting amount? 
        if (m === delayMonths + 1) {
            balance = startAmount;
            totalContributed = startAmount;
        }

        // Apply monthly interest
        balance = balance * (1 + r / n);
        // Add monthly contribution
        balance += monthlyContribution;
        totalContributed += monthlyContribution;

        // Store data point at the end of each year
        if (m % 12 === 0) {
            const year = m / 12;
            labels.push(`Year ${year}`);

            let displayBalance = balance;
            let displayContributed = totalContributed;

            if (adjustForInflation) {
                // Real Value = Nominal / (1 + inflation)^years
                const discountFactor = Math.pow(1 + (inflationRate / 100), year);
                displayBalance = balance / discountFactor;
                displayContributed = totalContributed / discountFactor;
            }

            balanceData.push(Math.round(displayBalance));
            contributionData.push(Math.round(displayContributed));
        }
    }

    let finalDisplayBalance = balance;
    let finalDisplayContributed = totalContributed;

    if (adjustForInflation) {
        const discountFactor = Math.pow(1 + (inflationRate / 100), years);
        finalDisplayBalance = balance / discountFactor;
        finalDisplayContributed = totalContributed / discountFactor;
    }

    return {
        labels,
        balanceData,
        contributionData,
        finalBalance: Math.round(finalDisplayBalance),
        totalContributed: Math.round(finalDisplayContributed),
        totalInterest: Math.round(finalDisplayBalance - finalDisplayContributed)
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
 * Finds the "Coast FIRE" year.
 * This is the year where the accumulated balance, if grown at the annualRate WITHOUT further contributions,
 * would still reach (or exceed) the targetBalance by the end of the total years.
 * 
 * @param {Array} balanceData - Array of balances at each year
 * @param {number} annualRate - Annual growth rate
 * @param {number} totalYears - Total duration
 * @param {number} targetBalance - The final goal amount
 * @returns {number|null} The Coast Fire Year, or null
 */
export const findCoastFireYear = (balanceData, annualRate, totalYears, targetBalance) => {
    const r = annualRate / 100;

    // Iterate through each year's balance
    // balanceData index 0 is Year 0, index 1 is Year 1...
    for (let i = 0; i < balanceData.length; i++) {
        const currentBalance = balanceData[i];
        const yearsRemaining = totalYears - i;

        if (yearsRemaining <= 0) continue;

        // Future Value = PV * (1 + r)^t
        const projectedValue = currentBalance * Math.pow((1 + r), yearsRemaining);

        if (projectedValue >= targetBalance) {
            return i;
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
