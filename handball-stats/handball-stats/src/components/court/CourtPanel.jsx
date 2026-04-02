import clsx from 'clsx'

/**
 * CourtPanel – Layout estilo Steazzi
 * ┌──────────────────────────────┐
 * │  [Gol]      [Guardar tiro]   │  ← solo si hay jugador seleccionado
 * │                              │
 * │    ████ ARCO FRONTAL 3×3 ████│  ← siempre visible, ~38% altura
 * ├──── Interrupción de juego ───┤  ← cuando está pausado
 * │                              │
 * │      CANCHA TOP-DOWN         │  ← zonas clickeables, ~62% altura
 * │                              │
 * └──────────────────────────────┘
 */

// ────────────────────────────────────────────────────────────
// ARCO FRONTAL (vista de frente, 3x3 grid)
// ────────────────────────────────────────────────────────────
const SECTIONS = ['tl','tc','tr','ml','mc','mr','bl','bc','br']

function GoalFront({ selected, onSelect, onGol, onSaved, showButtons }) {
  return (
    <div className="flex flex-col bg-court-surface px-2 pt-1 pb-0 flex-shrink-0">

      {/* Botones Gol / Guardar el tiro */}
      <div className="flex items-center justify-between mb-1 px-1">
        <button
          onClick={onGol}
          disabled={!showButtons}
          className={clsx(
            'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all',
            showButtons
              ? 'bg-brand-primary/20 border border-brand-primary/50 text-white'
              : 'opacity-0 pointer-events-none'
          )}
        >
          <span className="w-5 h-5 rounded-full bg-brand-primary/40 border border-brand-primary
                           flex items-center justify-center text-[10px]">●</span>
          Gol
        </button>

        <button
          onClick={onSaved}
          disabled={!showButtons}
          className={clsx(
            'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all',
            showButtons
              ? 'bg-brand-secondary/20 border border-brand-secondary/50 text-white'
              : 'opacity-0 pointer-events-none'
          )}
        >
          <span className="w-5 h-5 rounded-full bg-brand-secondary/40 border border-brand-secondary
                           flex items-center justify-center text-[10px]">◎</span>
          Guardar el tiro
        </button>
      </div>

      {/* Goal grid SVG – 3 cols × 3 rows */}
      <div className="px-1">
        <svg
          viewBox="0 0 300 160"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', display: 'block' }}
        >
          {/* Shadow */}
          <rect x="4" y="4" width="296" height="152" rx="6" fill="rgba(0,0,0,0.4)" />
          {/* Net background */}
          <rect x="2" y="2" width="296" height="152" rx="5" fill="#0b1d34" />

          {/* 3×3 clickable cells */}
          {SECTIONS.map((id, idx) => {
            const col = idx % 3
            const row = Math.floor(idx / 3)
            const cw = 296 / 3, ch = 152 / 3
            const x = 2 + col * cw, y = 2 + row * ch
            const isSel = selected === id
            return (
              <g key={id} onClick={() => onSelect(isSel ? null : id)}
                 style={{ cursor: 'pointer' }}>
                <rect x={x + 0.5} y={y + 0.5}
                      width={cw - 1} height={ch - 1}
                      fill={isSel ? 'rgba(234,179,8,0.55)' : 'rgba(255,255,255,0.025)'}
                      stroke={isSel ? '#eab308' : '#1e3f5a'}
                      strokeWidth={isSel ? 2 : 1} rx="1" />
              </g>
            )
          })}

          {/* Net crosshatch lines (decorative) */}
          {[1,2,3,4,5,6,7,8].map(i => (
            <line key={`v${i}`}
              x1={2 + i * 37} y1={2} x2={2 + i * 37 - 15} y2={154}
              stroke="#1a3550" strokeWidth="0.7" />
          ))}
          {[1,2,3].map(i => (
            <line key={`h${i}`}
              x1={2} y1={2 + i * 38} x2={298} y2={2 + i * 38}
              stroke="#1a3550" strokeWidth="0.7" />
          ))}

          {/* LEFT POST – red/white stripes */}
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(i => (
            <rect key={`lp${i}`} x={2} y={2 + i * 8} width={7} height={5}
              fill={i % 2 === 0 ? '#ef4444' : '#ffffff'} />
          ))}
          {/* RIGHT POST */}
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(i => (
            <rect key={`rp${i}`} x={291} y={2 + i * 8} width={7} height={5}
              fill={i % 2 === 0 ? '#ef4444' : '#ffffff'} />
          ))}
          {/* CROSSBAR */}
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33].map(i => (
            <rect key={`cb${i}`} x={2 + i * 9} y={2} width={5} height={7}
              fill={i % 2 === 0 ? '#ef4444' : '#ffffff'} />
          ))}

          {/* Frame outline */}
          <rect x={2} y={2} width={296} height={152} rx={5}
            fill="none" stroke="#ef4444" strokeWidth="3.5" />
          <rect x={2} y={2} width={296} height={152} rx={5}
            fill="none" stroke="rgba(255,100,100,0.4)" strokeWidth="1" />

          {/* Grid dividers */}
          <line x1={100.7} y1={9} x2={100.7} y2={152} stroke="#2a4f72" strokeWidth="1.5" />
          <line x1={200.3} y1={9} x2={200.3} y2={152} stroke="#2a4f72" strokeWidth="1.5" />
          <line x1={9} y1={52.7} x2={291} y2={52.7} stroke="#2a4f72" strokeWidth="1.5" />
          <line x1={9} y1={103.3} x2={291} y2={103.3} stroke="#2a4f72" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// CANCHA TOP-DOWN
