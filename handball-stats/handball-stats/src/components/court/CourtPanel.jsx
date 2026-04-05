import clsx from 'clsx'

/**
 * CourtPanel – Layout estilo Steazzi.
 *
 * TOP:    Arco frontal 3×3 (clickeable para sección del tiro)
 *         + botones Gol / Guardar el tiro
 * MIDDLE: Banner "Interrupción de juego"
 * BOTTOM: Cancha top-down con 9 zonas (diseño del court.html de referencia)
 */

// ─────────────────────────────────────────────────────────────
// ARCO FRONTAL 3×3
// ─────────────────────────────────────────────────────────────
const SECTIONS = ['tl','tc','tr','ml','mc','mr','bl','bc','br']

function GoalFront({ selected, onSelect, onGol, onSaved, showButtons }) {
  return (
    <div className="flex flex-col bg-court-surface px-3 pt-2 pb-1 flex-shrink-0">

      {/* Botones Gol / Guardar */}
      <div className={clsx(
        'flex items-center justify-between mb-1.5 transition-all',
        showButtons ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 mb-0 overflow-hidden'
      )}>
        <button onClick={onGol}
          className="flex items-center gap-2 px-5 py-1.5 rounded-full
                     bg-brand-primary/20 border border-brand-primary/60
                     text-white text-sm font-bold hover:bg-brand-primary/30 transition-all">
          <span className="w-5 h-5 rounded-full bg-brand-primary/50 border border-brand-primary
                           flex items-center justify-center text-[10px]">●()</span>
          Gol
        </button>
        <button onClick={onSaved}
          className="flex items-center gap-2 px-5 py-1.5 rounded-full
                     bg-brand-secondary/20 border border-brand-secondary/60
                     text-white text-sm font-bold hover:bg-brand-secondary/30 transition-all">
          <span className="w-5 h-5 rounded-full bg-brand-secondary/50 border border-brand-secondary
                           flex items-center justify-center text-[10px]">◎</span>
          Guardar el tiro
        </button>
      </div>

      {/* SVG Arco */}
      <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg"
           style={{ width: '100%', display: 'block' }}>

        {/* Shadow + Net */}
        <rect x="4" y="4" width="296" height="152" rx="5" fill="rgba(0,0,0,0.35)" />
        <rect x="2" y="2" width="296" height="152" rx="4" fill="#0b1d34" />

        {/* Net pattern lines */}
        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(i => (
          <line key={`nv${i}`} x1={2 + i*18} y1={9} x2={2 + i*18 - 8} y2={154}
            stroke="#162d47" strokeWidth="0.8" />
        ))}
        {[1,2,3].map(i => (
          <line key={`nh${i}`} x1={9} y1={2 + i*38} x2={291} y2={2 + i*38}
            stroke="#162d47" strokeWidth="0.8" />
        ))}

        {/* Cells 3×3 */}
        {SECTIONS.map((id, idx) => {
          const col = idx % 3, row = Math.floor(idx / 3)
          const cw = 296/3, ch = 152/3
          const x = 2 + col*cw, y = 2 + row*ch
          const isSel = selected === id
          return (
            <g key={id} onClick={() => onSelect(isSel ? null : id)} style={{ cursor: 'pointer' }}>
              <rect x={x+1} y={y+1} width={cw-2} height={ch-2}
                fill={isSel ? 'rgba(200,168,42,0.65)' : 'rgba(255,255,255,0.02)'}
                stroke={isSel ? '#c8a82a' : '#1e3f5a'}
                strokeWidth={isSel ? 2 : 1} rx="1" />
            </g>
          )
        })}

        {/* Grid dividers (over cells) */}
        <line x1="100.7" y1="9" x2="100.7" y2="153" stroke="#2a5070" strokeWidth="1.8" />
        <line x1="200.3" y1="9" x2="200.3" y2="153" stroke="#2a5070" strokeWidth="1.8" />
        <line x1="9" y1="52.7" x2="291" y2="52.7" stroke="#2a5070" strokeWidth="1.8" />
        <line x1="9" y1="103.3" x2="291" y2="103.3" stroke="#2a5070" strokeWidth="1.8" />

        {/* Left post stripes */}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(i => (
          <rect key={`lp${i}`} x={2} y={2+i*8.5} width={7} height={5}
            fill={i%2===0 ? '#ef4444' : '#ffffff'} />
        ))}
        {/* Right post stripes */}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(i => (
          <rect key={`rp${i}`} x={291} y={2+i*8.5} width={7} height={5}
            fill={i%2===0 ? '#ef4444' : '#ffffff'} />
        ))}
        {/* Crossbar stripes */}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32].map(i => (
          <rect key={`cb${i}`} x={2+i*9} y={2} width={5.5} height={7}
            fill={i%2===0 ? '#ef4444' : '#ffffff'} />
        ))}

        {/* Frame */}
        <rect x={2} y={2} width={296} height={152} rx={4}
          fill="none" stroke="#ef4444" strokeWidth="4" />
        <rect x={2} y={2} width={296} height={152} rx={4}
          fill="none" stroke="rgba(255,130,130,0.35)" strokeWidth="1" />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CANCHA TOP-DOWN – 9 zonas (port directo del court.html)
