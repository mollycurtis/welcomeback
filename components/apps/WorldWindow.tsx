'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { useSave } from '@/store/save';
import { useSystem } from '@/store/system';
import { WORLDS } from '@/lib/worlds';
import { Icon } from '@/lib/icons';
import { sounds } from '@/lib/sounds';
import dynamic from 'next/dynamic';
const IFind = dynamic(() => import('./ifind/IFind'), { ssr: false, loading: () => <div style={{ padding: 20, fontFamily: 'Verdana, sans-serif', fontSize: 12 }}>Loading iFind...</div> });
const MapleGrove = dynamic(() => import('./maplegrove/MapleGrove'), { ssr: false, loading: () => <div style={{ padding: 20, fontFamily: 'Verdana, sans-serif', fontSize: 12 }}>Loading Maple Grove…</div> });
const Finn = dynamic(() => import('./finn/Finn'), { ssr: false, loading: () => <div style={{ padding: 20, fontFamily: 'Verdana, sans-serif', fontSize: 12 }}>Swimming...</div> });
import { searchFor, suggestQueries, resultByUrl, type SearchResult } from '@/lib/search';
import { LobbyPage, CursorsPage, QuizPage, HomeworkHQ, ArticlePage, articleByUrl, type HwPage } from './web/Pages';
import { LibrarySite, type LibraryPage } from './web/Library';
import { PieShoppeSite, type PiePage } from './web/PieShoppe';
import { GameFortSite, type FortPage } from './web/GameFort';

type Page =
  | { kind: 'home' }
  | { kind: 'world'; slug: string }
  | { kind: 'history' }
  | { kind: 'cursors' }
  | { kind: 'quiz' }
  | { kind: 'pie'; sub: PiePage }
  | { kind: 'fav' }
  | { kind: 'fort'; sub: FortPage }
  | { kind: 'homework'; sub: HwPage }
  | { kind: 'library'; sub: LibraryPage; query?: string }
  | { kind: 'article'; url: string }
  | { kind: 'search'; query: string }
  | { kind: 'engine' }
  | { kind: 'suggest' }
  | { kind: 'dead'; url: string }
  | { kind: 'mygame' }
  | { kind: 'broken'; url: string }
  | { kind: 'notfound'; url: string; vintage?: boolean; ring?: boolean };

const HOME_URL = 'www.thelobby.com';

const HISTORY_ENTRIES: Array<{ q: string; d: string }> = [
  { q: 'free online games no download', d: 'June 12, 2009' },
  { q: 'cheats for penguin cove', d: 'June 11, 2009' },
  { q: 'how to get unbanned from penguin cove', d: 'June 11, 2009' },
  { q: 'how to do a kickflip', d: 'June 10, 2009' },
  { q: 'what does g2g mean', d: 'June 9, 2009' },
  { q: 'is santa real serious answers only', d: 'June 9, 2009' },
  { q: 'how to convince your mom', d: 'June 8, 2009' },
  { q: 'world record most pizza', d: 'June 8, 2009' },
  { q: 'maze game', d: 'June 7, 2009' },
  { q: 'how to type faster', d: 'June 6, 2009' },
  { q: 'how to dog sit', d: 'June 5, 2009' },
  { q: 'can fish blink', d: 'June 4, 2009' },
  { q: 'best igloo layout', d: 'June 2, 2009' },
  { q: 'how to stay up til midnight', d: 'May 30, 2009' },
];

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

function canonOf(u: string): string {
  if (u === '' || u === 'home' || u === 'thelobby.com' || u === HOME_URL) return HOME_URL;
  if (u === 'suggest') return ENGINE + '/suggest';
  if (u.startsWith('search:')) return ENGINE + '/search?q=' + encodeURIComponent(u.slice(7)).replace(/%20/g, '+');
  return u;
}

const ENGINE = 'www.askbeeves.com';
const sub = (u: string, base: string) => (u.startsWith(base + '/') ? u.slice(base.length + 1) : u === base ? '' : null);

