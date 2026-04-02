import clsx from 'clsx'

/**
 * CourtPanel – Vista combinada estilo Steazzi:
 *  ┌─────────────────────────────┐
 *  │  [Gol]  [Guardar el tiro]   │
 *  │      ARCO FRONTAL 3×3       │
 *  ├─── Interrupción de juego ───┤
 *  │    CANCHA TOP-DOWN + ZONAS  │
 *  └─────────────────────────────┘
 */

// ── Arco frontal ────────────────────────────────────────────
const GOAL_SECTIONS = [
  'tl','tc','tr',
  'ml','mc','mr',
  'bl','bc','br',
]

function GoalFront({ selected, onSelect }) {
  // 3 cols x 3 rows
  const cols = 3, rows = 3
  const W = 270, H = 148
  const cellW = W / cols
  const cellH = H / rows

  return (
    <svg viewBox={`0 0 ${W + 16} ${H + 16}`} className="w-full" style={{ maxHeight: 180 }}>
      {/* Shadow */}
      <rect x="10" y="10" width={W} height={H} rx="4" fill="rgba(0,0,0,0.3)" />
      {/* Net bg */}
      <rect x="8" y="8" width={W} height={H} rx="4" fill="#0c1e36" />

      {/* Grid cells */}
      {GOAL_SECTIONS.map((id, idx) => {
        const col = idx % cols
        const row = Math.floor(idx / cols)
        const x = 8 + col * cellW
        const y = 8 + row * cellH
        const isSel = selected === id
        return (
          <g key={id} onClick={() => onSelect(isSel ? null : id)} style={{ cursor: 'pointer' }}>
            <rect x={x} y={y} width={cellW} height={cellH}
              fill={isSel ? 'rgba(234,179,8,0.50)' : 'rgba(255,255,255,0.02)'}
              stroke={isSel ? '#eab308' : '#2a4a6a'}
              strokeWidth={isSel ? 2 : 1}
            />
          </g>
        )
      })}

      {/* Post left */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(i => (
        <rect key={`lp${i}`} x={8} y={8 + i * 8} width={6} height={5}
          fill={i % 2 === 0 ? '#ef4444' : '#fff'} />
      ))}
      {/* Post right */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(i => (
        <rect key={`rp${i}`} x={8 + W - 6} y={8 + i * 8} width={6} height={5}
          fill={i % 2 === 0 ? '#ef4444' : '#fff'} />
      ))}
      {/* Crossbar */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32].map(i => (
        <rect key={`cb${i}`} x={8 + i * 9} y={8} width={5} height={6}
          fill={i % 2 === 0 ? '#ef4444' : '#fff'} />
      ))}
      {/* Frame outline */}
      <rect x={8} y={8} width={W} height={H} rx={3}
        fill="none" stroke="#ff6060" strokeWidth="2" />
    </svg>
  )
}

// ── Cancha top-down ─────────────────────────────────────────
const CX = 160, CY = 0, VH = 320

// Zonas: 7 sectores + afuera
const ZONES = [
  {
    id: 'extreme_left',
    label: 'Ext. Izq.',
    pts: `0,0 110,0 40,${VH} 0,${VH}`,
    lx: 22, ly: 230,
  },
  {
    id: 'back_left',
    label: 'Lat. Izq.',
    pts: `110,0 ${CX},0 ${CX - 48},${VH} 40,${VH}`,
    lx: 92, ly: 210,
  },
  {
    id: 'center',
    label: 'Central',
    pts: `${CX},0 ${CX - 48},${VH} ${CX + 48},${VH}`,
    lx: 160, ly: 240,
  },
  {
    id: 'back_right',
    label: 'Lat. Der.',
    pts: `${CX},0 210,0 280,${VH} ${CX + 48},${VH}`,
    lx: 228, ly: 210,
  },
  {
    id: 'extreme_right',
    label: 'Ext. Der.',
    pts: `210,0 320,0 320,${VH} 280,${VH}`,
    lx: 298, ly: 230,
  },
  {
    id: 'pivot',
    label: 'Pivote',
    pts: `${CX - 52},0 ${CX + 52},0 ${CX + 62},105 ${CX - 62},105`,
    lx: 160, ly: 88,
  },
]

