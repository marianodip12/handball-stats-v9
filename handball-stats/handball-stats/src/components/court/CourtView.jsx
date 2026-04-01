import clsx from 'clsx'

/**
 * CourtView – SVG handball half-court with clickable zones.
 *
 * Zones radiate as sectors from the goal centre (180, 50):
 *   extreme_left  | back_left | center | back_right | extreme_right
 *   pivot (near 6m) | 7m spot
 *
 * Props:
 *   selectedZone  – string id of active zone
 *   onZoneSelect  – (zoneId: string) => void
 *   flipped       – boolean, mirror court left↔right
 *   heatmap       – { [zoneId]: number } optional count for stats overlay
 */

const ZONE_FILL_ACTIVE  = 'rgba(234,179,8,0.45)'
const ZONE_FILL_HOVER   = 'rgba(255,255,255,0.06)'
const ZONE_FILL_DEFAULT = 'transparent'

// SVG viewBox: 360 × 420
// Goal line at y=50, court bottom at y=420
// Goal centre: (180, 50), left post: (147, 50), right post: (213, 50)
// 6m arc approximate: radius ~100px from (180,50)
// 9m arc approximate: radius ~155px from (180,50) (dashed)

const COURT_ZONES = [
  {
    id: 'extreme_left',
    label: 'Ext.\nIzq.',
    // Quadrilateral: top-left corner → goal left post → bottom 0–72 → left edge
    polygon: '0,30 147,50 72,420 0,420',
    labelPos: { x: 30, y: 320 },
  },
  {
    id: 'back_left',
    label: 'Lat.\nIzq.',
    // Triangle: goal centre → bottom 72–144
    polygon: '147,50 180,50 144,420 72,420',
    labelPos: { x: 105, y: 310 },
  },
  {
    id: 'center',
    label: 'Central',
    // Triangle: goal centre → bottom 144–216
    polygon: '180,50 144,420 216,420',
    labelPos: { x: 180, y: 330 },
  },
  {
    id: 'back_right',
    label: 'Lat.\nDer.',
    // Mirror of back_left
    polygon: '180,50 213,50 288,420 216,420',
    labelPos: { x: 255, y: 310 },
  },
  {
    id: 'extreme_right',
    label: 'Ext.\nDer.',
    // Mirror of extreme_left
    polygon: '213,50 360,30 360,420 288,420',
    labelPos: { x: 330, y: 320 },
  },
  {
    id: 'pivot',
    label: 'Pivote',
    // Trapezoid near 6m line, overlaid in centre
    polygon: '135,50 225,50 225,118 135,118',
    labelPos: { x: 180, y: 100 },
  },
]