function resolve(u: string): Page {
  if (u === HOME_URL) return { kind: 'home' };
  const art = articleByUrl(u);
  if (art) return { kind: 'article', url: art.url };
  if (u === 'history' || u === 'worldwindow://history') return { kind: 'history' };
  const w = WORLDS.find((x) => x.url === u || x.url.replace('www.', '') === u);
  if (w) return { kind: 'world', slug: w.slug };
  const bare = u.replace(/^www\./, '');
  if (bare === 'coolcursors.com' || bare === 'cursorcastle.com') return { kind: 'cursors' };
  if (bare === 'quizfever.com' || u === 'quiz') return { kind: 'quiz' };
  const pie = sub(bare, 'italianpieshoppe.com');
  if (pie !== null) return { kind: 'pie', sub: (pie || 'home') as PiePage };
  if (u === 'favorites' || u === 'worldwindow://favorites') return { kind: 'fav' };
  const fort = sub(bare, 'gamefort.com');
  if (fort !== null && fort !== 'games/maze') return { kind: 'fort', sub: (fort || 'home') as FortPage };
  const hw = sub(bare, 'homeworkhelphq.com');
  if (hw !== null || u === 'search:homework help') return { kind: 'homework', sub: ((hw || 'home') as HwPage) };
  const lib = sub(bare, 'citylibrary.org');
  if (lib !== null) {
    if (lib.startsWith('search/')) return { kind: 'library', sub: 'search', query: decodeURIComponent(lib.slice(7)) };
    return { kind: 'library', sub: (lib || 'home') as LibraryPage };
  }
  if (u === 'webring') return { kind: 'notfound', url: 'the 2009 webring', ring: true };
  if (bare === 'askbeeves.com' || u === 'search') return { kind: 'engine' };
  if (u === 'suggest' || bare === 'askbeeves.com/suggest') return { kind: 'suggest' };
  const sq = bare.match(/^askbeeves\.com\/search\?q=(.*)$/);
  if (sq) {
    const query = decodeURIComponent(sq[1].replace(/\+/g, ' '));
    if (query === 'homework help') return { kind: 'homework', sub: 'home' };
    return { kind: 'search', query };
  }
  if (u.startsWith('search:')) return { kind: 'search', query: u.slice(7) };
  if (bare === 'geocities.com/sunnyhills/mygame') return { kind: 'mygame' };
  if (u.includes('forums.penguincove') || u.includes('bookreportsforfree') || u === 'www.petville.com/recover')
    return { kind: 'dead', url: u };
  if (bare === 'freewebs.com/themazegame') return { kind: 'broken', url: u } as Page;
  if (resultByUrl(u)?.state === 'broken') return { kind: 'broken', url: u };
  return { kind: 'notfound', url: u };
}

