'use client'

import { useMemo } from 'react'
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
import type { CapabilityArea } from '@/actions/skills'

interface SkillsSpiderChartProps {
  capabilities: CapabilityArea[]
}

interface ChartDataPoint {
  category: string
  years: number
  skills: number
  fullMark: number
  totalYears: number
  skillCount: number
}

export function SkillsSpiderChart({ capabilities }: SkillsSpiderChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const chartData = useMemo<ChartDataPoint[]>(() => {
    const data = capabilities.map((area) => {
      // Union of active years across all skills in this capability area
      const activeYears = new Set<number>()
      for (const s of area.skills) {
        for (const y of s.activeYears) activeYears.add(y)
      }
      return {
        category: area.label,
        totalYears: activeYears.size,
        skillCount: area.skills.length,
      }
    })

    const maxYears = Math.max(...data.map((d) => d.totalYears), 1)
    const maxSkills = Math.max(...data.map((d) => d.skillCount), 1)

    return data.map((d) => ({
      category: d.category,
      years: Math.round((d.totalYears / maxYears) * 100),
      skills: Math.round((d.skillCount / maxSkills) * 100),
      fullMark: 100,
      totalYears: d.totalYears,
      skillCount: d.skillCount,
    }))
  }, [capabilities])

  if (capabilities.length === 0) return null

  return (
    <div className="w-full h-[350px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid
            stroke={isDark ? 'hsl(var(--heroui-default-200))' : 'hsl(var(--heroui-default-300))'}
            strokeOpacity={0.5}
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{
              fill: isDark ? 'hsl(var(--heroui-default-500))' : 'hsl(var(--heroui-default-600))',
              fontSize: 12,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
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
          <Radar
            name="Skills"
            dataKey="skills"
            stroke="hsl(var(--heroui-secondary))"
            fill="hsl(var(--heroui-secondary))"
            fillOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const data = payload[0].payload as ChartDataPoint
              return (
                <div className="bg-content1 border border-default-200 rounded-lg px-3 py-2 shadow-lg">
                  <p className="font-medium text-foreground text-sm">{data.category}</p>
                  <p className="text-primary text-xs">
                    {data.totalYears} {data.totalYears === 1 ? 'year' : 'years'} experience
                  </p>
                  <p className="text-secondary text-xs">
                    {data.skillCount} {data.skillCount === 1 ? 'skill' : 'skills'}
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
