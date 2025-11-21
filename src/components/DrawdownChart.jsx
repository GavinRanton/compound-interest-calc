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

const DrawdownChart = ({ labels, balanceData, withdrawnData, interestDeficitYear }) => {

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
                annotations: interestDeficitYear ? {
                    line1: {
                        type: 'line',
                        xMin: interestDeficitYear,
                        xMax: interestDeficitYear,
                        borderColor: 'rgb(255, 159, 64)',
                        borderWidth: 2,
                        borderDash: [6, 6],
                        label: {
                            display: true,
                            content: 'Interest < Drawdown 📉',
                            position: 'start',
                            backgroundColor: 'rgba(255, 159, 64, 0.8)',
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

    const data = {
        labels,
        datasets: [
            {
                label: 'Pot Value',
                data: balanceData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Total Withdrawn',
                data: withdrawnData,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export default DrawdownChart;