export default function WorldWindow({ props }: AppWindowProps) {
  const startUrl = canonOf(normalize(typeof props?.url === 'string' ? (props.url as string) : 'home'));

  const [stack, setStack] = useState<string[]>([startUrl]);
  const [idx, setIdx] = useState(0);
  const [addr, setAddr] = useState(startUrl);
  const [status, setStatus] = useState('Done');

  const hitCount = useSave((s) => s.hitCount);
  const bumpHitCount = useSave((s) => s.bumpHitCount);
  const alert = useSystem((s) => s.alert);
  const blocked = (what: string) => {
    sounds.error();
    const msg = what === 'download' ? 'You have been blocked from downloading.\n\nDownloads are disabled on this computer by the administrator.'
      : what === 'signup' ? 'Sign up blocked.\n\nCreating online accounts requires an administrator.'
      : what === 'login' ? 'Could not log in.\n\nNo GameFort account exists on this computer. Sign up is blocked by the administrator.'
      : what === 'contest' ? 'Blocked.\n\nEntering contests and giving out your phone number is disabled by the administrator.'
      : what === 'order' ? 'Online ordering blocked.\n\nAnything that costs money needs an administrator.\n\nCall 555-0142 instead.'
      : 'Blocked by the administrator.';
    void alert('Parental Controls', msg, 'error');
  };
  const bumped = useRef(false);

  const current = stack[idx] ?? HOME_URL;
  const page = resolve(current);

  useEffect(() => {
    if (page.kind === 'home' && !bumped.current) {
      bumped.current = true;
      bumpHitCount();
    }
  }, [page.kind, bumpHitCount]);

  const land = () => {
    setStatus('Done (' + (Math.random() * 2.4 + 0.7).toFixed(2) + ' seconds)');
  };

  const navigate = (raw: string) => {
    sounds.click();
    const canon = canonOf(normalize(raw));
    if (raw.startsWith('search:')) pushRecent(raw.slice(7));
    const next = [...stack.slice(0, idx + 1), canon];
    setStack(next);
    setIdx(next.length - 1);
    setAddr(canon);
    land();
  };

  const back = () => {
    if (idx <= 0) return;
    sounds.click();
    setIdx(idx - 1);
    setAddr(stack[idx - 1] ?? HOME_URL);
    land();
  };

  const forward = () => {
    if (idx >= stack.length - 1) return;
    sounds.click();
    setIdx(idx + 1);
    setAddr(stack[idx + 1] ?? HOME_URL);
    land();
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-1 p-1 win-noselect" style={{ borderBottom: '1px solid var(--shadow-dark)' }}>
        <button className="btn3d !px-2 text-[11px]" disabled={idx <= 0} onClick={back}>
          ◄ Back
        </button>
        <button className="btn3d !px-2 text-[11px]" disabled={idx >= stack.length - 1} onClick={forward}>
          Forward ►
        </button>
        <button className="btn3d !px-2 text-[11px]" onClick={() => navigate(HOME_URL)}>
          Home
        </button>
        <button className="btn3d !px-2 text-[11px]" onClick={() => navigate('history')}>
          History
        </button>
        <span className="text-[11px] pl-2 pr-1">Address</span>
        <input
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(addr)}
          className="bevel-in flex-1 px-2 py-0.5 text-[12px] outline-none"
          spellCheck={false}
        />
        <button className="btn3d !px-3 text-[11px]" onClick={() => navigate(addr)}>
          Go
        </button>
      </div>

      {!((page.kind === 'world' && (page.slug === 'maple' || page.slug === 'ifind' || page.slug === 'finn')) || (page.kind === 'fort' && ['maze', 'bubble', 'tank', 'dressup', 'stick', 'burger'].includes(page.sub))) && (
      <div className="flex items-center gap-2 px-2 py-1 text-[11px] win-noselect overflow-hidden" style={{ borderBottom: '1px solid var(--shadow-dark)' }}>
        <span className="font-bold shrink-0">★ Bookmarks:</span>
        <BookmarkBtn label="The Lobby" onClick={() => navigate(HOME_URL)} />
        <BookmarkBtn label="Bookmarks" onClick={() => navigate('favorites')} />
        <BookmarkBtn label="AskBeeves" onClick={() => navigate(ENGINE)} />
      </div>
      )}

      <div className="flex-1 overflow-auto bg-white relative">
        {page.kind === 'home' && (
          <LobbyPage hitCount={hitCount} navigate={navigate} search={<LobbySearch navigate={navigate} />} />
        )}
        {page.kind === 'world' && page.slug === 'maple' && <MapleGrove />}
        {page.kind === 'world' && page.slug === 'ifind' && <IFind />}
        {page.kind === 'world' && page.slug === 'finn' && <Finn />}
        {page.kind === 'world' && page.slug !== 'maple' && page.slug !== 'ifind' && page.slug !== 'finn' && (
          <WorldPage slug={page.slug} navigate={navigate} />
        )}
        {page.kind === 'history' && <HistoryPage navigate={navigate} />}
        {page.kind === 'cursors' && <CursorsPage navigate={navigate} onDownload={() => blocked('download')} />}
        {page.kind === 'quiz' && <QuizPage navigate={navigate} />}
        {page.kind === 'pie' && <PieShoppeSite page={page.sub} go={(p) => navigate('www.italianpieshoppe.com' + (p === 'home' ? '' : '/' + p))} back={() => navigate(HOME_URL)} onOrder={() => blocked('order')} />}
        {page.kind === 'fav' && <FavoritesPage navigate={navigate} />}
        {page.kind === 'fort' && <GameFortSite page={page.sub} go={(p) => navigate('www.gamefort.com' + (p === 'home' ? '' : '/' + p))} back={() => navigate(HOME_URL)} onBlocked={blocked} />}
        {page.kind === 'homework' && <HomeworkHQ page={page.sub} go={(p) => navigate('www.homeworkhelphq.com' + (p === 'home' ? '' : '/' + p))} navigate={navigate} />}
        {page.kind === 'library' && <LibrarySite page={page.sub} query={page.query} go={(p) => navigate('www.citylibrary.org' + (p === 'home' ? '' : p === 'search' ? '/search/holes' : '/' + p))} back={() => navigate(HOME_URL)} />}
        {page.kind === 'article' && articleByUrl(page.url) && <ArticlePage a={articleByUrl(page.url)!} navigate={navigate} />}
        {page.kind === 'engine' && <SearchEngine navigate={navigate} />}
        {page.kind === 'suggest' && <SuggestGameForm navigate={navigate} />}
        {page.kind === 'search' && <SearchResults query={page.query} navigate={navigate} />}
        {page.kind === 'dead' && <DeadPage url={page.url} navigate={navigate} />}
        {page.kind === 'broken' && <BrokenPage url={page.url} navigate={navigate} />}
        {page.kind === 'mygame' && <MyGamePage navigate={navigate} />}
        {page.kind === 'notfound' && <NotFoundPage page={page} navigate={navigate} />}
      </div>

      <div className="bevel-in flex items-center justify-between px-2 h-[20px] text-[11px] win-noselect" style={{ background: 'var(--face)' }}>
        <span>{status}</span>
        <span className="flex items-center gap-1">
          <Icon name="globe" size={12} /> Internet
        </span>
      </div>
    </div>
  );
}

function BookmarkBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="bg-transparent border-0 p-0 cursor-pointer text-[11px] hover:underline whitespace-nowrap"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

const WEB_FONT = { fontFamily: 'Verdana, Tahoma, sans-serif' };

