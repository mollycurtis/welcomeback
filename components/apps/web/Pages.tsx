'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, type ReactNode } from 'react';
import { WORLDS } from '@/lib/worlds';
import { Icon } from '@/lib/icons';
import { SubPage, P, H, Table } from './SiteMap';

const FONT = { fontFamily: 'Verdana, Tahoma, sans-serif' };

function useLiveHits(): number | null {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_COUNTER_URL;
    if (!base) return;
    const bumped = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('wb-counted');
    const url = bumped ? `${base}` : `${base}/up`;
    fetch(url, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        const v = Number(j?.data?.up_count ?? j?.data?.value ?? j?.value ?? j?.count ?? j?.hits);
        const offset = Number(process.env.NEXT_PUBLIC_COUNTER_OFFSET) || 0;
        if (!Number.isNaN(v)) setN(Math.max(1, v - offset));
        try { sessionStorage.setItem('wb-counted', '1'); } catch { }
      })
      .catch(() => {});
  }, []);
  return n;
}

export function LobbyPage({ hitCount, navigate, search }: { hitCount: number; navigate: (u: string) => void; search: ReactNode }) {
  const liveHits = useLiveHits();
  return (
    <div className="text-[12px] leading-relaxed" style={{ ...FONT, background: '#fff', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(#3a6ea5, #24528a)', color: '#fff', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>The Lobby</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, textAlign: 'right' }}>Friday, June 12, 2009<br /><span style={{ opacity: 0.8 }}>Partly cloudy, 74&deg;</span></div>
      </div>
      <div style={{ background: '#eaf2fb', borderBottom: '1px solid #b7c8dd', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 700, color: '#24528a' }}>Search the Web:</span>{search}
        <span style={{ fontSize: 10, color: '#5a6a8a' }}>powered by <span className="link-1999" onClick={() => navigate('www.askbeeves.com')}>AskBeeves</span></span>
      </div>

      <div style={{ display: 'flex', gap: 18, padding: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 340px', minWidth: 300 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#24528a', borderBottom: '2px solid #3a6ea5', marginBottom: 8, paddingBottom: 2 }}>Games</div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${WORLDS.length}, 1fr)`, gap: 6 }}>
            {WORLDS.map((w) => (
              <div key={w.slug} onClick={() => navigate(w.url)} title={w.url}
                style={{ border: '1px solid #b7c8dd', borderRadius: 4, padding: '8px 2px 6px', textAlign: 'center', cursor: 'pointer', background: '#f7faff', minWidth: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e4eefb')} onMouseLeave={(e) => (e.currentTarget.style.background = '#f7faff')}>
                <Icon name={w.icon} size={30} />
                <div style={{ fontWeight: 700, color: '#1a3a7a', marginTop: 3, fontSize: 10, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontWeight: 700, fontSize: 13, color: '#24528a', borderBottom: '2px solid #3a6ea5', marginBottom: 6, paddingBottom: 2 }}>Word of the Day</div>
          <div style={{ background: '#f7faff', border: '1px solid #b7c8dd', borderRadius: 4, padding: '8px 10px' }}>
            <div><b style={{ fontSize: 14, color: '#1a3a7a' }}>procrastinate</b> <span style={{ color: '#5a6a8a' }}>(verb)</span></div>
            <div style={{ marginTop: 2 }}>to put off doing something until later, especially homework, especially when there is a computer in the room.</div>
            <div style={{ fontSize: 10, color: '#5a6a8a', marginTop: 4 }}>&ldquo;I will start my report after one more game.&rdquo;</div>
          </div>
          <div style={{ marginTop: 10, fontWeight: 700, fontSize: 13, color: '#24528a', borderBottom: '2px solid #3a6ea5', marginBottom: 6, paddingBottom: 2 }}>Poll</div>
          <div style={{ fontSize: 11 }}>Best after school snack? <span style={{ color: '#5a6a8a' }}>Pizza rolls 41% &middot; Fruit snacks 27% &middot; Cereal (dry) 19% &middot; Other 13%</span> <span style={{ color: '#8a8a8a' }}>&middot; 3,204 votes</span></div>
        </div>

        <div style={{ flex: '0 0 200px' }}>
          <div style={{ border: '1px solid #b7c8dd', background: '#fdf6da', padding: 10, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: '#5a4a1a' }}>Cool Links</div>
            <ul style={{ margin: 0, paddingLeft: 14, lineHeight: 1.8 }}>
              <li><span className="link-1999" onClick={() => navigate('www.quizfever.com')}>Quiz: How 2000s Are You?</span></li>
              <li><span className="link-1999" onClick={() => navigate('www.coolcursors.com')}>CursorCastle - Free</span></li>
              <li><span className="link-1999" onClick={() => navigate('www.italianpieshoppe.com')}>Italian Pie Shoppe</span></li>
              <li><span className="link-1999" onClick={() => navigate('www.homeworkhelphq.com')}>Homework Help HQ</span></li>
              <li><span className="link-1999" onClick={() => navigate('www.citylibrary.org')}>City Public Library</span></li>
              <li><span className="link-1999" onClick={() => navigate('www.gamefort.com')}>GameFort</span></li>
              <li><span className="link-1999" onClick={() => navigate('suggest')}>Remember a game? Tell me about it</span></li>
            </ul>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, marginBottom: 2 }}>You are visitor &#8470;</div>
            <span className="lcd inline-block px-3 py-1 text-2xl">{String(liveHits ?? hitCount).padStart(6, '0')}</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #c0c0c0', margin: '0 18px', padding: '10px 0 16px', textAlign: 'center', fontSize: 10, color: '#5a5a5a' }}>
        <span className="link-1999" onClick={() => navigate('favorites')}>My Favorites</span> &middot; <span className="link-1999" onClick={() => navigate('history')}>History</span> &middot; <span className="link-1999" onClick={() => navigate('www.askbeeves.com')}>AskBeeves</span>
      </div>
    </div>
  );
}

const CURSORS = [
  { n: 'Sparkle Trail', d: 'glitter follows your mouse', c: '#f5c2ff', sh: '✦' }, { n: 'Flaming Arrow', d: 'the classic', c: '#ff8a3a', sh: '➚' }, { n: 'Rainbow Pointer', d: 'cycles every color', c: '#7ad', sh: '➤' },
  { n: 'Smiley', d: 'always happy to click', c: '#ffe14a', sh: '☺' }, { n: 'Dolphin', d: 'jumps when you click', c: '#4aa8ff', sh: '~' }, { n: 'Skull & Bones', d: 'for the edgy', c: '#ccc', sh: '☠' },
  { n: 'Butterfly', d: 'flaps its wings', c: '#ff7ab8', sh: '❧' }, { n: 'Lightning Bolt', d: 'zap', c: '#fff36b', sh: '⚡' },
];
export function CursorsPage({ navigate, onDownload }: { navigate: (u: string) => void; onDownload: () => void }) {
  return (
    <div style={{ ...FONT, background: '#1a0a3a', minHeight: '100%', color: '#fff', fontSize: 12 }}>
      <div style={{ textAlign: 'center', padding: '16px 10px 6px' }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: '#ffd6ff', textShadow: '0 0 10px #f5c2ff, 2px 2px 0 #5a1a8a', letterSpacing: 1 }}>✦ CursorCastle ✦</div>
        <div style={{ fontSize: 11, color: '#d8c6ff' }}>FREE cursors for your computer!! over 2,000 to choose from &middot; no spyware (we promise)</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, padding: '10px 16px' }}>
        {CURSORS.map((c) => (
          <div key={c.n} style={{ background: '#2a1552', border: '1px solid #6a4a9a', borderRadius: 4, padding: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 28, height: 36, color: c.c, textShadow: `0 0 8px ${c.c}` }}>{c.sh}</div>
            <div style={{ fontWeight: 700 }}>{c.n}</div>
            <div style={{ fontSize: 10, color: '#c9b8e8', marginBottom: 6 }}>{c.d}</div>
            <button onClick={onDownload} style={{ background: 'linear-gradient(#ff9ad5, #d84ea4)', border: '2px solid #ffd6ff', color: '#fff', fontWeight: 900, fontSize: 11, padding: '3px 12px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }}>DOWNLOAD</button>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: 10, color: '#a893d6', padding: '6px 10px 14px' }}>
        cursors are .exe installers &middot; 400 to 900 KB each &middot; <span className="link-1999" style={{ color: '#ffd6ff' }} onClick={() => navigate('www.thelobby.com')}>back to The Lobby</span>
      </div>
    </div>
  );
}

const QUIZ: { q: string; a: string[] }[] = [
  { q: 'Pick your childhood gaming setup.', a: ['Nintendo DS or Gameboy', 'Wii', 'Xbox 360 or PlayStation 2', 'iPod Touch or iPod Nano'] },
  { q: 'You get $20 for the weekend. What are you buying?', a: ['A new DS or video game', 'Something from the mall', 'Movies from Blockbuster', 'Whatever random thing you see at Target'] },
  { q: 'You are making a new username. Which one feels more like you?', a: ['Your first name + birth year', 'Your favorite animal + a number', 'Something with "xX" or "_"', 'A completely random username you made up in 5th grade'] },
  { q: 'What are you most likely watching after school?', a: ['Disney Channel', 'Nickelodeon', 'Cartoon Network', 'I am playing video games'] },
  { q: 'You are picking a book from the school library. What are you grabbing?', a: ['Junie B. Jones', 'Magic Tree House', 'Diary of a Wimpy Kid', 'Captain Underpants'] },
  { q: 'Pick your ideal sleepover activity.', a: ['Watching movies', 'Playing Wii', 'Making friendship bracelets', 'Staying up until 3 AM'] },
  { q: 'Pick your most 2008 bedroom decoration.', a: ['A lava lamp', 'A giant celebrity poster', 'A wall covered in photos', 'A giant corkboard covered in random memories'] },
  { q: 'You are watching TV. What are you putting on?', a: ['The Magic School Bus', 'Power Rangers', 'Pokémon', 'SpongeBob SquarePants'] },
  { q: 'Your friend hands you their MP3 player and says "pick a song." What are you picking?', a: ['"Party in the U.S.A." by Miley Cyrus', '"Love Story" by Taylor Swift', '"Boom Boom Pow" by The Black Eyed Peas', '"Low" by Flo Rida'] },
  { q: 'You finally get your own phone. What are you getting?', a: ['A pink or blue flip phone', 'A slide out keyboard phone', 'An iPhone', 'BlackBerry'] },
];
const RESULTS = [
  ['The Internet Kid', 'You were online way too early. You had a username with at least one questionable character, stayed up later than you were supposed to, and somehow knew how to find things on the internet that your parents definitely did not know existed. You did not just grow up in the 2000s. You were logged on. You are: internet raised and probably still recovering.'],
  ['The Mall Rat', 'Your weekends had a soundtrack and it was playing in Claire\'s. You knew which food court had the good pretzels, your phone had a slide out keyboard, and your bedroom wall was a photo collage. You are: a little dramatic, in a Disney Channel way, and you know every word to Love Story.'],
  ['The Living Room Champion', 'Wii Sports at your house was a competitive event. You had a DS in your backpack, a Diary of a Wimpy Kid on the nightstand and a very strong opinion about Cartoon Network vs. Nickelodeon. You are: the friend everyone wanted at the sleepover.'],
  ['The Cozy Kid', 'Magic Tree House, The Magic School Bus, a lava lamp and a flip phone you mostly used to call your mom. You were happiest at home with the TV on and a snack. You are: wholesome, nostalgic, and honestly thriving.'],
];
export function QuizPage({ navigate }: { navigate: (u: string) => void }) {
  const [i, setI] = useState(0); const [pts, setPts] = useState(0); const [done, setDone] = useState(false);
  const pick = (ai: number) => { const p = pts + ai; if (i + 1 >= QUIZ.length) { setPts(p); setDone(true); } else { setPts(p); setI(i + 1); } };
  const bracket = pts >= 24 ? 0 : pts >= 16 ? 1 : pts >= 8 ? 2 : 3;
  return (
    <div style={{ ...FONT, background: '#ffe9f3', minHeight: '100%', fontSize: 12 }}>
      <div style={{ background: 'linear-gradient(#ff6fae, #e0308a)', color: '#fff', padding: '10px 16px', fontWeight: 900, fontSize: 22, textShadow: '2px 2px 0 #8a0a4a', textAlign: 'center' }}>QuizFever!</div>
      <div style={{ maxWidth: 520, margin: '16px auto', background: '#fff', border: '3px solid #e0308a', borderRadius: 8, padding: 16 }}>
        <div style={{ fontWeight: 900, color: '#e0308a', fontSize: 16, marginBottom: 4 }}>How 2000s Are You?</div>
        {!done ? (
          <>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>Question {i + 1} of {QUIZ.length}</div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>{QUIZ[i].q}</div>
            {QUIZ[i].a.map((a, ai) => <div key={a} onClick={() => pick(ai)} style={{ border: '1px solid #f5a8cf', borderRadius: 4, padding: '6px 10px', marginBottom: 5, cursor: 'pointer', background: '#fff5fa' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#ffe0ef')} onMouseLeave={(e) => (e.currentTarget.style.background = '#fff5fa')}>&#9675; {a}</div>)}
          </>
        ) : (
          <>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#8a0a4a', margin: '8px 0' }}>You are: {RESULTS[bracket][0]}</div>
            <div style={{ marginBottom: 12 }}>{RESULTS[bracket][1]}</div>
            <button onClick={() => { setI(0); setPts(0); setDone(false); }} style={{ background: '#e0308a', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 12px', fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>Take it again</button>
          </>
        )}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#a05a7a', paddingBottom: 14 }}><span className="link-1999" onClick={() => navigate('www.thelobby.com')}>back to The Lobby</span></div>
    </div>
  );
}

export type HwPage = 'home' | 'math' | 'science' | 'english' | 'history' | 'study' | 'reports';
export function HomeworkHQ({ page, go, navigate }: { page: HwPage; go: (p: HwPage) => void; navigate: (u: string) => void }) {
  const nav = [{ label: 'Home', onClick: () => go('home') }, { label: 'Math', onClick: () => go('math') }, { label: 'Science', onClick: () => go('science') }, { label: 'English', onClick: () => go('english') }, { label: 'Social Studies', onClick: () => go('history') }, { label: 'Study Skills', onClick: () => go('study') }];
  const wrap = (title: string, body: ReactNode) => <SubPage site="Homework Help HQ" tagline="Free help for grades 5 to 8" title={title} nav={nav} accent="#2f6b3a" bg="#f1f6ee" font="Verdana, Tahoma, sans-serif" onBack={page === 'home' ? () => navigate('www.thelobby.com') : () => go('home')} backLabel={page === 'home' ? 'The Lobby' : 'HQ home'}
    topRight={<span>Written by teachers · Updated weekly</span>}
    sidebar={<>
      <div style={{ fontWeight: 700, color: '#2f6b3a', marginBottom: 4 }}>Subjects</div>
      {([['math', 'Math'], ['science', 'Science'], ['english', 'English'], ['history', 'Social Studies'], ['study', 'Study Skills']] as [HwPage, string][]).map(([k, l]) => <div key={k}><span className={'link-1999' + (page === k ? ' visited' : '')} onClick={() => go(k)}>{l}</span></div>)}
      <div style={{ fontWeight: 700, color: '#2f6b3a', margin: '10px 0 4px' }}>Ask a Teacher</div>
      <div style={{ fontSize: 10 }}>Questions answered within 24 hours on school days.</div>
      <div style={{ marginTop: 8 }}><span className="link-1999" onClick={() => navigate('www.citylibrary.org/homework')}>Live tutoring at the library &raquo;</span></div>
    </>}>{body}</SubPage>;
  switch (page) {
    case 'home': return wrap('Welcome', <>
      <P>Homework Help HQ is written by teachers for students in grades 5 to 8. Pick a subject, find your topic, and work through the examples. Every page ends with a practice problem and its answer.</P>
      <Table rows={[['Math', 'Fractions, decimals, percents, order of operations, pre-algebra'], ['Science', 'Scientific method, the water cycle, cells, simple machines'], ['English', 'Book reports, five paragraph essays, metaphors and similes, grammar'], ['Social Studies', 'U.S. states and capitals, the Constitution, timelines'], ['Study Skills', 'Planners, taking notes, test day']]} />
      <P>Need a book? Your <span className="link-1999" onClick={() => navigate('www.citylibrary.org')}>public library</span> offers free live tutoring with a library card.</P>
    </>);
    case 'math': return wrap('Math', <>
      <H>Order of operations</H><P>Parentheses, Exponents, Multiply/Divide (left to right), Add/Subtract (left to right). Example: 3 + 4 &times; 2 = 3 + 8 = 11, not 14.</P>
      <H>Adding fractions</H><P>Find a common denominator first. 1/2 + 1/3 = 3/6 + 2/6 = 5/6. Simplify at the end.</P>
      <H>Percents</H><P>&ldquo;Percent&rdquo; means per hundred. 25% of 80 = 0.25 &times; 80 = 20. To find what percent 15 is of 60, divide: 15 &divide; 60 = 0.25 = 25%.</P>
      <H>Solving for x</H><P>Undo what was done to x, in reverse order, doing the same thing to both sides. 2x + 3 = 11 &rarr; 2x = 8 &rarr; x = 4.</P>
      <H>Practice</H><P>What is 40% of 150? <i>(Answer: 60.)</i></P>
    </>);
    case 'science': return wrap('Science', <>
      <H>The scientific method</H><P>Question &rarr; Hypothesis &rarr; Experiment &rarr; Results &rarr; Conclusion. A hypothesis is a testable guess, written as &ldquo;If ___, then ___.&rdquo;</P>
      <H>The water cycle</H><P>Evaporation (liquid to vapor, powered by the sun) &rarr; Condensation (vapor to clouds) &rarr; Precipitation (rain, snow) &rarr; Collection (lakes, oceans, groundwater). Then it repeats.</P>
      <H>Cells</H><P>All living things are made of cells. Plant cells have a cell wall and chloroplasts; animal cells do not. The nucleus holds the DNA.</P>
      <H>Science fair tip</H><P>Change only one variable. Keep everything else the same. Write down what you measured, not what you expected.</P>
    </>);
    case 'english': return wrap('English & Language Arts', <>
      <H>Writing a book report</H><P>1. Title, author, and genre. 2. Setting and main characters. 3. A short summary of the plot, do not give away the ending. 4. Your favorite part and why. 5. Would you recommend it? Use examples from the book.</P>
      <H>Metaphor vs. simile</H><P>A simile compares using &ldquo;like&rdquo; or &ldquo;as&rdquo;: <i>the camp was like a prison.</i> A metaphor says one thing <b>is</b> another: <i>the holes are his sentence.</i> Authors use them so a small detail can stand for a big idea.</P>
      <H>The five paragraph essay</H><P>Introduction with a thesis, three body paragraphs (one reason each, with evidence), and a conclusion that restates the thesis in new words.</P>
      <H>Commonly confused words</H><Table rows={[['their / there / they\'re', 'ownership / a place / they are'], ['its / it\'s', 'ownership / it is'], ['definitely', 'not &ldquo;definately&rdquo;'], ['separate', 'there is &ldquo;a rat&rdquo; in separate']]} />
    </>);
    case 'history': return wrap('Social Studies', <>
      <H>The three branches of government</H><P>Legislative (Congress) makes laws. Executive (the President) carries them out. Judicial (the courts) interprets them. Checks and balances keep any one branch from having too much power.</P>
      <H>Reading a timeline</H><P>Put events in order first, then look for cause and effect. A good timeline entry has a date, an event, and one sentence on why it mattered.</P>
      <H>States and capitals</H><P>Group them by region and learn five at a time. Minnesota: St. Paul, Wisconsin: Madison, Iowa: Des Moines. North Dakota. Bismarck. South Dakota - Pierre.</P>
    </>);
    case 'study': return wrap('Study Skills', <>
      <H>Use a planner</H><P>Write every assignment down the day it is given, with its due date. Check it before you leave school.</P>
      <H>Taking notes</H><P>Do not copy everything. Write the main idea, then two or three details underneath. Leave space to add to it later.</P>
      <H>Test day</H><P>Read every question before you start. Answer the ones you know first. Go back to the hard ones. Check your name is on it.</P>
      <H>Talking to your parents about homework</H><P>Show them your planner. Ask for help early, not the night before. If you finish, tell them, they are more likely to say yes to computer time.</P>
    </>);
    case 'reports': return wrap('Book Reports', <><P>See <span className="link-1999" onClick={() => go('english')}>English &rarr; Writing a book report</span>.</P></>);
  }
  return null;
}

export interface Article { url: string; site: string; tagline?: string; title: string; accent: string; bg?: string; font?: string; body: ReactNode }
export const ARTICLES: Article[] = [
  { url: 'www.northside.k12.us/kessler/fair', site: 'Mrs. Kessler\u2019s Class', tagline: 'archived snapshot, March 2006', title: 'Science Fair 2006!', accent: '#7a4a9a', body: <><P><i>This page was saved by an archive before the school website changed. Some images are missing.</i></P><P>Projects are due <b>Friday, March 10</b>. Every project needs four things: a question, a guess (your hypothesis), a fair test, and what happened.</P><H>Ideas if you are stuck</H><P>Which paper towel absorbs the most? Does music help plants grow? Which brand of bubble gum makes the biggest bubble? (Ask before chewing in class.)</P><P>Remember: change only ONE thing at a time. Everything else stays the same. That is what makes it a fair test!</P></> },
  { url: 'www.howdoi.com/whistle', site: 'HowDoI', tagline: 'how to do just about anything', title: 'Learn to Whistle in 5 Minutes', accent: '#2d6a4f', body: <><P>Wet your lips. Make a small round O, the shape your mouth makes saying the word &ldquo;too&rdquo;. Rest the tip of your tongue just behind your bottom teeth, low and flat.</P><P>Now blow gently. Gently! Almost everyone who cannot whistle is blowing far too hard. Slide your tongue a tiny bit forward and back until a note comes out, even a quiet one.</P><H>Still just air?</H><P>Totally normal. Most people need a few days. Practice in the car or the bath, anywhere with an echo. Once you get one note, the rest come quickly.</P></> },
  { url: 'answers.askbeeves.com/q/4471', site: 'Ask Beeves Answers', tagline: 'real people, real answers', title: 'why cant i whistle', accent: '#1d5fb5', body: <><P><b>Question</b> from soccerstar_09: i have tried for like a week and only air comes out. my brother can do it and he is SO annoying about it. why cant i</P><P><b>Best answer</b> (chosen by voters): some people take weeks. keep your lips loose and blow softer than you think you need to. practice in the car where nobody can hear you.</P><P><b>Other answers (3):</b> it took me until i was 10 &middot; put two fingers in your mouth (do not do this at the dinner table) &middot; whistling is overrated tbh</P></> },
  { url: 'www.sciencebuddy.com/absorb', site: 'ScienceBuddy', tagline: 'science fair projects that actually work', title: 'Which Paper Towel Absorbs the Most?', accent: '#c45a1a', body: <><P>A classic for a reason. You need three or four brands of paper towel, a measuring cup, a bowl of water and a kitchen scale.</P><H>What to do</H><P>Cut one square of each brand the same size. Weigh each one dry and write it down. Dip each square in the water for exactly 10 seconds, let it drip for 5, then weigh it again. The difference is how much water it held.</P><H>Do not forget a control</H><P>Do every brand three times and average the results. Keep the water, the time and the square size the same every time, so the only thing that changes is the brand.</P></> },
  { url: 'www.petpals.com/shake', site: 'PetPals', tagline: 'happy pets, happy people', title: 'Teaching Shake in One Afternoon', accent: '#b5651d', body: <><P>Hold a treat in a closed fist down near your dog&apos;s front paw. Then wait. Do not say anything yet.</P><P>Most dogs will sniff, then lick, then paw at your hand to get the treat. The moment the paw lifts, say &ldquo;shake&rdquo; and open your hand.</P><P>Do it ten times, take a break, then do ten more. By dinner most dogs will lift the paw when they hear the word. Keep sessions short and always end on a good one.</P></> },
  { url: 'forums.petpals.com/t/8823', site: 'PetPals Forums', tagline: 'happy pets, happy people', title: 'my dog only does tricks for food', accent: '#b5651d', body: <><P><b>tuckers_mom</b> wrote: he knows sit, shake and down but ONLY if he can see a treat. if my hands are empty he just stares at me. help</P><P><b>Reply from trainer_deb:</b> That is not a bug, that is the deal you made! Fade the treat slowly. Reward one in three, then one in five, and give lots of praise in between. Keep the treats in your pocket instead of your hand.</P><P><b>Reply from pugsrule:</b> my dog does tricks for cheese and honestly same</P></> },
  { url: 'www.backyardbuilds.com/fort', site: 'BackyardBuilds', tagline: 'weekend projects for the whole family', title: 'A Fort You Can Actually Finish', accent: '#6b4f2a', body: <><P>Start smaller than you want to. A fort you finish this weekend beats a fort you only draw. Pick a spot between two trees or against the fence, so you only need two new walls.</P><H>What you need</H><P>An old tarp, some rope, four clothespins and a blanket for the floor. Ask before using the good tarp. Ask before using any tarp, really.</P><H>Make it yours</H><P>A flashlight, a sign for the door and a password. The password is the most important part.</P></> },
  { url: 'www.kidbiz.com/lemonade', site: 'KidBiz', tagline: 'big ideas for young business people', title: 'Running a Lemonade Stand', accent: '#d4a017', body: <><P>Twenty five cents a cup is the right price. People will pay a quarter without thinking about it, and lots of them will tell you to keep the change.</P><H>Location, location, location</H><P>A corner beats a driveway every time. Set up near something people walk past, like the park or the pool.</P><H>The sign</H><P>Make it bigger than you think it needs to be. Big letters, one color, and the price written on it.</P></> },
  { url: 'www.backyardbugs.com/fireflies', site: 'BackyardBugs', tagline: 'the bugs in your backyard', title: 'Catching Fireflies Safely', accent: '#3d6b35', body: <><P>The best time is just after dusk on a warm, still night. Move slowly and cup your hands around the light instead of grabbing.</P><P>Use a clear jar and punch small holes in the lid. Add a damp leaf or a bit of wet paper towel so the air stays humid.</P><P>Let them go the same night. Fireflies do not live long in a jar, and they have important blinking to do.</P></> },
  { url: 'www.backyardbugs.com/why-glow', site: 'BackyardBugs', tagline: 'the bugs in your backyard', title: 'Why do fireflies light up?', accent: '#3d6b35', body: <><P>The glow is a signal. Fireflies blink to find each other, and every kind of firefly blinks in its own rhythm, like a secret code.</P><P>The light is made by a chemical reaction in the tail. It gives off almost no heat at all, so you could hold one all night and it would never feel warm.</P></> },
  { url: 'answers.askbeeves.com/q/9902', site: 'Ask Beeves Answers', tagline: 'real people, real answers', title: 'my sister goes in my room', accent: '#1d5fb5', body: <><P><b>Question</b> from bookworm_kid: my sister goes in my room when im not home and moves my stuff around. how do i make her stop</P><P><b>Best answer</b> (chosen by voters): ask your parents for a rule instead of a punishment. like knock first, or not when you are not home. rules last longer than getting somebody in trouble.</P><P><b>Other answers (2):</b> put a sign on the door &middot; booby trap (do not)</P></> },
  { url: 'www.familytalk.com/siblings', site: 'FamilyTalk', tagline: 'growing up together', title: 'Sharing a House With a Sibling', accent: '#8a3a6a', body: <><P>Most arguments between brothers and sisters are about territory, not about the thing being argued over. The TV remote is really about who gets to decide.</P><P>Give each child one space that is only theirs, even if it is just a shelf or a drawer. Agree on a few house rules together, like knocking on closed doors, and write them down where everyone can see them.</P></> },
  { url: 'www.wordmap.com/bubbler', site: 'WordMap', tagline: 'how America talks', title: 'Bubbler vs Drinking Fountain', accent: '#2a5d9f', body: <><P>Bubbler is the word you will hear across most of Wisconsin and in parts of New England. The name goes back to an early fountain that sent the water bubbling straight up.</P><P>Almost everywhere else says drinking fountain or water fountain. Cross the border from Wisconsin into Minnesota and the word changes in about ten minutes.</P></> },
  { url: 'www.homepchelp.com/slow', site: 'HomePCHelp', tagline: 'computer help for the whole family', title: 'Why Your Computer Got Slow', accent: '#33507a', body: <><P>Nine times out of ten it is toolbars. Every free game, cursor pack or screensaver that asks to install something usually brings a toolbar or two along with it.</P><H>What to do</H><P>Do not install anything a website says you need just to view it. Remove programs you do not recognize (ask a grown up first). Restart the computer at least once a week.</P><P>If it is still slow, it might just be old. That is allowed too.</P></> },
  { url: 'www.bellwoodsupply.com/support', site: 'Bellwood Supply', tagline: 'computers and electronics', title: 'Customer Support', accent: '#4a4a4a', body: <><Table rows={[['Phone', '1-800-555-0177'], ['Hours', 'Monday to Friday, 8 to 5 Central'], ['Warranty', 'One year, parts and labor']]} /><P>Before you call, write down your model number. It is on the sticker on the back of the tower.</P><P>If your computer is making a clicking noise, back up your files to a CD before doing anything else.</P></> },
  { url: 'www.gamefort.com/finn/walkthrough', site: 'GameFort', tagline: 'thousands of free games', title: 'Finn the Fish. Fan Walkthrough (in progress)', accent: '#e8730c', body: <><P><b>by finnfan2002</b>. this is NOT official. spoilers obviously</P><H>Part 1: Coral Cove (done)</H><P>Talk to Pearlina by the Moon Shell and ask who she gave the pouch to. Gus is in the Coral Gardens. Ask him about his spectacles. They are stuck in his old shell, and the shell opener is in the anemone.</P><H>Part 2: Bubble Bay (mostly done)</H><P>Give Gus his spectacles and he remembers which pouch was which. Pip at the Festival Grounds saw where it went. Look behind the crates!!</P><H>Part 3: The Trench (still working on it)</H><P>The professor in the deep cave knows something about the pouch. I cannot get the reef gate open. Email me if you get past the gate.</P></> },
  { url: 'forums.maplegrove.com/t/1180', site: 'Maple Grove Forums', tagline: 'the Maple Grove community', title: 'Best game for tickets?', accent: '#2f6fd0', body: <><P><b>arcade_queen</b> wrote: which arcade game gives the most tickets?? i want the big prize</P><P><b>Reply from mg_mayor_fan:</b> Whichever one is the seasonal bonus that week. Check the Gazette before you play anything.</P><P><b>Reply from xXbuilderXx:</b> skee ball if you are good at timing. stop playing when you get mad, you get worse</P></> },
  { url: 'www.howdoi.com/search-engines', site: 'HowDoI', tagline: 'how to do just about anything', title: 'How a Search Engine Works', accent: '#2d6a4f', body: <><P>A program called a crawler visits web pages and reads every word on them. Then it keeps a giant index, like the one in the back of a book, of which words are on which pages.</P><P>When you search, the engine looks up your words in the index and ranks the pages that match, usually by how many other pages link to them. Nobody is choosing your answer by hand. It just feels that way sometimes.</P></> },
  { url: 'www.kidsanswers.com/g2g', site: 'KidsAnswers', tagline: 'questions from kids, answered', title: 'What does g2g mean?', accent: '#c0392b', body: <><P><b>g2g</b> means &ldquo;got to go.&rdquo; People type it in chat when they have to leave quickly.</P><Table rows={[['brb', 'be right back'], ['ttyl', 'talk to you later'], ['lol', 'laughing out loud'], ['omg', 'oh my gosh'], ['idk', "I don't know"], ['jk', 'just kidding'], ['gtg / g2g', 'got to go']]} /><P>Tip: your parents probably know these too now.</P></> },
  { url: 'www.kidsanswers.com/santa', site: 'KidsAnswers', tagline: 'questions from kids, answered', title: 'Is Santa real? Serious answers only.', accent: '#c0392b', body: <><P>This question gets asked here every December, and we give the same answer: that is a conversation to have with your family. Every family celebrates differently, and they know the true answer for your house.</P><P>What we can tell you is that the tradition of Santa Claus goes back hundreds of years to a real person, Saint Nicholas, who was known for giving gifts to children in secret.</P></> },
  { url: 'www.kidsanswers.com/fish-blink', site: 'KidsAnswers', tagline: 'questions from kids, answered', title: 'Can fish blink?', accent: '#c0392b', body: <><P>Most fish cannot blink. They do not have eyelids, because they live in water and their eyes never dry out. Sharks are an exception, some have a special membrane that slides over the eye for protection.</P><P>So if your fish looks like it is staring at you, it is. It has no choice.</P></> },
  { url: 'www.skatetips.com/kickflip', site: 'SkateTips', tagline: 'learn to skate, one trick at a time', title: 'How to Kickflip', accent: '#1b1b1b', bg: '#e6e6e6', body: <><P>Learn the ollie first. Seriously. Everything below assumes you can ollie.</P><H>Foot position</H><P>Back foot on the tail. Front foot just behind the front bolts, angled a little toward your toes, with your heel hanging slightly off.</P><H>The flick</H><P>Pop the tail hard, slide your front foot up like an ollie, then flick off the corner of the nose with the outside of your foot. The flick is a quick brush, not a kick.</P><H>Land it</H><P>Watch the board spin once, catch it with your back foot first, then your front. Bend your knees. Expect to land primo (on the side of the board) about 200 times first. That is normal.</P></> },
  { url: 'www.recordszone.com/pizza', site: 'RecordsZone', tagline: 'the biggest, the longest, the most', title: 'World Record: Most Pizza', accent: '#d35400', body: <><P>The largest pizza ever made measured 122 feet 8 inches across and was baked in South Africa in 1990. It used 9,920 pounds of flour and 3,968 pounds of cheese.</P><P>The most pizza eaten in a sitting is tracked by competitive eating leagues; the record is over 40 slices in 10 minutes. Do not try this. Your stomach is not a competitive eater.</P><P>The longest pizza delivery on record traveled from Cape Town to Sydney - about 6,860 miles. It arrived cold.</P></> },
  { url: 'www.familylife.com/asking', site: 'FamilyLife Online', tagline: 'practical advice for busy families', title: 'Kids: How to Ask Your Parents for Something (and Actually Get a Yes)', accent: '#5b3a8a', body: <><P>1. <b>Pick your moment.</b> Not when they walk in the door, not during dinner cleanup. After dinner, when everyone is sitting down.</P><P>2. <b>Do your job first.</b> Homework done, room picked up, without being asked. It removes their easiest &ldquo;no.&rdquo;</P><P>3. <b>Ask, then stop talking.</b> Say what you want and why, in two sentences. Then wait. Do not argue with the first &ldquo;we&apos;ll see.&rdquo;</P><P>4. <b>Offer a trade.</b> An earlier bedtime the next night. A chore. Parents respect a negotiator.</P><P>5. <b>Accept the answer.</b> A calm &ldquo;okay&rdquo; today makes tomorrow&apos;s yes more likely.</P></> },
  { url: 'www.familylife.com/bedtime', site: 'FamilyLife Online', tagline: 'practical advice for busy families', title: 'How Late Should Kids Stay Up?', accent: '#5b3a8a', body: <><P>School age children need 9 to 11 hours of sleep. For most kids that means bed between 8:00 and 9:00 on school nights.</P><P>Summer and weekends are a good time to let bedtime slide an hour. Staying up until midnight once, as a special event, is a memory. Staying up until midnight every night is a problem by Wednesday.</P><P>If your child wants to stay up late, make it a plan: a movie, popcorn, and a firm end time. Half the fun is that it was allowed.</P></> },
  { url: 'www.typequest.com', site: 'TypeQuest', tagline: 'learn to type without looking', title: 'How to Type Faster', accent: '#0a7a5a', body: <><P><b>Home row first.</b> Left hand on A S D F, right hand on J K L ;. Your index fingers rest on the keys with the little bumps.</P><P><b>Stop looking down.</b> Put a towel over your hands if you have to. Speed comes from your fingers knowing where the keys are, not your eyes.</P><P><b>Accuracy before speed.</b> Type slowly and correctly for two weeks. The speed shows up on its own.</P><P><b>Practice 10 minutes a day.</b> Chat counts. So does typing up your book report instead of writing it by hand.</P><P>Average adult speed is about 40 words per minute. A good goal for middle school is 25&ndash;30.</P></> },
  { url: 'www.petpals.com/dog-birthday', site: 'PetPals', tagline: 'for people who love their pets a little too much', title: 'How to Throw a Birthday Party for Your Dog', accent: '#b5651d', body: <><P><b>Guests:</b> one or two dogs your dog already likes. This is not the day to make new friends.</P><P><b>Cake:</b> peanut butter (no xylitol), mashed banana, and oats. Bake in a small pan. Skip the frosting, or use plain yogurt.</P><P><b>Games:</b> hide treats around the yard. A new tennis ball. A kiddie pool if it is hot.</P><P><b>Hat:</b> optional. Your dog will remove it. Take the photo fast.</P><P>Most of all: he does not know it is his birthday. But you do, and that is the whole point.</P></> },
  { url: 'www.petpals.com/dog-sitting', site: 'PetPals', tagline: 'for people who love their pets a little too much', title: 'How to Dog Sit Like a Pro', accent: '#b5651d', body: <><P><b>Walks:</b> twice a day, at the same times as at home. Ask which way he likes to go.</P><P><b>Food and water:</b> exactly what the owner says, no extra. Fresh water every morning.</P><P><b>Treats:</b> keep them up high. Dogs can reach more than you think.</P><P><b>Socks:</b> pick them up. All of them.</P><P><b>Missing home:</b> a dog misses his family. Extra belly rubs and his own blanket help a lot.</P></> },
  { url: 'www.penguincove.com/help/igloo', site: 'Penguin Cove Help', tagline: 'waddle on in', title: 'Igloo Decorating Tips', accent: '#1a5fa0', bg: '#eaf4ff', body: <><P>Every igloo starts as one round room. You unlock more space at levels 10, 25, and 40.</P><P><b>Layout tips from the community:</b> keep the door area clear so friends can get in; put the biggest furniture against the walls; the fireplace goes in the middle if you have one, everyone gathers there.</P><P>Themes that always look good: Winter Lodge (wood + red rugs), Aquarium (blue floor + fish tanks), Arcade (dark floor + every game machine you own).</P><P>Furniture can be bought in the Catalog or won in the Snowball Arena.</P></> },
  { url: 'www.penguincove.com/help/account', site: 'Penguin Cove Help', tagline: 'waddle on in', title: 'My account was banned. What now?', accent: '#1a5fa0', bg: '#eaf4ff', body: <><P>Bans happen for language, sharing personal information, or using third party programs. Most bans are 24 hours; repeat offenses are longer.</P><P>If you believe a ban was a mistake, a <b>parent</b> can email support from the address on the account with the penguin name. We will look into it. We cannot lift bans over chat.</P><P>Using a &ldquo;trainer&rdquo; or cheat program is against the rules and can result in a permanent ban. There is no secret room behind the waterfall.</P></> },
  { url: 'www.penguincove.com/help/tips', site: 'Penguin Cove Help', tagline: 'waddle on in', title: 'Tips for earning coins faster', accent: '#1a5fa0', bg: '#eaf4ff', body: <><P>There are no cheat codes for Penguin Cove. Anyone who says otherwise is trying to get your password.</P><P><b>Fastest legitimate coins:</b> the daily fishing bonus, Snowball Arena (win streaks pay double), and the delivery mini-game in the Plaza. Play all three each day and you will reach level 50 in a few weeks.</P><P>Never share your password, even with a friend. Even a best friend.</P></> },
  { url: 'www.gamefort.com/games/maze', site: 'GameFort', title: 'The Maze Game', accent: '#2b3fbf', body: <><P>The Maze Game on GameFort is a normal maze. Arrow keys, find the exit, nothing jumps out. Anyone who sends you a &ldquo;maze game&rdquo; link that is not on GameFort: do not click it.</P></> },
];
export const articleByUrl = (u: string) => ARTICLES.find((a) => a.url === u || a.url.replace('www.', '') === u);
const COMMENTS: Record<string, [string, string][]> = {
  'www.kidsanswers.com/g2g': [['brookee_02', 'omg my cousin says this all the time and i just nodded. thank u'], ['lil_tony', 'g2g means get 2 gether?? no??']],
  'www.kidsanswers.com/santa': [['jacob_p', 'my sister showed me this and now she wont talk to me'], ['mom_of_3', 'This is a very kind answer. Thank you.'], ['SANTA_IS_REAL', 'not reading this']],
  'www.kidsanswers.com/fish-blink': [['fishguy77', 'i stared at my goldfish for 10 minutes to check. he won.']],
  'www.skatetips.com/kickflip': [['xXsk8rXx', 'first!!!!'], ['tonyhawk_fan', 'landed it after like 300 tries. my shins are destroyed'], ['dan_the_man', 'the foot placement picture helped a lot']],
  'www.recordszone.com/pizza': [['pizzaboy', 'i could beat this'], ['sarah_k', 'no you could not']],
  'www.familylife.com/asking': [['just_a_kid', 'tried the "help with chores first" thing. worked. got a sleepover.'], ['tired_dad', 'Please stop sharing this with my children.']],
  'www.familylife.com/bedtime': [['nightowl_11', 'made it to 11:48. so close']],
  'www.typequest.com': [['hunterpecker', '34 wpm and climbing'], ['ms_alvarez', 'I assign this to my 5th graders every fall. Still the best free one.'], ['kevin_r', 'home row is a lie']],
  'www.petpals.com/dog-birthday': [['tuckers_mom', 'made the peanut butter cake. he ate the candle too.'], ['pugsrule', 'my dog does not know when his birthday is but i do and thats what matters']],
  'www.petpals.com/dog-sitting': [['dogsitter_kid', 'we watched my friends dog last weekend. he ate my sisters sock'], ['pugsrule', 'the blanket thing really works']],
  'www.penguincove.com/help/igloo': [['icebreaker99', 'the split level layout is the only correct one'], ['penguinpal', 'how do i get the pizza parlor set back?']],
  'www.penguincove.com/help/account': [['waddles_4ever', 'i was NOT saying bad words it was my brother']],
  'www.penguincove.com/help/tips': [['coolpenguin', 'the hidden pin under the dock. thank me later']],
  default: [['maddie_h', 'exactly what i was looking for. thank u']],
};
export function ArticlePage({ a, navigate }: { a: Article; navigate: (u: string) => void }) {
  const siblings = ARTICLES.filter((x) => x.site === a.site);
  const home = siblings[0] ?? a;
  const nav = [{ label: 'Home', onClick: () => navigate(home.url) }, ...siblings.filter((x) => x.url !== a.url).slice(0, 4).map((x) => ({ label: x.title.length > 26 ? x.title.slice(0, 24) + '…' : x.title, onClick: () => navigate(x.url) })), { label: 'Search', onClick: () => navigate('www.askbeeves.com') }];
  const sidebar = (
    <>
      <div style={{ fontWeight: 700, color: a.accent, marginBottom: 4 }}>On {a.site}</div>
      {siblings.map((x) => <div key={x.url}><span className={'link-1999' + (x.url === a.url ? ' visited' : '')} onClick={() => navigate(x.url)}>{x.title}</span></div>)}
      <div style={{ fontWeight: 700, color: a.accent, margin: '10px 0 4px' }}>Elsewhere</div>
      <div><span className="link-1999" onClick={() => navigate('www.gamefort.com')}>GameFort</span></div>
      <div><span className="link-1999" onClick={() => navigate('www.citylibrary.org')}>City Public Library</span></div>
      <div><span className="link-1999" onClick={() => navigate('www.askbeeves.com')}>AskBeeves</span></div>
      <div style={{ marginTop: 10, background: '#fff', border: '1px solid #bbb', padding: 6, fontSize: 10, textAlign: 'center' }}>
        <div style={{ color: '#888', fontSize: 8, letterSpacing: 1 }}>ADVERTISEMENT</div>
        <div style={{ fontWeight: 900, color: '#d81b60' }}>FREE cursors!!</div>
        <span className="link-1999" onClick={() => navigate('www.coolcursors.com')}>CursorCastle.com</span>
      </div>
    </>
  );
  const comments = COMMENTS[a.url] ?? COMMENTS.default;
  return (
    <SubPage site={a.site} tagline={a.tagline} title={a.title} nav={nav} accent={a.accent} bg={a.bg} font={a.font ?? 'Verdana, Tahoma, sans-serif'} onBack={() => navigate(home.url)} backLabel={a.site + ' home'} sidebar={sidebar}>
      <div style={{ fontSize: 10, color: '#777', marginBottom: 8 }}>Posted June 2009 &middot; {Math.floor(1200 + a.title.length * 137) % 9000 + 800} views</div>
      {a.body}
      <div style={{ marginTop: 18, borderTop: '1px solid rgba(0,0,0,0.15)', paddingTop: 8 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Comments ({comments.length})</div>
        {comments.map(([who, txt], i) => <div key={i} style={{ background: 'rgba(0,0,0,0.04)', padding: '5px 8px', marginBottom: 4, fontSize: 11 }}><b style={{ color: a.accent }}>{who}</b> <span style={{ color: '#888', fontSize: 9 }}>· June 2009</span><br />{txt}</div>)}
        <div style={{ fontSize: 11, marginTop: 6 }}>Leave a comment: <input className="bevel-in" style={{ padding: '2px 6px', fontSize: 11, width: 220 }} placeholder="(you must be logged in)" readOnly /></div>
      </div>
    </SubPage>
  );
}