function CourtTopDown({ selectedZone, onZoneSelect, heatmap = {} }) {
  const maxHeat = Math.max(0, ...Object.values(heatmap))

  const click = (id) => onZoneSelect(selectedZone === id ? null : id)

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 320 320" className="w-full" style={{ display: 'block' }}>
        {/* Court bg */}
        <rect width="320" height="320" fill="#0f2744" />

        {/* 6m filled arc */}
        <path d="M 0,0 A 120,120 0 0 1 320,0 Z" fill="#0c2050" />
        <path d="M 0,0 A 120,120 0 0 1 320,0" fill="none" stroke="#4a7fc1" strokeWidth="2.5" />

        {/* 9m dashed */}
        <path d="M -20,0 A 183,183 0 0 1 340,0" fill="none" stroke="#4a7fc1"
          strokeWidth="1.2" strokeDasharray="9 5" opacity="0.6" />

        {/* Far arc (bottom of court) */}
        <path d={`M -60,${VH} A 230,230 0 0 0 380,${VH}`} fill="none"
          stroke="#4a7fc1" strokeWidth="1" opacity="0.3" />

        {/* Zone fills */}
        {ZONES.map(z => {
          const sel = selectedZone === z.id
          const heat = maxHeat > 0 ? (heatmap[z.id] ?? 0) / maxHeat : 0
          return (
            <g key={z.id} onClick={() => click(z.id)} style={{ cursor: 'pointer' }}>
              <polygon points={z.pts}
                fill={sel
                  ? 'rgba(234,179,8,0.42)'
                  : heat > 0
                    ? `rgba(239,100,97,${0.08 + heat * 0.5})`
                    : 'transparent'}
                stroke={sel ? '#eab308' : 'transparent'}
                strokeWidth={sel ? 2 : 0}
              />
              <polygon points={z.pts} fill="transparent" strokeWidth="14" stroke="transparent" />
            </g>
          )
        })}

        {/* 7m spot */}
        <g onClick={() => click('7m')} style={{ cursor: 'pointer' }}>
          <circle cx={CX} cy={170} r={26}
            fill={selectedZone === '7m' ? 'rgba(234,179,8,0.38)' : 'transparent'}
            stroke={selectedZone === '7m' ? '#eab308' : 'transparent'}
            strokeWidth="2"
          />
        </g>
        <circle cx={CX} cy={170} r={4} fill="#fff" opacity="0.85" style={{ pointerEvents: 'none' }} />

        {/* Afuera zones – left and right edges */}
        {['outside_left','outside_right'].map((id, i) => {
          const sel = selectedZone === 'outside'
          const x = i === 0 ? -40 : 320
          return (
            <g key={id} onClick={() => click('outside')} style={{ cursor: 'pointer' }}>
              <rect x={i === 0 ? -40 : 310} y={0} width={50} height={VH}
                fill={sel ? 'rgba(234,179,8,0.2)' : 'transparent'} />
            </g>
          )
        })}

        {/* Zone divider lines */}
        <line x1="110" y1="0" x2="40"  y2={VH} stroke="#4a7fc1" strokeWidth="1.3" opacity="0.6" />
        <line x1={CX}  y1="0" x2={CX - 48} y2={VH} stroke="#4a7fc1" strokeWidth="1.3" opacity="0.6" />
        <line x1={CX}  y1="0" x2={CX + 48} y2={VH} stroke="#4a7fc1" strokeWidth="1.3" opacity="0.6" />
        <line x1="210" y1="0" x2="280" y2={VH} stroke="#4a7fc1" strokeWidth="1.3" opacity="0.6" />
        {/* Pivot boundary */}
        <line x1={CX - 62} y1="105" x2={CX + 62} y2="105"
          stroke="#4a7fc1" strokeWidth="1" strokeDasharray="5 3" opacity="0.5" />

        {/* Labels */}
        {ZONES.map(z => {
          const sel = selectedZone === z.id
          return (
            <text key={`l-${z.id}`} x={z.lx} y={z.ly}
              textAnchor="middle"
              fill={sel ? '#eab308' : 'rgba(139,163,193,0.75)'}
              fontSize="11" fontWeight={sel ? 'bold' : 'normal'}
              style={{ pointerEvents: 'none' }}>
              {z.label}
            </text>
          )
        })}

        {/* 7m label */}
        <text x={CX + 32} y={174} fill={selectedZone === '7m' ? '#eab308' : 'rgba(139,163,193,0.8)'}
          fontSize="11" style={{ pointerEvents: 'none' }}>7m</text>

        {/* Heatmap counts */}
        {maxHeat > 0 && ZONES.map(z => {
          const v = heatmap[z.id]; if (!v) return null
          return (
            <text key={`h-${z.id}`} x={z.lx} y={z.ly - 16}
              textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold"
              style={{ pointerEvents: 'none' }}>{v}</text>
          )
        })}
      </svg>

      {/* 7m badge */}
      <div className="absolute" style={{ top: 155, left: '50%', transform: 'translateX(-50%)' }}>
        <div className={clsx(
          'px-2 py-0.5 rounded-full text-xs font-bold border',
          selectedZone === '7m'
            ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300'
            : 'bg-court-bg/70 border-white/20 text-gray-400'
        )}>7m</div>
      </div>
    </div>
  )
}

// ── Export principal ─────────────────────────────────────────
export default function CourtPanel({
  selectedZone, onZoneSelect,
  selectedGoalSection, onGoalSectionSelect,
  isInterrupted,
  heatmap = {},
  onGol, onGuardarTiro,
  showGoalButtons = false,
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-court-bg">

      {/* ── Arco frontal (top) ── */}
      <div className="bg-court-surface px-3 pt-2 pb-1">
        {/* Botones Gol / Guardar el tiro */}
        {showGoalButtons && (
          <div className="flex items-center justify-around mb-2">
            <button onClick={onGol}
              className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-brand-primary/30 border-2 border-brand-primary
                              flex items-center justify-center text-xl">⚽</div>
              <span className="text-white text-xs font-semibold">Gol</span>
            </button>
            <button onClick={onGuardarTiro}
              className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-brand-secondary/30 border-2 border-brand-secondary
                              flex items-center justify-center text-xl">🧤</div>
              <span className="text-white text-xs font-semibold">Guardar el tiro</span>
            </button>
          </div>
        )}
        <GoalFront selected={selectedGoalSection} onSelect={onGoalSectionSelect} />
      </div>

      {/* ── Banner interrupción ── */}
      {isInterrupted && (
        <div className="bg-brand-secondary/20 border-y border-brand-secondary/40 py-1.5">
          <p className="text-brand-secondary text-center text-sm font-bold tracking-wide">
            Interrupción de juego
          </p>
        </div>
      )}

      {/* ── Cancha zonas (bottom) ── */}
      <div className="flex-1 overflow-hidden">
        <CourtTopDown
          selectedZone={selectedZone}
          onZoneSelect={onZoneSelect}
          heatmap={heatmap}
        />
      </div>
    </div>
  )
}

// Exportar también CourtTopDown para stats
export { CourtTopDown }
