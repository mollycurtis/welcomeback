'use client';

import { useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { MAIL, type Mail } from '@/lib/mailData';
import { useMail } from '@/store/mail';
import { useSystem } from '@/store/system';
import { sounds } from '@/lib/sounds';

type Menu = 'File' | 'Edit' | 'View' | 'Tools' | 'Help';
const MENUS: Record<Menu, { label: string; note: string }[]> = {
  File:  [{ label: 'New Message', note: 'This account is not connected to a mail server.' },
          { label: 'Print', note: 'No printer is installed.' },
          { label: 'Work Offline', note: 'WelcomeMail is already working offline.' }],
  Edit:  [{ label: 'Find Message', note: 'Type a word in the search box above the list.' },
          { label: 'Mark All as Read', note: 'mark' }],
  View:  [{ label: 'Sort by Date', note: 'Messages are already sorted newest first.' },
          { label: 'Preview Pane', note: 'The preview pane is already shown.' }],
  Tools: [{ label: 'Send and Receive', note: 'Could not connect. Check that you are connected to the Internet.' },
          { label: 'Address Book', note: 'The address book is empty.' }],
  Help:  [{ label: 'About WelcomeMail', note: 'WelcomeMail 4.2 for Homestead OS. Registered to The Curtis Family.' }],
};

export default function WelcomeMail({}: AppWindowProps) {
  const [selected, setSelected] = useState<string | null>('m1');
  const [menu, setMenu] = useState<Menu | null>(null);
  const [query, setQuery] = useState('');
  const read = useMail((s) => s.read);
  const markRead = useMail((s) => s.markRead);
  const alert = useSystem((s) => s.alert);

  const list = MAIL.filter((m) => !query || (m.subject + ' ' + m.from + ' ' + m.body.join(' ')).toLowerCase().includes(query.toLowerCase()));
  const msg = MAIL.find((m) => m.id === selected) ?? null;
  const unread = MAIL.filter((m) => m.unread && !read.includes(m.id)).length;

  const openMsg = (m: Mail) => { sounds.blip(); setSelected(m.id); if (m.unread) markRead(m.id); };
  const runItem = (it: { label: string; note: string }) => {
    setMenu(null); sounds.click();
    if (it.note === 'mark') { MAIL.forEach((m) => markRead(m.id)); return; }
    alert(it.label, it.note);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#d4d0c8', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, Verdana, sans-serif' }}
      onClick={() => menu && setMenu(null)}>
      <div style={{ display: 'flex', gap: 2, padding: '2px 4px', fontSize: 11, borderBottom: '1px solid #9a968e', position: 'relative' }}>
        {(Object.keys(MENUS) as Menu[]).map((m) => (
          <div key={m} style={{ position: 'relative' }}>
            <span onClick={(e) => { e.stopPropagation(); sounds.click(); setMenu(menu === m ? null : m); }}
              style={{ padding: '1px 6px', cursor: 'default', background: menu === m ? '#0a246a' : 'transparent', color: menu === m ? '#fff' : '#000' }}>{m}</span>
            {menu === m && (
              <div onClick={(e) => e.stopPropagation()}
                style={{ position: 'absolute', top: '100%', left: 0, zIndex: 20, background: '#d4d0c8', border: '2px outset #f2f2ec', minWidth: 160, padding: 2, boxShadow: '2px 2px 0 rgba(0,0,0,0.35)' }}>
                {MENUS[m].map((it) => (
                  <div key={it.label} onClick={() => runItem(it)}
                    style={{ padding: '3px 18px', fontSize: 11, cursor: 'default' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#0a246a'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}>
                    {it.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find"
          style={{ fontSize: 11, border: '2px inset #e8e8e2', padding: '1px 5px', width: 130, fontFamily: 'inherit' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, margin: 4 }}>
        <div style={{ height: '40%', background: '#fff', border: '2px inset #e8e8e2', overflowY: 'auto' }}>
          <div style={{ display: 'flex', fontSize: 10, fontWeight: 700, background: '#d4d0c8', borderBottom: '1px solid #9a968e', position: 'sticky', top: 0 }}>
            <div style={{ flex: '0 0 130px', padding: '2px 5px', borderRight: '1px solid #9a968e' }}>From</div>
            <div style={{ flex: 1, padding: '2px 5px', borderRight: '1px solid #9a968e' }}>Subject</div>
            <div style={{ flex: '0 0 140px', padding: '2px 5px' }}>Received</div>
          </div>
          {list.length === 0 && <div style={{ padding: 8, fontSize: 11, color: '#666' }}>No messages match.</div>}
          {list.map((m) => {
            const on = selected === m.id; const bold = !!m.unread && !read.includes(m.id);
            return (
              <div key={m.id} onClick={() => openMsg(m)}
                style={{ display: 'flex', fontSize: 11, cursor: 'pointer', background: on ? '#0a246a' : 'transparent', color: on ? '#fff' : '#000', fontWeight: bold ? 700 : 400 }}>
                <div style={{ flex: '0 0 130px', padding: '2px 5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.from}</div>
                <div style={{ flex: 1, padding: '2px 5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
                <div style={{ flex: '0 0 140px', padding: '2px 5px', whiteSpace: 'nowrap' }}>{m.date}</div>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, marginTop: 4, background: '#fff', border: '2px inset #e8e8e2', overflowY: 'auto', minHeight: 0 }}>
          {!msg ? <div style={{ padding: 10, fontSize: 11, color: '#666' }}>No message selected.</div> : (
            <div style={{ padding: 8 }}>
              <div style={{ fontSize: 11, borderBottom: '1px solid #d7d7d0', paddingBottom: 5, marginBottom: 6 }}>
                <div><b>From:</b> {msg.from} &lt;{msg.fromAddr}&gt;</div>
                <div><b>To:</b> {msg.to ?? 'macgruber7@quickmail.net'}</div>
                <div><b>Subject:</b> {msg.subject}</div>
                <div><b>Date:</b> {msg.date}</div>
              </div>
              <div style={{ fontFamily: '"Courier New", monospace', fontSize: 12, lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>{msg.body.join('\n')}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ fontSize: 10, padding: '2px 8px', borderTop: '1px solid #9a968e', display: 'flex', justifyContent: 'space-between' }}>
        <span>{MAIL.length} messages</span><span>{unread} unread</span>
      </div>
    </div>
  );
}
