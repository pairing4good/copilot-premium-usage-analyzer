let csvData = null;
let seatCount = 0;
let hourlyRate = 100;

const fileInput = document.getElementById('csvFile');
const seatInput = document.getElementById('seatLicenses');
const hourlyRateInput = document.getElementById('hourlyRate');
const analyzeBtn = document.getElementById('analyzeBtn');
const noCsvCheckbox = document.getElementById('noCsvCheckbox');
const dashboard = document.getElementById('dashboard');

// Enable/disable file input based on checkbox
noCsvCheckbox.addEventListener('change', () => {
    fileInput.disabled = noCsvCheckbox.checked;
    if (noCsvCheckbox.checked) {
        fileInput.value = '';
    }
    checkInputs();
});

// Enable analyze button when inputs are valid
function checkInputs() {
    const hasFile = fileInput.files.length > 0;
    const hasSeats = seatInput.value > 0;
    const skipCsv = noCsvCheckbox.checked;
    
    analyzeBtn.disabled = !(hasSeats && (hasFile || skipCsv));
}

fileInput.addEventListener('change', checkInputs);
seatInput.addEventListener('input', checkInputs);
hourlyRateInput.addEventListener('input', checkInputs);

analyzeBtn.addEventListener('click', () => {
    seatCount = parseInt(seatInput.value);
    hourlyRate = parseFloat(hourlyRateInput.value) || 100;
    
    if (noCsvCheckbox.checked) {
        // No CSV file - analyze with zero usage
        csvData = [];
        analyzeData();
    } else {
        const file = fileInput.files[0];
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                csvData = results.data;
                analyzeData();
            }
        });
    }
});

// Back button to show upload form again
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'backBtn') {
        dashboard.classList.remove('active');
        document.getElementById('header').style.display = 'block';
        document.getElementById('uploadSection').style.display = 'grid';
    }
});

function analyzeData() {
    // Clear any previous error messages
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
    
    // Check if running in "capacity-only" mode (checkbox checked, no CSV)
    const isCapacityOnlyMode = noCsvCheckbox.checked;
    
    if (!csvData || csvData.length === 0) {
        if (isCapacityOnlyMode) {
            // Show full report with zero usage (all capacity is unused)
            const metrics = calculateMetrics([]);
            
            dashboard.classList.add('active');
            document.getElementById('header').style.display = 'none';
            document.getElementById('uploadSection').style.display = 'none';
            
            renderMetrics(metrics);
            renderCharts(metrics);
            renderProductivity(metrics);
            renderInsights(metrics, true); // Pass flag for capacity-only mode
            renderUserTable(metrics, true); // Pass flag for capacity-only mode
        } else {
            // Actually no data - show error
            showEmptyState();
        }
        return;
    }

    // Validate that seat count is at least equal to number of unique users in CSV
    const uniqueUsers = new Set(csvData.map(row => row.username)).size;
    if (seatCount < uniqueUsers) {
        errorMessage.innerHTML = `<strong>Validation Error:</strong> The Number of Copilot Seat Licenses (${seatCount}) must be at least equal to the number of unique users in the CSV file (${uniqueUsers}). Please increase the seat count to at least ${uniqueUsers}.`;
        errorMessage.style.display = 'block';
        return;
    }

    // Calculate metrics
    const metrics = calculateMetrics(csvData);
    
    // Show dashboard and hide header/upload section
    dashboard.classList.add('active');
    document.getElementById('header').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'none';
    
    // Render components
    renderMetrics(metrics);
    renderCharts(metrics);
    renderProductivity(metrics);
    renderInsights(metrics);
    renderUserTable(metrics);
}

