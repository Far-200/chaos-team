import { useEffect, useRef } from 'react'
import { AGENTS } from '../data/agents'
import MessageText from './MessageText'
import PostmortemCard from './PostmortemCard'

const AGENT_MAP = Object.fromEntries(AGENTS.map((a) => [a.id, a]))
const USER_PROFILE = { id: 'user', name: 'You', emoji: '🧑‍💻', color: '#f0f6fc' }

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

// Consecutive messages from the same sender (agent or the user) collapse
// into one visual group, mirroring how a real chat room avoids repeating
// the avatar/name every line.
function groupEvents(events) {
  const groups = []
  for (const ev of events) {
    const bucketKey = ev.kind === 'agent' ? ev.agentId : ev.kind === 'user' ? 'user' : null
    const last = groups[groups.length - 1]
    if (bucketKey && last && last.bucketKey === bucketKey) {
      last.items.push(ev)
    } else if (bucketKey) {
      groups.push({ kind: ev.kind, bucketKey, agentId: bucketKey, items: [ev] })
    } else {
      groups.push({ kind: ev.kind, items: [ev] })
    }
  }
  return groups
}

function TypingDots() {
  return (
    <span className="typing-dots">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </span>
  )
}

export default function ChatFeed({ events, typingAgentId, phase, task, postmortem, finalStats, onReset }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [events.length, typingAgentId, postmortem])

  const groups = groupEvents(events)
  const lastGroup = groups[groups.length - 1]
  const typingJoinsLastGroup =
    Boolean(typingAgentId) && lastGroup && lastGroup.kind === 'agent' && lastGroup.agentId === typingAgentId

  return (
    <div className="chat-feed" ref={scrollRef}>
      {groups.length === 0 && !typingAgentId && (
        <div className="chat-empty">
          <p>No incidents yet.</p>
          <p className="chat-empty-sub">Describe a tiny task below and deploy the team.</p>
        </div>
      )}

      {groups.map((group, gi) => {
        if (group.kind === 'system') {
          const ev = group.items[0]
          return (
            <div key={ev.id} className="event-system">
              <span>{ev.text}</span>
            </div>
          )
        }

        if (group.kind === 'climax') {
          const ev = group.items[0]
          return (
            <div key={ev.id} className="event-climax">
              <span className="climax-icon">🚨</span>
              <span>{ev.text}</span>
            </div>
          )
        }

        const isSelf = group.kind === 'user'
        const profile = isSelf ? USER_PROFILE : AGENT_MAP[group.agentId]
        const showTypingHere = !isSelf && typingJoinsLastGroup && gi === groups.length - 1

        return (
          <div key={group.items[0].id} className={`message-row${isSelf ? ' message-row-self' : ''}`}>
            <span className="msg-avatar" style={{ background: profile.color }}>
              {profile.emoji}
            </span>
            <div className="message-col">
              <div className="message-meta">
                <span className="msg-name" style={{ color: isSelf ? undefined : profile.color }}>
                  {profile.name}
                </span>
                <span className="msg-time">{formatTime(group.items[0].revealedAt)}</span>
              </div>
              {group.items.map((ev) => (
                <div
                  key={ev.id}
                  className={`bubble${isSelf ? ' bubble-self' : ''}`}
                  style={isSelf ? undefined : { borderLeftColor: profile.color }}
                >
                  <MessageText text={ev.text} />
                </div>
              ))}
              {showTypingHere && (
                <div className="bubble bubble-typing" style={{ borderLeftColor: profile.color }}>
                  <TypingDots />
                </div>
              )}
            </div>
          </div>
        )
      })}

      {typingAgentId && !typingJoinsLastGroup && (
        <div className="message-row">
          <span className="msg-avatar" style={{ background: AGENT_MAP[typingAgentId].color }}>
            {AGENT_MAP[typingAgentId].emoji}
          </span>
          <div className="message-col">
            <div className="message-meta">
              <span className="msg-name" style={{ color: AGENT_MAP[typingAgentId].color }}>
                {AGENT_MAP[typingAgentId].name}
              </span>
            </div>
            <div className="bubble bubble-typing" style={{ borderLeftColor: AGENT_MAP[typingAgentId].color }}>
              <TypingDots />
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && postmortem && (
        <PostmortemCard task={task} postmortem={postmortem} finalStats={finalStats} onReset={onReset} />
      )}
    </div>
  )
}
