'use client';

import { useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { sounds } from '@/lib/sounds';

interface Entry { day: number; text: string; kind: 'school' | 'family' | 'birthday' | 'pet' | 'holiday' | 'appt' | 'sport' | 'trip'; span?: number }

const YEAR = 2009;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const ENTRIES: Record<number, Entry[]> = {
  0: [
    { day: 1, text: 'New Year\u2019s Day - no school', kind: 'holiday' },
    { day: 2, text: 'No school', kind: 'school' },
    { day: 5, text: 'Back to school', kind: 'school' },
    { day: 9, text: 'MOM\u2019S BIRTHDAY', kind: 'birthday' },
    { day: 10, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 16, text: 'Tucker (thru Sun)', kind: 'pet' },
    { day: 19, text: 'MLK Day - no school', kind: 'holiday' },
    { day: 24, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 26, text: 'MARI\u2019S BIRTHDAY', kind: 'birthday' },
    { day: 27, text: 'Dentist 3:30 (both)', kind: 'appt' },
    { day: 31, text: 'SARAH\u2019S BIRTHDAY', kind: 'birthday' },
  ],
  1: [
    { day: 6, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 13, text: 'Valentine cards for class', kind: 'school' },
    { day: 14, text: 'Valentine\u2019s Day - Dad\u2019s treasure hunt', kind: 'family' },
    { day: 15, text: 'Daytona 500', kind: 'family' },
    { day: 16, text: 'Presidents Day - no school', kind: 'holiday' },
    { day: 20, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 21, text: 'Craft day w/ Mom', kind: 'family' },
    { day: 27, text: 'Tucker (thru Sun)', kind: 'pet' },
  ],
  2: [
    { day: 6, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 12, text: 'Doctor - Molly checkup 2pm', kind: 'appt' },
    { day: 14, text: 'Farkle night', kind: 'family' },
    { day: 15, text: 'GRANDMA\u2019S BIRTHDAY', kind: 'birthday' },
    { day: 20, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 23, text: 'Spring break - no school', kind: 'holiday', span: 5 },
    { day: 28, text: 'Grandma babysitting', kind: 'family' },
  ],
  3: [
    { day: 3, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 4, text: 'T-ball sign-up', kind: 'sport' },
    { day: 10, text: 'Good Friday - no school', kind: 'holiday' },
    { day: 12, text: 'Easter', kind: 'holiday' },
    { day: 17, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 21, text: 'Dentist 3:30 (Sarah)', kind: 'appt' },
    { day: 25, text: 'T-ball practice starts - Dad coaching', kind: 'sport' },
    { day: 29, text: 'T-ball practice 6pm', kind: 'sport' },
  ],
  4: [
    { day: 1, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 2, text: 'T-ball 9am', kind: 'sport' },
    { day: 6, text: 'T-ball practice 6pm', kind: 'sport' },
    { day: 8, text: 'Field trip - zoo', kind: 'school' },
    { day: 9, text: 'T-ball 9am', kind: 'sport' },
    { day: 10, text: 'Mother\u2019s Day', kind: 'holiday' },
    { day: 13, text: 'T-ball practice 6pm', kind: 'sport' },
    { day: 15, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 15, text: 'Father Daughter Dance 6:30', kind: 'school' },
    { day: 16, text: 'T-ball 9am', kind: 'sport' },
    { day: 22, text: 'Tucker (thru Sun)', kind: 'pet' },
    { day: 23, text: 'Sarah piano recital 2pm', kind: 'family' },
    { day: 25, text: 'Memorial Day - no school', kind: 'holiday' },
    { day: 30, text: 'The lake', kind: 'trip' },
  ],
  5: [
    { day: 2, text: 'Dentist 3:30', kind: 'appt' },
    { day: 5, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 6, text: 'T-ball 9am', kind: 'sport' },
    { day: 9, text: 'Book Fair - bring money', kind: 'school' },
    { day: 10, text: 'Science fair SETUP 3pm', kind: 'school' },
    { day: 11, text: 'SCIENCE FAIR 6pm', kind: 'school' },
    { day: 12, text: 'LAST DAY - half day', kind: 'school' },
    { day: 12, text: 'Tucker (thru Sun)', kind: 'pet' },
    { day: 14, text: 'Grandma calls', kind: 'family' },
    { day: 16, text: 'Swim practice starts (Tue/Thu)', kind: 'sport' },
    { day: 18, text: 'Swim 5pm', kind: 'sport' },
    { day: 19, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 20, text: 'Lemonade stand', kind: 'family' },
    { day: 21, text: 'Father\u2019s Day', kind: 'holiday' },
    { day: 23, text: 'Swim 5pm', kind: 'sport' },
    { day: 25, text: 'Swim 5pm', kind: 'sport' },
    { day: 27, text: 'The lake', kind: 'trip' },
  ],
  6: [
    { day: 3, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 4, text: 'Fireworks at the lake', kind: 'trip' },
    { day: 7, text: 'Swim 5pm', kind: 'sport' },
    { day: 9, text: 'Swim 5pm', kind: 'sport' },
    { day: 11, text: 'Camp Pepin - Mom and Sarah', kind: 'trip', span: 3 },
    { day: 17, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 18, text: 'NEIGHBORHOOD BLOCK PARTY - movie night', kind: 'family' },
    { day: 21, text: 'Swim 5pm', kind: 'sport' },
    { day: 24, text: 'Tucker (thru Sun)', kind: 'pet' },
    { day: 28, text: 'Drive to Grandma\u2019s (Fargo)', kind: 'trip' },
    { day: 31, text: 'Sarah piano 4pm', kind: 'sport' },
  ],
  7: [
    { day: 1, text: 'Five Flags with family', kind: 'trip' },
    { day: 4, text: 'Swim 5pm', kind: 'sport' },
    { day: 8, text: 'The lake', kind: 'trip' },
    { day: 14, text: 'GRANDPA\u2019S BIRTHDAY', kind: 'birthday' },
    { day: 14, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 20, text: 'Doctor - Sarah checkup 10am', kind: 'appt' },
    { day: 22, text: 'School supplies shopping', kind: 'school' },
    { day: 28, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 29, text: 'Tucker (thru Sun)', kind: 'pet' },
  ],
  8: [
    { day: 1, text: 'FIRST DAY OF SCHOOL', kind: 'school' },
    { day: 2, text: 'ALEX\u2019S BIRTHDAY', kind: 'birthday' },
    { day: 7, text: 'Labor Day - no school', kind: 'holiday' },
    { day: 11, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 12, text: 'Farkle night', kind: 'family' },
    { day: 18, text: 'Grandma babysitting', kind: 'family' },
    { day: 25, text: 'Sarah piano 4pm', kind: 'sport' },
  ],
  9: [
    { day: 1, text: 'Halloween decorations go up!', kind: 'family' },
    { day: 7, text: 'DAD\u2019S BIRTHDAY - make red velvet cupcakes', kind: 'birthday' },
    { day: 9, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 15, text: 'No school - teacher day', kind: 'school' },
    { day: 16, text: 'No school', kind: 'school' },
    { day: 17, text: 'Pumpkin patch', kind: 'trip' },
    { day: 23, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 24, text: 'Tucker (thru Sun)', kind: 'pet' },
    { day: 30, text: 'Halloween party at school', kind: 'school' },
    { day: 31, text: 'HALLOWEEN', kind: 'holiday' },
  ],
  10: [
    { day: 6, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 10, text: 'MOLLY\u2019S BIRTHDAY', kind: 'birthday' },
    { day: 11, text: 'Veterans Day - no school', kind: 'holiday' },
    { day: 14, text: 'Craft day w/ Mom', kind: 'family' },
    { day: 17, text: 'MADDIE\u2019S BIRTHDAY - sleepover', kind: 'birthday' },
    { day: 20, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 26, text: 'Thanksgiving - no school', kind: 'holiday' },
    { day: 27, text: 'No school', kind: 'school' },
    { day: 28, text: 'Grandma here', kind: 'family' },
  ],
  11: [
    { day: 4, text: 'Sarah piano 4pm', kind: 'sport' },
    { day: 5, text: 'Tucker (thru Sun)', kind: 'pet' },
    { day: 12, text: 'Sarah piano recital 2pm', kind: 'family' },
    { day: 18, text: 'Winter break - no school', kind: 'holiday', span: 14 },
    { day: 19, text: 'Christmas light show', kind: 'family' },
    { day: 24, text: 'Christmas Eve', kind: 'holiday' },
    { day: 25, text: 'Christmas', kind: 'holiday' },
    { day: 29, text: 'BREISHEN\u2019S BIRTHDAY', kind: 'birthday' },
    { day: 31, text: 'New Year\u2019s Eve', kind: 'holiday' },
  ],
};

const KIND_COLOR: Record<Entry['kind'], string> = {
  school: '#12386e',
  holiday: '#c0392b',
  family: '#2a6a34',
  birthday: '#a02060',
  pet: '#6a3fa0',
  appt: '#0e7c7b',
  sport: '#c9741a',
  trip: '#7a4a22',
};
const KIND_LABEL: Record<Entry['kind'], string> = {
  school: 'School', holiday: 'Holiday', family: 'Family', birthday: 'Birthday', pet: 'Tucker', appt: 'Appointment', sport: 'Practice', trip: 'Trip',
};

export default function Calendar({}: AppWindowProps) {
  const [month, setMonth] = useState(5);
  const [picked, setPicked] = useState<number | null>(null);

  const first = new Date(YEAR, month, 1).getDay();
  const days = new Date(YEAR, month + 1, 0).getDate();
  const entries = ENTRIES[month] ?? [];
  const forDay = (d: number) => entries.filter((e) => d >= e.day && d < e.day + (e.span ?? 1));
  const step = (n: number) => { sounds.blip(); setMonth((m) => Math.min(11, Math.max(0, m + n))); setPicked(null); };

  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#d4d0c8', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, Verdana, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px' }}>
        <button onClick={() => step(-1)} disabled={month === 0}
          style={{ background: '#d4d0c8', border: '2px outset #f4f4ee', padding: '1px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>&lt;</button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>{MONTHS[month]} {YEAR}</div>
        <button onClick={() => step(1)} disabled={month === 11}
          style={{ background: '#d4d0c8', border: '2px outset #f4f4ee', padding: '1px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>&gt;</button>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 5, padding: '0 6px 6px', minHeight: 0 }}>
        <div style={{ flex: 1, background: '#fff', border: '2px inset #e8e8e2', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#eceae4', borderBottom: '1px solid #9a968e' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, padding: '2px 0' }}>{d}</div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', minHeight: 0 }}>
            {cells.map((d, i) => {
              const es = d ? forDay(d) : [];
              const on = d !== null && picked === d;
              return (
                <div key={i}
                  onClick={() => { if (d) { sounds.blip(); setPicked(d); } }}
                  style={{
                    border: '1px solid #e4e2dc', padding: 2, cursor: d ? 'pointer' : 'default',
                    background: on ? '#0a246a' : d ? '#fff' : '#f4f3ef',
                    color: on ? '#fff' : '#000', overflow: 'hidden', minWidth: 0,
                  }}>
                  {d && <div style={{ fontSize: 10, fontWeight: es.length ? 700 : 400 }}>{d}</div>}
                  {es.slice(0, 2).map((e, j) => (
                    <div key={j} style={{
                      fontSize: 8, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      color: on ? '#cfe0ff' : KIND_COLOR[e.kind],
                    }}>{e.text}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ width: 160, flex: '0 0 160px', background: '#fff', border: '2px inset #e8e8e2', padding: 6, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 700, borderBottom: '1px solid #d7d7d0', paddingBottom: 3, marginBottom: 5 }}>
            {picked ? `${MONTHS[month]} ${picked}` : MONTHS[month]}
          </div>
          <div style={{ flex: 1 }}>
          {(picked ? forDay(picked) : entries).length === 0 ? (
            <div style={{ fontSize: 11, color: '#777' }}>Nothing written down.</div>
          ) : (
            (picked ? forDay(picked) : entries).map((e, i) => (
              <div key={i} style={{ fontSize: 11, marginBottom: 5, lineHeight: 1.3 }}>
                {!picked && <b style={{ color: '#555' }}>{e.span && e.span > 1 ? `${e.day}-${e.day + e.span - 1}` : e.day} </b>}
                <span style={{ color: KIND_COLOR[e.kind] }}>{e.text}</span>
              </div>
            ))
          )}
          </div>
          <div style={{ borderTop: '1px solid #d7d7d0', paddingTop: 4, marginTop: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px 6px' }}>
            {(Object.keys(KIND_COLOR) as Entry['kind'][]).filter((k) => k !== 'pet').map((k) => (
              <div key={k} style={{ fontSize: 9, color: KIND_COLOR[k], display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, background: KIND_COLOR[k], borderRadius: 2 }} />{KIND_LABEL[k]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
