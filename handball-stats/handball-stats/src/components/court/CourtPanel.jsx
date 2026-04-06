import clsx from 'clsx'

/**
 * CourtPanel – Layout estilo Steazzi
 * El panel se divide en proporciones fijas:
 *   ~40% → Arco frontal 3×3
 *   ~60% → Cancha top-down 9 zonas
 * El sidebar de jugadores está fuera de este componente (en LiveMatch)
 */

// ─── Arco frontal 3×3 ────────────────────────────────────────
const SECTIONS = ['tl','tc','tr','ml','mc','mr','bl','bc','br']

function GoalFront({ selected, onSelect, onGol, onSaved, showButtons }) {
  return (
    // altura fija relativa: el arco nunca crece más de esto
    <div className="flex-shrink-0 bg-court-surface px-2 pt-1 pb-0"
         style={{ maxHeight: '42%' }}>

      {/* Botones Gol / Guardar – solo cuando hay jugador */}
      {showButtons && (
        <div className="flex items-center justify-around mb-1 px-2">
          <button onClick={onGol}
            className="flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold
                       bg-brand-primary/20 border border-brand-primary/50 text-white
                       hover:bg-brand-primary/30 transition-all">
            <span className="w-4 h-4 rounded-full bg-brand-primary/60 border border-brand-primary
                             flex items-center justify-center text-[9px]">●</span>
            Gol
          </button>
          <button onClick={onSaved}
            className="flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold
                       bg-brand-secondary/20 border border-brand-secondary/50 text-white
                       hover:bg-brand-secondary/30 transition-all">
            <span className="w-4 h-4 rounded-full bg-brand-secondary/60 border border-brand-secondary
                             flex items-center justify-center text-[9px]">◎</span>
            Guardar el tiro
          </button>
        </div>
      )}

      {/* SVG del arco – viewBox fijo, altura máxima controlada por el wrapper */}
      <svg
        viewBox="0 0 300 160"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', display: 'block', maxHeight: showButtons ? '130px' : '150px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Shadow */}
        <rect x="4" y="4" width="296" height="152" rx="5" fill="rgba(0,0,0,0.4)" />
        {/* Net bg */}
        <rect x="2" y="2" width="296" height="152" rx="4" fill="#0b1d34" />

        {/* Net pattern */}
        {Array.from({length:16},(_,i)=>i+1).map(i=>(
          <line key={`nv${i}`} x1={2+i*18} y1={9} x2={2+i*18-8} y2={154}
            stroke="#162d47" strokeWidth="0.8"/>
        ))}
        {[1,2,3].map(i=>(
          <line key={`nh${i}`} x1={9} y1={2+i*38} x2={291} y2={2+i*38}
            stroke="#162d47" strokeWidth="0.8"/>
        ))}

        {/* Cells 3×3 */}
        {SECTIONS.map((id,idx)=>{
          const col=idx%3, row=Math.floor(idx/3)
          const cw=296/3, ch=152/3
          const x=2+col*cw, y=2+row*ch
          const isSel=selected===id
          return (
            <g key={id} onClick={()=>onSelect(isSel?null:id)} style={{cursor:'pointer'}}>
              <rect x={x+1} y={y+1} width={cw-2} height={ch-2}
                fill={isSel?'rgba(200,168,42,0.65)':'rgba(255,255,255,0.02)'}
                stroke={isSel?'#c8a82a':'#1e3f5a'}
                strokeWidth={isSel?2:1} rx="1"/>
            </g>
          )
        })}

        {/* Grid dividers */}
        <line x1="100.7" y1="9" x2="100.7" y2="153" stroke="#2a5070" strokeWidth="2"/>
        <line x1="200.3" y1="9" x2="200.3" y2="153" stroke="#2a5070" strokeWidth="2"/>
        <line x1="9" y1="52.7" x2="291" y2="52.7" stroke="#2a5070" strokeWidth="2"/>
        <line x1="9" y1="103.3" x2="291" y2="103.3" stroke="#2a5070" strokeWidth="2"/>

        {/* Left post stripes */}
        {Array.from({length:19},(_,i)=>i).map(i=>(
          <rect key={`lp${i}`} x={2} y={2+i*8.5} width={7} height={5}
            fill={i%2===0?'#ef4444':'#ffffff'}/>
        ))}
        {/* Right post stripes */}
        {Array.from({length:19},(_,i)=>i).map(i=>(
          <rect key={`rp${i}`} x={291} y={2+i*8.5} width={7} height={5}
            fill={i%2===0?'#ef4444':'#ffffff'}/>
        ))}
        {/* Crossbar */}
        {Array.from({length:33},(_,i)=>i).map(i=>(
          <rect key={`cb${i}`} x={2+i*9} y={2} width={5.5} height={7}
            fill={i%2===0?'#ef4444':'#ffffff'}/>
        ))}

        {/* Frame */}
        <rect x={2} y={2} width={296} height={152} rx={4}
          fill="none" stroke="#ef4444" strokeWidth="4"/>
        <rect x={2} y={2} width={296} height={152} rx={4}
          fill="none" stroke="rgba(255,130,130,0.35)" strokeWidth="1"/>
      </svg>
    </div>
  )
}

