import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GroupBarChart({
    legendDisplay = true, 
    legendPosition = "top", 
    titleDisplay = true,
    titleText = "Insert text here",
    xStacked = true,
    yStacked = false,
    xGridDisplay = false,
    yGridDisplay = false,
    labelsData = ['Dummy01', 'Dummy02', 'Dummy03', 'Dummy04', 'Dummy05', 'Dummy06', 'Dummy07'],
    chartData01 = [200, 300, 400, 500, 600, 700, 800],
    chartData02 = [100, 200, 300, 400, 500, 600, 700],
    barLabel01 = "Insert label name",
    barLabel02 = "Insert label name",
    barColor01 = 'rgba(39, 160, 227, 0.8)',
    barColor02 = 'rgba(205, 58, 49, 0.8)',
}) {
    const options = {
        plugins: {
            legend: {
                display: legendDisplay,
                position: legendPosition,
                labels: {
                    font: {
                        family: "'Poppins', 'Open Sans', 'sans-serif'"
                    }
                }
            },
            title: {
                display: titleDisplay,
                text: titleText,
            }
        },
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: true,
        },
        scales: {
            x: {
                stacked: xStacked,
                grid: {
                    display: xGridDisplay
                },
            },
            y: {
                stacked: yStacked,
                grid: {
                    display: yGridDisplay
                },
            },
        },
    };

    const labels = labelsData;

    const data = {
        labels,
        datasets: [
            {
                label: barLabel01,
                data: labels.map((val, index) => parseInt(chartData01[index])),
                backgroundColor: barColor01,
                stack: 'Stack 0',
            },
            {
                label: barLabel02,
                data: labels.map((val, index) => parseInt(chartData02[index])),
                backgroundColor: barColor02,
                stack: 'Stack 0',
            },
        ],
    };

    return <Bar options={options} data={data} />;
}