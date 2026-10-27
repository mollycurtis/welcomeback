'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { useSave } from '@/store/save';
import { ImageMap, P, H, Table, type Area } from './SiteMap';
import { MazeGame } from './games/MazeGame';
import { BubblePop } from './games/BubblePop';
import { TankWars } from './games/TankWars';
import { DressUp } from './games/DressUp';
import { StickFighter } from './games/StickFighter';
import { BurgerTime } from './games/BurgerTime';

export type FortPage = 'home' | 'maze' | 'bubble' | 'tank' | 'dressup' | 'stick' | 'burger' | 'login' | 'signup' | 'favorites' | 'scores' | 'friends' | 'news' | 'wallpaper' | 'help' | 'all' | 'top' | 'action' | 'puzzle' | 'sports' | 'girls' | 'more' | 'ad-phone' | 'ad-spree' | 'cool' | 'about' | 'contact' | 'privacy' | 'terms';
const BLUE = '#2b3fbf';
export const FORT_GAMES: { id: FortPage; name: string; cat: string; blurb: string }[] = [
  { id: 'maze', name: 'The Maze Game', cat: 'Puzzle', blurb: 'Can you find your way out?' },
  { id: 'bubble', name: 'Bubble Pop Deluxe', cat: 'Puzzle', blurb: 'Clear the board!' },
  { id: 'tank', name: 'Tank Wars', cat: 'Action', blurb: 'Battle the computer!' },
  { id: 'dressup', name: 'Makeover Studio', cat: 'Girls', blurb: 'Hair, nails, makeup!' },
  { id: 'stick', name: 'Stick Fighter', cat: 'Action', blurb: 'How long can you last?' },
  { id: 'burger', name: 'Burger Time!', cat: 'Sports', blurb: "Stack 'em up!" },
];

