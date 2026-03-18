'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useTheme } from 'next-themes'
import type { SkillWithYears } from '@/actions/skills'

interface CapabilitySpiderChartProps {
  skills: SkillWithYears[]
}

interface ChartDataPoint {
  skill: string
  years: number
  fullMark: number
}

export function CapabilitySpiderChart({ skills }: CapabilitySpiderChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const maxYears = Math.max(...skills.map((s) => s.years), 1)

  const chartData: ChartDataPoint[] = skills.map((s) => ({
    skill: s.skill.name,
    years: s.years,
    fullMark: maxYears,
  }))

  if (skills.length < 3) return null

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid
            stroke={isDark ? 'hsl(var(--heroui-default-200))' : 'hsl(var(--heroui-default-300))'}
            strokeOpacity={0.5}
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fill: isDark ? 'hsl(var(--heroui-default-500))' : 'hsl(var(--heroui-default-600))',
              fontSize: 11,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, maxYears]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Years"
            dataKey="years"
            stroke="hsl(var(--heroui-primary))"
            fill="hsl(var(--heroui-primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const data = payload[0].payload as ChartDataPoint
              return (
                <div className="bg-content1 border border-default-200 rounded-lg px-3 py-2 shadow-lg">
                  <p className="font-medium text-foreground text-sm">{data.skill}</p>
                  <p className="text-default-500 text-xs">
                    {data.years} {data.years === 1 ? 'year' : 'years'}
                  </p>
                </div>
              )
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
