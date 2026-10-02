import { TASK_PRESETS } from '../data/presets'

export default function Composer({ task, onTaskChange, onDeploy }) {
  function handleSurprise() {
    const pick = TASK_PRESETS[Math.floor(Math.random() * TASK_PRESETS.length)]
    onTaskChange(pick)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (task.trim()) onDeploy()
  }

  return (
    <div className="composer-area">
      <div className="composer-presets">
        {TASK_PRESETS.map((p) => (
          <button type="button" key={p} className="preset-chip" onClick={() => onTaskChange(p)}>
            {p}
          </button>
        ))}
        <button type="button" className="preset-chip surprise" onClick={handleSurprise}>
          🎲 Surprise me
        </button>
      </div>
      <form className="composer" onSubmit={handleSubmit}>
        <input
          className="composer-input"
          type="text"
          placeholder="Describe a tiny task, e.g. Center the login button"
          value={task}
          onChange={(e) => onTaskChange(e.target.value)}
        />
        <button type="submit" className="composer-send" disabled={!task.trim()}>
          🚀 Deploy
        </button>
      </form>
    </div>
  )
}
