/* eslint-disable react/jsx-key */

export type IconName =
  | 'folder' | 'docs' | 'pictures' | 'recycle' | 'recycleFull'
  | 'globe' | 'paint' | 'notepad' | 'cards' | 'mine' | 'monitor'
  | 'house' | 'snow' | 'paw' | 'sparkle' | 'pencil' | 'fish'
  | 'warn' | 'question' | 'info' | 'lock' | 'user' | 'key'
  | 'sunrise' | 'speaker' | 'speakerOff' | 'file' | 'pinball'
  | 'petville' | 'mapleGrove' | 'ifind' | 'finn' | 'penguinCove'
  | 'calc' | 'mail' | 'chat' | 'calendar' | 'typing';

function art(name: IconName) {
  switch (name) {
    case 'folder':
      return (
        <>
          <rect x="1" y="3" width="7" height="3" fill="#7a5b1a" />
          <rect x="1" y="5" width="14" height="9" fill="#7a5b1a" />
          <rect x="2" y="4" width="5" height="2" fill="#f3d264" />
          <rect x="2" y="6" width="12" height="7" fill="#f3d264" />
          <rect x="2" y="6" width="12" height="1" fill="#fbe89a" />
        </>
      );
    case 'docs':
      return (
        <>
          <rect x="8" y="1" width="6" height="8" fill="#5a5a5a" />
          <rect x="9" y="2" width="4" height="6" fill="#ffffff" />
          <rect x="10" y="3" width="2" height="1" fill="#9aa0a6" />
          <rect x="10" y="5" width="2" height="1" fill="#9aa0a6" />
          <rect x="1" y="4" width="7" height="3" fill="#7a5b1a" />
          <rect x="1" y="6" width="14" height="8" fill="#7a5b1a" />
          <rect x="2" y="5" width="5" height="2" fill="#f3d264" />
          <rect x="2" y="7" width="12" height="6" fill="#f3d264" />
          <rect x="2" y="7" width="12" height="1" fill="#fbe89a" />
        </>
      );
    case 'pictures':
      return (
        <>
          <rect x="1" y="3" width="7" height="3" fill="#7a5b1a" />
          <rect x="1" y="5" width="14" height="9" fill="#7a5b1a" />
          <rect x="2" y="4" width="5" height="2" fill="#f3d264" />
          <rect x="2" y="6" width="12" height="7" fill="#f3d264" />
          <rect x="4" y="7" width="8" height="5" fill="#8ecae6" />
          <rect x="5" y="9" width="3" height="3" fill="#4a8a3c" />
          <rect x="8" y="10" width="3" height="2" fill="#5a9e4b" />
          <rect x="9" y="8" width="2" height="2" fill="#ffd54a" />
        </>
      );
    case 'recycle':
    case 'recycleFull':
      return (
        <>
          {name === 'recycleFull' && (
            <>
              <rect x="5" y="1" width="3" height="3" fill="#ffffff" />
              <rect x="9" y="2" width="2" height="2" fill="#e8e8e8" />
            </>
          )}
          <rect x="3" y="3" width="10" height="2" fill="#5a6066" />
          <rect x="4" y="5" width="8" height="9" fill="#9aa0a6" />
          <rect x="4" y="5" width="8" height="1" fill="#c4c9ce" />
          <rect x="5" y="6" width="1" height="7" fill="#7d838a" />
          <rect x="8" y="6" width="1" height="7" fill="#7d838a" />
          <rect x="11" y="6" width="1" height="7" fill="#7d838a" />
          <rect x="6" y="8" width="4" height="1" fill="#2e8b57" />
          <rect x="6" y="10" width="4" height="1" fill="#2e8b57" />
        </>
      );
    case 'globe':
      return (
        <>
          <circle cx="8" cy="8" r="6.5" fill="#1a4a7a" />
          <circle cx="8" cy="8" r="5.5" fill="#3a82c4" />
          <rect x="4" y="4" width="3" height="2" fill="#4a8a3c" />
          <rect x="9" y="6" width="3" height="3" fill="#4a8a3c" />
          <rect x="5" y="9" width="3" height="2" fill="#4a8a3c" />
          <rect x="2.5" y="7.5" width="11" height="1" fill="#6fb1e8" opacity="0.8" />
        </>
      );
    case 'paint':
      return (
        <>
          <rect x="11" y="1" width="2" height="3" fill="#8a8a8a" />
          <rect x="10" y="4" width="2" height="3" fill="#c4a35a" />
          <rect x="9" y="7" width="2" height="2" fill="#6b4a2a" />
          <rect x="2" y="5" width="12" height="9" rx="3" fill="#c98a4b" />
          <rect x="3" y="6" width="10" height="1" fill="#e0a866" />
          <circle cx="5" cy="8" r="1.2" fill="#d8332a" />
          <circle cx="8" cy="7.5" r="1.2" fill="#2a52d8" />
          <circle cx="5.5" cy="11" r="1.2" fill="#f3c94b" />
          <circle cx="9" cy="11.5" r="1.2" fill="#3f9e3a" />
          <rect x="11" y="9" width="2" height="3" fill="#7a4a22" />
        </>
      );
    case 'notepad':
      return (
        <>
          <rect x="3" y="1" width="10" height="14" fill="#5a5a5a" />
          <rect x="4" y="2" width="8" height="12" fill="#ffffff" />
          <rect x="4" y="2" width="8" height="2" fill="#3a6ea5" />
          <rect x="5" y="6" width="6" height="1" fill="#9aa0a6" />
          <rect x="5" y="8" width="6" height="1" fill="#9aa0a6" />
          <rect x="5" y="10" width="4" height="1" fill="#9aa0a6" />
        </>
      );
    case 'pinball':
      return (
        <>
          <rect x="2" y="1" width="12" height="14" rx="2" fill="#2a3a5c" />
          <rect x="3" y="2" width="10" height="12" rx="1" fill="#3a5276" />
          <circle cx="8" cy="5" r="2" fill="#d8332a" />
          <circle cx="8" cy="5" r="0.8" fill="#ffd0c0" />
          <circle cx="10.5" cy="9" r="1.7" fill="#e8e8f0" />
          <circle cx="10" cy="8.4" r="0.5" fill="#ffffff" />
          <rect x="3.4" y="11.4" width="4" height="1.6" rx="0.8" fill="#f3c94b" transform="rotate(24 3.4 11.4)" />
          <rect x="8.6" y="13" width="4" height="1.6" rx="0.8" fill="#f3c94b" transform="rotate(-24 12.6 13)" />
        </>
      );
    case 'file':
      return (
        <>
          <rect x="3" y="1" width="10" height="14" fill="#5a5a5a" />
          <rect x="4" y="2" width="8" height="12" fill="#ffffff" />
          <rect x="5" y="4" width="6" height="1" fill="#9aa0a6" />
          <rect x="5" y="6" width="6" height="1" fill="#9aa0a6" />
          <rect x="5" y="8" width="6" height="1" fill="#9aa0a6" />
          <rect x="5" y="10" width="4" height="1" fill="#9aa0a6" />
        </>
      );
    case 'cards':
      return (
        <>
          <rect x="3" y="2" width="8" height="10" fill="#5a5a5a" />
          <rect x="4" y="3" width="6" height="8" fill="#ffffff" />
          <rect x="6" y="5" width="2" height="2" fill="#d8332a" />
          <rect x="5" y="6" width="4" height="1" fill="#d8332a" />
          <rect x="6" y="6" width="2" height="2" fill="#d8332a" />
          <rect x="6" y="4" width="8" height="10" fill="#5a5a5a" />
          <rect x="7" y="5" width="6" height="8" fill="#ffffff" />
          <rect x="9" y="7" width="2" height="2" fill="#111111" />
          <rect x="8" y="8" width="4" height="2" fill="#111111" />
          <rect x="9" y="10" width="2" height="2" fill="#111111" />
        </>
      );
    case 'mine':
      return (
        <>
          <rect x="7" y="2" width="2" height="3" fill="#222222" />
          <rect x="7" y="12" width="2" height="2" fill="#222222" />
          <rect x="2" y="7" width="3" height="2" fill="#222222" />
          <rect x="11" y="7" width="3" height="2" fill="#222222" />
          <circle cx="8" cy="8" r="4" fill="#222222" />
          <rect x="6" y="6" width="2" height="2" fill="#6f6f6f" />
        </>
      );
    case 'monitor':
      return (
        <>
          <rect x="1" y="2" width="14" height="10" fill="#6b6b6b" />
          <rect x="2" y="3" width="12" height="8" fill="#3a6ea5" />
          <rect x="3" y="4" width="10" height="2" fill="#6f9fd0" />
          <rect x="6" y="12" width="4" height="1" fill="#4a4a4a" />
          <rect x="4" y="13" width="8" height="2" fill="#8a8a8a" />
        </>
      );
    case 'house':
      return (
        <>
          <rect x="7" y="2" width="2" height="2" fill="#8a2f2f" />
          <rect x="5" y="4" width="6" height="2" fill="#a13838" />
          <rect x="3" y="6" width="10" height="2" fill="#8a2f2f" />
          <rect x="4" y="8" width="8" height="6" fill="#e0b96f" />
          <rect x="7" y="10" width="2" height="4" fill="#6b4a2a" />
          <rect x="5" y="9" width="2" height="2" fill="#8ecae6" />
          <rect x="10" y="9" width="2" height="2" fill="#8ecae6" />
        </>
      );
    case 'snow':
      return (
        <>
          <rect x="7" y="1" width="2" height="14" fill="#bfe8ff" />
          <rect x="1" y="7" width="14" height="2" fill="#bfe8ff" />
          <rect x="3" y="3" width="2" height="2" fill="#bfe8ff" />
          <rect x="11" y="3" width="2" height="2" fill="#bfe8ff" />
          <rect x="3" y="11" width="2" height="2" fill="#bfe8ff" />
          <rect x="11" y="11" width="2" height="2" fill="#bfe8ff" />
          <rect x="7" y="7" width="2" height="2" fill="#ffffff" />
        </>
      );
    case 'paw':
      return (
        <>
          <circle cx="4" cy="5" r="1.6" fill="#8a5a3b" />
          <circle cx="8" cy="3.5" r="1.6" fill="#8a5a3b" />
          <circle cx="12" cy="5" r="1.6" fill="#8a5a3b" />
          <ellipse cx="8" cy="10" rx="4.5" ry="3.6" fill="#8a5a3b" />
          <ellipse cx="8" cy="10.5" rx="2.6" ry="2" fill="#b8743a" />
        </>
      );
    case 'sparkle':
      return (
        <>
          <rect x="7" y="1" width="2" height="6" fill="#ff7ec4" />
          <rect x="7" y="9" width="2" height="6" fill="#ff7ec4" />
          <rect x="1" y="7" width="6" height="2" fill="#ff7ec4" />
          <rect x="9" y="7" width="6" height="2" fill="#ff7ec4" />
          <rect x="7" y="7" width="2" height="2" fill="#ffffff" />
          <rect x="12" y="2" width="2" height="2" fill="#ffc6e6" />
          <rect x="2" y="12" width="2" height="2" fill="#ffc6e6" />
        </>
      );
    case 'pencil':
      return (
        <>
          <rect x="1" y="7" width="1" height="3" fill="#e08a9a" />
          <rect x="2" y="7" width="1" height="3" fill="#c0c0c0" />
          <rect x="3" y="7" width="9" height="3" fill="#f3c94b" />
          <rect x="3" y="8" width="9" height="1" fill="#d9a92e" />
          <rect x="12" y="7" width="2" height="3" fill="#e7b083" />
          <rect x="14" y="8" width="1" height="1" fill="#333333" />
        </>
      );
    case 'fish':
      return (
        <>
          <polygon points="11,8 15,4.5 15,11.5" fill="#e0903e" />
          <ellipse cx="7" cy="8" rx="5" ry="3.4" fill="#ffb45e" />
          <ellipse cx="7" cy="7" rx="4" ry="1.6" fill="#ffd29a" />
          <circle cx="4.5" cy="7" r="1" fill="#ffffff" />
          <circle cx="4.5" cy="7" r="0.5" fill="#111111" />
          <polygon points="6,5 8,3 9,5" fill="#e0903e" />
        </>
      );
    case 'warn':
      return (
        <>
          <polygon points="8,1.5 15,14 1,14" fill="#f7d11e" stroke="#7a5b1a" strokeWidth="1" />
          <rect x="7" y="5" width="2" height="5" fill="#1a1a1a" />
          <rect x="7" y="11.5" width="2" height="1.5" fill="#1a1a1a" />
        </>
      );
    case 'question':
      return (
        <>
          <circle cx="8" cy="8" r="7" fill="#3a6ea5" />
          <rect x="5" y="4" width="6" height="2" fill="#ffffff" />
          <rect x="9" y="6" width="2" height="2" fill="#ffffff" />
          <rect x="7" y="8" width="3" height="2" fill="#ffffff" />
          <rect x="7" y="12" width="2" height="2" fill="#ffffff" />
        </>
      );
    case 'info':
      return (
        <>
          <circle cx="8" cy="8" r="7" fill="#3a6ea5" />
          <rect x="7" y="4" width="2" height="2" fill="#ffffff" />
          <rect x="7" y="7" width="2" height="5" fill="#ffffff" />
        </>
      );
    case 'lock':
      return (
        <>
          <rect x="5" y="2" width="6" height="2" fill="#9a8a4a" />
          <rect x="5" y="3" width="2" height="5" fill="#9a8a4a" />
          <rect x="9" y="3" width="2" height="5" fill="#9a8a4a" />
          <rect x="3" y="7" width="10" height="7" fill="#7a5b1a" />
          <rect x="4" y="8" width="8" height="5" fill="#e0b13e" />
          <rect x="7" y="9" width="2" height="3" fill="#6b4a1a" />
        </>
      );
    case 'user':
      return (
        <>
          <circle cx="8" cy="5.5" r="3.2" fill="#f1c27d" />
          <rect x="6.8" y="2" width="2.4" height="1.4" fill="#6b4a2a" />
          <rect x="3" y="10" width="10" height="5" rx="2" fill="#3a6ea5" />
          <rect x="3" y="10" width="10" height="1.4" rx="0.7" fill="#5d8fc4" />
        </>
      );
    case 'key':
      return (
        <>
          <circle cx="5" cy="8" r="3" fill="none" stroke="#e0b13e" strokeWidth="2" />
          <rect x="7" y="7" width="7" height="2" fill="#e0b13e" />
          <rect x="11" y="9" width="1.4" height="2" fill="#e0b13e" />
          <rect x="13" y="9" width="1.4" height="2.6" fill="#e0b13e" />
        </>
      );
    case 'sunrise':
      return (
        <>
          <rect x="7" y="1" width="2" height="3" fill="#ffd54a" />
          <rect x="1" y="6" width="3" height="2" fill="#ffd54a" />
          <rect x="12" y="6" width="3" height="2" fill="#ffd54a" />
          <rect x="3" y="2.6" width="2" height="2" fill="#ffd54a" />
          <rect x="11" y="2.6" width="2" height="2" fill="#ffd54a" />
          <circle cx="8" cy="9" r="4" fill="#ffd54a" />
          <path d="M0,11 Q5,8 9,10.5 T16,10 L16,16 L0,16 Z" fill="#4a8a3c" />
          <path d="M0,13 Q6,11 11,13 T16,12.5 L16,16 L0,16 Z" fill="#3f7d33" />
        </>
      );
    case 'speaker':
    case 'speakerOff':
      return (
        <>
          <polygon points="2,6 5,6 9,2.5 9,13.5 5,10 2,10" fill="#3a3a3a" />
          {name === 'speaker' ? (
            <>
              <rect x="11" y="6" width="1.4" height="4" fill="#3a3a3a" />
              <rect x="13.4" y="4.6" width="1.4" height="6.8" fill="#3a3a3a" />
            </>
          ) : (
            <>
              <rect x="10.5" y="5" width="1.6" height="1.6" fill="#c0392b" />
              <rect x="12.1" y="6.6" width="1.6" height="1.6" fill="#c0392b" />
              <rect x="13.7" y="8.2" width="1.6" height="1.6" fill="#c0392b" />
              <rect x="13.7" y="5" width="1.6" height="1.6" fill="#c0392b" />
              <rect x="12.1" y="6.6" width="1.6" height="1.6" fill="#c0392b" />
              <rect x="10.5" y="8.2" width="1.6" height="1.6" fill="#c0392b" />
            </>
          )}
        </>
      );
    case 'calc':
      return (
        <>
          <rect x="3" y="1" width="10" height="14" fill="#6b7280" />
          <rect x="4" y="2" width="8" height="12" fill="#cfd4da" />
          <rect x="5" y="3" width="6" height="3" fill="#1f3a2e" />
          <rect x="5" y="3" width="6" height="1" fill="#2f5c47" />
          <rect x="5" y="7" width="2" height="2" fill="#7b8794" />
          <rect x="8" y="7" width="2" height="2" fill="#7b8794" />
          <rect x="5" y="10" width="2" height="2" fill="#7b8794" />
          <rect x="8" y="10" width="2" height="2" fill="#c0392b" />
        </>
      );
    case 'mail':
      return (
        <>
          <rect x="1" y="4" width="14" height="9" fill="#e9eef3" />
          <rect x="1" y="4" width="14" height="9" fill="none" stroke="#6b7280" />
          <rect x="1" y="4" width="14" height="1" fill="#c7d2dd" />
          <rect x="2" y="5" width="2" height="1" fill="#4a7fb5" />
          <rect x="4" y="6" width="2" height="1" fill="#4a7fb5" />
          <rect x="6" y="7" width="4" height="1" fill="#4a7fb5" />
          <rect x="10" y="6" width="2" height="1" fill="#4a7fb5" />
          <rect x="12" y="5" width="2" height="1" fill="#4a7fb5" />
        </>
      );
    case 'chat':
      return (
        <>
          <rect x="1" y="2" width="10" height="7" fill="#f3f6fa" stroke="#4a7fb5" />
          <rect x="3" y="9" width="2" height="2" fill="#f3f6fa" />
          <rect x="3" y="4" width="6" height="1" fill="#7b8794" />
          <rect x="3" y="6" width="4" height="1" fill="#7b8794" />
          <rect x="6" y="7" width="9" height="6" fill="#dff0dc" stroke="#4a8a3a" />
          <rect x="8" y="9" width="5" height="1" fill="#4a8a3a" />
          <rect x="8" y="11" width="3" height="1" fill="#4a8a3a" />
        </>
      );
    case 'typing':
      return (
        <>
          <rect x="1" y="5" width="14" height="8" fill="#cfd4da" stroke="#6b7280" />
          <rect x="2" y="6" width="2" height="2" fill="#4a5560" />
          <rect x="5" y="6" width="2" height="2" fill="#4a5560" />
          <rect x="8" y="6" width="2" height="2" fill="#4a5560" />
          <rect x="11" y="6" width="2" height="2" fill="#4a5560" />
          <rect x="3" y="9" width="2" height="2" fill="#4a5560" />
          <rect x="6" y="9" width="4" height="2" fill="#4a5560" />
          <rect x="11" y="9" width="2" height="2" fill="#4a5560" />
          <rect x="6" y="1" width="4" height="3" fill="#fff" stroke="#6b7280" />
          <rect x="7" y="2" width="2" height="1" fill="#2a7a34" />
        </>
      );
    case 'calendar':
      return (
        <>
          <rect x="2" y="2" width="12" height="12" fill="#ffffff" stroke="#6b7280" />
          <rect x="2" y="2" width="12" height="3" fill="#c0392b" />
          <rect x="4" y="1" width="1" height="3" fill="#6b7280" />
          <rect x="11" y="1" width="1" height="3" fill="#6b7280" />
          <rect x="4" y="7" width="2" height="2" fill="#9aa0a6" />
          <rect x="7" y="7" width="2" height="2" fill="#9aa0a6" />
          <rect x="10" y="7" width="2" height="2" fill="#f0a030" />
          <rect x="4" y="10" width="2" height="2" fill="#9aa0a6" />
          <rect x="7" y="10" width="2" height="2" fill="#9aa0a6" />
        </>
      );
    default:
      return null;
  }
}

