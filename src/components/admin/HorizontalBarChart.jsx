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

export default function HorizontalBarChart({
  bordWidth = 0,
  legendDisplay = true,
  legendPosition = "top",
  titleDisplay = true,
  titleText = "Insert text here",
  xGridDisplay = false,
  yGridDisplay = false,
  labelsData = ["Dummy01", "Dummy02", "Dummy03", "Dummy04", "Dummy05", "Dummy06", "Dummy07"],
  chartData = [200, 300, 400, 500, 600, 700, 800],
  barLabel = "Insert label name",
  barColor = "rgba(39, 160, 227, 0.8)",
  bordColor = "rgba(39, 160, 227, 0.8)",
}) {
  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: bordWidth,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: legendDisplay,
        position: legendPosition,
      },
      title: {
        display: titleDisplay,
        text: titleText,
      },
    },
    scales: {
      x: {
        grid: {
          display: xGridDisplay,
        },
      },
      y: {
        grid: {
          display: yGridDisplay,
        },
      },
    },
  };

  const labels = labelsData;

  const data = {
    labels,
    datasets: [
      {
        label: barLabel,
        data: labels.map((val, index) => parseInt(chartData[index])),
        borderColor: bordColor,
        backgroundColor: barColor,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}