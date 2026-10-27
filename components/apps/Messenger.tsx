'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { BUDDIES, MOBILE, MY_NAME } from '@/lib/chatterData';
import { pickReply } from '@/lib/chatterBrain';
import { useChatter } from '@/store/chatter';
import { sounds } from '@/lib/sounds';

function PhoneIcon({ color }: { color: string }) {
  return (
    <span title="Messaging from a cell phone" style={{ display: 'inline-flex', verticalAlign: '-1px', margin: '0 3px 0 1px', flex: '0 0 auto' }}>
      <svg width="7" height="11" viewBox="0 0 7 11" aria-label="on a cell phone" role="img">
        <rect x="0.6" y="0.6" width="5.8" height="9.8" rx="1.2" fill="none" stroke={color} strokeWidth="1.1" />
        <rect x="1.8" y="2" width="3.4" height="3.1" fill={color} />
        <circle cx="3.5" cy="8.1" r="0.8" fill={color} />
      </svg>
    </span>
  );
}

export default function Messenger({ props }: AppWindowProps) {
  const openWith = (props as { buddy?: string } | undefined)?.buddy ?? null;
  const [openId, setOpenId] = useState<string | null>(openWith);
  useEffect(() => { if (openWith) setOpenId(openWith); }, [openWith]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | null>(null);

  const st = useChatter();
  const buddy = BUDDIES.find((b) => b.id === openId) ?? null;
  const sessions = buddy ? st.sessions(buddy.id) : [];
  const lineCount = sessions.reduce((n, x) => n + x.lines.length, 0);
  const phoneNow = !!buddy && MOBILE.includes(buddy.id) && (st.threads[buddy.id] ?? []).some((l) => l.who === 'them');

  useEffect(() => { if (openId) st.markRead(openId); }, [openId, lineCount]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [lineCount, openId, typing]);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const send = () => {
    if (!buddy || !draft.trim() || typing) return;
    const text = draft.trim();
    const last = [...(st.threads[buddy.id] ?? [])].reverse().find((l) => l.who === 'them')?.text;
    st.send(buddy.id, text);
    setDraft('');
    sounds.blip();

    const reply = pickReply(buddy.id, text, new Set(st.used[buddy.id] ?? []), last);
    if (!reply) return;
    setTyping(true);
    const delay = Math.min(3200, 900 + reply.length * 28 + Math.random() * 500);
    timer.current = window.setTimeout(() => {
      st.receive(buddy.id, reply);
      st.markUsed(buddy.id, reply);
      st.setOnline(buddy.id);
      setTyping(false);
      sounds.ding();
    }, delay);
  };

  const dot = (id: string) => (st.online.includes(id) ? '#3f9a3a' : '#9aa0a6');

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#d4d0c8', display: 'flex', fontFamily: 'Tahoma, Verdana, sans-serif' }}>
      <div style={{ width: 176, flex: '0 0 176px', display: 'flex', flexDirection: 'column', margin: 4, marginRight: 0 }}>
        <div style={{ background: '#0a246a', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 6px' }}>
          Chatterbox - {MY_NAME}
        </div>
        <div style={{ flex: 1, background: '#fff', border: '2px inset #e8e8e2', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 6px', background: '#eceae4', borderBottom: '1px solid #d7d7d0' }}>
            Buddies ({st.online.length}/{BUDDIES.length} online)
          </div>
          {BUDDIES.map((b) => {
            const unread = st.unread.includes(b.id);
            const onPhone = MOBILE.includes(b.id) && (st.threads[b.id] ?? []).some((l) => l.who === 'them');
            return (
              <div key={b.id} onClick={() => { sounds.blip(); setOpenId(b.id); window.setTimeout(() => inputRef.current?.focus(), 0); }} title={b.real}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '3px 7px', fontSize: 11, cursor: 'pointer',
                  background: openId === b.id ? '#0a246a' : 'transparent',
                  color: openId === b.id ? '#fff' : '#000', fontWeight: unread ? 700 : 400,
                }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot(b.id), flex: '0 0 8px' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{b.screenName}</span>
                {onPhone && <PhoneIcon color={openId === b.id ? '#fff' : '#5a6b7f'} />}
                {unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d0342c', flex: '0 0 7px' }} />}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 10, padding: '2px 4px' }}>{st.online.length} of {BUDDIES.length} online</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: 4, minWidth: 0 }}>
        {!buddy ? (
          <div style={{ flex: 1, background: '#fff', border: '2px inset #e8e8e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 11, textAlign: 'center', padding: 14 }}>
            Click somebody in your buddy list to open the conversation.
          </div>
        ) : (
          <>
            <div style={{ background: '#0a246a', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{buddy.screenName}</span>
              <span style={{ fontWeight: 400, opacity: 0.85 }}>
                {phoneNow && <PhoneIcon color="#fff" />}{st.online.includes(buddy.id) ? (phoneNow ? 'On a cell phone' : 'Online') : 'Offline'}
              </span>
            </div>
            <div style={{ flex: 1, background: '#fff', border: '2px inset #e8e8e2', overflowY: 'auto', padding: 6, minHeight: 0 }}>
              {sessions.map((sess, si) => (
                <div key={si} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#8a8a8a', textAlign: 'center', margin: '2px 0 5px', borderTop: si ? '1px solid #eee' : 'none', paddingTop: si ? 6 : 0 }}>
                    {sess.date}
                  </div>
                  {sess.lines.map((l, i) => (
                    <div key={i} style={{ fontSize: 12, marginBottom: 3, lineHeight: 1.35 }}>
                      <b style={{ color: l.who === 'me' ? '#b02a1a' : '#12386e' }}>
                        {l.who === 'them' && sess.live && MOBILE.includes(buddy.id) && <PhoneIcon color="#12386e" />}
                        {l.who === 'me' ? MY_NAME : buddy.screenName}:
                      </b>{' '}
                      {l.text}
                    </div>
                  ))}
                </div>
              ))}
              {typing && <div style={{ fontSize: 10, color: '#8a8a8a', fontStyle: 'italic', marginTop: 4 }}>{buddy.screenName} is typing...</div>}
              <div ref={endRef} />
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
                onMouseDown={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                placeholder="Type a message"
                style={{ flex: 1, border: '2px inset #e8e8e2', padding: '3px 5px', fontSize: 12, fontFamily: 'inherit', minWidth: 0 }} />
              <button onClick={send} disabled={typing}
                style={{ background: '#d8d8d0', border: '2px outset #f2f2ec', padding: '3px 14px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
