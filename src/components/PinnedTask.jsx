export default function PinnedTask({ task }) {
  if (!task) return null

  return (
    <div className="pinned-task">
      <span className="pin-icon">📌</span>
      <div>
        <div className="pinned-label">Pinned task</div>
        <div className="pinned-text">{task}</div>
      </div>
    </div>
  )
}
