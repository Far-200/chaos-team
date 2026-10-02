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
import { AGENT_REACTIONS } from './data/userReplies'
import { AGENTS } from './data/agents'
import { randInt, pickRandom } from './engine/utils'
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
    appendEvent({ id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, kind: 'system', text, deltas: {} })
  }

  function finishIncident() {
    const current = incidentRef.current
    setPostmortem(buildPostmortem({ task: current.task, finalStats: statsRef.current, participating: current.participating }))
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

  function buildReactions(preset) {
    if (preset && preset.reaction) return [preset.reaction]

    const first = pickRandom(AGENTS)
    const reactions = [{ agentId: first.id, text: pickRandom(AGENT_REACTIONS[first.id]) }]
    if (Math.random() < 0.3) {
      let second = pickRandom(AGENTS)
      while (second.id === first.id) second = pickRandom(AGENTS)
      reactions.push({ agentId: second.id, text: pickRandom(AGENT_REACTIONS[second.id]) })
    }
    return reactions
  }

  function handleInterventionSubmit(messageText, preset) {
    const message = messageText.trim()
    if (!message) return

    setAwaitingIntervention(false)
    appendEvent({ id: `user-${Date.now()}`, kind: 'user', text: message, deltas: preset ? preset.deltas : { chaos: 2 } })

    const reactions = buildReactions(preset)
    let delay = randInt(500, 900)

    reactions.forEach((reaction, i) => {
      scheduleTimer(() => {
        setTypingAgentId(reaction.agentId)
        scheduleTimer(() => {
          setTypingAgentId(null)
          appendEvent({
            id: `reaction-${Date.now()}-${i}`,
            kind: 'agent',
            agentId: reaction.agentId,
            text: reaction.text,
            deltas: {},
          })
          if (i === reactions.length - 1) {
            scheduleTimer(() => {
              if (!cancelledRef.current) playNext()
            }, randInt(700, 1100))
          }
        }, randInt(450, 750))
      }, delay)
      delay += randInt(1000, 1500)
    })
  }

  function handleDeploy() {
    const built = buildIncident(task.trim())
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
    setPostmortem(buildPostmortem({ task: current.task, finalStats: stats, participating: current.participating }))
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
        <PinnedTask task={incident ? incident.task : null} />

        <div className={`room-main${phase !== 'running' ? ' room-main-full' : ''}`}>
          <ChatFeed
            events={revealed}
            typingAgentId={typingAgentId}
            phase={phase}
            task={incident ? incident.task : task}
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
