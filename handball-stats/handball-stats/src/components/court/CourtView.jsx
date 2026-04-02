import clsx from 'clsx'

/**
 * CourtView – SVG handball half-court, Steazzi-style.
 * ViewBox: 320 x 500
 * Goal line at y=80. Goal centre (CX=160, CY=80).
 * Goal posts: left=117, right=203 (width 86px)
 * 6m radius: 120px | 9m radius: 183px
 */

const CX = 160
const CY = 80
const BOTTOM = 500

// Bottom x anchors for zone divisions
const B_EXT_LEFT   = 30
const B_BACK_LEFT  = 112
const B_BACK_RIGHT = 208
const B_EXT_RIGHT  = 290

// Goal posts x
const T_LEFT  = 117
const T_RIGHT = 203

// Pivot zone
const PIVOT_BOTTOM = CY + 110
const PIVOT_BL = CX - 68
const PIVOT_BR = CX + 68

const COURT_ZONES = [
  {
    id: 'extreme_left',
    label: ['Extremo', 'Izq.'],
    pts: `0,${CY} ${T_LEFT},${CY} ${B_EXT_LEFT},${BOTTOM} 0,${BOTTOM}`,
    lx: 20, ly: 340,
  },
  {
    id: 'back_left',
    label: ['Lateral', 'Izq.'],
    pts: `${T_LEFT},${CY} ${CX},${CY} ${B_BACK_LEFT},${BOTTOM} ${B_EXT_LEFT},${BOTTOM}`,
    lx: 88, ly: 310,
  },
  {
    id: 'center',
    label: ['Central'],
    pts: `${CX},${CY} ${B_BACK_LEFT},${BOTTOM} ${B_BACK_RIGHT},${BOTTOM}`,
    lx: 160, ly: 370,
  },
  {
    id: 'back_right',
    label: ['Lateral', 'Der.'],
    pts: `${CX},${CY} ${T_RIGHT},${CY} ${B_EXT_RIGHT},${BOTTOM} ${B_BACK_RIGHT},${BOTTOM}`,
    lx: 232, ly: 310,
  },
  {
    id: 'extreme_right',
    label: ['Extremo', 'Der.'],
    pts: `${T_RIGHT},${CY} 320,${CY} 320,${BOTTOM} ${B_EXT_RIGHT},${BOTTOM}`,
    lx: 300, ly: 340,
  },
  {
    id: 'pivot',
    label: ['Pivote'],
    pts: `${CX - 55},${CY} ${CX + 55},${CY} ${PIVOT_BR},${PIVOT_BOTTOM} ${PIVOT_BL},${PIVOT_BOTTOM}`,
    lx: 160, ly: PIVOT_BOTTOM - 8,
  },
]

function Goal() {
  const x = T_LEFT, y = 28, w = T_RIGHT - T_LEFT, h = 54
  return (
    <g>
      {/* Shadow */}
      <rect x={x + 3} y={y + 3} width={w} height={h} rx={2} fill="rgba(0,0,0,0.35)" />
      {/* Net */}
      <rect x={x + 5} y={y + 5} width={w - 10} height={h - 5} fill="#0c1e36" />
      {/* Net vertical lines */}
      {[1, 2].map(i => (
        <line key={`nv${i}`}
          x1={x + 5 + ((w - 10) / 3) * i} y1={y + 5}
          x2={x + 5 + ((w - 10) / 3) * i} y2={y + h}
          stroke="#2a4a6a" strokeWidth="1" />
      ))}
      {/* Net horizontal lines */}
      {[1, 2].map(i => (
        <line key={`nh${i}`}
          x1={x + 5} y1={y + 5 + ((h - 5) / 3) * i}
          x2={x + w - 5} y2={y + 5 + ((h - 5) / 3) * i}
          stroke="#2a4a6a" strokeWidth="1" />
      ))}
      {/* Frame */}
      <rect x={x} y={y} width={w} height={h} rx={2}
            fill="none" stroke="#ef4444" strokeWidth="4.5" />
      {/* Stripe overlay on posts */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={`ls${i}`} x={x} y={y + i * 8}
              width={4.5} height={4} fill={i % 2 === 0 ? '#ef4444' : '#fff'} />
      ))}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={`rs${i}`} x={x + w - 4.5} y={y + i * 8}
              width={4.5} height={4} fill={i % 2 === 0 ? '#ef4444' : '#fff'} />
      ))}
      {/* Crossbar stripes */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={`cs${i}`} x={x + i * 11} y={y}
              width={6} height={4} fill={i % 2 === 0 ? '#ef4444' : '#fff'} />
      ))}
      {/* Bright outline */}
      <rect x={x} y={y} width={w} height={h} rx={2}
            fill="none" stroke="#ff8080" strokeWidth="1" />
    </g>
  )
}

