import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({
  labelsData = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  labelDesc = "# of Examples",
  chartData = [12, 19, 3, 5, 2, 3],
  bgColorArray = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
  ],
  bordColorArray = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ],
  bordWidth = 1
}) {
  const data = {
    labels: labelsData,
    datasets: [
      {
        label: labelDesc,
        data: chartData,
        backgroundColor: bgColorArray,
        borderColor: bordColorArray,
        borderWidth: bordWidth,
      },
    ],
  };

  return <Doughnut data={data} />;
}