const crop = (box: [number, number, number, number]) => (a: Area): Area | null => {
  const [bx, by, bw, bh] = box;
  const x = ((a.x - bx) / bw) * 100, y = ((a.y - by) / bh) * 100, w = (a.w / bw) * 100, h = (a.h / bh) * 100;
  if (x < -1 || y < -1 || x > 100 || y > 100) return null;
  return { ...a, x, y, w, h };
};
const HEAD: [number, number, number, number] = [0, 0, 100, 228 / 1024 * 100];
const SIDE: [number, number, number, number] = [8 / 1536 * 100, 238 / 1024 * 100, 234 / 1536 * 100, 704 / 1024 * 100];
const AD1: [number, number, number, number] = [1272 / 1536 * 100, 238 / 1024 * 100, 264 / 1536 * 100, 274 / 1024 * 100];
const AD2: [number, number, number, number] = [1272 / 1536 * 100, 522 / 1024 * 100, 264 / 1536 * 100, 390 / 1024 * 100];
const FOOT: [number, number, number, number] = [0, 940 / 1024 * 100, 100, 84 / 1024 * 100];
function FortFrame({ areas, children, wide }: { areas: Area[]; children: React.ReactNode; wide?: boolean }) {
  const pick = (box: [number, number, number, number]) => areas.map(crop(box)).filter((a): a is Area => !!a);
  return (
    <div style={{ fontFamily: 'Verdana, Tahoma, sans-serif', background: 'radial-gradient(ellipse at 30% 20%, #dbe9fb, #a9c6ea 70%, #93b5e4)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <ImageMap src="/sites/gamefort-header.jpg" alt="GameFort" areas={pick(HEAD)} />
      <div style={{ display: 'flex', gap: 10, padding: 10, alignItems: 'flex-start', flex: 1 }}>
        {!wide && <div style={{ flex: '0 0 15.5%' }}><ImageMap src="/sites/gamefort-side.jpg" alt="Member menu" areas={pick(SIDE)} /></div>}
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        {!wide && <div style={{ flex: '0 0 17%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ImageMap src="/sites/gamefort-ad1.jpg" alt="Advertisement" areas={pick(AD1)} />
          <ImageMap src="/sites/gamefort-ad2.jpg" alt="Advertisement" areas={pick(AD2)} />
        </div>}
      </div>
      <ImageMap src="/sites/gamefort-footer.jpg" alt="GameFort footer" areas={pick(FOOT)} />
    </div>
  );
}
function FortTile({ title, color, children, onClick }: { title: React.ReactNode; color: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div style={{ border: `3px solid ${color}`, borderRadius: 8, background: '#fff', overflow: 'hidden', marginBottom: 10, boxShadow: '0 3px 0 rgba(0,0,0,0.25)' }}>
      <div onClick={onClick} style={{ background: `linear-gradient(${color}, ${color}cc)`, color: '#fff', fontWeight: 900, fontSize: 14, padding: '5px 10px', textShadow: '1px 1px 0 rgba(0,0,0,0.45)', cursor: onClick ? 'pointer' : 'default' }}>{title}</div>
      <div style={{ padding: 10, fontSize: 12, lineHeight: 1.5, color: '#1a2a55' }}>{children}</div>
    </div>
  );
}

export function GameFortSite({ page, go, back, onBlocked }: { page: FortPage; go: (p: FortPage) => void; back: () => void; onBlocked: (what: string) => void }) {
  const [form, setForm] = useState({ u: '', p: '', e: '' });
  const [err, setErr] = useState('');
  const account = useSave((st) => st.fortAccount);
  const loggedIn = useSave((st) => st.fortLoggedIn);
  const favorites = useSave((st) => st.fortFavorites);
  const fortSignup = useSave((st) => st.fortSignup);
  const fortLogin = useSave((st) => st.fortLogin);
  const fortLogout = useSave((st) => st.fortLogout);
  const toggleFav = useSave((st) => st.fortToggleFavorite);
  const me = loggedIn && account ? account.user : null;
  const home = () => go('home');
  const doLogin = () => {
    if (!form.u || !form.p) { setErr('Please enter your username and password.'); return; }
    if (!account) { setErr('No account with that username. Sign up - it\'s free!'); return; }
    if (fortLogin(form.u, form.p)) { setErr(''); go('favorites'); } else setErr('Wrong username or password.');
  };
  const doSignup = () => {
    if (form.u.trim().length < 3) { setErr('Usernames need at least 3 characters.'); return; }
    if (form.p.length < 4) { setErr('Passwords need at least 4 characters.'); return; }
    if (!form.e.includes('@')) { setErr('Please enter a parent\'s email address.'); return; }
    fortSignup(form.u.trim(), form.p); setErr(''); go('favorites');
  };
  const areas: Area[] = [
      { x: 30, y: 1.5, w: 42, h: 12, title: 'GameFort home', onClick: home },
      { x: 78, y: 1, w: 21, h: 16, title: 'New games every week!', onClick: () => go('news') },
      { x: 8, y: 17.5, w: 6, h: 4, title: 'Home', onClick: home },
      { x: 16.5, y: 17.5, w: 9, h: 4, title: 'All Games', onClick: home },
      { x: 28, y: 17.5, w: 10, h: 4, title: 'Top Games', onClick: home },
      { x: 40.5, y: 17.5, w: 6, h: 4, title: 'Action', onClick: home },
      { x: 49, y: 17.5, w: 6, h: 4, title: 'Puzzle', onClick: home },
      { x: 57.5, y: 17.5, w: 6.5, h: 4, title: 'Sports', onClick: home },
      { x: 66.5, y: 17.5, w: 5, h: 4, title: 'Girls', onClick: home },
      { x: 73.5, y: 17.5, w: 7, h: 4, title: 'More', onClick: home },
      { x: 1, y: 24, w: 14.5, h: 28, title: 'Member Login', onClick: () => go('login') },
      { x: 3, y: 49, w: 10, h: 3, title: 'Sign Up FREE!', onClick: () => go('signup') },
      { x: 1.5, y: 55, w: 13, h: 3.2, title: 'My Favorites', onClick: () => go('favorites') },
      { x: 1.5, y: 58.7, w: 13, h: 3.2, title: 'High Scores', onClick: () => go('scores') },
      { x: 1.5, y: 62.3, w: 13, h: 3.2, title: 'Make Friends', onClick: () => go('friends') },
      { x: 1.5, y: 66, w: 13, h: 3.2, title: 'Game News', onClick: () => go('news') },
      { x: 1.5, y: 69.6, w: 13, h: 3.2, title: 'Wallpaper', onClick: () => go('wallpaper') },
      { x: 1.5, y: 73.2, w: 13, h: 3.2, title: 'Help / FAQ', onClick: () => go('help') },
      { x: 1, y: 77.5, w: 14.5, h: 14, title: 'Cool Stuff! Free ringtones & wallpapers', onClick: () => go('cool') },
      { x: 17, y: 24.5, w: 21, h: 25, title: 'The Maze Game', onClick: () => go('maze') },
      { x: 39, y: 24.5, w: 21, h: 25, title: 'Bubble Pop Deluxe', onClick: () => go('bubble') },
      { x: 61, y: 24.5, w: 21, h: 25, title: 'Tank Wars', onClick: () => go('tank') },
      { x: 17, y: 50.5, w: 21, h: 25, title: 'Makeover Studio', onClick: () => go('dressup') },
      { x: 39, y: 50.5, w: 21, h: 25, title: 'Stick Fighter', onClick: () => go('stick') },
      { x: 61, y: 50.5, w: 21, h: 25, title: 'Burger Time!', onClick: () => go('burger') },
      { x: 17, y: 77, w: 65, h: 11, title: 'Free games · cool prizes · make friends', onClick: () => go('signup') },
      { x: 83, y: 24, w: 16.5, h: 26, title: 'Advertisement: Hottest games for your cell phone', onClick: () => go('ad-phone') },
      { x: 83, y: 51, w: 16.5, h: 37.5, title: 'Advertisement: Win a $1,000 shopping spree', onClick: () => go('ad-spree') },
      { x: 27.5, y: 93.5, w: 4, h: 3, title: 'Home', onClick: home },
      { x: 33, y: 93.5, w: 6, h: 3, title: 'Contact Us', onClick: () => go('contact') },
      { x: 41, y: 93.5, w: 7.5, h: 3, title: 'Privacy Policy', onClick: () => go('privacy') },
      { x: 50.5, y: 93.5, w: 7, h: 3, title: 'Terms of Use', onClick: () => go('terms') },
      { x: 59.5, y: 93.5, w: 9, h: 3, title: 'About GameFort', onClick: () => go('about') },
    ];
  if (page === 'home') return <ImageMap src="/sites/gamefort.jpg" alt="GameFort" areas={areas} />;

  if (page === 'maze') return <FortFrame areas={areas}><MazeGame onBack={home} /></FortFrame>;
  if (page === 'bubble') return <FortFrame areas={areas}><BubblePop onBack={home} /></FortFrame>;
  if (page === 'tank') return <FortFrame areas={areas}><TankWars onBack={home} /></FortFrame>;
  if (page === 'dressup') return <FortFrame areas={areas}><DressUp onBack={home} /></FortFrame>;
  if (page === 'stick') return <FortFrame areas={areas}><StickFighter onBack={home} /></FortFrame>;
  if (page === 'burger') return <FortFrame areas={areas}><BurgerTime onBack={home} /></FortFrame>;

  const member = me
    ? <span>Welcome back, <b>{me}</b>! · <span className="link-1999" onClick={() => go('favorites')}>My Favorites ({favorites.length})</span> · <span className="link-1999" onClick={() => { fortLogout(); go('home'); }}>Log out</span></span>
    : <span><span className="link-1999" onClick={() => go('login')}>Member Login</span> · <span className="link-1999" onClick={() => go('signup')}>Sign Up FREE!</span></span>;
  const wrap = (title: string, body: React.ReactNode) => (
    <FortFrame areas={areas}>
      <div style={{ background: 'rgba(255,255,255,0.85)', border: '2px solid #2b3fbf', borderRadius: 6, padding: '3px 8px', fontSize: 11, marginBottom: 8, color: '#1a2a55' }}>{member}</div>
      <FortTile title={<>▶ {title}</>} color={BLUE}>{body}</FortTile>
    </FortFrame>
  );
  const Card = ({ g, remove }: { g: typeof FORT_GAMES[number]; remove?: boolean }) => (
    <div style={{ position: 'relative', lineHeight: 0, cursor: 'pointer', borderRadius: 6, overflow: 'hidden', boxShadow: '0 3px 0 rgba(0,0,0,0.2)' }} onClick={() => go(g.id)} title={g.name}>
      <img src={`/sites/gamefort-card-${g.id}.jpg`} alt={g.name} draggable={false} style={{ width: '100%', display: 'block' }} />
      {me && (
        <span title={favorites.includes(g.id) ? 'Remove from favorites' : 'Add to favorites'} onClick={(e) => { e.stopPropagation(); toggleFav(g.id); }}
          style={{ position: 'absolute', top: 4, right: 6, fontSize: 18, lineHeight: 1, color: favorites.includes(g.id) ? '#ffe14a' : 'rgba(255,255,255,0.7)', textShadow: '0 0 3px rgba(0,0,0,0.8)', cursor: 'pointer' }}>★</span>
      )}
      {remove && <span onClick={(e) => { e.stopPropagation(); toggleFav(g.id); }} style={{ position: 'absolute', left: 6, top: 4, fontSize: 10, lineHeight: 1.4, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '1px 6px', borderRadius: 3, cursor: 'pointer' }}>remove</span>}
    </div>
  );
  const list = (filter?: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
      {FORT_GAMES.filter((g) => !filter || g.cat === filter).map((g) => <Card key={g.id} g={g} />)}
    </div>
  );
  const input = (k: 'u' | 'p', type = 'text') => <input type={type} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="bevel-in" style={{ padding: '3px 6px', fontSize: 12, width: 180 }} />;
  const btn = (label: string, onClick: () => void) => <button onClick={onClick} style={{ padding: '4px 14px', border: `2px solid #1b2a8a`, borderRadius: 5, background: `linear-gradient(#6a7ff0, ${BLUE})`, color: '#fff', fontWeight: 900, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>;

  switch (page) {
    case 'login': return wrap('Member Login', <>
      {me ? <P>You are logged in as <b>{me}</b>. <span className="link-1999" onClick={() => go('favorites')}>Go to My Favorites</span> or <span className="link-1999" onClick={() => { fortLogout(); setErr(''); }}>log out</span>.</P> : <>
        <P>Username: {input('u')}</P><P>Password: {input('p', 'password')}</P>
        {err && <P style={{ color: '#c62828', fontWeight: 700 }}>{err}</P>}
        <P>{btn('LOGIN', doLogin)} &nbsp; <span className="link-1999" onClick={() => go('signup')}>Not a member? Sign up FREE!</span></P>
        <P style={{ fontSize: 11, color: '#555' }}>Forgot your password? Ask a parent to check the email address you signed up with.</P>
      </>}
    </>);
    case 'signup': return wrap('Sign Up - it\'s FREE!', <>
      <P>Members can save favorites, post high scores, add friends, and enter prize drawings.</P>
      <P>Choose a username: {input('u')}</P><P>Choose a password: {input('p', 'password')}</P>
      <P>Parent&apos;s email: <input className="bevel-in" style={{ padding: '3px 6px', fontSize: 12, width: 180 }} value={form.e} onChange={(e) => setForm({ ...form, e: e.target.value })} placeholder="required for under 13" /></P>
      {err && <P style={{ color: '#c62828', fontWeight: 700 }}>{err}</P>}
      <P>{btn('CREATE MY ACCOUNT', doSignup)}</P>
      <P style={{ fontSize: 11, color: '#555' }}>By signing up you agree to the <span className="link-1999" onClick={() => go('terms')}>Terms of Use</span>. We never share your information. Ask a parent before you sign up for anything online.</P>
    </>);
    case 'favorites': return wrap(me ? `${me}'s Favorites` : 'My Favorites', me ? <>
      {favorites.length === 0 ? <P>You haven&apos;t starred any games yet. Click the ★ next to a game to add it.</P> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>{FORT_GAMES.filter((g) => favorites.includes(g.id)).map((g) => <Card key={g.id} g={g} remove />)}</div>}
      <H>All games</H>{list()}
    </> : <><P>You are not signed in. <span className="link-1999" onClick={() => go('login')}>Log in</span> or <span className="link-1999" onClick={() => go('signup')}>sign up</span> to save your favorite games.</P><H>Popular favorites</H>{list()}</>);
    case 'scores': return wrap('High Scores', <>
      <Table rows={[['The Maze Game', 'xXmazeRunnerXx, 1,240'], ['Bubble Pop Deluxe', 'bubblegirl_04, 9,870'], ['Tank Wars', 'GENERAL_TANK, 300'], ['Stick Fighter', 'stikman2000, 214 seconds'], ['Burger Time!', 'fryguy88, 1,150'], ['Dress Up Studio', '(no scores - 4,102 looks saved)']]} />
      {me ? <P>Scores you post are saved under <b>{me}</b>. Play any game and beat the board!</P> : <P>Your scores are saved on this computer for this session. <span className="link-1999" onClick={() => go('login')}>Log in</span> to post to the board.</P>}
    </>);
    case 'friends': return wrap('Make Friends', <><P>Add friends by username to compare high scores and send game challenges. Chat is limited to pre written messages for members under 13.</P>{me ? <><P>Add a friend by username: {input('u')} {btn('Add', () => setErr(form.u ? `Friend request sent to ${form.u}!` : 'Type a username first.'))}</P>{err && <P style={{ color: BLUE, fontWeight: 700 }}>{err}</P>}<P>Your friends (0): nobody yet. Ask your friends for their GameFort usernames!</P></> : <P>You are not signed in. <span className="link-1999" onClick={() => go('login')}>Log in</span> to add friends.</P>}<P style={{ fontSize: 11, color: '#555' }}>Never share your real name, school, or address online. If someone makes you uncomfortable, tell a parent and click Report.</P></>);
    case 'news': return wrap('Game News', <>
      <H>June 12 - Burger Time! is here</H><P>Catch the ingredients in the right order before the kitchen closes. Our fastest-growing game already.</P>
      <H>June 5 - Stick Fighter update</H><P>Enemies now come from both sides. You asked for harder. You got harder.</P>
      <H>May 29 - Bubble Pop Deluxe</H><P>The deluxe version adds floating-cluster drops for bonus points.</P>
      <H>Coming soon</H><P>Skate Park, Word Blaster, and a two player mode for Tank Wars.</P>
    </>);
    case 'wallpaper': return wrap('Wallpaper', <>
      <P>Free desktop wallpapers from your favorite GameFort games. Available in 800×600 and 1024×768.</P>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{['Maze Game', 'Bubble Pop', 'Tank Wars', 'Stick Fighter'].map((n) => <div key={n} style={{ width: 120, border: '2px solid #999', background: '#fff', padding: 4, textAlign: 'center', fontSize: 11 }}><div style={{ height: 60, background: '#3a5bd9', marginBottom: 4 }} />{n}<br />{btn('Download', () => onBlocked('download'))}</div>)}</div>
    </>);
    case 'help': return wrap('Help / FAQ', <>
      <H>The game won&apos;t load.</H><P>Most games need the FlashPlayer plug in. If you see a blank box, wait, loading can take a few minutes on dial up. Do not click Refresh; that starts over.</P>
      <H>The keyboard isn&apos;t working.</H><P>Click on the game once so it has focus.</P>
      <H>How do I save my score?</H><P>Sign in as a member before you play. Guest scores are kept only until you close the browser.</P>
      <H>Bad quality game?</H><P>Molly here. You try making a video game!</P>
      <H>Is GameFort safe?</H><P>GameFort is for ages 8 and up. Ask a parent before signing up, downloading, or entering any contest.</P>
    </>);
    case 'cool': return wrap('Cool Stuff!', <><P>Free ringtones and wallpapers for your cell phone. Text the code shown to 55555, or download to your computer and transfer with a USB cable.</P><Table rows={[['Maze Game theme', 'ringtone, code MAZE1'], ['Bubble Pop jingle', 'ringtone, code POP2'], ['Tank Wars', 'wallpaper 176×220']]} /><P>{btn('Download all', () => onBlocked('download'))}</P></>);
    case 'ad-phone': return wrap('Get the Hottest Games for your Cell Phone!', <><P>Play GameFort favorites anywhere. Compatible with most flip phones. Standard text and data rates apply - $9.99/month subscription, cancel anytime by texting STOP.</P><P>{btn('Download Now', () => onBlocked('download'))}</P><P style={{ fontSize: 11, color: '#555' }}>Advertisement. Must be 18 or have a parent&apos;s permission.</P></>);
    case 'ad-spree': return wrap('WIN a $1,000 Shopping Spree!', <><P>Enter for your chance to win. Just fill in your name, address, phone number, and a parent&apos;s email. Winners will be notified by phone. No purchase necessary.</P><P>{btn('Enter Now', () => onBlocked('contest'))}</P><P style={{ fontSize: 11, color: '#555' }}>Advertisement. Sponsored by a third party. GameFort is not responsible for prize fulfillment.</P></>);
    case 'about': return wrap('About GameFort', <><P>GameFort launched in 2004 with twelve games and a message board. Today we host thousands of free browser games made by independent developers, with new games added every week.</P><P>Our games are free because of the advertisements on the site. We review every ad for age-appropriateness.</P></>);
    case 'contact': return wrap('Contact Us', <><Table rows={[['Support', 'help@gamefort.com'], ['Game submissions', 'games@gamefort.com'], ['Advertising', 'ads@gamefort.com']]} /><P>We read every message. Please include which browser you are using.</P></>);
    case 'privacy': return wrap('Privacy Policy', <><P>GameFort does not collect personal information from children under 13 without a parent&apos;s permission. We use cookies to remember your login and high scores. We do not sell member information. Advertisements on GameFort are provided by third parties who may use their own cookies.</P></>);
    case 'terms': return wrap('Terms of Use', <><P>By using GameFort you agree to be nice on the message boards, to not cheat on the high score tables, and to ask a parent before downloading anything. Games are provided as-is. Some games require the FlashPlayer plug in, the ShockWave plug in, the Java runtime, and a parent&apos;s permission.</P></>);
  }
  return null;
}