function ZonePolygon({ zone, isSelected, onClick, heatValue, maxHeat }) {
  const heatOpacity = maxHeat > 0 ? (heatValue ?? 0) / maxHeat : 0

  return (
    <g
      onClick={() => onClick(zone.id)}
      className="cursor-pointer"
      style={{ outline: 'none' }}
    >
      <polygon
        points={zone.polygon}
        fill={
          isSelected
            ? ZONE_FILL_ACTIVE
            : heatOpacity > 0
              ? `rgba(239,100,97,${0.1 + heatOpacity * 0.5})`
              : ZONE_FILL_DEFAULT
        }
        stroke={isSelected ? '#eab308' : 'transparent'}
        strokeWidth={isSelected ? 2 : 0}
        className="transition-colors duration-150"
      />
      {/* Invisible larger hit area */}
      <polygon
        points={zone.polygon}
        fill="transparent"
        stroke="transparent"
        strokeWidth="8"
      />
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

  const handleZoneClick = (zoneId) => {
    onZoneSelect?.(selectedZone === zoneId ? null : zoneId)
  }

  return (
    <div className={clsx('relative w-full select-none', className)}>
      <svg
        viewBox="0 0 360 420"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: flipped ? 'scaleX(-1)' : 'none',
          maxHeight: '52vh',
        }}
        className="w-full"
      >
        {/* ── Court background ── */}
        <rect width="360" height="420" fill="#0d1b2a" />
        <rect x="0" y="50" width="360" height="370" fill="#0f2744" />

        {/* ── 6m D-area ── */}
        <path
          d="M 80,50 A 100,100 0 0 1 280,50"
          fill="#0a1f3a"
          stroke="#4a7fc1"
          strokeWidth="1.5"
        />

        {/* ── 9m free-throw line (dashed) ── */}
        <path
          d="M 22,50 A 158,158 0 0 1 338,50"
          fill="none"
          stroke="#4a7fc1"
          strokeWidth="1"
          strokeDasharray="7 4"
          opacity="0.6"
        />

        {/* ── Zone divider lines ── */}
        {[72, 144, 180, 216, 288].map((bx) => (
          <line
            key={bx}
            x1="180" y1="50"
            x2={bx} y2="420"
            stroke="#4a7fc1"
            strokeWidth="0.8"
            opacity="0.45"
          />
        ))}
        {/* Extreme boundaries */}
        <line x1="147" y1="50" x2="0"   y2="420" stroke="#4a7fc1" strokeWidth="0.8" opacity="0.45" />
        <line x1="213" y1="50" x2="360" y2="420" stroke="#4a7fc1" strokeWidth="0.8" opacity="0.45" />

        {/* ── Pivot zone boundary line ── */}
        <line x1="135" y1="118" x2="225" y2="118" stroke="#4a7fc1" strokeWidth="1" opacity="0.5" strokeDasharray="4 3" />

        {/* ── 7m spot ── */}
        <circle cx="180" cy="176" r="4" fill="#fff" opacity="0.8" />

        {/* ── Clickable zones ── */}
        {COURT_ZONES.map(zone => (
          <ZonePolygon
            key={zone.id}
            zone={zone}
            isSelected={selectedZone === zone.id}
            onClick={handleZoneClick}
            heatValue={heatmap[zone.id] ?? 0}
            maxHeat={maxHeat}
          />
        ))}

        {/* ── 7m clickable area ── */}
        <circle
          cx="180" cy="176" r="18"
          fill={selectedZone === '7m' ? ZONE_FILL_ACTIVE : 'transparent'}
          stroke={selectedZone === '7m' ? '#eab308' : 'transparent'}
          strokeWidth="2"
          className="cursor-pointer"
          onClick={() => handleZoneClick('7m')}
        />

        {/* ── Outside button (rendered separately, not a court zone) ── */}

        {/* ── Goal rectangle ── */}
        <rect
          x="147" y="12" width="66" height="40"
          fill="#1a2f4a"
          stroke="#ef6461"
          strokeWidth="2"
          rx="2"
        />
        {/* Goal grid lines 3×3 */}
        <line x1="169" y1="12" x2="169" y2="52" stroke="#4a7fc1" strokeWidth="1" opacity="0.7" />
        <line x1="191" y1="12" x2="191" y2="52" stroke="#4a7fc1" strokeWidth="1" opacity="0.7" />
        <line x1="147" y1="25" x2="213" y2="25" stroke="#4a7fc1" strokeWidth="1" opacity="0.7" />
        <line x1="147" y1="38" x2="213" y2="38" stroke="#4a7fc1" strokeWidth="1" opacity="0.7" />

        {/* ── Zone labels (when not flipped to avoid mirrored text) ── */}
        {showLabels && !flipped && (
          <g style={{ pointerEvents: 'none' }}>
            {COURT_ZONES.map(zone => {
              const isSelected = selectedZone === zone.id
              const lines = zone.label.split('\n')
              return lines.map((line, i) => (
                <text
                  key={`${zone.id}-${i}`}
                  x={zone.labelPos.x}
                  y={zone.labelPos.y + i * 13}
                  textAnchor="middle"
                  fill={isSelected ? '#eab308' : '#8ba3c1'}
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {line}
                </text>
              ))
            })}
            <text x="195" y="183" fill="#8ba3c1" fontSize="10">7m</text>
          </g>
        )}

        {/* ── Heatmap count overlay ── */}
        {Object.keys(heatmap).length > 0 && (
          <g style={{ pointerEvents: 'none' }}>
            {COURT_ZONES.map(zone => heatmap[zone.id] ? (
              <text
                key={`heat-${zone.id}`}
                x={zone.labelPos.x}
                y={zone.labelPos.y - 14}
                textAnchor="middle"
                fill="#fff"
                fontSize="16"
                fontWeight="bold"
                opacity="0.9"
              >
                {heatmap[zone.id]}
              </text>
            ) : null)}
          </g>
        )}
      </svg>

      {/* ── Outside button (below SVG) ── */}
      <button
        onClick={() => handleZoneClick('outside')}
        className={clsx(
          'absolute top-1 right-2 text-xs px-2 py-1 rounded-lg border transition-all',
          selectedZone === 'outside'
            ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300'
            : 'bg-white/5 border-white/20 text-gray-400',
        )}
      >
        Afuera
      </button>
    </div>
  )
}
