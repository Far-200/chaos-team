import { useEffect, useRef, useState } from 'react'
import RoomHeader from './components/RoomHeader'
import PinnedTask from './components/PinnedTask'
import ChatFeed from './components/ChatFeed'
import StatsRail from './components/StatsRail'
import Composer from './components/Composer'
import InterventionBar from './components/InterventionBar'
import { buildIncident } from './engine/buildIncident'
import { buildPostmortem } from './engine/buildPostmortem'
import { INITIAL_STATS, mergeDeltas } from './engine/stats'
import { buildCustomReactionSteps } from './engine/buildReactions'
import './App.css'

export default function App() {
  const [phase, setPhase] = useState('idle') // idle | running | done
  const [task, setTask] = useState('')
  const [incident, setIncident] = useState(null)
  const [revealed, setRevealed] = useState([])
  const [typingAgentId, setTypingAgentId] = useState(null)
  const [awaitingIntervention, setAwaitingIntervention] = useState(false)
  const [postmortem, setPostmortem] = useState(null)

  const incidentRef = useRef(null)
  incidentRef.current = incident

  const eventIdRef = useRef(0)
  const idxRef = useRef(0)
  const statsRef = useRef(INITIAL_STATS)
  const cancelledRef = useRef(false)
  const handledInterventionsRef = useRef(new Set())
  const activeTimersRef = useRef([])

  function scheduleTimer(fn, ms) {
    const id = setTimeout(() => {
      activeTimersRef.current = activeTimersRef.current.filter((t) => t !== id)
      fn()
    }, ms)
    activeTimersRef.current.push(id)
    return id
  }

  function clearAllTimers() {
    activeTimersRef.current.forEach((id) => clearTimeout(id))
    activeTimersRef.current = []
  }

  function appendEvent(ev) {
    const newStats = mergeDeltas(statsRef.current, ev.deltas)
    statsRef.current = newStats
    setRevealed((prev) => [...prev, { ...ev, stats: newStats, revealedAt: Date.now() }])
  }

  function pushSystemEvent(text) {
    appendEvent({ id: `sys-${eventIdRef.current++}`, kind: 'system', text, deltas: {} })
  }

  function finishIncident() {
    const current = incidentRef.current
    setPostmortem(
      buildPostmortem({
        task: current.task,
        finalStats: statsRef.current,
        participating: current.participating,
        category: current.category,
        arithmetic: current.arithmetic,
      })
    )
    setTypingAgentId(null)
    setPhase('done')
  }

  // Plays the pre-built event list one beat at a time, reading state only
  // from refs so it can be paused (intervention) and resumed from outside,
  // or fast-forwarded (skip) without racing React's render cycle.
  function playNext() {
    if (cancelledRef.current) return
    const current = incidentRef.current
    if (!current) return
    const idx = idxRef.current

    if (idx >= current.events.length) {
      finishIncident()
      return
    }

    if (current.interventionPoints.includes(idx) && !handledInterventionsRef.current.has(idx)) {
      handledInterventionsRef.current.add(idx)
      setTypingAgentId(null)
      pushSystemEvent('The team pauses, waiting on you.')
      setAwaitingIntervention(true)
      return
    }

    const ev = current.events[idx]
    const isAgent = ev.kind === 'agent'
    if (isAgent) setTypingAgentId(ev.agentId)

    scheduleTimer(() => {
      setTypingAgentId(null)
      appendEvent(ev)
      idxRef.current = idx + 1
      scheduleTimer(playNext, ev.postMs)
    }, isAgent ? ev.typingMs : 0)
  }

  function handleInterventionSubmit(messageText, preset) {
    const message = messageText.trim()
    if (!message) return

    setAwaitingIntervention(false)
    appendEvent({ id: `user-${eventIdRef.current++}`, kind: 'user', text: message, deltas: preset ? preset.deltas : { chaos: 2 } })

    // Presets carry a scripted step sequence (agent lines and/or system
    // lines); custom messages fall back to a generic persona reaction.
    const steps = preset ? preset.steps : buildCustomReactionSteps(incidentRef.current.seed, idxRef.current)
    let delay = 700

    steps.forEach((step, i) => {
      const isLast = i === steps.length - 1

      if (step.system) {
        scheduleTimer(() => {
          pushSystemEvent(step.system)
          if (isLast) {
            scheduleTimer(() => {
              if (!cancelledRef.current) playNext()
            }, 900)
          }
        }, delay)
        delay += 800
        return
      }

      scheduleTimer(() => {
        setTypingAgentId(step.agentId)
        scheduleTimer(() => {
          setTypingAgentId(null)
          appendEvent({
            id: `reaction-${eventIdRef.current++}`,
            kind: 'agent',
            agentId: step.agentId,
            text: step.text,
            deltas: {},
          })
          if (isLast) {
            scheduleTimer(() => {
              if (!cancelledRef.current) playNext()
            }, 900)
          }
        }, 600)
      }, delay)
      delay += 1250
    })
  }

  function handleDeploy() {
    const built = buildIncident(task.trim())
    eventIdRef.current = 0
    idxRef.current = 0
    statsRef.current = INITIAL_STATS
    handledInterventionsRef.current = new Set()
    cancelledRef.current = false
    setIncident(built)
    setRevealed([])
    setPostmortem(null)
    setTypingAgentId(null)
    setAwaitingIntervention(false)
    setPhase('running')
  }

  function handleReset() {
    cancelledRef.current = true
    clearAllTimers()
    setPhase('idle')
    setTask('')
    setIncident(null)
    setRevealed([])
    setTypingAgentId(null)
    setAwaitingIntervention(false)
    setPostmortem(null)
  }

  function handleSkip() {
    const current = incidentRef.current
    if (phase !== 'running' || !current) return

    cancelledRef.current = true
    clearAllTimers()
    setAwaitingIntervention(false)
    setTypingAgentId(null)

    let idx = idxRef.current
    let stats = statsRef.current
    const extra = []
    for (; idx < current.events.length; idx++) {
      const ev = current.events[idx]
      stats = mergeDeltas(stats, ev.deltas)
      extra.push({ ...ev, stats, revealedAt: Date.now() })
    }
    statsRef.current = stats
    idxRef.current = idx

    if (extra.length) setRevealed((prev) => [...prev, ...extra])
    setPostmortem(
      buildPostmortem({
        task: current.task,
        finalStats: stats,
        participating: current.participating,
        category: current.category,
        arithmetic: current.arithmetic,
      })
    )
    setPhase('done')
  }

  // Kicks off (or tears down) the scheduler exactly once per deployed incident.
  useEffect(() => {
    if (!incident) return
    cancelledRef.current = false
    playNext()
    return () => {
      cancelledRef.current = true
      clearAllTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incident])

  const currentStats = revealed.length > 0 ? revealed[revealed.length - 1].stats : INITIAL_STATS
  const participating = incident ? incident.participating : null

  return (
    <div className="app-shell">
      <div className="room-shell">
        <RoomHeader
          phase={phase}
          participating={participating}
          postmortemStatus={postmortem ? postmortem.status : null}
        />
        <PinnedTask task={incident ? incident.task : null} category={incident ? incident.category : null} />

        <div className={`room-main${phase !== 'running' ? ' room-main-full' : ''}`}>
          <ChatFeed
            events={revealed}
            typingAgentId={typingAgentId}
            phase={phase}
            task={incident ? incident.task : task}
            category={incident ? incident.category : null}
            postmortem={postmortem}
            finalStats={currentStats}
            onReset={handleReset}
          />
          {phase === 'running' && <StatsRail stats={currentStats} />}
        </div>

        {phase === 'idle' && <Composer task={task} onTaskChange={setTask} onDeploy={handleDeploy} />}

        {phase === 'running' && !awaitingIntervention && (
          <div className="running-bar">
            <span className="running-dot" />
            Incident in progress
            <button className="skip-btn" onClick={handleSkip}>
              Skip to end
            </button>
            <button className="abort-btn" onClick={handleReset}>
              Abort
            </button>
          </div>
        )}

        {phase === 'running' && awaitingIntervention && (
          <InterventionBar onSubmit={handleInterventionSubmit} onSkip={handleSkip} />
        )}
      </div>
    </div>
  )
}
