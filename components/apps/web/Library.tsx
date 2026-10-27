'use client';

import { ImageMap, SubPage, P, H, Table, type Area } from './SiteMap';

const NAV_ACCENT = '#5a3a1e';
export type LibraryPage = 'home' | 'catalog' | 'account' | 'events' | 'research' | 'kids' | 'teens' | 'about' | 'hours' | 'newarrivals' | 'ebooks' | 'locations' | 'contact' | 'summer' | 'homework' | 'renew' | 'fines' | 'search';

export function LibrarySite({ page, go, back, query }: { page: LibraryPage; go: (p: LibraryPage) => void; back: () => void; query?: string }) {
  if (page === 'home') {
    const areas: Area[] = [
      { x: 2, y: 16.5, w: 9, h: 5, title: 'Home', onClick: () => go('home') },
      { x: 13, y: 16.5, w: 10, h: 5, title: 'Catalog', onClick: () => go('catalog') },
      { x: 25, y: 16.5, w: 14, h: 5, title: 'My Account', onClick: () => go('account') },
      { x: 40, y: 16.5, w: 9, h: 5, title: 'Events', onClick: () => go('events') },
      { x: 50.5, y: 16.5, w: 11, h: 5, title: 'Research', onClick: () => go('research') },
      { x: 63, y: 16.5, w: 8, h: 5, title: 'Kids', onClick: () => go('kids') },
      { x: 73, y: 16.5, w: 9, h: 5, title: 'Teens', onClick: () => go('teens') },
      { x: 84, y: 16.5, w: 12, h: 5, title: 'About Us', onClick: () => go('about') },
      { x: 1.5, y: 22.6, w: 15.5, h: 3.6, title: 'Library Home', onClick: () => go('home') },
      { x: 1.5, y: 26.73, w: 15.5, h: 3.6, title: 'Search Catalog', onClick: () => go('catalog') },
      { x: 1.5, y: 30.86, w: 15.5, h: 3.6, title: 'My Account', onClick: () => go('account') },
      { x: 1.5, y: 34.99, w: 15.5, h: 3.6, title: 'New Arrivals', onClick: () => go('newarrivals') },
      { x: 1.5, y: 39.12, w: 15.5, h: 3.6, title: 'eBooks & eAudiobooks', onClick: () => go('ebooks') },
      { x: 1.5, y: 43.25, w: 15.5, h: 3.6, title: 'Research & Homework', onClick: () => go('homework') },
      { x: 1.5, y: 47.38, w: 15.5, h: 3.6, title: 'Kids\' Corner', onClick: () => go('kids') },
      { x: 1.5, y: 51.51, w: 15.5, h: 3.6, title: 'Teen Zone', onClick: () => go('teens') },
      { x: 1.5, y: 55.64, w: 15.5, h: 3.6, title: 'Programs & Events', onClick: () => go('events') },
      { x: 1.5, y: 59.77, w: 15.5, h: 3.6, title: 'Library Locations', onClick: () => go('locations') },
      { x: 1.5, y: 63.9, w: 15.5, h: 3.6, title: 'Hours & Directions', onClick: () => go('hours') },
      { x: 1.5, y: 68.03, w: 15.5, h: 3.6, title: 'Contact Us', onClick: () => go('contact') },
      { x: 78.5, y: 53.2, w: 15, h: 2.9, title: 'View My Checkouts', onClick: () => go('account') },
      { x: 78.5, y: 56.2, w: 15, h: 2.9, title: 'Renew Items', onClick: () => go('renew') },
      { x: 78.5, y: 59.2, w: 15, h: 2.9, title: 'Holds / Reservations', onClick: () => go('account') },
      { x: 78.5, y: 62.2, w: 15, h: 2.9, title: 'Fines & Fees', onClick: () => go('fines') },
      { x: 78.5, y: 65.2, w: 15, h: 2.9, title: 'Update My Information', onClick: () => go('account') },
      { x: 19.5, y: 75, w: 25, h: 14, title: 'Summer Reading Club', onClick: () => go('summer') },
      { x: 45.5, y: 75, w: 25.5, h: 14, title: 'eBooks & eAudiobooks', onClick: () => go('ebooks') },
      { x: 72, y: 75, w: 26.5, h: 14, title: 'Research & Homework Help', onClick: () => go('homework') },
      { x: 2, y: 95, w: 13, h: 3, title: 'back to The Lobby', onClick: back },
      { x: 67, y: 95.5, w: 6, h: 3, title: 'Privacy Policy', onClick: () => go('about') },
      { x: 74, y: 95.5, w: 6, h: 3, title: 'Terms of Use', onClick: () => go('about') },
      { x: 81, y: 95.5, w: 4, h: 3, title: 'Site Map', onClick: () => go('about') },
      { x: 86, y: 95.5, w: 5, h: 3, title: 'Contact Us', onClick: () => go('contact') },
    ];
    return <ImageMap src="/sites/library.jpg" alt="City Public Library" areas={areas} />;
  }

  const nav = [
    { label: 'Home', onClick: () => go('home') }, { label: 'Catalog', onClick: () => go('catalog') }, { label: 'My Account', onClick: () => go('account') },
    { label: 'Events', onClick: () => go('events') }, { label: 'Kids', onClick: () => go('kids') }, { label: 'Teens', onClick: () => go('teens') }, { label: 'About Us', onClick: () => go('about') },
  ];
  const wrap = (title: string, body: React.ReactNode) => (
    <SubPage site="City Public Library" tagline="Read. Learn. Discover. Together." title={title} nav={nav} accent={NAV_ACCENT} onBack={() => go('home')} backLabel="Library Home"
      topRight={<span><span className="link-1999" style={{ color: '#fff' }} onClick={() => go('account')}>My Account</span> · <span className="link-1999" style={{ color: '#fff' }} onClick={() => go('hours')}>Hours</span></span>}
      sidebar={<>
        {([['home', 'Library Home'], ['catalog', 'Search Catalog'], ['account', 'My Account'], ['newarrivals', 'New Arrivals'], ['ebooks', 'eBooks & eAudiobooks'], ['homework', 'Research & Homework'], ['kids', "Kids' Corner"], ['teens', 'Teen Zone'], ['events', 'Programs & Events'], ['locations', 'Library Locations'], ['hours', 'Hours & Directions'], ['contact', 'Contact Us']] as [LibraryPage, string][]).map(([k, l]) => <div key={k}><span className={'link-1999' + (page === k ? ' visited' : '')} onClick={() => go(k)}>{l}</span></div>)}
        <div style={{ marginTop: 8, fontSize: 10, color: '#5a3a1e', fontStyle: 'italic' }}>Main Library open today 9 to 8</div>
      </>}>{body}</SubPage>
  );

  switch (page) {
    case 'catalog': return wrap('Online Catalog', <>
      <P>Search the catalog by title, author, subject, or keyword. Items available at all three branches are listed together; check the &ldquo;Location&rdquo; column before you make the trip.</P>
      <H>Search tips</H>
      <P>Use quotation marks for an exact title. Leave out &ldquo;a&rdquo;, &ldquo;an&rdquo;, and &ldquo;the&rdquo; at the beginning of a title. Author searches work best as last name, first name.</P>
      <H>Placing a hold</H>
      <P>Sign in to My Account, then click &ldquo;Place Hold&rdquo; on any item. We will call or email when it is ready. Holds are kept at the desk for 7 days.</P>
    </>);
    case 'search': return wrap(`Catalog results${query ? ` for "${query}"` : ''}`, <>
      <Table rows={[['Holes. Louis Sachar', 'Juvenile Fiction · SAC · Checked out (1 hold)'], ['Small Steps. Louis Sachar', 'Juvenile Fiction · SAC · Available (Main)'], ['There\'s a Boy in the Girls\' Bathroom - Louis Sachar', 'Juvenile Fiction · SAC · Available (Northside)'], ['Holes (audiobook, 4 CDs)', 'Juvenile Audio · SAC · Available (Main)']]} />
      <P>4 results. Items marked &ldquo;Available&rdquo; can be found on the shelf; ask at the desk if you cannot locate one.</P>
    </>);
    case 'account': return wrap('My Account', <>
      <Table rows={[['Card number', '2100 3392 **** ****'], ['Items out', '1'], ['Overdue', '1 - Holes (Louis Sachar), due 3 weeks ago'], ['Fines', '$0.60'], ['Holds', 'None']]} />
      <P>Overdue items may be renewed once online unless another patron has placed a hold. Fines accrue at 10&cent; per day per item to a maximum of $5.00.</P>
      <P><span className="link-1999" onClick={() => go('renew')}>Renew items</span> &middot; <span className="link-1999" onClick={() => go('fines')}>Pay fines</span></P>
    </>);
    case 'renew': return wrap('Renew Items', <>
      <P><b>Holes</b> - Louis Sachar</P>
      <P>Renewal <b>not available</b>: another patron has placed a hold on this item. Please return it to any branch or the outdoor book drop. The fine stops accruing the day it is returned.</P>
    </>);
    case 'fines': return wrap('Fines & Fees', <>
      <Table rows={[['Overdue books', '10¢ per day, per item (max $5.00)'], ['Overdue DVDs', '$1.00 per day (max $5.00)'], ['Lost or damaged item', 'Replacement cost + $3.00 processing'], ['Replacement library card', '$1.00']]} />
      <P>Fines may be paid at any branch desk by cash or check. Accounts with more than $10.00 in fines cannot check out additional items until the balance is paid.</P>
      <P>Your current balance: <b>$0.60</b></P>
    </>);
    case 'events': return wrap('Programs & Events', <>
      <Table rows={[['Mon 10:30 am', 'Toddler Storytime (ages 1 to 3) - Children\'s Room'], ['Tue 4:00 pm', 'Lego Club (grades K, 5) - Community Room'], ['Wed 6:30 pm', 'Adult Book Discussion, this month: The Kite Runner'], ['Thu 3:30 pm', 'Teen Gaming Hour. Teen Zone'], ['Sat 11:00 am', 'Family Movie Matinee, free popcorn']]} />
      <P>All programs are free. Children under 8 must be accompanied by an adult. Registration is required for Lego Club; sign up at the Children\'s desk.</P>
    </>);
    case 'research': return wrap('Research', <>
      <P>Library cardholders have free access to the following databases from home. Enter your card number when prompted.</P>
      <Table rows={[['World Book Online', 'Encyclopedia articles, maps, and primary sources'], ['NewsBank', 'Local and national newspapers, 1990, present'], ['Learning Express', 'Practice tests and career guides'], ['Ancestry Library Edition', 'In-library use only']]} />
    </>);
    case 'homework': return wrap('Research & Homework Help', <>
      <P>Stuck on an assignment? Start here.</P>
      <H>Live Homework Help</H>
      <P>Free online tutoring for grades 4 to 12, every day 2:00 to 10:00 pm. Subjects: math, science, social studies, English. Sign in with your library card number.</P>
      <H>Book reports</H>
      <P>Ask at the Children\'s or Teen desk for our book report guide. It covers choosing a book, taking notes as you read, and organizing a summary, a favorite part, and a recommendation. Reference librarians can help you find reviews and author information.</P>
      <H>Citing sources</H>
      <P>Print copies of the MLA quick guide are available at the Reference desk.</P>
    </>);
    case 'kids': return wrap("Kids' Corner", <>
      <P>The Children\'s Room is on the first floor, to the left of the main entrance. Picture books, early readers, chapter books, and juvenile nonfiction are shelved there, along with a family computer area.</P>
      <H>Recommended reads</H>
      <Table rows={[['Grades 2 to 3', 'Magic Tree House series; Frog and Toad; Junie B. Jones'], ['Grades 4 to 5', 'Holes; Because of Winn-Dixie; The Tale of Despereaux'], ['Grades 6 to 8', 'Hatchet; The Giver; Hoot; Maniac Magee']]} />
      <P>Storytimes for toddlers and preschoolers run Monday and Wednesday mornings. No registration needed.</P>
    </>);
    case 'teens': return wrap('Teen Zone', <>
      <P>The Teen Zone is on the second floor. Graphic novels, manga, magazines, and the teen fiction collection are here, plus four computers reserved for ages 12 to 18 after school.</P>
      <H>Volunteer</H>
      <P>Teens ages 13+ can earn community service hours by shelving, helping with summer reading, or assisting at children&rsquo;s programs. Pick up an application at the desk.</P>
    </>);
    case 'about': return wrap('About Us', <>
      <P>City Public Library has served the community since 1911. The Main Library moved to its current building at 123 Main Street in 1998; the Northside and Eastview branches opened in 1974 and 2002.</P>
      <Table rows={[['Collection', '212,000 items'], ['Cardholders', '38,400'], ['Annual visits', '410,000'], ['Staff', '46 full- and part time']]} />
      <P>The Library is governed by a seven member Board of Trustees appointed by the City Council. Board meetings are held the second Tuesday of each month at 6:00 pm and are open to the public.</P>
    </>);
    case 'hours': return wrap('Hours & Directions', <>
      <Table rows={[['Monday, Thursday', '9:00 am, 8:00 pm'], ['Friday, Saturday', '9:00 am, 6:00 pm'], ['Sunday', 'Closed (Main open 1 to 5 pm Oct, May)']]} />
      <P>The Main Library is at 123 Main Street, one block north of the town square. Parking is free in the lot behind the building and on Main Street after 6:00 pm. The #4 bus stops directly in front.</P>
    </>);
    case 'newarrivals': return wrap('New Arrivals', <>
      <Table rows={[['Fiction', 'The Help; The Girl with the Dragon Tattoo; Olive Kitteridge'], ['Juvenile', 'Diary of a Wimpy Kid: The Last Straw; The Graveyard Book'], ['DVD', 'WALL·E; Slumdog Millionaire; Marley & Me'], ['Music CD', 'Taylor Swift - Fearless; Coldplay - Viva la Vida']]} />
      <P>New items are shelved on the display near the entrance for their first month. New DVDs check out for 7 days.</P>
    </>);
    case 'ebooks': return wrap('eBooks & eAudiobooks', <>
      <P>Download titles to your computer or MP3 player, free with your library card. Titles check out for 14 days and return automatically, no late fees.</P>
      <P>You will need the free OverDrive Media Console software. Some audiobooks can be transferred to an iPod; look for the &ldquo;MP3 audiobook&rdquo; format.</P>
    </>);
    case 'locations': return wrap('Library Locations', <>
      <Table rows={[['Main Library', '123 Main Street · 555-0142'], ['Northside Branch', '4410 Hamline Avenue · 555-0148'], ['Eastview Branch', '890 Lake Road · 555-0151']]} />
      <P>Items may be returned to any branch regardless of where they were checked out.</P>
    </>);
    case 'contact': return wrap('Contact Us', <>
      <Table rows={[['Phone', '555-0142'], ['Reference desk', '555-0142 ext. 3'], ['Email', 'reference@citypubliclibrary.org'], ['Mail', '123 Main Street, Maple Grove, MN 55369']]} />
      <P>We answer email questions within one business day.</P>
    </>);
    case 'summer': return wrap('Summer Reading Club', <>
      <P>June 15, August 15. Open to kids from birth through grade 12.</P>
      <P>Sign up at any branch and pick up a reading log. Read (or be read to) for 20 minutes a day. Bring your log to the desk every 5 hours of reading to collect a prize and a raffle ticket.</P>
      <Table rows={[['5 hours', 'Bookmark + sticker sheet'], ['10 hours', 'Free book (your choice from the cart)'], ['15 hours', 'Pizza coupon from Italian Pie Shoppe'], ['20 hours', 'Grand prize raffle entry, bicycle']]} />
      <P>Finish 20 hours and you are invited to the End-of-Summer Party on August 15 in the Community Room.</P>
    </>);
  }
  return null;
}
