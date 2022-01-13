import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({
    legendDisplay = true, 
    legendPosition = "top", 
    titleDisplay = true,
    titleText = "Insert text here",
    maintainAspectRatio = false,
    tension = 0.4,
    xGridDisplay = false,
    yGridDisplay = false,
    labelsData = ['Dummy01', 'Dummy02', 'Dummy03', 'Dummy04', 'Dummy05', 'Dummy06', 'Dummy07'],
    chartData01 = [200, 300, 400, 500, 600, 700, 800],
    chartData02 = [100, 200, 300, 400, 500, 600, 700],
    barLabel01 = "Insert label name",
    barLabel02 = "Insert label name",
    barColor01 = 'rgba(39, 160, 227, 0.8)',
    barColor02 = 'rgba(205, 58, 49, 0.8)',
    bordColor01 = "rgba(39, 160, 227, 0.8)",
    bordColor02 = 'rgba(205, 58, 49, 0.8)',
}) {
  const options = {
    scales: {
        x: {
            grid: {
                display: xGridDisplay
            },
        },
        y: {
            grid: {
                display: yGridDisplay
            },
        },
    },
    responsive: true,
    maintainAspectRatio: maintainAspectRatio,
    tension: tension,
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
        borderColor: bordColor01,
        backgroundColor: barColor01,
      },
      {
        label: barLabel02,
        data: labels.map((val, index) => parseInt(chartData02[index])),
        borderColor: bordColor02,
        backgroundColor: barColor02,
      },
    ],
  };

  return <Line options={options} data={data} />;
}