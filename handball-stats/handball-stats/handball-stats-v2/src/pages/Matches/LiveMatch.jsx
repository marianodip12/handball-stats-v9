import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import useMatchStore from '@/store/matchStore'
import { useMatch } from '@/hooks/useMatch'
import { useTimer } from '@/hooks/useTimer'

import Scoreboard from '@/components/match/Scoreboard'
import PlayerSidebar from '@/components/match/PlayerSidebar'
import LineupManager from '@/components/match/LineupManager'
import CourtView from '@/components/court/CourtView'
import { Modal, Button, Spinner } from '@/components/ui'
import {
  SancionesPanel,
  AtaquePanel,
  DefensaPanel,
  ShotResultPanel,
} from '@/components/match/EventPanel'

export default function LiveMatch() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { match, loading, logEvent, syncTimer, setPlayerOnCourt } = useMatch(id)

  const store = useMatchStore()
  const {
    isRunning, isInterrupted,
    selectedPlayerId, selectedZone,
    activePanel, setActivePanel,
    startTimer, pauseTimer, resume,
    clearEventBuilder, flipCourt, courtFlipped,
    homeTeam, awayTeam, homeLineup, awayLineup, selectedTeamSide,
    status,
  } = store

  const [showLineup, setShowLineup] = useState(null)  // 'home' | 'away' | null
  const [showShotResult, setShowShotResult] = useState(false)
  const [syncInterval, setSyncInterval] = useState(null)

  // Periodic sync to Supabase
  useEffect(() => {
    const iv = setInterval(syncTimer, 10_000)
    setSyncInterval(iv)
    return () => clearInterval(iv)
  }, [syncTimer])

  const handleTimerPress = () => {
    if (isRunning) pauseTimer()
    else if (isInterrupted) resume()
    else startTimer()
  }

  const handleZoneSelect = (zone) => {
    store.selectZone(zone)
    // If player already selected, prompt shot result
    if (selectedPlayerId && zone) setShowShotResult(true)
  }

  const handleShotResult = async (result) => {
    const s = useMatchStore.getState()
    const team = s.selectedTeamSide === 'home' ? s.homeTeam : s.awayTeam
    const oppSide = s.selectedTeamSide === 'home' ? 'away' : 'home'
    const oppLineup = oppSide === 'home' ? s.homeLineup : s.awayLineup
    const gk = oppLineup.find(p => p.isGoalkeeper)

    await logEvent({
      event_type: 'shot',
      team_id: team?.id,
      player_id: s.selectedPlayerId,
      goalkeeper_id: gk?.id ?? null,
      zone: s.selectedZone,
      goal_section: s.selectedGoalSection,
      shot_result: result,
    })

    setShowShotResult(false)
    clearEventBuilder()
    resume()
  }

  const handlePanelLog = async (eventData) => {
    await logEvent(eventData)
    clearEventBuilder()
    resume()
  }

  const panelTitle = {
    sanciones: 'Sanciones',
    ataque:    'Ataque',
    defensa:   'Defensa',
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <Spinner size={10} />
        <p className="text-gray-400">Cargando partido...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-court-bg overflow-hidden">
      {/* ── Scoreboard ──────────────────────────── */}
      <Scoreboard onPressTimer={handleTimerPress} />

      {/* ── Main body ───────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Player sidebar */}
        <PlayerSidebar />

        {/* Court + action area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Court */}
          <div className="relative flex-1">
            <CourtView
              selectedZone={selectedZone}
              onZoneSelect={handleZoneSelect}
              flipped={courtFlipped}
              className="h-full"
            />

            {/* Interruption overlay label */}
            {isInterrupted && (
              <div className="absolute left-0 right-0 top-[48%] pointer-events-none">
                <p className="text-brand-secondary text-center text-sm font-bold tracking-wide
                              bg-court-bg/70 py-1">
                  Interrupción de juego
                </p>
              </div>
            )}

            {/* Top-right controls */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={flipCourt}
                className="bg-white/10 rounded-full p-1.5 text-gray-300 hover:bg-white/20 text-xs"
                title="Girar cancha"
              >
                ↔
              </button>
            </div>
          </div>

          {/* ── Bottom action bar ─────────────────── */}
          <div className="bg-court-surface border-t border-white/10">
            {/* Lineup row */}
            <div className="flex justify-between px-3 py-1.5 border-b border-white/5 text-xs">
              <button
                onClick={() => setShowLineup('home')}
                className="text-gray-400 hover:text-white"
              >
                👥 {homeTeam?.short_name ?? 'Local'} ({homeLineup.length})
              </button>
              <button
                onClick={() => setShowLineup('away')}
                className="text-gray-400 hover:text-white"
              >
                👥 {awayTeam?.short_name ?? 'Visit.'} ({awayLineup.length})
              </button>
            </div>

            {/* Action panels selector */}
            <div className="grid grid-cols-3 gap-0 border-b border-white/5">
              {['sanciones', 'ataque', 'defensa'].map(panel => (
                <button
                  key={panel}
                  onClick={() => setActivePanel(activePanel === panel ? 'none' : panel)}
                  className={clsx(
                    'py-2.5 text-sm font-semibold capitalize transition-all border-r last:border-r-0 border-white/5',
                    activePanel === panel
                      ? 'bg-brand-primary/20 text-brand-primary'
                      : 'text-gray-400 hover:text-white',
                  )}
                >
                  {panel.charAt(0).toUpperCase() + panel.slice(1)}
                </button>
              ))}
            </div>

            {/* Expanded panel */}
            {activePanel !== 'none' && (
              <div className="p-3 max-h-64 overflow-y-auto">
                {activePanel === 'sanciones' && (
                  <SancionesPanel
                    onLog={handlePanelLog}
                    onClose={() => setActivePanel('none')}
                  />
                )}
                {activePanel === 'ataque' && (
                  <AtaquePanel
                    onLog={handlePanelLog}
                    onClose={() => setActivePanel('none')}
                  />
                )}
                {activePanel === 'defensa' && (
                  <DefensaPanel
                    onLog={handlePanelLog}
                    onClose={() => setActivePanel('none')}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Shot result modal ───────────────────── */}
      <Modal
        isOpen={showShotResult}
        onClose={() => { setShowShotResult(false); clearEventBuilder() }}
        title="Resultado del tiro"
        size="md"
      >
        <ShotResultPanel
          onSelect={handleShotResult}
          onClose={() => { setShowShotResult(false); clearEventBuilder() }}
        />
      </Modal>

      {/* ── Lineup manager modals ───────────────── */}
      {showLineup === 'home' && homeTeam && (
        <LineupManager
          isOpen
          onClose={() => setShowLineup(null)}
          side="home"
          teamId={homeTeam.id}
          onSave={(players) =>
            players.forEach(p => setPlayerOnCourt(p.id, homeTeam.id, p.isGoalkeeper, true))
          }
        />
      )}
      {showLineup === 'away' && awayTeam && (
        <LineupManager
          isOpen
          onClose={() => setShowLineup(null)}
          side="away"
          teamId={awayTeam.id}
          onSave={(players) =>
            players.forEach(p => setPlayerOnCourt(p.id, awayTeam.id, p.isGoalkeeper, true))
          }
        />
      )}
    </div>
  )
}
