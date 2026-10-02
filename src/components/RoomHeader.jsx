import { AGENTS } from '../data/agents'

const STATUS_CONFIG = {
  idle: { label: 'Awaiting incident', dot: 'dot-idle' },
  running: { label: 'Live incident', dot: 'dot-live' },
  resolved: { label: 'Resolved', dot: 'dot-resolved' },
  'resolved-ish': { label: 'Resolved (technically)', dot: 'dot-warn' },
  unresolved: { label: 'Unresolved', dot: 'dot-danger' },
}

export default function RoomHeader({ phase, participating, postmortemStatus }) {
  const roster = participating && participating.length ? participating : AGENTS
  const statusKey = phase === 'done' ? postmortemStatus : phase
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.idle

  return (
    <header className="room-header">
      <div className="room-title-group">
        <div className="room-title">
          <span className="room-hash">#</span>
          <h1>chaos-team</h1>
        </div>
        <span className="room-subtitle">Incident response room</span>
      </div>
      <div className="room-meta">
        <div className="avatar-stack">
          {roster.map((a) => (
            <span key={a.id} className="avatar-chip" style={{ borderColor: a.color }} title={a.name}>
              {a.emoji}
            </span>
          ))}
        </div>
        <span className="agent-count">{roster.length} agents</span>
        <span className="room-meta-divider" />
        <span className={`status-pill ${status.dot}`}>
          <span className="status-dot" />
          {status.label}
        </span>
      </div>
    </header>
  )
}
