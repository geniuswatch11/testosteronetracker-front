"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { useTheme } from "next-themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface TestosteroneData {
  _id: string;
  create_at: string;
  testosterona_total_ng_dl: number;
  Testosterona_libre_ng_dl: number;
}

interface TestosteroneLineChartProps {
  data: TestosteroneData[];
}

export default function TestosteroneLineChart({
  data,
}: TestosteroneLineChartProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const chartData = {
    labels: data.map((item) => new Date(item.create_at)),
    datasets: [
      {
        label: "Testosterona Total (ng/dL)",
        data: data.map((item) => item.testosterona_total_ng_dl),
        borderColor: "#3b82f6", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Testosterona Libre (ng/dL)",
        data: data.map((item) => item.Testosterona_libre_ng_dl),
        borderColor: "#22c55e", // green-500
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#f9fafb", // gray-200 or gray-800
        },
      },
      title: {
        display: true,
        text: "Evolución de Niveles de Testosterona",
        color: "#f9fafb", // gray-50 or gray-900
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "PPP", // e.g., Jul 29, 2025
        },
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDarkMode ? "#d1d5db" : "#f9fafb", // gray-300 or gray-700
        },
      },
      y: {
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDarkMode ? "#d1d5db" : "#f9fafb", // gray-300 or gray-700
        },
        title: {
          display: true,
          text: "ng/dL",
          color: isDarkMode ? "#d1d5db" : "#f9fafb",
        },
      },
    },
  };

  return (
    <div className="relative h-80 w-full">
      <Line options={options} data={chartData} />
    </div>
  );
}
