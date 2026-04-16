'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from 'next-themes'
import { useHero } from '@/contexts/HeroContext'
import { motion, MotionValue, useMotionValueEvent } from 'framer-motion'

const Colors = {
  bg0:  'hsl(var(--heroui-background))',
  bg2:  'hsl(var(--heroui-content2))',
  ink:  'hsl(var(--heroui-foreground))',
  i2:   'hsl(var(--heroui-default))',
  i3:   'hsl(var(--heroui-default-900))',
  grn:  'hsl(var(--heroui-primary))',
  grn2: 'hsl(var(--heroui-primary-600))',
  ok:   'hsl(var(--heroui-success))',
  rim2: 'hsl(var(--heroui-divider) / 0.13)',
} as const

// Structural colors that differ between themes
const Palette = {
  dark: {
    deskSurface: '#0F1A12',
    deskEdge: '#182418',
    monitorStand: '#121A14',
    monitorBase: '#0E1610',
    monitorBezel: '#101810',
    monitorInner: '#0A0F0C',
    monitorScreen: '#0C1210',
    editorChrome: '#111810',
    editorTab: '#182018',
    editorTabText: '#3D5C44',
    syntaxImport: '#A78BFA',
    syntaxModule: '#5EEAD4',
    lampArm: '#182018',
    lampShade: '#243024',
    lampShadeTop: '#2E3E2E',
    lampBulb: '#D1FAE5',
    lampBase: '#12180E',
    chairOuter: '#0C1210',
    chairInner: '#101810',
    hoodieMain: '#1A2E1A',
    hoodieDetail: '#223022',
    hoodieShoulder: '#162016',
    hoodieArm: '#1A2E1A',
    hair: '#0A0804',
    glassesFrame: '#3A3020',
    glassesLens: 'rgba(62,207,142,.04)',
    eyeIris: '#1A1208',
    eyeHighlight: '#E4EDE6',
    headphonesBand: '#1A2018',
    headphonesPad: '#243020',
    keyboardOuter: '#0E1610',
    keyboardInner: '#141C14',
    keyboardSpace: '#18201A',
    keyHsl: (row: number) => `hsl(140,12%,${14 + row}%)`,
    mugShadow: '#080C09',
    mugBody: '#E4EDE6',
    mugRim: '#D4DDD6',
    mugCoffee: '#1A0C08',
    mugText: '#7A9A82',
    mugSteam: '#2D3A2E',
    notebookCover: '#0E2018',
    notebookSpine: '#0A1810',
    notebookLine: '#1E4030',
    notebookMark: '#E4EDE6',
    plantPot: '#080C09',
    plantSoil: '#0E2018',
    plantLeaves: ['#1A4028', '#224E30', '#143820', '#224E30'],
    annotationBg: '#0D1810',
    gradScreenGlow: ['#3ECF8E', '#2AAF72', '#080C09'],
    gradLampLight: '#A0E8C0',
    // Lamp beam overlay
    lampLightColor: 'rgba(62,207,142,0.08)',
  },
  light: {
    // Desk — warm wood tones, distinct from page bg
    deskSurface: '#B8A280',
    deskEdge: '#A89070',
    // Monitor — mid-grays with green tint for contrast
    monitorStand: '#B8B0A4',
    monitorBase: '#A8A098',
    monitorBezel: '#C8C4BC',
    monitorInner: '#E8E4E0',
    monitorScreen: '#F0EDE8',
    editorChrome: '#E4E0DA',
    editorTab: '#D8D4CE',
    editorTabText: '#6A8A70',
    syntaxImport: '#7C3AED',
    syntaxModule: '#0D9488',
    // Lamp
    lampArm: '#7A7A70',
    lampShade: '#5A7A5A',
    lampShadeTop: '#6A8A6A',
    lampBulb: '#FFFDE8',
    lampBase: '#6A6A60',
    // Chair — darker grays
    chairOuter: '#9A9890',
    chairInner: '#A8A69E',
    // Hoodie — rich greens
    hoodieMain: '#2A5A34',
    hoodieDetail: '#3A6A44',
    hoodieShoulder: '#1E4A28',
    hoodieArm: '#2A5A34',
    // Hair
    hair: '#1A1008',
    // Glasses
    glassesFrame: '#4A3A28',
    glassesLens: 'rgba(26,155,96,.08)',
    // Eyes
    eyeIris: '#1A1208',
    eyeHighlight: '#FFFFFF',
    // Headphones — dark
    headphonesBand: '#505048',
    headphonesPad: '#606058',
    // Keyboard — dark like the monitor
    keyboardOuter: '#384038',
    keyboardInner: '#283028',
    keyboardSpace: '#303830',
    keyHsl: (row: number) => `hsl(140,10%,${22 + row * 3}%)`,
    // Mug — white stands out against wood desk
    mugShadow: '#A89070',
    mugBody: '#FFFFFF',
    mugRim: '#E8E4E0',
    mugCoffee: '#3A2010',
    mugText: '#2A5A34',
    mugSteam: '#B8C8BC',
    // Notebook — green cover
    notebookCover: '#1E4830',
    notebookSpine: '#163820',
    notebookLine: '#3A7A50',
    notebookMark: '#FFFFFF',
    // Plant — vivid greens
    plantPot: '#6A4A2A',
    plantSoil: '#4A3020',
    plantLeaves: ['#1A7038', '#28883C', '#146830', '#28883C'],
    // Annotations — light green cards
    annotationBg: '#DFF0E4',
    // Gradient — subtle green glow on light bg
    gradScreenGlow: ['#1A9B60', '#157A4C', '#F4FAF6'],
    gradLampLight: '#88DFAA',
    lampLightColor: 'rgba(26,155,96,0.14)',
  },
} as const

