"use client"

import { Radar } from "react-chartjs-2"
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js"

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

type RadarChartProps = {
  labels: string[]
  values: number[]
  label?: string
}

export function RadarChart({ labels, values, label = "Scores" }: RadarChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: "rgba(99, 102, 241, 0.2)", // uses token via CSS cascade
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
      },
    ],
  }

  const options = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: { stepSize: 2 },
        angleLines: { color: "var(--color-border)" },
        grid: { color: "var(--color-border)" },
        pointLabels: { color: "var(--color-muted-foreground)" },
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  } as any

  return (
    <div className="h-72">
      <Radar data={data} options={options} />
    </div>
  )
}
