import { useTimer } from '@/hooks/useTimer'
import useMatchStore from '@/store/matchStore'
import clsx from 'clsx'

export default function Scoreboard({ onPressTimer }) {
  const { formatted, half } = useTimer()
  const {
    homeTeam, awayTeam,
    homeScore, awayScore,
    isRunning, isInterrupted,
  } = useMatchStore()

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-court-surface/80 backdrop-blur
                    border-b border-white/10 sticky top-0 z-30">
      {/* Home team */}
      <div className="flex flex-col items-start min-w-0">
        <span className="text-xs text-gray-400 truncate max-w-[80px]">
          {homeTeam?.short_name ?? homeTeam?.name ?? 'Local'}
        </span>
        <span
          className="text-3xl font-black leading-none"
          style={{ color: homeTeam?.color ?? '#ef6461' }}
        >
          {homeScore}
        </span>
      </div>

      {/* Centre: timer + play/pause */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onPressTimer}
          className={clsx(
            'flex items-center gap-2 px-4 py-1.5 rounded-2xl font-mono text-lg font-bold transition-all',
            isRunning
              ? 'bg-brand-primary/20 text-brand-primary'
              : 'bg-white/10 text-white',
            isInterrupted && 'animate-pulse',
          )}
        >
          <span>{isRunning ? '⏸' : '▶'}</span>
          <span>{formatted}</span>
        </button>
        <span className="text-xs text-gray-500">
          {half === 1 ? '1er Tiempo' : half === 2 ? '2do Tiempo' : `Tiempo ${half}`}
        </span>
      </div>

      {/* Away team */}
      <div className="flex flex-col items-end min-w-0">
        <span className="text-xs text-gray-400 truncate max-w-[80px]">
          {awayTeam?.short_name ?? awayTeam?.name ?? 'Visitante'}
        </span>
        <span
          className="text-3xl font-black leading-none"
          style={{ color: awayTeam?.color ?? '#48cae4' }}
        >
          {awayScore}
        </span>
      </div>
    </div>
  )
}