// ViewBox 360×300, mismo diseño exacto de referencia
// ─────────────────────────────────────────────────────────────

// Mapeo zone-id → número interno del HTML original
const ZONE_MAP = {
  extreme_left:  1,
  lateral_left:  2,
  center_above:  3,
  lateral_right: 4,
  extreme_right: 5,
  '7m':          6,
  near_left:     7,
  near_center:   8,
  near_right:    9,
  outside:       10,
}
const ZONE_ID_MAP = Object.fromEntries(Object.entries(ZONE_MAP).map(([k,v]) => [v,k]))

// Label positions for each zone (x,y dentro del viewBox 360×300)
const ZONE_LABELS = {
  1:  { x: 32,  y: 60,  label: 'Ext.\nIzq.' },
  2:  { x: 106, y: 80,  label: 'Lat.\nIzq.' },
  3:  { x: 180, y: 75,  label: 'Centro' },
  4:  { x: 254, y: 80,  label: 'Lat.\nDer.' },
  5:  { x: 328, y: 60,  label: 'Ext.\nDer.' },
  7:  { x: 106, y: 220, label: 'Cerca\nIzq.' },
  8:  { x: 180, y: 230, label: 'Pivote' },
  9:  { x: 254, y: 220, label: 'Cerca\nDer.' },
}