// ────────────────────────────────────────────────────────────
const CX = 160

const ZONES = [
  { id: 'extreme_left',  label: 'Ext. Izq.',  pts: '0,0 108,0 38,300 0,300',              lx: 20,  ly: 210 },
  { id: 'back_left',     label: 'Lat. Izq.',  pts: '108,0 160,0 112,300 38,300',           lx: 84,  ly: 200 },
  { id: 'center',        label: 'Central',    pts: '160,0 112,300 208,300',                lx: 160, ly: 235 },
  { id: 'back_right',    label: 'Lat. Der.',  pts: '160,0 212,0 262,300 208,300',          lx: 236, ly: 200 },
  { id: 'extreme_right', label: 'Ext. Der.',  pts: '212,0 320,0 320,300 262,300',          lx: 300, ly: 210 },
  { id: 'pivot',         label: 'Pivote',     pts: '105,0 215,0 225,108 95,108',           lx: 160, ly: 90  },
]

function CourtTopDown({ selectedZone, onZoneSelect, heatmap = {} }) {
  const maxHeat = Math.max(0, ...Object.values(heatmap))
  const click = (id) => onZoneSelect(selectedZone === id ? null : id)

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 320 300"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Court surface */}
        <rect width="320" height="300" fill="#0f2744" />

        {/* 6m filled arc */}
        <path d="M 40,0 A 122,122 0 0 1 280,0 Z" fill="#0c2050" />
        <path d="M 40,0 A 122,122 0 0 1 280,0" fill="none" stroke="#4a7fc1" strokeWidth="2.5" />

        {/* 9m dashed */}
        <path d="M -18,0 A 185,185 0 0 1 338,0" fill="none"
          stroke="#4a7fc1" strokeWidth="1.2" strokeDasharray="9 5" opacity="0.6" />

        {/* Bottom arc (court boundary) */}
        <path d="M -40,300 A 220,220 0 0 0 360,300" fill="none"
          stroke="#4a7fc1" strokeWidth="1" opacity="0.25" />

        {/* Zone fills */}
        {ZONES.map(z => {
          const sel = selectedZone === z.id
          const heat = maxHeat > 0 ? (heatmap[z.id] ?? 0) / maxHeat : 0
          return (
            <g key={z.id} onClick={() => click(z.id)} style={{ cursor: 'pointer' }}>
              <polygon points={z.pts}
                fill={sel ? 'rgba(234,179,8,0.42)' : heat > 0 ? `rgba(239,100,97,${0.1+heat*0.5})` : 'transparent'}
                stroke={sel ? '#eab308' : 'transparent'} strokeWidth={sel ? 2 : 0}
              />
              <polygon points={z.pts} fill="transparent" stroke="transparent" strokeWidth="14" />
            </g>
          )
        })}

        {/* 7m clickable */}
        <g onClick={() => click('7m')} style={{ cursor: 'pointer' }}>
          <circle cx={CX} cy={170} r={28}
            fill={selectedZone === '7m' ? 'rgba(234,179,8,0.38)' : 'transparent'}
            stroke={selectedZone === '7m' ? '#eab308' : 'transparent'} strokeWidth="2" />
        </g>
        <circle cx={CX} cy={170} r={4} fill="#fff" opacity="0.85" style={{ pointerEvents: 'none' }} />

        {/* Outside (left/right edges) */}
        <g onClick={() => click('outside')} style={{ cursor: 'pointer' }}>
          <rect x={-50} y={0} width={55} height={300}
            fill={selectedZone === 'outside' ? 'rgba(234,179,8,0.15)' : 'transparent'} />
          <rect x={315} y={0} width={55} height={300}
            fill={selectedZone === 'outside' ? 'rgba(234,179,8,0.15)' : 'transparent'} />
        </g>

        {/* Zone divider lines */}
        <line x1="108" y1="0" x2="38"  y2="300" stroke="#4a7fc1" strokeWidth="1.3" opacity="0.6" />
        <line x1="160" y1="0" x2="112" y2="300" stroke="#4a7fc1" strokeWidth="1.3" opacity="0.6" />
        <line x1="160" y1="0" x2="208" y2="300" stroke="#4a7fc1" strokeWidth="1.3" opacity="0.6" />
        <line x1="212" y1="0" x2="262" y2="300" stroke="#4a7fc1" strokeWidth="1.3" opacity="0.6" />
        {/* Pivot bottom boundary */}
        <line x1="95" y1="108" x2="225" y2="108" stroke="#4a7fc1" strokeWidth="1"
          strokeDasharray="5 3" opacity="0.5" />

        {/* Labels */}
        {ZONES.map(z => {
          const sel = selectedZone === z.id
          return (
            <text key={`l-${z.id}`} x={z.lx} y={z.ly} textAnchor="middle"
              fill={sel ? '#eab308' : 'rgba(139,163,193,0.8)'}
              fontSize="11" fontWeight={sel ? 'bold' : 'normal'}
              style={{ pointerEvents: 'none' }}>
              {z.label}
            </text>
          )
        })}

        {/* 7m label */}
        <text x={CX + 32} y={174} fill={selectedZone === '7m' ? '#eab308' : 'rgba(139,163,193,0.75)'}
          fontSize="11" style={{ pointerEvents: 'none' }}>7m</text>

        {/* Afuera labels on edges */}
        <text x={-14} y={150} textAnchor="middle"
          fill={selectedZone === 'outside' ? '#eab308' : 'rgba(139,163,193,0.5)'}
          fontSize="9" transform="rotate(-90, -14, 150)"
          style={{ pointerEvents: 'none' }}>AFUERA</text>
        <text x={334} y={150} textAnchor="middle"
          fill={selectedZone === 'outside' ? '#eab308' : 'rgba(139,163,193,0.5)'}
          fontSize="9" transform="rotate(90, 334, 150)"
          style={{ pointerEvents: 'none' }}>AFUERA</text>

        {/* Heatmap */}
        {maxHeat > 0 && ZONES.map(z => {
          const v = heatmap[z.id]; if (!v) return null
          return (
            <text key={`h-${z.id}`} x={z.lx} y={z.ly - 16} textAnchor="middle"
              fill="#fff" fontSize="16" fontWeight="bold"
              style={{ pointerEvents: 'none' }}>{v}</text>
          )
        })}
      </svg>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// EXPORT PRINCIPAL
// ────────────────────────────────────────────────────────────
export default function CourtPanel({
  selectedZone, onZoneSelect,
  selectedGoalSection, onGoalSectionSelect,
  isInterrupted,
  heatmap = {},
  onGol, onGuardarTiro,
  showGoalButtons = false,
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Arco frontal */}
      <GoalFront
        selected={selectedGoalSection}
        onSelect={onGoalSectionSelect}
        showButtons={showGoalButtons}
        onGol={onGol}
        onSaved={onGuardarTiro}
      />

      {/* Banner interrupción */}
      <div className={clsx(
        'transition-all overflow-hidden flex-shrink-0',
        isInterrupted ? 'h-8' : 'h-0'
      )}>
        <div className="bg-brand-secondary/25 border-y border-brand-secondary/40 h-8 flex items-center justify-center">
          <p className="text-brand-secondary text-xs font-bold tracking-widest uppercase">
            Interrupción de juego
          </p>
        </div>
      </div>

      {/* Cancha zonas */}
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

export { CourtTopDown }
