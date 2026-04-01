import clsx from 'clsx'
import { GOAL_SECTIONS } from '@/constants'

/**
 * GoalGrid – 3×3 goal face. Click a section to record where the shot went.
 *
 * Props:
 *   selected   – section id (e.g. 'tl', 'mc', 'br')
 *   onSelect   – (sectionId) => void
 *   counts     – { [sectionId]: number } for stats heatmap
 */
export default function GoalGrid({ selected, onSelect, counts = {}, size = 'md' }) {
  const rows = [0, 1, 2]
  const cols = [0, 1, 2]

  const sectionAt = (row, col) =>
    GOAL_SECTIONS.find(s => s.row === row && s.col === col)

  const maxCount = Math.max(0, ...Object.values(counts))

  const cellSize = { sm: 'h-10', md: 'h-14', lg: 'h-20' }

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-red-500/70"
         style={{ background: '#1a2f4a' }}>
      {/* Goal post indicator */}
      <div className="absolute inset-y-0 left-0 w-2 bg-red-500/50 rounded-l" />
      <div className="absolute inset-y-0 right-0 w-2 bg-red-500/50 rounded-r" />
      <div className="absolute top-0 inset-x-0 h-2 bg-red-500/50 rounded-t" />

      <div className="grid grid-cols-3 gap-0.5 p-2">
        {rows.map(row =>
          cols.map(col => {
            const section = sectionAt(row, col)
            if (!section) return null
            const count = counts[section.id] ?? 0
            const heat = maxCount > 0 ? count / maxCount : 0
            const isSelected = selected === section.id

            return (
              <button
                key={section.id}
                onClick={() => onSelect?.(isSelected ? null : section.id)}
                className={clsx(
                  cellSize[size],
                  'rounded flex items-center justify-center text-sm font-bold transition-all',
                  'border border-white/10',
                  isSelected
                    ? 'bg-yellow-500/50 border-yellow-400 text-yellow-200'
                    : 'hover:bg-white/10 text-white/60',
                )}
                style={{
                  backgroundColor: isSelected
                    ? undefined
                    : heat > 0
                      ? `rgba(239,100,97,${0.1 + heat * 0.55})`
                      : undefined,
                }}
              >
                {count > 0 ? count : ''}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