// ─── Cancha top-down 9 zonas ──────────────────────────────────
// Port directo del court.html de referencia (viewBox 360×300)
const ZONE_LABELS = {
  extreme_left:  { x: 32,  y: 55,  t: ['Ext.','Izq.'] },
  lateral_left:  { x: 106, y: 75,  t: ['Lat.','Izq.'] },
  center_above:  { x: 180, y: 70,  t: ['Centro'] },
  lateral_right: { x: 254, y: 75,  t: ['Lat.','Der.'] },
  extreme_right: { x: 328, y: 55,  t: ['Ext.','Der.'] },
  near_left:     { x: 106, y: 225, t: ['Cerca','Izq.'] },
  near_center:   { x: 180, y: 235, t: ['Pivote'] },
  near_right:    { x: 254, y: 225, t: ['Cerca','Der.'] },
}

function zFill(id, selected, heatmap, maxHeat) {
  if (selected === id) return 'rgba(200,168,42,0.75)'
  const heat = maxHeat > 0 ? (heatmap[id] ?? 0) / maxHeat : 0
  if (heat > 0) return `rgba(239,100,97,${0.1 + heat * 0.5})`
  return 'transparent'
}

function CourtTopDown({ selectedZone, onZoneSelect, heatmap = {} }) {
  const maxHeat = Math.max(0, ...Object.values(heatmap))
  const click = (id) => onZoneSelect(selectedZone === id ? null : id)

  const f = (id) => zFill(id, selectedZone, heatmap, maxHeat)
  const s = (id) => selectedZone === id ? '#c8a82a' : 'transparent'

  return (
    <svg
      viewBox="0 0 360 300"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <clipPath id="cp-aL"><path d="M 65 0 L 148 0 L 148 174 Q 106 158 65 132 Z"/></clipPath>
        <clipPath id="cp-aC"><path d="M 148 0 L 212 0 L 212 174 L 148 174 Z"/></clipPath>
        <clipPath id="cp-aR"><path d="M 212 0 L 295 0 L 295 132 Q 254 158 212 174 Z"/></clipPath>
        <clipPath id="cp-bL"><path d="M 65 132 Q 106 158 148 174 L 148 300 L 65 300 Z"/></clipPath>
        <clipPath id="cp-bC"><path d="M 148 174 L 212 174 L 212 300 L 148 300 Z"/></clipPath>
        <clipPath id="cp-bR"><path d="M 212 174 Q 254 158 295 132 L 295 300 L 212 300 Z"/></clipPath>
      </defs>

      {/* Background */}
      <rect width="360" height="300" fill="#0b1a2e"/>

      {/* Zone fills */}
      {/* 1 – Extremo Izq */}
      <rect onClick={()=>click('extreme_left')} style={{cursor:'pointer'}}
        x="0" y="0" width="65" height="117"
        fill={f('extreme_left')} stroke={s('extreme_left')} strokeWidth="2"/>

      {/* 2 – Lateral Izq arriba 9m */}
      <rect onClick={()=>click('lateral_left')} style={{cursor:'pointer'}}
        x="65" y="0" width="83" height="300" clipPath="url(#cp-aL)"
        fill={f('lateral_left')} stroke={s('lateral_left')} strokeWidth="2"/>

      {/* 3 – Centro arriba 9m */}
      <rect onClick={()=>click('center_above')} style={{cursor:'pointer'}}
        x="148" y="0" width="64" height="300" clipPath="url(#cp-aC)"
        fill={f('center_above')} stroke={s('center_above')} strokeWidth="2"/>

      {/* 4 – Lateral Der arriba 9m */}
      <rect onClick={()=>click('lateral_right')} style={{cursor:'pointer'}}
        x="212" y="0" width="83" height="300" clipPath="url(#cp-aR)"
        fill={f('lateral_right')} stroke={s('lateral_right')} strokeWidth="2"/>

      {/* 5 – Extremo Der */}
      <rect onClick={()=>click('extreme_right')} style={{cursor:'pointer'}}
        x="295" y="0" width="65" height="117"
        fill={f('extreme_right')} stroke={s('extreme_right')} strokeWidth="2"/>

      {/* 7 – Cerca Izq (abajo 9m) */}
      <rect onClick={()=>click('near_left')} style={{cursor:'pointer'}}
        x="65" y="0" width="83" height="300" clipPath="url(#cp-bL)"
        fill={f('near_left')} stroke={s('near_left')} strokeWidth="2"/>

      {/* 8 – Pivote/Centro cerca */}
      <rect onClick={()=>click('near_center')} style={{cursor:'pointer'}}
        x="148" y="0" width="64" height="300" clipPath="url(#cp-bC)"
        fill={f('near_center')} stroke={s('near_center')} strokeWidth="2"/>

      {/* 9 – Cerca Der */}
      <rect onClick={()=>click('near_right')} style={{cursor:'pointer'}}
        x="212" y="0" width="83" height="300" clipPath="url(#cp-bR)"
        fill={f('near_right')} stroke={s('near_right')} strokeWidth="2"/>

      {/* Afuera – bordes izq/der debajo del extremo */}
      <g onClick={()=>click('outside')} style={{cursor:'pointer'}}>
        <rect x="0"   y="117" width="65" height="183"
          fill={f('outside')}/>
        <rect x="295" y="117" width="65" height="183"
          fill={f('outside')}/>
      </g>

      {/* ── Court lines (encima de fills) ── */}
      <path d="M 0 0 Q 180 210 360 0 L 360 -2 L 0 -2 Z" fill="#1a3d7a" opacity="0.85"/>
      <path d="M 0 0 Q 180 210 360 0" fill="none" stroke="#ffffff" strokeWidth="2.5"/>
      <path d="M 0 65 Q 180 290 360 65" fill="none" stroke="#ffffff"
        strokeWidth="2" strokeDasharray="10,7"/>
      <line x1="65"  y1="62"  x2="65"  y2="300" stroke="#ffffff" strokeWidth="1.5" opacity="0.45"/>
      <line x1="148" y1="102" x2="148" y2="300" stroke="#ffffff" strokeWidth="1.5" opacity="0.45"/>
      <line x1="212" y1="102" x2="212" y2="300" stroke="#ffffff" strokeWidth="1.5" opacity="0.45"/>
      <line x1="295" y1="62"  x2="295" y2="300" stroke="#ffffff" strokeWidth="1.5" opacity="0.45"/>

      {/* Zone labels */}
      {Object.entries(ZONE_LABELS).map(([id,{x,y,t}])=>(
        t.map((line,i)=>(
          <text key={`${id}-${i}`} x={x} y={y+i*14} textAnchor="middle"
            fill={selectedZone===id?'#c8a82a':'rgba(255,255,255,0.45)'}
            fontSize="11" fontWeight={selectedZone===id?'bold':'normal'}
            fontFamily="Arial,sans-serif" style={{pointerEvents:'none'}}>
            {line}
          </text>
        ))
      ))}

      {/* Afuera label */}
      <text x="32" y="220" textAnchor="middle"
        fill={selectedZone==='outside'?'#c8a82a':'rgba(255,255,255,0.25)'}
        fontSize="9" fontFamily="Arial,sans-serif" style={{pointerEvents:'none'}}>
        AFUERA
      </text>
      <text x="328" y="220" textAnchor="middle"
        fill={selectedZone==='outside'?'#c8a82a':'rgba(255,255,255,0.25)'}
        fontSize="9" fontFamily="Arial,sans-serif" style={{pointerEvents:'none'}}>
        AFUERA
      </text>

      {/* Heatmap counts */}
      {maxHeat > 0 && Object.entries(ZONE_LABELS).map(([id,{x,y}])=>{
        const v=heatmap[id]; if(!v) return null
        return <text key={`h-${id}`} x={x} y={y-16} textAnchor="middle"
          fill="#fff" fontSize="16" fontWeight="bold" fontFamily="Arial,sans-serif"
          style={{pointerEvents:'none'}}>{v}</text>
      })}

      {/* 7m badge */}
      <g onClick={()=>click('7m')} style={{cursor:'pointer'}}>
        <rect x="148" y="125" width="64" height="24" rx="12"
          fill={selectedZone==='7m'?'#c8a82a':'#ffffff'}/>
        <text x="180" y="141" textAnchor="middle"
          fill={selectedZone==='7m'?'#fff':'#0b1a2e'}
          fontFamily="Arial,sans-serif" fontSize="12" fontWeight="800"
          style={{pointerEvents:'none'}}>7m</text>
      </g>
    </svg>
  )
}