const IMAGE_ICONS: Partial<Record<IconName, string>> = {
  cards: '/icons/solitaire.png',
  mine: '/icons/minesweeper.png',
  pinball: '/icons/pinball.png',
  petville: '/icons/petville.png',
  mapleGrove: '/icons/maple-grove.png',
  ifind: '/icons/ifind.png',
  finn: '/icons/finn-the-fish.png',
  penguinCove: '/icons/penguin-cove.png',
  docs: '/icons/my-documents.png',
  pictures: '/icons/my-pictures.png',
  recycle: '/icons/recycle-empty.png',
  recycleFull: '/icons/recycle-full.png',
  monitor: '/icons/computer.png',
  globe: '/icons/worldwindow.png',
  mail: '/icons/welcomemail.png',
  chat: '/icons/chatterbox.png',
  calc: '/icons/calculator.png',
  calendar: '/icons/calendar.png',
  paint: '/icons/scribble.png',
  notepad: '/icons/notepad.png',
  typing: '/icons/typeright.png',
  folder: '/icons/folder.png',
  file: '/icons/document.png',
  lock: '/icons/document-locked.png',
};

export function Icon({
  name,
  size = 32,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const img = IMAGE_ICONS[name];
  if (img) {
    return (
      <img
        src={img}
        width={size}
        height={size}
        className={className ? 'ic ' + className : 'ic'}
        style={{ imageRendering: 'auto', objectFit: 'contain', display: 'inline-block' }}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className ? 'ic ' + className : 'ic'}
      aria-hidden="true"
    >
      {art(name)}
    </svg>
  );
}
