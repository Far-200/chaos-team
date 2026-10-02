export default function PinnedTask({ task, category }) {
  if (!task) return null

  return (
    <div className="pinned-task">
      <span className="pin-icon">📌</span>
      <div>
        <div className="pinned-head">
          <span className="pinned-label">Pinned incident</span>
          {category && <span className="pinned-category">{category}</span>}
        </div>
        <div className="pinned-text">{task}</div>
      </div>
    </div>
  )
}
