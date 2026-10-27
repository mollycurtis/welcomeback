'use client';

import { APPS, type AppId } from '@/lib/registry';
import { useSave } from '@/store/save';

export const MACHINE = {
  os: 'Homestead OS',
  edition: 'Family Edition',
  version: '4.2.1180',
  manufacturer: 'Welcome Computer Co.',
  model: 'Homestead 500',
  processor: 'Vantage 1.2 GHz',
  memory: '256 MB RAM',
  disk: '40 GB',
  diskFree: '11.4 GB free',
  display: '15 inch CRT, 800x600',
  optical: 'CD-RW / DVD-ROM',
  computerName: 'FAMILY-PC',
  owner: 'The Curtis Family',
  purchased: 'March 2002',
  lastUsed: 'June 2009',
};

const PROGRAM_ORDER: AppId[] = [
  'browser', 'mail', 'messenger', 'notepad', 'scribble',
  'calculator', 'calendar', 'solitaire', 'minefield', 'pinball',
];

export function SystemTab() {
  const soundOn = useSave((s) => s.soundOn);
  const programs = PROGRAM_ORDER.map((id) => APPS[id]?.title).filter(Boolean) as string[];

  const Block = ({ title, rows }: { title: string; rows: [string, string][] }) => (
    <section style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, borderBottom: '1px solid #b8b4a8', paddingBottom: 2, marginBottom: 3 }}>{title}</div>
      <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
        <colgroup><col style={{ width: 68 }} /><col /></colgroup>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td style={{ fontSize: 10.5, color: '#444', padding: '1px 0', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{k}</td>
              <td style={{ fontSize: 10.5, fontWeight: 700, padding: '1px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, height: '100%', minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
        <svg width="34" height="34" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
          <rect x="1" y="2" width="10" height="7" fill="#6b7280" />
          <rect x="2" y="3" width="8" height="5" fill="#2b4a6f" />
          <rect x="2" y="3" width="8" height="1" fill="#4a7fb5" />
          <rect x="4" y="9" width="4" height="1" fill="#6b7280" />
          <rect x="3" y="10" width="6" height="1" fill="#9aa0a6" />
          <rect x="11" y="4" width="4" height="9" fill="#cfd4da" />
          <rect x="12" y="5" width="2" height="1" fill="#6b7280" />
          <rect x="12" y="7" width="2" height="1" fill="#6b7280" />
          <rect x="12" y="11" width="1" height="1" fill="#3f9a3a" />
        </svg>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{MACHINE.os} <span style={{ fontWeight: 400, color: '#444' }}>{MACHINE.edition}</span></div>
          <div style={{ fontSize: 10, color: '#666' }}>Version {MACHINE.version} &middot; Registered to {MACHINE.owner}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
        <Block title="Computer" rows={[
          ['Name', MACHINE.computerName],
          ['Maker', MACHINE.manufacturer],
          ['Model', MACHINE.model],
          ['Purchased', MACHINE.purchased],
          ['Last used', MACHINE.lastUsed],
          ['Programs', String(programs.length)],
        ]} />
        <Block title="System" rows={[
          ['Processor', MACHINE.processor],
          ['Memory', MACHINE.memory],
          ['Hard disk', `${MACHINE.disk} (${MACHINE.diskFree})`],
          ['Optical', MACHINE.optical],
          ['Display', MACHINE.display],
          ['Sound', soundOn ? 'Enabled' : 'Muted'],
        ]} />
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 10, color: '#555', borderTop: '1px solid #c8c4b8', paddingTop: 6 }}>
        This computer has not been shut down properly since {MACHINE.lastUsed}.
      </div>
    </div>
  );
}

export default function AboutComputer() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#d4d0c8', padding: 12, fontFamily: 'Tahoma, Verdana, sans-serif' }}>
      <SystemTab />
    </div>
  );
}
