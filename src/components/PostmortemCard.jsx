import StatsRail from './StatsRail'

const STATUS_CLASS = {
  resolved: 'status-resolved',
  'resolved-ish': 'status-resolved-ish',
  unresolved: 'status-unresolved',
}

export default function PostmortemCard({ task, postmortem, finalStats, onReset }) {
  return (
    <div className="postmortem-card">
      <div className="postmortem-card-header">
        <span className="postmortem-bot-avatar">🪦</span>
        <div>
          <div className="postmortem-bot-name">
            Incident Bot <span className="bot-tag">BOT</span>
          </div>
          <div className="postmortem-bot-sub">posted a postmortem</div>
        </div>
      </div>

      <div className="postmortem-body">
        <h3>Postmortem: "{task}"</h3>
        <span className={`status-badge ${STATUS_CLASS[postmortem.status]}`}>{postmortem.statusLabel}</span>

        <StatsRail stats={finalStats} variant="summary" />

        <h4>Root causes</h4>
        <ul className="root-causes">
          {postmortem.rootCauses.map((cause, i) => (
            <li key={i}>{cause}</li>
          ))}
        </ul>

        <p className="postmortem-closing">{postmortem.closing}</p>

        <button className="deploy-btn" onClick={onReset}>
          🔁 New Incident
        </button>
      </div>
    </div>
  )
}