function CourtTopDown({ selectedZone, onZoneSelect, heatmap = {} }) {
  const maxHeat = Math.max(0, ...Object.values(heatmap))
  const click = (id) => onZoneSelect(selectedZone === id ? null : id)

  const selNum = ZONE_MAP[selectedZone] ?? -1

  const zFill = (num) => {
    const id = ZONE_ID_MAP[num]
    if (!id) return 'transparent'
    if (selectedZone === id) return 'rgba(200,168,42,0.75)'
    const heat = maxHeat > 0 ? (heatmap[id] ?? 0) / maxHeat : 0
    if (heat > 0) return `rgba(239,100,97,${0.1 + heat * 0.5})`
    return 'transparent'
  }

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 360 300"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <clipPath id="above9m-L"><path d="M 65 0 L 148 0 L 148 174 Q 106 158 65 132 Z"/></clipPath>
          <clipPath id="above9m-C"><path d="M 148 0 L 212 0 L 212 174 L 148 174 Z"/></clipPath>
          <clipPath id="above9m-R"><path d="M 212 0 L 295 0 L 295 132 Q 254 158 212 174 Z"/></clipPath>
          <clipPath id="below9m-L"><path d="M 65 132 Q 106 158 148 174 L 148 300 L 65 300 Z"/></clipPath>
          <clipPath id="below9m-C"><path d="M 148 174 L 212 174 L 212 300 L 148 300 Z"/></clipPath>
          <clipPath id="below9m-R"><path d="M 212 174 Q 254 158 295 132 L 295 300 L 212 300 Z"/></clipPath>
        </defs>

        {/* Background */}
        <rect width="360" height="300" fill="#0b1a2e"/>

        {/* ── ZONES – clickeable fills ── */}

        {/* Zone 1: Extremo Izquierdo */}
        <rect onClick={() => click('extreme_left')} style={{ cursor:'pointer' }}
          x="0" y="0" width="65" height="117"
          fill={zFill(1)}
          stroke={selectedZone==='extreme_left' ? '#c8a82a' : 'transparent'}
          strokeWidth="2" />

        {/* Zone 2: Lateral Izq arriba de 9m */}
        <rect onClick={() => click('lateral_left')} style={{ cursor:'pointer' }}
          x="65" y="0" width="83" height="300"
          fill={zFill(2)} clipPath="url(#above9m-L)"
          stroke={selectedZone==='lateral_left' ? '#c8a82a' : 'transparent'}
          strokeWidth="2" />

        {/* Zone 3: Centro arriba de 9m */}
        <rect onClick={() => click('center_above')} style={{ cursor:'pointer' }}
          x="148" y="0" width="64" height="300"
          fill={zFill(3)} clipPath="url(#above9m-C)"
          stroke={selectedZone==='center_above' ? '#c8a82a' : 'transparent'}
          strokeWidth="2" />

        {/* Zone 4: Lateral Der arriba de 9m */}
        <rect onClick={() => click('lateral_right')} style={{ cursor:'pointer' }}
          x="212" y="0" width="83" height="300"
          fill={zFill(4)} clipPath="url(#above9m-R)"
          stroke={selectedZone==='lateral_right' ? '#c8a82a' : 'transparent'}
          strokeWidth="2" />

        {/* Zone 5: Extremo Derecho */}
        <rect onClick={() => click('extreme_right')} style={{ cursor:'pointer' }}
          x="295" y="0" width="65" height="117"
          fill={zFill(5)}
          stroke={selectedZone==='extreme_right' ? '#c8a82a' : 'transparent'}
          strokeWidth="2" />

        {/* Zone 7: Lateral Izq abajo de 9m (cerca) */}
        <rect onClick={() => click('near_left')} style={{ cursor:'pointer' }}
          x="65" y="0" width="83" height="300"
          fill={zFill(7)} clipPath="url(#below9m-L)"
          stroke={selectedZone==='near_left' ? '#c8a82a' : 'transparent'}
          strokeWidth="2" />

        {/* Zone 8: Centro abajo de 9m (pivote) */}
        <rect onClick={() => click('near_center')} style={{ cursor:'pointer' }}
          x="148" y="0" width="64" height="300"
          fill={zFill(8)} clipPath="url(#below9m-C)"
          stroke={selectedZone==='near_center' ? '#c8a82a' : 'transparent'}
          strokeWidth="2" />

        {/* Zone 9: Lateral Der abajo de 9m (cerca) */}
        <rect onClick={() => click('near_right')} style={{ cursor:'pointer' }}
          x="212" y="0" width="83" height="300"
          fill={zFill(9)} clipPath="url(#below9m-R)"
          stroke={selectedZone==='near_right' ? '#c8a82a' : 'transparent'}
          strokeWidth="2" />

        {/* ── COURT LINES (over zone fills) ── */}

        {/* Blue goal area */}
        <path d="M 0 0 Q 180 210 360 0 L 360 -2 L 0 -2 Z" fill="#1a3d7a" opacity="0.85"/>

        {/* 6m arc line */}
        <path d="M 0 0 Q 180 210 360 0" fill="none" stroke="#ffffff" strokeWidth="2.5"/>

        {/* 9m dashed arc */}
        <path d="M 0 65 Q 180 290 360 65"
          fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="10,7"/>

        {/* Vertical dividers */}
        <line x1="65"  y1="62"  x2="65"  y2="300" stroke="#ffffff" strokeWidth="1.5" opacity="0.45"/>
        <line x1="148" y1="102" x2="148" y2="300" stroke="#ffffff" strokeWidth="1.5" opacity="0.45"/>
        <line x1="212" y1="102" x2="212" y2="300" stroke="#ffffff" strokeWidth="1.5" opacity="0.45"/>
        <line x1="295" y1="62"  x2="295" y2="300" stroke="#ffffff" strokeWidth="1.5" opacity="0.45"/>

        {/* Zone labels */}
        {Object.entries(ZONE_LABELS).map(([num, { x, y, label }]) => {
          const id = ZONE_ID_MAP[parseInt(num)]
          const sel = selectedZone === id
          return label.split('\n').map((line, i) => (
            <text key={`${num}-${i}`}
              x={x} y={y + i*14}
              textAnchor="middle"
              fill={sel ? '#c8a82a' : 'rgba(255,255,255,0.45)'}
              fontSize="11"
              fontWeight={sel ? 'bold' : 'normal'}
              fontFamily="Arial,sans-serif"
              style={{ pointerEvents: 'none' }}>
              {line}
            </text>
          ))
        })}

        {/* Heatmap counts */}
        {maxHeat > 0 && Object.entries(ZONE_LABELS).map(([num, { x, y }]) => {
          const id = ZONE_ID_MAP[parseInt(num)]
          const v = heatmap[id]
          if (!v) return null
          return (
            <text key={`h-${num}`} x={x} y={y - 16}
              textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold"
              fontFamily="Arial,sans-serif"
              style={{ pointerEvents: 'none' }}>{v}</text>
          )
        })}

        {/* ── 7m badge – selectable ── */}
        <g onClick={() => click('7m')} style={{ cursor: 'pointer' }}>
          <rect x="148" y="125" width="64" height="24" rx="12"
            fill={selectedZone === '7m' ? '#c8a82a' : '#ffffff'} />
          <text x="180" y="141" textAnchor="middle"
            fill={selectedZone === '7m' ? '#fff' : '#0b1a2e'}
            fontFamily="Arial,sans-serif" fontSize="12" fontWeight="800"
            style={{ pointerEvents: 'none' }}>7m</text>
        </g>

        {/* Afuera – left & right edges */}
        <g onClick={() => click('outside')} style={{ cursor: 'pointer' }}>
          <rect x="0" y="117" width="65" height="183"
            fill={selectedZone === 'outside' ? 'rgba(200,168,42,0.35)' : 'transparent'} />
          <rect x="295" y="117" width="65" height="183"
            fill={selectedZone === 'outside' ? 'rgba(200,168,42,0.35)' : 'transparent'} />
        </g>

        {/* Afuera labels */}
        <text x="32" y="210" textAnchor="middle"
          fill={selectedZone==='outside' ? '#c8a82a' : 'rgba(255,255,255,0.3)'}
          fontSize="9" fontFamily="Arial,sans-serif"
          style={{ pointerEvents: 'none' }}>AFUERA</text>
        <text x="328" y="210" textAnchor="middle"
          fill={selectedZone==='outside' ? '#c8a82a' : 'rgba(255,255,255,0.3)'}
          fontSize="9" fontFamily="Arial,sans-serif"
          style={{ pointerEvents: 'none' }}>AFUERA</text>

      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// EXPORT PRINCIPAL
// ─────────────────────────────────────────────────────────────
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
      <GoalFront
        selected={selectedGoalSection}
        onSelect={onGoalSectionSelect}
        showButtons={showGoalButtons}
        onGol={onGol}
        onSaved={onGuardarTiro}
      />

      {/* Banner interrupción */}
      <div className={clsx(
        'flex-shrink-0 transition-all overflow-hidden',
        isInterrupted ? 'h-8' : 'h-0'
      )}>
        <div className="h-8 flex items-center justify-center
                        bg-brand-secondary/20 border-y border-brand-secondary/40">
          <p className="text-brand-secondary text-xs font-bold tracking-widest uppercase">
            Interrupción de juego
          </p>
        </div>
      </div>

      {/* Cancha */}
      <div className="flex-1 min-h-0 overflow-hidden bg-[#0b1a2e]">
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