function WorldPage({
  slug,
  navigate,
}: {
  slug: string;
  navigate: (u: string) => void;
}) {
  const w = WORLDS.find((x) => x.slug === slug);
  if (!w) return null;
  return (
    <div style={WEB_FONT} className="min-h-full flex flex-col">
      <div className="p-5 flex items-center gap-4" style={{ background: w.accent }}>
        <span className="bevel-thin p-2 inline-flex" style={{ background: 'rgba(255,255,255,0.92)' }}>
          <Icon name={w.icon} size={56} />
        </span>
        <div>
          <div
            className="font-bios text-4xl text-white tracking-wide"
            style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.35)' }}
          >
            {w.name}
          </div>
          <div className="text-white text-[12px] italic" style={{ opacity: 0.92 }}>
            {w.tag}
          </div>
        </div>
      </div>

      <div className="stripes h-4" />

      <div className="marquee-wrap bg-black text-[#ffd54a] font-bios text-lg py-1">
        <span className="marquee-inner">
          ★ UNDER CONSTRUCTION ★ {w.name.toUpperCase()} IS STILL BEING BUILT ★ CHECK BACK
          SOON ★ TELL YOUR FRIENDS ★
        </span>
      </div>

      <div className="flex-1 flex gap-4 p-5 text-[13px] leading-relaxed" style={{ alignItems: 'stretch' }}>
        <div className="bevel-thin p-5 flex flex-col justify-center" style={{ background: '#fffbe6', flex: '3 1 0' }}>
          <p className="font-bold text-[15px] mb-2">Do you remember a game from your childhood?</p>
          <p className="mb-3">Tell me about it. If I can bring it back, it might show up right here in Welcome Back.</p>
          <span className="link-1999 self-start" onClick={() => navigate('suggest')}>Tell me about your game →</span>
        </div>
        <div className="bevel-thin p-5 flex flex-col justify-center" style={{ background: '#f4f8ff', flex: '2 1 0' }}>
          <p className="font-bold text-[15px] mb-2">Play these games</p>
          {PLAYABLE.map((g) => (
            <div key={g.slug} className="flex items-center gap-2 py-1">
              <Icon name={g.icon} size={20} />
              <span className="link-1999" onClick={() => navigate(g.url)}>{g.name}</span>
            </div>
          ))}
          <div className="mt-3 pt-2" style={{ borderTop: '1px solid #d7deea' }}>
            <span className="link-1999" onClick={() => navigate(HOME_URL)}>
              ← back to The Lobby
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const PLAYABLE = ['finn', 'ifind', 'maple'].map((slug) => WORLDS.find((x) => x.slug === slug)!).filter(Boolean);

function HistoryPage({ navigate }: { navigate: (u: string) => void }) {
  return (
    <div className="p-5 text-[12px]" style={WEB_FONT}>
      <div className="font-bold text-[14px] mb-1">History</div>
      <div className="text-[11px] text-[#5a5a5a] mb-3">June 2009 (and earlier)</div>
      <ul className="space-y-1.5">
        {HISTORY_ENTRIES.map((e) => (
          <li key={e.q} className="flex gap-3">
            <span className="text-[#8a8a8a] w-[92px] shrink-0">{e.d}</span>
            <span className="link-1999 visited" onClick={() => navigate(firstHit(e.q))}>
              {e.q}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function firstHit(q: string): string {
  const entry = searchFor(q);
  const hit = entry?.results.find((r) => r.state !== 'dead' && !r.url.includes('penguincove'));
  if (q.toLowerCase().includes('penguin cove') || q.toLowerCase().includes('igloo')) return 'search:' + q;
  return hit ? hit.url : 'search:' + q;
}

const recentSearches: string[] = [];
function pushRecent(query: string) {
  const v = query.trim();
  if (!v || v.length > 60) return;
  const i = recentSearches.findIndex((x) => x.toLowerCase() === v.toLowerCase());
  if (i >= 0) recentSearches.splice(i, 1);
  recentSearches.unshift(v);
  if (recentSearches.length > 8) recentSearches.length = 8;
}

function SearchBox({
  initial,
  onSearch,
  width,
  autoFocus,
}: {
  initial?: string;
  onSearch: (q: string) => void;
  width?: number;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState(initial ?? '');
  const [open, setOpen] = useState(false);
  const typed = q.trim();
  const sugg = typed ? suggestQueries(q, 7) : recentSearches.slice(0, 6);

  const submit = (val?: string) => {
    const v = (val ?? q).trim();
    if (!v) return;
    setOpen(false);
    onSearch(v);
  };

  return (
    <div className="relative" style={{ width: width ?? 320 }}>
      <div className="flex gap-1">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
            else if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Ask me anything!"
          className="bevel-in px-2 py-1 text-[13px] outline-none flex-1 min-w-0"
          autoFocus={autoFocus}
        />
        <button className="btn3d" onMouseDown={(e) => e.preventDefault()} onClick={() => submit()}>
          Ask!
        </button>
      </div>
      {open && sugg.length > 0 && (
        <div
          className="absolute left-0 right-0 bevel-thin bg-white z-30 text-left overflow-hidden"
          style={{ top: '100%', marginTop: 2, boxShadow: '2px 3px 7px rgba(0,0,0,0.28)' }}
        >
          {!typed && (
            <div
              className="px-2 py-1 text-[10px] text-[#7a7a7a] win-noselect"
              style={{ borderBottom: '1px solid #e2e2e2', background: '#f6f6f6' }}
            >
              recent searches
            </div>
          )}
          {sugg.map((s) => (
            <div
              key={s}
              className="px-2 py-1 text-[12px] cursor-pointer win-noselect flex items-center gap-1.5 hover:bg-[#dce6f6]"
              onMouseDown={(e) => {
                e.preventDefault();
                submit(s);
              }}
            >
              <span className="text-[10px]" style={{ color: '#9a9a9a' }}>
                {typed ? '🔎' : '🕘'}
              </span>
              <span className="truncate">{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SuggestGameForm({ navigate }: { navigate: (u: string) => void }) {
  const [game, setGame] = useState('');
  const [mode, setMode] = useState<'play' | 'see' | 'remember'>('play');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  const submit = async () => {
    if (status === 'sending') return;
    if (!game.trim() && !details.trim()) {
      setStatus('err');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/mpqegyrq', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: game.trim() || '(no name given)',
          looking_to: mode === 'play' ? 'play it' : mode === 'see' ? 'see it again' : 'remember it',
          details: details.trim(),
          _subject: 'Welcome Back, a game someone is looking for',
        }),
      });
      if (res.ok) {
        setStatus('ok');
        sounds.chime();
      } else {
        setStatus('err');
      }
    } catch {
      setStatus('err');
    }
  };

  const modes: { id: 'play' | 'see' | 'remember'; label: string }[] = [
    { id: 'play', label: 'play it' },
    { id: 'see', label: 'see it again' },
    { id: 'remember', label: 'just remember it' },
  ];

  return (
    <div style={{ ...WEB_FONT, minHeight: '100%', background: '#fff' }}>
      <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid #ccc', background: '#f3f3f3' }}>
        <span className="font-bios text-[18px]" style={{ color: '#2a2a8a' }}>
ask<span style={{ color: '#c0392b' }}>beeves</span>
        </span>
        <span className="text-[12px] text-[#5a5a5a]">· tell me about a game</span>
      </div>

      <div className="px-6 py-5 max-w-[460px]">
        {status === 'ok' ? (
          <div>
            <div className="text-[18px] font-bold mb-2" style={{ color: '#2a2a8a' }}>
              Thank you. Your submission was received.
            </div>
            <p className="text-[12px] text-[#444] leading-relaxed mb-4">
              Molly, the creator of Welcome Back, reads all of the submissions.
              Thank you for playing. It means a lot that you spent some time in here.
              Keep a lookout in case your game turns up.
            </p>
            <span className="link-1999 text-[12px]" onClick={() => navigate('www.askbeeves.com')}>
              ← back to search
            </span>
          </div>
        ) : (
          <>
            <div className="text-[16px] font-bold mb-1" style={{ color: '#2a2a8a' }}>
              looking for a game that isn&apos;t here?
            </div>
            <p className="text-[12px] text-[#555] leading-relaxed mb-3">
              remember a game from your childhood? tell me about it. it comes straight to me (Molly), and if it&apos;s real I&apos;ll try to add it. no name or email needed.
            </p>

            <label className="block text-[12px] font-bold mb-1">the game</label>
            <input
              value={game}
              onChange={(e) => {
                setGame(e.target.value);
                if (status === 'err') setStatus('idle');
              }}
              placeholder="what's it called? (or “i don't know the name”)"
              className="bevel-in px-2 py-1 text-[13px] outline-none w-full mb-3"
              maxLength={120}
            />

            <div className="text-[12px] font-bold mb-1">are you trying to…</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {modes.map((m) => {
                const on = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className="btn3d text-[12px] !px-3"
                    style={on ? { background: '#2a2a8a', color: '#fff', fontWeight: 700 } : undefined}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            <label className="block text-[12px] font-bold mb-1">what do you remember?</label>
            <textarea
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                if (status === 'err') setStatus('idle');
              }}
              placeholder="what it looked like, where you played it, what happened in it, the feeling of it… anything."
              className="bevel-in px-2 py-1 text-[13px] outline-none w-full mb-3 resize-none"
              rows={3}
              maxLength={2000}
            />

            {status === 'err' && (
              <div className="text-[12px] mb-3" style={{ color: '#c0392b' }}>
                {!game.trim() && !details.trim()
                  ? 'tell me at least the name or a little about it first.'
                  : "couldn't send that just now, check your connection and try again."}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button className="btn3d" onClick={() => void submit()} disabled={status === 'sending'}>
                {status === 'sending' ? 'sending…' : 'send it in'}
              </button>
              <span className="link-1999 text-[12px]" onClick={() => navigate('www.askbeeves.com')}>
                ← back to search
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LobbySearch({ navigate }: { navigate: (u: string) => void }) {
  const [q, setQ] = useState('');
  return (
    <span className="inline-flex gap-1">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && q.trim() && navigate('search:' + q.trim())}
        className="bevel-in px-2 py-0.5 text-[12px] outline-none"
        style={{ width: 180 }}
        placeholder="search the web…"
      />
      <button className="btn3d !py-0.5 !px-2 text-[11px]" onClick={() => q.trim() && navigate('search:' + q.trim())}>
        Go
      </button>
    </span>
  );
}

function SearchEngine({ navigate }: { navigate: (u: string) => void }) {
  return (
    <div style={{ ...WEB_FONT, minHeight: '100%', background: '#fff' }}>
      <div className="flex flex-col items-center pt-12 pb-6">
        <div className="text-[40px] font-bios tracking-wide" style={{ color: '#2a2a8a' }}>
ask<span style={{ color: '#c0392b' }}>beeves</span>
        </div>
        <SearchBox onSearch={(v) => navigate('search:' + v)} width={340} autoFocus />
        <div className="text-[11px] text-[#3a3a9a] mt-4 flex gap-3 flex-wrap justify-center">
          <span className="link-1999" onClick={() => navigate('search:games')}>Games</span>
          <span className="link-1999" onClick={() => navigate('search:homework help')}>Homework</span>
          <span className="link-1999" onClick={() => navigate('search:pizza')}>Local</span>
          <span className="link-1999" onClick={() => navigate(HOME_URL)}>The Lobby</span>
        </div>
        <div className="text-[11px] mt-4 text-[#5a5a5a] text-center max-w-[330px]">
          looking for a game i don&apos;t have yet?{' '}
          <span className="link-1999" onClick={() => navigate('suggest')}>tell me about it →</span>
        </div>
      </div>
    </div>
  );
}

function StateBadge({ state }: { state: SearchResult['state'] }) {
  const map: Record<SearchResult['state'], [string, string]> = {
    live: ['', ''],
    dead: ['#a33', 'dead link'],
    archived: ['#7a5', 'archived'],
    broken: ['#a73', 'may not load'],
  };
  const [c, label] = map[state];
  if (!label) return null;
  return (
    <span className="text-[10px] ml-2" style={{ color: c, border: '1px solid ' + c, padding: '0 4px', borderRadius: 2 }}>
      {label}
    </span>
  );
}

const FALLBACK_RESULTS: SearchResult[] = [
  { title: 'GameFort, thousands of FREE games, no download*', url: 'www.gamefort.com', blurb: 'The Maze Game, Bubble Pop Deluxe, Tank Wars, Stick Fighter, Burger Time! and more. New games every week.', state: 'live' },
  { title: 'City Public Library. Search the catalog', url: 'www.citylibrary.org/catalog', blurb: 'Books, DVDs, and music at all three branches. Place holds online with your library card.', state: 'live' },
  { title: 'Homework Help HQ, free help for grades 5 to 8', url: 'www.homeworkhelphq.com', blurb: 'Math, science, English, social studies and study skills, written by teachers.', state: 'live' },
  { title: 'KidsAnswers, questions from kids, answered', url: 'www.kidsanswers.com/g2g', blurb: 'What does g2g mean? Can fish blink? Is Santa real? Real answers, no sign up.', state: 'live' },
];

function SearchResults({ query, navigate }: { query: string; navigate: (u: string) => void }) {
  const entry = searchFor(query);
  const results = entry ? entry.results : FALLBACK_RESULTS;

  return (
    <div style={{ ...WEB_FONT, minHeight: '100%', background: '#fff' }}>
      <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid #ccc', background: '#f3f3f3' }}>
        <span className="font-bios text-[18px]" style={{ color: '#2a2a8a' }}>
ask<span style={{ color: '#c0392b' }}>beeves</span>
        </span>
        <SearchBox key={query} initial={query} onSearch={(v) => navigate('search:' + v)} width={360} />
      </div>

      <div className="px-5 py-3 text-[12px] flex gap-6">
       <div className="flex-1 min-w-0">
        {true ? (
          <>
            <div className="text-[11px] text-[#5a5a5a] mb-3 flex justify-between">
              <span>{entry ? <>Results for <b>{query}</b></> : <>No exact matches for <b>{query}</b> - showing the closest results</>}</span>
              <span>({(0.08 + (query.length % 7) / 20).toFixed(2)} seconds)</span>
              {entry?.didYouMean && (
                <>
                  {' '}. did you mean{' '}
                  <span className="link-1999" onClick={() => navigate('search:' + entry.didYouMean)}>
                    {entry.didYouMean}
                  </span>?
                </>
              )}
            </div>
            <div style={{ background: '#fff8e1', border: '1px solid #f0d890', padding: '6px 10px', marginBottom: 12 }}>
              <div className="text-[9px] text-[#8a7a4a] tracking-widest">SPONSORED LINK</div>
              <div className="text-[13px]"><span className="link-1999" onClick={() => navigate('www.italianpieshoppe.com/specials')}>Italian Pie Shoppe. Family Night every Tuesday</span></div>
              <div style={{ color: '#1a7a1a' }} className="text-[11px]">Large 1 topping pizza $11.99. Dine in or carry out. Call 555-0142.</div>
              <div className="text-[11px] text-[#5a5a5a]">www.italianpieshoppe.com</div>
            </div>
            <div className="space-y-4">
              {results.filter((r) => r.state !== 'dead').map((r, i) => (
                <div key={i}>
                  <div className="text-[15px]">
                    <span className="link-1999" onClick={() => navigate(r.url)}>{r.title}</span>
                    <StateBadge state={r.state} />
                  </div>
                  <div style={{ color: '#1a7a1a' }} className="text-[12px] leading-snug">{r.blurb}</div>
                  <div className="text-[11px]" style={{ color: '#5a5a5a' }}>{r.display ?? r.url}</div>
                </div>
              ))}
            </div>
          </>
        ) : null}
        <div className="mt-6 pt-3 text-[11px] text-[#5a5a5a]" style={{ borderTop: '1px solid #eee' }}>
          can&apos;t find the game you&apos;re thinking of?{' '}
          <span className="link-1999" onClick={() => navigate('suggest')}>describe it and we&apos;ll look for it →</span>
        </div>
       </div>
       <div className="hidden md:block" style={{ flex: '0 0 170px' }}>
        <div className="text-[9px] text-[#888] tracking-widest mb-1">SPONSORED LINKS</div>
        {[['CursorCastle. Free', 'Sparkle trails and more. 2,000+ cursors.', 'www.coolcursors.com'], ['Summer Reading Club', 'Sign up at City Public Library. Prizes every 5 hours read.', 'www.citylibrary.org/summer'], ['How 2000s Are You?', 'Take the quiz. Put it in your profile.', 'www.quizfever.com']].map(([t, b, u]) => (
          <div key={u} className="mb-3 text-[11px]" style={{ borderLeft: '2px solid #f0d890', paddingLeft: 6 }}>
            <div><span className="link-1999" onClick={() => navigate(u)}>{t}</span></div>
            <div style={{ color: '#1a7a1a' }}>{b}</div>
            <div style={{ color: '#5a5a5a' }}>{u}</div>
          </div>
        ))}
       </div>
      </div>
    </div>
  );
}

function DeadPage({ url, navigate }: { url: string; navigate: (u: string) => void }) {
  return (
    <div style={{ ...WEB_FONT, minHeight: '100%', background: '#fff' }}>
      <div className="p-8 text-center">
        <div className="text-[64px] font-bios" style={{ color: '#c0c0c0' }}>404</div>
        <div className="text-[15px] font-bold mb-1">Not Found</div>
        <p className="text-[12px] text-[#5a5a5a] max-w-[360px] mx-auto">
          The page <span style={{ color: '#a33' }}>{url}</span> is no longer here. It may have moved,
          expired, or been taken down. The internet forgets faster than you&apos;d think.
        </p>
        <p className="text-[11px] text-[#9a9a9a] mt-3 italic">
          (someone made this once. they meant to keep it up.)
        </p>
        <p className="mt-5 text-[12px]">
          <span className="link-1999" onClick={() => navigate('www.askbeeves.com')}>← back to search</span>
        </p>
      </div>
    </div>
  );
}

function BrokenPage({ url, navigate }: { url: string; navigate: (u: string) => void }) {
  const maze = url.includes('themazegame');
  return (
    <div style={{ ...WEB_FONT, minHeight: '100%', background: maze ? '#000' : '#008080' }}>
      <div className="p-5" style={{ color: maze ? '#0f0' : '#fff' }}>
        <div className="mb-3" style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {maze ? '> THE MAZE GAME' : 'PETVILLE'}
        </div>
        <div
          className="bevel-in p-4 mb-3 flex items-center justify-center"
          style={{ background: '#c0c0c0', color: '#333', minHeight: 120, width: '70%' }}
        >
          <div className="text-center text-[12px]">
            <div className="text-[28px] mb-1">⚠</div>
            This page requires the <b>{maze ? 'ShockWave' : 'Flash'}</b> plug in.
            <br />
            <span className="text-[11px]">The plug in is not installed. (It is also not 2009 on the servers anymore.)</span>
          </div>
        </div>
        {maze ? (
          <p style={{ fontFamily: 'monospace', fontSize: 12 }}>
            follow the path to level 3.<br />
            follow the path to level 3.<br />
            <span style={{ opacity: 0.5 }}>follow the path to level 3.</span>
          </p>
        ) : (
          <p className="text-[12px]">Half the images are missing. A puppy icon sits where the login used to be.</p>
        )}
        <p className="mt-5 text-[12px]">
          <span className="link-1999" style={{ color: maze ? '#6cf' : '#cfe' }} onClick={() => navigate('www.askbeeves.com')}>
            ← back to search
          </span>
        </p>
      </div>
    </div>
  );
}

function MyGamePage({ navigate }: { navigate: (u: string) => void }) {
  return (
    <div style={{ ...WEB_FONT, minHeight: '100%', background: '#cfe8ff' }}>
      <div className="px-4 py-2 text-[11px] flex items-center gap-2" style={{ background: '#2a2a2a', color: '#cfcfcf' }}>
        🕰 <b>The WayBack Closet</b> - archived snapshot · the only copy left
      </div>
      <div className="p-5 text-[12px]" style={{ fontFamily: "'Comic Sans MS',cursive", color: '#1a3a6a' }}>
        <div className="text-center mb-3">
          <div className="text-[26px] font-bold" style={{ textShadow: '1px 1px 0 #fff' }}>
            ~* MY GAME *~
          </div>
          <div className="text-[12px]" style={{ color: '#c0392b' }}>★ UNDER CONSTRUCTION ★</div>
          <div className="text-[11px]">(a game im making. by me.)</div>
        </div>
        <div className="bevel-thin p-3 mb-3" style={{ background: '#fff' }}>
          <p className="font-bold mb-1">it will have:</p>
          <p>🐴 HORSES you can ride and brush</p>
          <p>🦕 DINOSAURS (like the tv show)</p>
          <p>🏠 a DOLL HOUSE you decorate yourself</p>
        </div>
        <p className="mb-2">coming soon. (soon = when i learn how to make games.)</p>
        <p className="text-[11px] mb-2" style={{ color: '#a33' }}>
          DO NOT STEAL MY IDEAS. i wrote them down so its proof.
        </p>
        <div className="bevel-in p-2 mb-3 text-[11px]" style={{ background: '#fffbe6', color: '#5a4a1a' }}>
          last updated: a long time ago. this page is still &quot;under
          construction.&quot; it probably always will be.
        </div>
        <div className="text-center text-[11px] mb-2">
          <span className="lcd inline-block px-2 py-0.5">visitors: 000007</span>
          <div style={{ opacity: 0.7 }}>(mostly me, checking if it still works.)</div>
        </div>
        <p>
          <span className="link-1999" onClick={() => navigate('www.askbeeves.com')}>← back to search</span>
        </p>
      </div>
    </div>
  );
}

function FavoritesPage({ navigate }: { navigate: (u: string) => void }) {
  const groups: Array<{ head: string; links: Array<[string, string]> }> = [
    {
      head: 'Games',
      links: [
        ['Petville', 'www.petville.com'],
        ['Maple Grove', 'www.maplegrove.com'],
        ['iFind', 'www.ifind.com'],
        ['Finn the Fish', 'www.finnthefish.com'],
        ['Penguin Cove', 'www.penguincove.com'],
        ['GameFort', 'www.gamefort.com'],
      ],
    },
    {
      head: 'School',
      links: [
        ['Homework Help HQ', 'www.homeworkhelphq.com'],
        ['City Public Library', 'www.citylibrary.org'],
      ],
    },
    {
      head: 'Stuff',
      links: [
        ['CursorCastle. Free', 'www.coolcursors.com'],
        ['Italian Pie Shoppe', 'www.italianpieshoppe.com'],
        ['QuizFever', 'www.quizfever.com'],
        ['AskBeeves', 'www.askbeeves.com'],
      ],
    },
  ];
  const total = groups.reduce((n, g) => n + g.links.length, 0);
  return (
    <div className="p-5 text-[12px]" style={WEB_FONT}>
      <div className="font-bold text-[15px] mb-1">★ My Favorites</div>
      <div className="text-[11px] text-[#5a5a5a] mb-3">{total} bookmarks</div>
      <div className="flex gap-5">
        {groups.map((g) => (
          <div key={g.head} className="flex-1 min-w-0">
            <div className="font-bold mb-1.5" style={{ borderBottom: '2px solid #c0c0c0' }}>
              📁 {g.head}
            </div>
            <ul className="space-y-1.5">
              {g.links.map(([label, url]) => (
                <li key={url}>
                  ★ <span className="link-1999" onClick={() => navigate(url)}>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotFoundPage({
  page,
  navigate,
}: {
  page: { url: string; vintage?: boolean; ring?: boolean };
  navigate: (u: string) => void;
}) {
  return (
    <div className="p-6 text-[12px] leading-relaxed" style={WEB_FONT}>
      <div className="font-bold text-[17px] mb-2">The page cannot be displayed</div>
      <p>
        The page you are looking for might have been removed, had its name changed, or is busy
        having a summer.
      </p>
      <hr className="my-3" style={{ border: 0, borderTop: '1px solid #c0c0c0' }} />
      <p className="text-[#5a5a5a] mb-3">{page.url}</p>
      {page.vintage && <p className="mb-3 font-bold">This page existed in 2009. It was great.</p>}
      {page.ring && <p className="mb-3 font-bold">The ring is broken. You are the ring now.</p>}
      <ul className="list-disc pl-5 space-y-1">
        <li>Check that the year is correct.</li>
        <li>
          Try going{' '}
          <span className="link-1999" onClick={() => navigate(HOME_URL)}>
            home
          </span>{' '}
          and starting over.
        </li>
        <li>Go outside and try again later.</li>
      </ul>
    </div>
  );
}
