import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    annotationPlugin
);

const GrowthChart = ({ labels, balanceData, contributionData, crossoverYear, comparisonBalanceData }) => {

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            annotation: {
                annotations: crossoverYear ? {
                    line1: {
                        type: 'line',
                        xMin: crossoverYear,
                        xMax: crossoverYear,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        borderDash: [6, 6],
                        label: {
                            display: true,
                            content: 'Interest Takeover! 🎉',
                            position: 'start',
                            backgroundColor: 'rgba(255, 99, 132, 0.8)',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                } : {}
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '£' + value.toLocaleString();
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    const datasets = [
        {
            label: 'Total Balance (Plan A)',
            data: balanceData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4,
        },
        {
            label: 'Your Contributions',
            data: contributionData,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            fill: true,
            tension: 0.4,
            hidden: !!comparisonBalanceData // Hide contributions if comparing, to reduce clutter
        },
    ];

    if (comparisonBalanceData) {
        datasets.push({
            label: 'Total Balance (Plan B - Delayed)',
            data: comparisonBalanceData,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: true,
            tension: 0.4,
            borderDash: [5, 5]
        });
    }

    const data = {
        labels,
        datasets,
    };

    return <Line options={options} data={data} />;
};

export default GrowthChart;
