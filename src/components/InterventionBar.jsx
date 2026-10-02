import { useState } from 'react'
import { USER_REPLY_PRESETS } from '../data/userReplies'

export default function InterventionBar({ onSubmit, onSkip }) {
  const [text, setText] = useState('')

  function handlePreset(preset) {
    onSubmit(preset.label, preset)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim()) {
      onSubmit(text.trim(), null)
      setText('')
    }
  }

  return (
    <div className="intervention-bar">
      <div className="intervention-label">
        <span className="intervention-dot" />
        The team has paused - say something
      </div>
      <div className="composer-presets">
        {USER_REPLY_PRESETS.map((p) => (
          <button type="button" key={p.id} className="preset-chip" onClick={() => handlePreset(p)}>
            {p.label}
          </button>
        ))}
      </div>
      <form className="composer" onSubmit={handleSubmit}>
        <input
          className="composer-input"
          type="text"
          placeholder="Or type your own reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <button type="submit" className="composer-send" disabled={!text.trim()}>
          Send
        </button>
      </form>
      <button type="button" className="skip-link" onClick={onSkip}>
        Skip to end instead
      </button>
    </div>
  )
}