const CODE_LINES_TEMPLATE = [
  { text: "import { useEffect } from 'react'",              colorKey: 'syntaxImport' as const },
  { text: "import express from 'express'",                  colorKey: 'syntaxModule' as const },
  { text: "from pyspark.sql import SparkSession",          colorKey: 'syntaxModule' as const },
  { text: "public class AuthService {}",                    colorKey: 'syntaxModule' as const },
  { text: '',                                               colorKey: null },

  { text: "// Frontend · Backend · Data · Identity",        colorKey: 'i3' as const },
  { text: "const app = express()",                          colorKey: 'grn' as const },
  { text: "const spark = SparkSession.builder.getOrCreate()", colorKey: 'grn2' as const },
  { text: "app.listen(process.env.PORT)",                   colorKey: 'ink' as const },
  { text: '',                                               colorKey: null },

  { text: "// ✓ TypeScript · Python · Java · Kotlin · SQL", colorKey: 'i3' as const },
]


const SVG_WIDTH = 480
const SVG_HEIGHT = 360

// Lamp sphere center in SVG coords
const LAMP_CENTER = { x: 362, y: 185 }
const LAMP_RADIUS = 12

// Beam overlay config
const BEAM_LENGTH = 2000
const BEAM_SPREAD = 1000

/** Degrees → radians */
function rad(deg: number) { return (deg * Math.PI) / 180 }

