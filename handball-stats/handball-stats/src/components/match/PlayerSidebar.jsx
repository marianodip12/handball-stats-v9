import { useMemo } from 'react'
import clsx from 'clsx'
import useMatchStore from '@/store/matchStore'

/**
 * PlayerSidebar
 * Shows the on-court players for the currently selected team side.
 * Scrollable (max 7 players). Excluded players show countdown.
 * Click player → selects as event subject.
 */
export default function PlayerSidebar() {
  const {
    selectedTeamSide, homeLineup, awayLineup,
    selectedPlayerId, selectPlayer,
    exclusions, elapsedSeconds,
    homeTeam, awayTeam,
  } = useMatchStore()

  const lineup = selectedTeamSide === 'home' ? homeLineup : awayLineup
  const team   = selectedTeamSide === 'home' ? homeTeam   : awayTeam

  const exclusionMap = useMemo(() => {
    const map = {}
    exclusions
      .filter(e => {
        const teamId = selectedTeamSide === 'home' ? homeTeam?.id : awayTeam?.id
        return e.teamId === teamId
      })
      .forEach(e => { map[e.playerId] = e })
    return map
  }, [exclusions, selectedTeamSide, homeTeam, awayTeam])

  const toggleSide = () => {
    const next = selectedTeamSide === 'home' ? 'away' : 'home'
    useMatchStore.getState().selectTeamSide(next)
  }

  return (
    <div className="flex flex-col h-full bg-court-surface/50 border-r border-white/10 w-14">
      {/* Team switch button */}
      <button
        onClick={toggleSide}
        className="flex items-center justify-center h-10 border-b border-white/10
                   text-lg hover:bg-white/10 transition-colors"
        title="Cambiar equipo"
      >
        ⇄
      </button>

      {/* Team colour indicator */}
      <div
        className="h-1 mx-1 rounded-full mb-1"
        style={{ backgroundColor: team?.color ?? '#ef6461' }}
      />

      {/* Player list – scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 py-1 px-1">
        {lineup.map(player => {
          const excl = exclusionMap[player.id]
          const remaining = excl && !excl.isPermanent
            ? Math.max(0, excl.endsAtSeconds - elapsedSeconds)
            : null

          return (
            <button
              key={player.id}
              onClick={() => selectPlayer(player.id)}
              className={clsx(
                'relative flex flex-col items-center justify-center rounded-xl py-1.5 transition-all',
                'border text-xs font-bold leading-tight',
                selectedPlayerId === player.id
                  ? 'bg-yellow-500/30 border-yellow-400 text-yellow-200'
                  : excl?.isPermanent
                    ? 'bg-red-900/30 border-red-700/40 text-red-400 opacity-50 cursor-not-allowed'
                    : excl
                      ? 'bg-blue-900/40 border-blue-500/40 text-blue-300'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10',
              )}
              disabled={excl?.isPermanent}
              title={`${player.number} ${player.name}`}
            >
              {/* Jersey number */}
              <span className="text-base font-black">{player.number}</span>

              {/* GK indicator */}
              {player.isGoalkeeper && (
                <span className="text-[8px] text-gray-400">ARQ</span>
              )}

              {/* Exclusion countdown */}
              {remaining !== null && (
                <span className="text-[9px] text-blue-300 font-mono">
                  {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
                </span>
              )}

              {/* Permanent sanction badge */}
              {excl?.isPermanent && (
                <span className="absolute -top-1 -right-1 text-[8px] bg-red-600 rounded-full w-3 h-3 flex items-center justify-center">
                  ✕
                </span>
              )}
            </button>
          )
        })}

        {lineup.length === 0 && (
          <p className="text-[9px] text-gray-600 text-center px-1 mt-4">
            Sin jugadores
          </p>
        )}
      </div>
    </div>
  )
}
