function chaosColor(chaos) {
  if (chaos < 35) return '#2ea043'
  if (chaos < 70) return '#d4a72c'
  return '#da3633'
}

export default function StatsRail({ stats, variant = 'rail' }) {
  const { chaos, files, tests, branches, tokens, sanity } = stats

  return (
    <div className={`stats-panel stats-${variant}`}>
      <div className="meter-row">
        <div className="meter-label">
          <span>Chaos</span>
          <span>{chaos}/100</span>
        </div>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${chaos}%`, background: chaosColor(chaos) }} />
        </div>
      </div>

      <div className="meter-row">
        <div className="meter-label">
          <span>Team sanity</span>
          <span>{sanity}/100</span>
        </div>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${sanity}%`, background: '#58a6ff' }} />
        </div>
      </div>

      <div className="stat-tiles">
        <div className="stat-tile">
          <span className="stat-value">{files}</span>
          <span className="stat-key">files changed</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{tests}</span>
          <span className="stat-key">tests broken</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{branches}</span>
          <span className="stat-key">branches created</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{tokens.toLocaleString()}</span>
          <span className="stat-key">tokens burned</span>
        </div>
      </div>
    </div>
  )
}