export default function CourtView({
  selectedZone,
  onZoneSelect,
  flipped = false,
  heatmap = {},
  showLabels = true,
  className = '',
}) {
  const maxHeat = Math.max(0, ...Object.values(heatmap))

  const click = (id) => onZoneSelect?.(selectedZone === id ? null : id)

  return (
    <div className={clsx('relative w-full select-none', className)}>
      <svg
        viewBox="0 0 320 500"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: flipped ? 'scaleX(-1)' : 'none', width: '100%', display: 'block' }}
      >
        {/* Background */}
        <rect width="320" height="500" fill="#0d1b2a" />
        <rect x="0" y={CY} width="320" height={500 - CY} fill="#0f2744" />

        {/* 6m filled D-zone */}
        <path
          d={`M ${CX - 120},${CY} A 120,120 0 0 1 ${CX + 120},${CY} Z`}
          fill="#0c2050" stroke="#4a7fc1" strokeWidth="2"
        />

        {/* 9m dashed arc */}
        <path
          d={`M ${CX - 183},${CY} A 183,183 0 0 1 ${CX + 183},${CY}`}
          fill="none" stroke="#4a7fc1" strokeWidth="1.2"
          strokeDasharray="8 5" opacity="0.65"
        />

        {/* Zone fills */}
        {COURT_ZONES.map(z => {
          const sel = selectedZone === z.id
          const heat = maxHeat > 0 ? (heatmap[z.id] ?? 0) / maxHeat : 0
          return (
            <g key={z.id} onClick={() => click(z.id)} style={{ cursor: 'pointer' }}>
              <polygon
                points={z.pts}
                fill={sel
                  ? 'rgba(234,179,8,0.38)'
                  : heat > 0
                    ? `rgba(239,100,97,${0.08 + heat * 0.48})`
                    : 'transparent'}
                stroke={sel ? '#eab308' : 'transparent'}
                strokeWidth={sel ? 2 : 0}
              />
              {/* Fat hit area */}
              <polygon points={z.pts} fill="transparent" stroke="transparent" strokeWidth="14" />
            </g>
          )
        })}

        {/* 7m spot clickable */}
        <g onClick={() => click('7m')} style={{ cursor: 'pointer' }}>
          <circle cx={CX} cy={CY + 172} r={24}
            fill={selectedZone === '7m' ? 'rgba(234,179,8,0.35)' : 'transparent'}
            stroke={selectedZone === '7m' ? '#eab308' : 'transparent'}
            strokeWidth="2"
          />
        </g>
        <circle cx={CX} cy={CY + 172} r={4} fill="#fff" opacity="0.85" style={{ pointerEvents: 'none' }} />

        {/* Zone divider lines */}
        <line x1={T_LEFT}  y1={CY} x2={B_EXT_LEFT}   y2={BOTTOM} stroke="#4a7fc1" strokeWidth="1.2" opacity="0.55" />
        <line x1={CX}      y1={CY} x2={B_BACK_LEFT}  y2={BOTTOM} stroke="#4a7fc1" strokeWidth="1.2" opacity="0.55" />
        <line x1={CX}      y1={CY} x2={B_BACK_RIGHT} y2={BOTTOM} stroke="#4a7fc1" strokeWidth="1.2" opacity="0.55" />
        <line x1={T_RIGHT} y1={CY} x2={B_EXT_RIGHT}  y2={BOTTOM} stroke="#4a7fc1" strokeWidth="1.2" opacity="0.55" />

        {/* Pivot bottom line */}
        <line x1={PIVOT_BL} y1={PIVOT_BOTTOM} x2={PIVOT_BR} y2={PIVOT_BOTTOM}
              stroke="#4a7fc1" strokeWidth="1" opacity="0.5" strokeDasharray="5 3" />

        {/* Goal line */}
        <line x1="0" y1={CY} x2="320" y2={CY} stroke="#4a7fc1" strokeWidth="1.5" opacity="0.35" />

        {/* Goal */}
        <Goal />

        {/* Zone labels */}
        {showLabels && !flipped && (
          <g style={{ pointerEvents: 'none' }}>
            {COURT_ZONES.map(z => {
              const sel = selectedZone === z.id
              return z.label.map((line, i) => (
                <text key={`${z.id}-${i}`}
                  x={z.lx} y={z.ly + i * 14}
                  textAnchor="middle"
                  fill={sel ? '#eab308' : 'rgba(139,163,193,0.8)'}
                  fontSize="11"
                  fontWeight={sel ? 'bold' : 'normal'}
                >
                  {line}
                </text>
              ))
            })}
            <text x={CX + 30} y={CY + 177}
              fill={selectedZone === '7m' ? '#eab308' : 'rgba(139,163,193,0.8)'}
              fontSize="10">7m</text>
          </g>
        )}

        {/* Heatmap counts */}
        {maxHeat > 0 && COURT_ZONES.map(z => {
          const val = heatmap[z.id]
          if (!val) return null
          return (
            <text key={`h-${z.id}`}
              x={z.lx} y={z.ly - 16}
              textAnchor="middle" fill="#fff"
              fontSize="18" fontWeight="bold"
              style={{ pointerEvents: 'none' }}>
              {val}
            </text>
          )
        })}
      </svg>

      {/* Afuera button */}
      <button
        onClick={() => click('outside')}
        className={clsx(
          'absolute top-2 right-2 text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all',
          selectedZone === 'outside'
            ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300'
            : 'bg-white/5 border-white/20 text-gray-400 hover:text-white',
        )}
      >
        Afuera
      </button>
    </div>
  )
}