// ─── Export principal ─────────────────────────────────────────
export default function CourtPanel({
  selectedZone, onZoneSelect,
  selectedGoalSection, onGoalSectionSelect,
  isInterrupted,
  heatmap = {},
  onGol, onGuardarTiro,
  showGoalButtons = false,
}) {
  return (
    // flex-col que ocupa todo el espacio disponible entre scoreboard y bottom bar
    <div className="flex flex-col w-full overflow-hidden" style={{ flex: 1, minHeight: 0 }}>

      {/* ARCO – altura fija ~38% */}
      <div style={{ flex: '0 0 38%', minHeight: 0, overflow: 'hidden' }}
           className="bg-court-surface flex flex-col justify-end">
        <GoalFront
          selected={selectedGoalSection}
          onSelect={onGoalSectionSelect}
          showButtons={showGoalButtons}
          onGol={onGol}
          onSaved={onGuardarTiro}
        />
      </div>

      {/* BANNER interrupción */}
      {isInterrupted && (
        <div className="flex-shrink-0 h-7 flex items-center justify-center
                        bg-brand-secondary/20 border-y border-brand-secondary/40">
          <p className="text-brand-secondary text-[11px] font-bold tracking-widest uppercase">
            Interrupción de juego
          </p>
        </div>
      )}

      {/* CANCHA – ocupa el resto */}
      <div style={{ flex: 1, minHeight: 0 }} className="bg-[#0b1a2e] overflow-hidden">
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