function computeBeam(angleDeg: number, origin: { x: number; y: number }) {
  const a = rad(angleDeg)
  const dx = Math.cos(a)
  const dy = -Math.sin(a)
  const px = -dy
  const py = dx

  const edgeAx = origin.x + px * LAMP_RADIUS
  const edgeAy = origin.y + py * LAMP_RADIUS
  const edgeBx = origin.x - px * LAMP_RADIUS
  const edgeBy = origin.y - py * LAMP_RADIUS

  const farAx = edgeAx + dx * BEAM_LENGTH + px * BEAM_SPREAD
  const farAy = edgeAy + dy * BEAM_LENGTH + py * BEAM_SPREAD
  const farBx = edgeBx + dx * BEAM_LENGTH - px * BEAM_SPREAD
  const farBy = edgeBy + dy * BEAM_LENGTH - py * BEAM_SPREAD

  const points = `${edgeAx},${edgeAy} ${edgeBx},${edgeBy} ${farBx},${farBy} ${farAx},${farAy}`

  const allX = [edgeAx, edgeBx, farAx, farBx]
  const allY = [edgeAy, edgeBy, farAy, farBy]
  const minX = Math.min(...allX), maxX = Math.max(...allX)
  const minY = Math.min(...allY), maxY = Math.max(...allY)
  const shadeMidX = maxX === minX ? 0.5 : (origin.x - minX) / (maxX - minX)
  const shadeMidY = maxY === minY ? 0.5 : (origin.y - minY) / (maxY - minY)
  const farMidX = maxX === minX ? 0.5 : (((farAx + farBx) / 2) - minX) / (maxX - minX)
  const farMidY = maxY === minY ? 0.5 : (((farAy + farBy) / 2) - minY) / (maxY - minY)

  return { points, farMidX, farMidY, shadeMidX, shadeMidY }
}

function LampBeamOverlay({
  origin,
  on,
  color,
  angle,
  opacity
}: {
  origin: { x: number; y: number }
  on: boolean
  color: string
  angle: MotionValue<number>
  opacity: MotionValue<number>
}) {
  const polygonRef = useRef<SVGPolygonElement>(null)
  const gradRef = useRef<SVGLinearGradientElement>(null)

  // Update DOM directly — no React state, no re-renders
  useMotionValueEvent(angle, 'change', (angleDeg) => {
    const { points, farMidX, farMidY, shadeMidX, shadeMidY } = computeBeam(angleDeg, origin)
    if (polygonRef.current) {
      polygonRef.current.setAttribute('points', points)
    }
    if (gradRef.current) {
      gradRef.current.setAttribute('x1', `${farMidX * 100}%`)
      gradRef.current.setAttribute('y1', `${farMidY * 100}%`)
      gradRef.current.setAttribute('x2', `${shadeMidX * 100}%`)
      gradRef.current.setAttribute('y2', `${shadeMidY * 100}%`)
    }
  })

  const initial = useMemo(() => computeBeam(angle.get(), origin), [angle, origin])

  return createPortal(
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 1, delay: 1}}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '150%',
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'visible',
        transformOrigin: `${origin.x}px ${origin.y}px`,
      }}
    >
      <svg
        aria-hidden="true"
        className="absolute w-full h-full"
        style={{
          opacity: on ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <defs>
          <linearGradient ref={gradRef} id="beam-fade"
                          x1={`${initial.farMidX * 100}%`} y1={`${initial.farMidY * 100}%`}
                          x2={`${initial.shadeMidX * 100}%`} y2={`${initial.shadeMidY * 100}%`}>
            <stop offset="0%"   stopColor={color} stopOpacity="0" />
            <stop offset="100%" stopColor={color} stopOpacity="0.5" />
          </linearGradient>
          <filter id="beam-blur">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <polygon
          ref={polygonRef}
          points={initial.points}
          fill="url(#beam-fade)"
          filter="url(#beam-blur)"
        />
      </svg>
    </motion.div>,
    document.body,
  )
}

