function chaosColor(chaos) {
  if (chaos < 35) return 'var(--success)'
  if (chaos < 70) return 'var(--warning)'
  return 'var(--danger)'
}

export default function StatsRail({ stats, variant = 'rail' }) {
  const { chaos, files, tests, branches, tokens, sanity } = stats

  const metrics = [
    { value: files, label: 'files changed' },
    { value: tests, label: 'tests broken' },
    { value: branches, label: 'branches created' },
    { value: tokens.toLocaleString(), label: 'tokens burned' },
  ]

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
          <div className="meter-fill" style={{ width: `${sanity}%`, background: 'var(--accent)' }} />
        </div>
      </div>

      {variant === 'summary' ? (
        <div className="report-metrics">
          {metrics.map((m) => (
            <div className="report-metric" key={m.label}>
              <div className="report-metric-value">{m.value}</div>
              <div className="report-metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stat-tiles">
          {metrics.map((m) => (
            <div className="stat-tile" key={m.label}>
              <span className="stat-value">{m.value}</span>
              <span className="stat-key">{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