function showEmptyState() {
    dashboard.classList.add('active');
    document.getElementById('header').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('metricsGrid').innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <h2>No Premium Token Usage Found</h2>
            <p>This report contains no premium token usage data. This means no one has used premium features during this period.</p>
        </div>
    `;
}

function calculateMetrics(data) {
    const totalRequests = data.reduce((sum, row) => sum + (row.quantity || 0), 0);
    const totalCost = data.reduce((sum, row) => sum + (row.net_amount || 0), 0);
    
    // User statistics
    const userStats = {};
    data.forEach(row => {
        const user = row.username;
        if (!userStats[user]) {
            userStats[user] = {
                requests: 0,
                cost: 0,
                models: new Set()
            };
        }
        userStats[user].requests += row.quantity || 0;
        userStats[user].cost += row.net_amount || 0;
        userStats[user].models.add(row.model);
    });

    const activeUsers = Object.keys(userStats).length;
    const adoptionRate = (activeUsers / seatCount) * 100;

    // Model statistics
    const modelStats = {};
    let codeReviewRequests = 0;
    let codingAgentRequests = 0;
    
    data.forEach(row => {
        const model = row.model;
        if (!modelStats[model]) {
            modelStats[model] = { requests: 0, cost: 0 };
        }
        modelStats[model].requests += row.quantity || 0;
        modelStats[model].cost += row.net_amount || 0;
        
        // Track special agent features
        if (model === 'Code Review model') {
            codeReviewRequests += row.quantity || 0;
        }
        if (model === 'Coding Agent model') {
            codingAgentRequests += row.quantity || 0;
        }
    });

    // Daily statistics
    const dailyStats = {};
    data.forEach(row => {
        const date = row.date;
        if (!dailyStats[date]) {
            dailyStats[date] = { requests: 0, cost: 0 };
        }
        dailyStats[date].requests += row.quantity || 0;
        dailyStats[date].cost += row.net_amount || 0;
    });

    // Calculate quota usage - IMPORTANT: Based on ALL seats, not just active users
    const monthlyQuotaPerUser = 300; // From the data
    const totalAvailableQuota = seatCount * monthlyQuotaPerUser; // Use total seats, not active users
    const quotaUsagePercent = (totalRequests / totalAvailableQuota) * 100;

    return {
        totalRequests,
        totalCost,
        activeUsers,
        adoptionRate,
        userStats,
        modelStats,
        dailyStats,
        avgRequestsPerUser: totalRequests / seatCount, // Average across ALL seats
        avgCostPerUser: totalCost / seatCount, // Average across ALL seats
        avgRequestsPerActiveUser: activeUsers > 0 ? totalRequests / activeUsers : 0, // Average for active users only
        avgCostPerActiveUser: activeUsers > 0 ? totalCost / activeUsers : 0, // Average for active users only
        quotaUsagePercent,
        totalSeats: seatCount,
        unusedSeats: seatCount - activeUsers,
        codeReviewRequests,
        codingAgentRequests
    };
}

function renderMetrics(metrics) {
    const metricsGrid = document.getElementById('metricsGrid');
    
    metricsGrid.innerHTML = `
        <div class="metric-card">
            <div class="metric-label">Total Premium Tokens Used</div>
            <div class="metric-value">${metrics.totalRequests.toLocaleString()}</div>
            <div class="metric-subtitle">avg ${metrics.avgRequestsPerActiveUser.toFixed(1)} per active user</div>
        </div>

        <div class="metric-card">
            <div class="metric-label">Adoption Rate</div>
            <div class="metric-value">${metrics.adoptionRate.toFixed(1)}%</div>
            <div class="metric-subtitle">
                ${metrics.activeUsers} of ${metrics.totalSeats} licenses active
            </div>
        </div>

        <div class="metric-card">
            <div class="metric-label">Token Utilization</div>
            <div class="metric-value">${metrics.quotaUsagePercent.toFixed(1)}%</div>
            <div class="metric-subtitle">of total available tokens (${metrics.totalSeats} × 300)</div>
        </div>
    `;
}

let dailyChart, modelChart, userChart;

function renderCharts(metrics) {
    renderDailyChart(metrics.dailyStats);
    renderModelChart(metrics.modelStats);
    renderUserChart(metrics.userStats);
}

function renderDailyChart(dailyStats) {
    const ctx = document.getElementById('dailyUsageChart').getContext('2d');
    const dates = Object.keys(dailyStats).sort();
    const requests = dates.map(date => dailyStats[date].requests);

    // Destroy existing chart if it exists
    if (dailyChart) {
        dailyChart.destroy();
    }

    dailyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Requests',
                data: requests,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderColor: '#667eea',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    ticks: {
                        precision: 0,
                        font: {
                            size: 11,
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
                        },
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0,
                        font: {
                            size: 10,
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
                        },
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

function renderModelChart(modelStats) {
    const ctx = document.getElementById('modelChart').getContext('2d');
    const models = Object.keys(modelStats);
    const requests = models.map(model => modelStats[model].requests);

    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#fee140', '#30cfd0'
    ];

    // Destroy existing chart if it exists
    if (modelChart) {
        modelChart.destroy();
    }

    modelChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: models,
            datasets: [{
                data: requests,
                backgroundColor: colors.slice(0, models.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 10,
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
                        },
                        padding: 10,
                        color: '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 12
                    }
                }
            }
        }
    });
}

function renderUserChart(userStats) {
    const ctx = document.getElementById('userChart').getContext('2d');
    const users = Object.keys(userStats)
        .sort((a, b) => userStats[b].requests - userStats[a].requests)
        .slice(0, 5);
    const requests = users.map(user => userStats[user].requests);

    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'
    ];

    // Destroy existing chart if it exists
    if (userChart) {
        userChart.destroy();
    }

    userChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: users,
            datasets: [{
                data: requests,
                backgroundColor: colors.slice(0, users.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 10,
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
                        },
                        padding: 10,
                        color: '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 12
                    }
                }
            }
        }
    });
}

function renderProductivity(metrics) {
    const container = document.getElementById('productivityContent');
    
    // Get monthly quota from data
    const monthlyQuotaPerSeat = 300; // premium requests per seat
    const minutesPerRequest = 15; // Each request = 15 minutes of AI capacity
    const totalSeats = metrics.totalSeats;
    
    // Total opportunity in minutes and hours
    const totalMinutesAvailable = totalSeats * monthlyQuotaPerSeat * minutesPerRequest;
    const totalHoursAvailable = totalMinutesAvailable / 60;
    
    // Calculate hours used based on proportion of requests
    const usedRequests = metrics.totalRequests;
    const totalAvailableRequests = totalSeats * monthlyQuotaPerSeat;
    const hoursUsed = (usedRequests / totalAvailableRequests) * totalHoursAvailable;
    
    // Calculate lost hours
    const unusedRequests = totalAvailableRequests - usedRequests;
    const hoursLost = (unusedRequests / totalAvailableRequests) * totalHoursAvailable;
    
    // Calculate dollar values using the user-specified hourly rate
    const totalValue = totalHoursAvailable * hourlyRate;
    const usedValue = hoursUsed * hourlyRate;
    const lostValue = hoursLost * hourlyRate;
    
    container.innerHTML = `
        <div class="productivity-grid-three">
            <div class="productivity-metric">
                <div class="productivity-metric-label">Total Opportunity</div>
                <div class="productivity-metric-value">${totalHoursAvailable.toFixed(0)} hrs</div>
                <div class="productivity-metric-subtitle">$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
            </div>
            <div class="productivity-metric productivity-metric-success">
                <div class="productivity-metric-label">Time Saved</div>
                <div class="productivity-metric-value">${hoursUsed.toFixed(0)} hrs</div>
                <div class="productivity-metric-subtitle">$${usedValue.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
            </div>
            <div class="productivity-metric productivity-metric-warning">
                <div class="productivity-metric-label">Unused Potential</div>
                <div class="productivity-metric-value">${hoursLost.toFixed(0)} hrs</div>
                <div class="productivity-metric-subtitle">$${lostValue.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
            </div>
        </div>
    `;
}

function renderInsights(metrics, isCapacityOnly = false) {
    const container = document.getElementById('insightsContainer');
    const insights = [];

    if (isCapacityOnly) {
        // Capacity-only mode: Show insights about the potential
        insights.push({
            title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Capacity-Only Analysis',
            text: `This analysis shows your total available AI capacity without usage data. You have ${metrics.totalSeats} Copilot Premium seats, representing ${(metrics.totalSeats * 300 * 15 / 60).toFixed(0)} hours of potential AI-assisted development time per month.`
        });

        insights.push({
            title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Enable Premium Features',
            text: `To unlock this capacity, ensure premium features are enabled in your GitHub organization settings. Each developer should have access to Copilot Chat and premium AI models (GPT-4, Claude 3.5 Sonnet, etc.) in their IDE.`
        });

        insights.push({
            title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> Potential ROI',
            text: `At an average developer rate of $${hourlyRate}/hr, your ${metrics.totalSeats} Premium seats represent approximately $${((metrics.totalSeats * 300 * 15 / 60) * hourlyRate).toLocaleString()} in monthly productivity capacity. This is the value you've pre-paid for that could be unlocked through adoption.`
        });

        insights.push({
            title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> Next Steps',
            text: `Once premium features are enabled and developers start using them, upload a Premium Request Usage Report CSV to see actual adoption rates, token utilization, model preferences, and identify power users who can evangelize AI pair programming benefits.`
        });
    } else {
        // Normal mode with usage data
        // Adoption insight
        if (metrics.adoptionRate < 30) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Low Adoption Rate',
                text: `Only ${metrics.adoptionRate.toFixed(1)}% of your team (${metrics.activeUsers} out of ${metrics.totalSeats} seats) is using premium features. Consider training sessions or communications to increase awareness and adoption. You have ${metrics.unusedSeats} unused licenses representing untapped potential.`
            });
        } else if (metrics.adoptionRate < 60) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> Moderate Adoption',
                text: `${metrics.adoptionRate.toFixed(1)}% adoption rate (${metrics.activeUsers} of ${metrics.totalSeats} seats) shows growing interest. Focus on power users to evangelize benefits and share best practices with the remaining ${metrics.unusedSeats} license holders.`
            });
        } else {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="20 6 9 17 4 12"></polyline></svg> Strong Adoption',
                text: `Excellent! ${metrics.adoptionRate.toFixed(1)}% of licenses (${metrics.activeUsers} of ${metrics.totalSeats} seats) are actively used. This indicates strong value recognition across the team.`
            });
        }

        // Token utilization - Now correctly based on total seats
        if (metrics.quotaUsagePercent < 20) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> Low AI Usage',
                text: `Only ${metrics.quotaUsagePercent.toFixed(1)}% of available AI tokens are being used (${metrics.totalRequests} of ${metrics.totalSeats * 300} total tokens across all seats). This indicates significant unused capacity. Active users may benefit from training on advanced features, or non-active users need onboarding.`
            });
        } else if (metrics.quotaUsagePercent > 80) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> High AI Usage',
                text: `${metrics.quotaUsagePercent.toFixed(1)}% token utilization across all seats indicates power users are maximizing their AI capabilities. Monitor for users approaching limits and consider this strong engagement in ROI calculations.`
            });
        } else {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> Moderate AI Usage',
                text: `${metrics.quotaUsagePercent.toFixed(1)}% of available tokens are being used (${metrics.totalRequests} of ${metrics.totalSeats * 300} tokens). There's room for growth, especially among the ${metrics.unusedSeats} inactive seats.`
            });
        }

        // Model diversity
        const modelCount = Object.keys(metrics.modelStats).length;
        const topModel = Object.keys(metrics.modelStats).reduce((a, b) => 
            metrics.modelStats[a].requests > metrics.modelStats[b].requests ? a : b
        );
        insights.push({
            title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Model Usage Patterns',
            text: `Team is using ${modelCount} different AI models. ${topModel} is the most popular with ${((metrics.modelStats[topModel].requests / metrics.totalRequests) * 100).toFixed(1)}% of token usage. Diverse model usage indicates users are experimenting with different capabilities.`
        });

        // User concentration
        const topUsers = Object.entries(metrics.userStats)
            .sort((a, b) => b[1].requests - a[1].requests)
            .slice(0, 3);
        const top3Requests = topUsers.reduce((sum, [_, stats]) => sum + stats.requests, 0);
        const concentrationPercent = (top3Requests / metrics.totalRequests) * 100;
        
        if (concentrationPercent > 60) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> Usage Concentration',
                text: `Top 3 users (${topUsers.map(([name]) => name).join(', ')}) account for ${concentrationPercent.toFixed(1)}% of AI token usage. Consider having these power users share their workflows and use cases to boost adoption among the other ${metrics.totalSeats - 3} seats.`
            });
        }

        // ROI perspective
        const estimatedTimeSaved = metrics.totalRequests * 5; // Assume 5 minutes saved per token usage
        const savedHours = (estimatedTimeSaved / 60).toFixed(0);
        const dollarValue = ((estimatedTimeSaved / 60) * hourlyRate).toFixed(0);
        
        let roiText;
        if (metrics.totalCost > 0) {
            const returnMultiple = (((estimatedTimeSaved / 60) * hourlyRate) / metrics.totalCost).toFixed(1);
            roiText = `With ${metrics.totalRequests.toLocaleString()} AI tokens used, your team potentially saved ~${savedHours} hours of development time this month. At an average developer rate of $${hourlyRate}/hr, that's approximately $${dollarValue} in productivity value generated from a $${metrics.totalCost.toFixed(2)} usage cost (${returnMultiple}x return on incremental usage costs).`;
        } else {
            roiText = `With ${metrics.totalRequests.toLocaleString()} AI tokens used, your team potentially saved ~${savedHours} hours of development time this month. At an average developer rate of $${hourlyRate}/hr, that's approximately $${dollarValue} in productivity value generated. Premium tokens are included in your license cost, making this additional value with no incremental usage fees.`;
        }
        
        insights.push({
            title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Estimated Productivity Impact',
            text: roiText
        });

        // Unused tokens recommendation
        const monthlyQuotaPerSeat = 300;
        const totalAvailableRequests = metrics.totalSeats * monthlyQuotaPerSeat;
        const unusedRequests = totalAvailableRequests - metrics.totalRequests;
        const unusedHours = (unusedRequests / 60).toFixed(0);
        const totalHours = (totalAvailableRequests / 60).toFixed(0);
        
        if (unusedRequests > 0) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Maximize Token Usage',
                text: `Your team has ${unusedHours} hours of unused AI tokens out of ${totalHours} hours available this month. These tokens reset monthly and cannot be carried forward. Encourage active users to leverage AI capabilities more frequently, and ensure inactive team members receive training and onboarding to utilize their allocated tokens before they expire.`
            });
        }
        
        // Agent features insights
        // Code Review insight - enhances quality and thoroughness
        if (metrics.codeReviewRequests > 0) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="20 6 9 17 4 12"></polyline></svg> Code Review Agent Usage',
                text: `Your team used ${metrics.codeReviewRequests} automated code review${metrics.codeReviewRequests > 1 ? 's' : ''} this period. This AI-powered PR analysis helps catch security vulnerabilities, bugs, and standards violations that human reviewers might miss, allowing engineers to focus on complex logic and architecture.`
            });
        }

        // Coding Agent insight - parallel development capacity
        if (metrics.codingAgentRequests > 0) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="20 6 9 17 4 12"></polyline></svg> Coding Agent Deployment',
                text: `Excellent! Your team deployed ${metrics.codingAgentRequests} coding agent session${metrics.codingAgentRequests > 1 ? 's' : ''} this period. These autonomous agents handle routine tasks (bug fixes, tests, documentation) in parallel while your engineers focus on complex features—effectively expanding team capacity.`
            });
        }

        // Recommendations when features are not detected
        if (metrics.codeReviewRequests === 0) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M12 2v20M2 12h20"></path></svg> Code Review Agent Available',
                text: `Enable automated code reviews to improve quality assurance. AI-powered PR analysis catches security issues, bugs, and standards violations, complementing human reviewers. Uses 1 premium request per review from your existing quota.`
            });
        }
        
        if (metrics.codingAgentRequests === 0) {
            insights.push({
                title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M12 2v20M2 12h20"></path></svg> Coding Agent Available',
                text: `Deploy autonomous coding agents to expand development capacity. Assign routine tasks (bug fixes, tests, documentation) to AI agents that work in parallel with your team, freeing engineers for complex work. Uses 1 premium request per session from your existing quota.`
            });
        }
    }

    container.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-title">${insight.title}</div>
            <div class="insight-text">${insight.text}</div>
        </div>
    `).join('');
}

function renderUserTable(metrics, isCapacityOnly = false) {
    const table = document.getElementById('userTable');
    
    if (isCapacityOnly) {
        // Capacity-only mode: Show a message instead of empty table
        table.innerHTML = `
            <thead>
                <tr>
                    <th colspan="4" style="text-align: center;">User Activity Data</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px; color: #64748b;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <div><strong>No Usage Data Available</strong></div>
                        <div style="margin-top: 8px;">Upload a Premium Request Usage Report CSV to see individual user activity, model preferences, and adoption patterns.</div>
                    </td>
                </tr>
            </tbody>
        `;
    } else {
        const users = Object.entries(metrics.userStats)
            .sort((a, b) => b[1].requests - a[1].requests);

        const tableHTML = `
            <thead>
                <tr>
                    <th>User</th>
                    <th>AI Tokens Used</th>
                    <th>Models Used</th>
                    <th>% of Total Usage</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(([username, stats]) => `
                    <tr>
                        <td>${username}</td>
                        <td>${stats.requests.toLocaleString()}</td>
                        <td>${stats.models.size}</td>
                        <td>${((stats.requests / metrics.totalRequests) * 100).toFixed(1)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        table.innerHTML = tableHTML;
    }
    
    // Render methodology note at the bottom
    const monthlyQuotaPerSeat = 300;
    const totalSeats = metrics.totalSeats;
    const totalMinutesAvailable = totalSeats * monthlyQuotaPerSeat * 15; // 15 minutes per token
    const totalHoursAvailable = totalMinutesAvailable / 60;
    
    const methodologyNote = document.getElementById('methodologyNote');
    methodologyNote.innerHTML = `<strong>Methodology:</strong> Based on ${totalSeats} seats × ${monthlyQuotaPerSeat} premium requests × 15 minutes per request = ${totalMinutesAvailable.toLocaleString()} total minutes (${totalHoursAvailable.toFixed(0)} hours) at $${hourlyRate}/hour developer rate.`;
}