export function InteractiveDeskScene({ className, angle, opacity }: { className?: string; angle: MotionValue<number>, opacity: MotionValue<number> }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [mouseX, setMouseX] = useState(0.5)
  const [mouseY, setMouseY] = useState(0.5)
  const [typed, setTyped] = useState(0)
  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null)
  const [lampOn, setLampOn] = useState(true)
  const [beamOrigin, setBeamOrigin] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const { stats } = useHero()

  const isDark = resolvedTheme !== 'light'
  const P = isDark ? Palette.dark : Palette.light

  // Map lamp center to screen coordinates for the beam overlay
  const updateBeamOrigin = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    setBeamOrigin({
      x: rect.left + (LAMP_CENTER.x / SVG_WIDTH) * rect.width,
      y: rect.top + (LAMP_CENTER.y / SVG_HEIGHT) * rect.height,
    })
  }, [])

  useEffect(() => {
    updateBeamOrigin();
    setMounted(true)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouseX(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
    setMouseY(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)))
  }, [])

  const codeLines = CODE_LINES_TEMPLATE.map(line => ({
    text: line.text,
    color: line.colorKey === null
      ? 'transparent'
      : line.colorKey in Colors
        ? Colors[line.colorKey as keyof typeof Colors]
        : P[line.colorKey as keyof typeof P] as string,
  }))

  const totalChars = codeLines.reduce((a, l) => a + l.text.length, 0)
  useEffect(() => {
    if (typed >= totalChars) return
    const t = setTimeout(() => setTyped(v => v + 2), 28)
    return () => clearTimeout(t)
  }, [typed, totalChars])

  // Cumulative char counts per line (immutable — avoids react-compiler reassignment rule)
  const cumChars = codeLines.map((_, i) =>
    codeLines.slice(0, i + 1).reduce((s, l) => s + l.text.length, 0)
  )
  const visibleLines = codeLines.map((line, i) => {
    const start = i === 0 ? 0 : cumChars[i - 1]
    const show = Math.max(0, Math.min(line.text.length, typed - start))
    return { ...line, visible: line.text.slice(0, show) }
  })

  const illustrationStats = stats?.filter(s => s.useInIllustration) ?? []
  const annotationSlots = [
    { x: 14,  y: 28,  rotate: -3, color: Colors.grn },
    { x: 138, y: 238, rotate: 1,  color: Colors.ok  },
  ]
  const annotations = illustrationStats.slice(0, 2).map((stat, i) => ({
    id: stat.id ?? `s${i}`,
    ...annotationSlots[i],
    value: stat.value,
    label: stat.label,
  }))

  return (
    <>
      <svg ref={svgRef} viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg"
           className={className}
           style={{ width: '100%', height: '100%', display: 'block' }}
           onMouseMove={handleMouseMove}>
        <defs>
          <radialGradient id="sg" cx="62%" cy="48%" r="46%">
            <stop offset="0%"   stopColor={P.gradScreenGlow[0]} stopOpacity=".20" />
            <stop offset="55%"  stopColor={P.gradScreenGlow[1]} stopOpacity=".06" />
            <stop offset="100%" stopColor={P.gradScreenGlow[2]} stopOpacity="0"   />
          </radialGradient>
          <radialGradient id="lg" cx="100%" cy="50%" r="80%">
            <stop offset="0%"   stopColor={P.gradLampLight} stopOpacity={lampOn ? '.30' : '.14'} />
            <stop offset="100%" stopColor={P.gradLampLight} stopOpacity="0"   />
          </radialGradient>
          <linearGradient id="sk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#8B6348" />
            <stop offset="100%" stopColor="#6E4A30" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="b"/>
            <feComposite in="SourceGraphic" in2="b" operator="over"/>
          </filter>
          <filter id="bulb-glow">
            <feGaussianBlur stdDeviation="6" result="b"/>
            <feComposite in="SourceGraphic" in2="b" operator="over"/>
          </filter>
          <radialGradient id="lamp-sphere" cx="40%" cy="35%" r="55%">
            <stop offset="0%"   stopColor={P.lampShadeTop} stopOpacity=".6" />
            <stop offset="60%"  stopColor={P.lampShade}    stopOpacity=".1" />
            <stop offset="100%" stopColor={P.lampArm}      stopOpacity=".3" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="480" height="360" fill={Colors.bg0} />
        <rect width="480" height="360" fill="url(#sg)" />

        {/* Desk */}
        <rect x="0" y="296" width="480" height="64" fill={P.deskSurface} />
        <rect x="0" y="296" width="480" height="3"  fill={P.deskEdge} />

        {/* Monitor stand */}
        <rect x="255" y="263" width="50" height="36" rx="2" fill={P.monitorStand} />
        <rect x="234" y="292" width="92" height="7"  rx="4" fill={P.monitorBase} />

        {/* Monitor bezel */}
        <rect x="155" y="48" width="250" height="220" rx="14" fill={P.monitorBezel} filter="url(#glow)" />
        <rect x="163" y="56" width="234" height="204" rx="10" fill={P.monitorInner} />
        <rect x="167" y="60" width="226" height="196" rx="8"  fill={P.monitorScreen} />

        {/* Editor chrome */}
        <rect x="167" y="60" width="226" height="22" rx="8 8 0 0" fill={P.editorChrome} />
        <rect x="167" y="74" width="226" height="8"  fill={P.editorChrome} />
        <circle cx="180" cy="71" r="4" fill="#EF4444" opacity=".75" />
        <circle cx="192" cy="71" r="4" fill="#F59E0B" opacity=".75" />
        <circle cx="204" cy="71" r="4" fill="#22C55E" opacity=".75" />
        <rect x="215" y="65" width="80" height="14" rx="3" fill={P.editorTab} />
        <text x="219" y="75.5" fill={P.editorTabText} fontSize="7" fontFamily="'DM Mono',monospace">Migration.tsx</text>

        {/* Live code lines */}
        {visibleLines.map((line, i) => (
          <text key={i} x={175} y={96 + i * 12} fontSize={7.5}
                fontFamily="'DM Mono',monospace" fill={line.color} opacity=".92">
            {line.visible}
          </text>
        ))}

        {/* Blinking cursor */}
        {(() => {
          let r = typed; let li = 0
          for (let i = 0; i < codeLines.length; i++) {
            if (r <= codeLines[i].text.length) { li = i; break }
            r -= codeLines[i].text.length
          }
          const cx = 175 + r * 4.4
          const cy = 90 + li * 12
          return (
            <rect x={cx} y={cy} width={2} height={9} rx={1} fill={Colors.ink} opacity=".9">
              <animate attributeName="opacity" values=".9;0;.9" dur="1s" repeatCount="indefinite" />
            </rect>
          )
        })()}

        {/* Desk lamp — clickable, sphere head */}
        <g onClick={() => setLampOn(v => !v)} style={{ cursor: 'pointer', userSelect: 'none' }}>
          {/* Arm: base → up → bend → neck */}
          <path d="M432 296 L432 240 Q432 218 414 214 L392 210" stroke={P.lampArm} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M392 210 Q380 206 378 196 L376 190"          stroke={P.lampArm} strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Sphere head */}
          <circle cx="362" cy="190" r="18" fill={P.lampShade}  />
          <circle cx="362" cy="190" r="18" fill="url(#lamp-sphere)"  />
          {/* Highlight — gives it a 3D look */}
          <circle cx="356" cy="183" r="6" fill={P.lampShadeTop} opacity=".5" />
          {/* Bulb glow */}
          {lampOn && (
            <circle cx="362" cy="190" r="18" fill={P.gradLampLight} opacity=".2" filter="url(#bulb-glow)" />
          )}
          {/* Base */}
          <rect x="424" y="288" width="16" height="10" rx="3" fill={P.lampArm} />
          <rect x="420" y="295" width="24" height="4"  rx="2" fill={P.lampBase} />
          {/* Hit area */}
          <rect x="340" y="168" width="50" height="50" fill="transparent" />
        </g>

        {/* Chair */}
        <rect x="24" y="196" width="86" height="100" rx="12" fill={P.chairOuter} />
        <rect x="30" y="202" width="74" height="88"  rx="8"  fill={P.chairInner} />
        {/* Hoodie */}
        <path d="M18 310 Q18 268 34 258 Q50 248 68 244 Q86 248 102 258 Q118 268 118 310 Z" fill={P.hoodieMain} />
        <path d="M52 278 Q68 284 84 278" stroke={P.hoodieDetail} strokeWidth="2" fill="none" />
        <line x1="60" y1="260" x2="56" y2="276" stroke={P.hoodieDetail} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="76" y1="260" x2="80" y2="276" stroke={P.hoodieDetail} strokeWidth="1.5" strokeLinecap="round" />
        {/* Head + neck */}
        <rect x="58" y="227" width="20" height="22" rx="4" fill="url(#sk)" />
        <rect x="38" y="168" width="60" height="68" rx="28" fill="url(#sk)" />
        {/* Hair */}
        <path d="M38 190 Q38 162 68 158 Q98 162 98 185" fill={P.hair} />
        <rect x="38" y="168" width="10" height="24" rx="5" fill={P.hair} />
        {/* Glasses */}
        <rect x="46" y="197" width="22" height="15" rx="5" stroke={P.glassesFrame} strokeWidth="2" fill={P.glassesLens} />
        <rect x="72" y="197" width="22" height="15" rx="5" stroke={P.glassesFrame} strokeWidth="2" fill={P.glassesLens} />
        <line x1="68" y1="204" x2="72" y2="204" stroke={P.glassesFrame} strokeWidth="2" />
        <line x1="44" y1="204" x2="40" y2="206" stroke={P.glassesFrame} strokeWidth="2" strokeLinecap="round" />
        <line x1="94" y1="204" x2="98" y2="206" stroke={P.glassesFrame} strokeWidth="2" strokeLinecap="round" />
        {/* Eyes — follow mouse */}
        {[{ cx: 57, cy: 205 }, { cx: 83, cy: 205 }].map((eye, i) => {
          const dx = (mouseX - 0.5) * 2, dy = (mouseY - 0.5) * 2
          const ex = eye.cx + dx * 1.2, ey = eye.cy + dy * 0.8
          return (
            <g key={i}>
              <circle cx={eye.cx} cy={eye.cy} r={3.5} fill={P.eyeIris} />
              <circle cx={ex} cy={ey} r={1.2} fill={P.eyeHighlight} opacity=".55" />
            </g>
          )
        })}
        {/* Mouth */}
        <path d="M58 220 Q68 223 78 220" stroke="#6E4A30" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Headphones */}
        <path d="M36 196 Q36 155 68 152 Q100 155 100 196" stroke={P.headphonesBand} strokeWidth="9" fill="none" strokeLinecap="round" />
        <rect x="27" y="193" width="16" height="22" rx="7" fill={P.headphonesBand} />
        <rect x="93" y="193" width="16" height="22" rx="7" fill={P.headphonesBand} />
        <rect x="30" y="197" width="10" height="14" rx="4" fill={P.headphonesPad} />
        <rect x="96" y="197" width="10" height="14" rx="4" fill={P.headphonesPad} />
        {/* Arm */}
        <path d="M20 296 Q28 286 48 284 Q68 282 90 284 Q110 286 118 296" fill={P.hoodieShoulder} />
        <path d="M48 292 Q68 288 90 292 Q110 296 100 300 Q68 302 36 300 Z" fill={P.hoodieArm} opacity=".8" />

        {/* Keyboard */}
        <rect x="130" y="272" width="198" height="26" rx="6" fill={P.keyboardOuter} />
        <rect x="134" y="275" width="190" height="19" rx="4" fill={P.keyboardInner} />
        {[0, 1, 2].map(row => Array.from({ length: 14 - row }).map((_, k) => (
          <rect key={`${row}-${k}`}
                x={138 + k * 12 + row * 4} y={277 + row * 6}
                width="9" height="4" rx="1.5"
                fill={P.keyHsl(row)} opacity=".9" />
        )))}
        <rect x="158" y="295" width="120" height="4" rx="2" fill={P.keyboardSpace} />

        {/* Coffee mug */}
        <ellipse cx="362" cy="296" rx="18" ry="4" fill={P.mugShadow} opacity=".5" />
        <rect x="346" y="268" width="32" height="28" rx="6" fill={P.mugBody} />
        <rect x="346" y="268" width="32" height="9"  rx="6" fill={P.mugRim} />
        <ellipse cx="362" cy="273" rx="12" ry="4" fill={P.mugCoffee} />
        <path d="M378 274 Q390 274 390 281 Q390 288 378 288" stroke={P.mugRim} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <text x="350" y="292" fill={P.mugText} fontSize="7.5" fontFamily="'Lora',serif" fontStyle="italic">mg</text>
        {[0, 1, 2].map(i => (
          <path key={i} d={`M${354 + i * 6} 264 Q${356 + i * 6} 256 ${354 + i * 6} 248`}
                stroke={P.mugSteam} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".5">
            <animate attributeName="opacity" values=".5;.1;.5" dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="d"
                     values={`M${354+i*6} 264 Q${356+i*6} 256 ${354+i*6} 248;M${354+i*6} 264 Q${352+i*6} 256 ${354+i*6} 248;M${354+i*6} 264 Q${356+i*6} 256 ${354+i*6} 248`}
                     dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite" />
          </path>
        ))}

        {/* Notebook */}
        <rect x="4" y="274" width="50" height="22" rx="3" fill={P.notebookCover} opacity=".9" />
        <rect x="4" y="274" width="7"  height="22" rx="3" fill={P.notebookSpine} />
        {[0, 1, 2].map(i => (
          <rect key={i} x={14} y={278 + i * 5} width={34 - i * 6} height={1.5} rx={1} fill={P.notebookLine} opacity=".5" />
        ))}
        <rect x="1" y="266" width="3" height="18" rx="1.5" fill={P.notebookMark} opacity=".75" />
        <rect x="1" y="266" width="3" height="5"  rx="1.5" fill={Colors.grn}  opacity=".9" />

        {/* Plant */}
        <ellipse cx="452" cy="295" rx="14" ry="4" fill={P.plantPot} />
        <ellipse cx="452" cy="294" rx="10" ry="5" fill={P.plantSoil} />
        {[
          { cx: 445, cy: 278, rx: 10, ry: 7, r: -20, fill: P.plantLeaves[0] },
          { cx: 460, cy: 274, rx: 9,  ry: 7, r: 15,  fill: P.plantLeaves[1] },
          { cx: 452, cy: 272, rx: 8,  ry: 9, r: 0,   fill: P.plantLeaves[2] },
          { cx: 443, cy: 282, rx: 7,  ry: 5, r: -10, fill: P.plantLeaves[3] },
        ].map((l, i) => (
          <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} fill={l.fill}
                   transform={`rotate(${l.r} ${l.cx} ${l.cy})`} />
        ))}

        {/* Annotation bubbles — driven by hero stats */}
        {annotations.map(a => {
          const isHov = hoveredAnnotation === a.id
          return (
            <g key={a.id} transform={`rotate(${a.rotate} ${a.x + 65} ${a.y + 16})`}
               onMouseEnter={() => setHoveredAnnotation(a.id)}
               onMouseLeave={() => setHoveredAnnotation(null)}
               style={{ cursor: 'pointer' }}>
              <rect x={a.x} y={a.y} width={130} height={32} rx={7}
                    fill={isHov ? Colors.bg2 : P.annotationBg}
                    stroke={isHov ? a.color : Colors.rim2}
                    strokeWidth={isHov ? 1.5 : 1}
                    style={{ transition: 'all .2s' }} />
              <text x={a.x + 10} y={a.y + 14} fill={a.color} fontSize={9}
                    fontFamily="'DM Mono',monospace" fontWeight="bold">{a.value}</text>
              <text x={a.x + 10} y={a.y + 26} fill={Colors.i2} fontSize={7}
                    fontFamily="'DM Mono',monospace">{a.label}</text>
            </g>
          )
        })}
      </svg>

      {/* Page-level lamp beam overlay */}
      {mounted && (
        <LampBeamOverlay
          origin={beamOrigin}
          on={lampOn}
          color={P.lampLightColor}
          angle={angle}
          opacity={opacity}
        />
      )}
    </>
  )
}
