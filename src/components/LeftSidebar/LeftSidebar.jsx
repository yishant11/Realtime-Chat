
import db from '../../../instantdb/config';
import './LeftSidebar.css';

const userId = Math.random().toString(36).slice(2, 6);

const randomDarkColor =
  '#' +
  [0, 0, 0]
    .map(() =>
      Math.floor(Math.random() * 200)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');
const user = {
  id: userId,
  name: `${userId}`,
  color: randomDarkColor,
};

const room = db.room('test', '1234');

function LeftSidebar() {
  room.useSyncPresence(user);

  const presence = room.usePresence();

  const { active, inputProps } = room.useTypingIndicator('chat');

  const peers = Object.values(presence.peers).filter((p) => p.id);
  const activeMap = Object.fromEntries(
    active.map((activePeer) => [activePeer.id, activePeer]),
  );

  return (
    <div className="sidebar-container">
      <div className="peers-container">
        {peers.map((peer) => {
          return (
            <div
              key={peer.id}
              className="peer-avatar"
              style={{
                borderColor: peer.color,
              }}
            >
              {peer.name?.slice(0, 1)}
              {activeMap[peer.id] ? (
                <div className="typing-indicator">
                  ⋯
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="message-container">
        <textarea
          placeholder="Compose your message here..."
          className="message-input"
          onKeyDown={(e) => inputProps.onKeyDown(e)}
          onBlur={() => inputProps.onBlur()}
        />
        <div className="typing-info">
          {active.length ? typingInfo(active) : <>&nbsp;</>}
        </div>
      </div>
    </div>
  );
}

function typingInfo(typing) {
  if (typing.length === 0) return null;
  if (typing.length === 1) return `${typing[0].name} is typing...`;
  if (typing.length === 2)
    return `${typing[0].name} and ${typing[1].name} are typing...`;

  return `${typing[0].name} and ${typing.length - 1} others are typing...`;
}

export default LeftSidebar;
