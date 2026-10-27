'use client';

import { ImageMap, SubPage, P, H, Table, type Area } from './SiteMap';

export type PiePage = 'home' | 'menu' | 'specials' | 'about' | 'location' | 'contact' | 'order' | 'pizza' | 'pasta' | 'sandwiches' | 'salads' | 'appetizers' | 'desserts' | 'beverages' | 'kids';
const RED = '#a5261e';

export function PieShoppeSite({ page, go, back, onOrder }: { page: PiePage; go: (p: PiePage) => void; back: () => void; onOrder: () => void }) {
  if (page === 'home') {
    const areas: Area[] = [
      { x: 10, y: 23, w: 8, h: 4, title: 'Home', onClick: () => go('home') },
      { x: 23, y: 23, w: 8, h: 4, title: 'Menu', onClick: () => go('menu') },
      { x: 35.5, y: 23, w: 9, h: 4, title: 'Specials', onClick: () => go('specials') },
      { x: 49.5, y: 23, w: 9, h: 4, title: 'About Us', onClick: () => go('about') },
      { x: 65, y: 23, w: 9, h: 4, title: 'Location', onClick: () => go('location') },
      { x: 79, y: 23, w: 9, h: 4, title: 'Contact', onClick: () => go('contact') },
      { x: 5, y: 38.5, w: 10, h: 3.6, title: 'Pizza', onClick: () => go('pizza') },
      { x: 5, y: 43, w: 10, h: 3.6, title: 'Pasta', onClick: () => go('pasta') },
      { x: 5, y: 47.3, w: 12, h: 3.6, title: 'Sandwiches', onClick: () => go('sandwiches') },
      { x: 5, y: 51.7, w: 10, h: 3.6, title: 'Salads', onClick: () => go('salads') },
      { x: 5, y: 56, w: 12, h: 3.6, title: 'Appetizers', onClick: () => go('appetizers') },
      { x: 5, y: 60.5, w: 10, h: 3.6, title: 'Desserts', onClick: () => go('desserts') },
      { x: 5, y: 65, w: 12, h: 3.6, title: 'Beverages', onClick: () => go('beverages') },
      { x: 5, y: 69.5, w: 12, h: 3.6, title: 'Kids Menu', onClick: () => go('kids') },
      { x: 2, y: 75, w: 18, h: 15, title: 'Call for takeout', onClick: () => go('contact') },
      { x: 21.5, y: 30, w: 57, h: 37, title: 'Authentic Italian Flavor', onClick: () => go('about') },
      { x: 21.5, y: 68.5, w: 18.5, h: 20, title: 'Lunch Special', onClick: () => go('specials') },
      { x: 40.5, y: 68.5, w: 19, h: 20, title: 'Family Nights', onClick: () => go('specials') },
      { x: 60, y: 68.5, w: 19, h: 20, title: 'Garlic Knots', onClick: () => go('appetizers') },
      { x: 81.5, y: 30, w: 17, h: 23, title: 'Order Online', onClick: onOrder },
      { x: 81.5, y: 56, w: 17, h: 19, title: 'Our Hours', onClick: () => go('location') },
      { x: 81.5, y: 76, w: 17, h: 14, title: 'Visit Us', onClick: () => go('location') },
      { x: 30.5, y: 94.5, w: 4, h: 3, title: 'Home', onClick: () => go('home') },
      { x: 36, y: 94.5, w: 4, h: 3, title: 'Menu', onClick: () => go('menu') },
      { x: 41, y: 94.5, w: 5, h: 3, title: 'Specials', onClick: () => go('specials') },
      { x: 48, y: 94.5, w: 5.5, h: 3, title: 'About Us', onClick: () => go('about') },
      { x: 55, y: 94.5, w: 5, h: 3, title: 'Location', onClick: () => go('location') },
      { x: 62, y: 94.5, w: 5, h: 3, title: 'Contact', onClick: () => go('contact') },
    ];
    return <ImageMap src="/sites/pieshoppe.jpg" alt="Italian Pie Shoppe" areas={areas} quiet />;
  }
  const nav = [{ label: 'Home', onClick: () => go('home') }, { label: 'Menu', onClick: () => go('menu') }, { label: 'Specials', onClick: () => go('specials') }, { label: 'About Us', onClick: () => go('about') }, { label: 'Location', onClick: () => go('location') }, { label: 'Contact', onClick: () => go('contact') }];
  const wrap = (title: string, body: React.ReactNode) => (
    <SubPage site="Italian Pie Shoppe" tagline="Good Food. Good Friends. Great Pizza.. Est. 1987" title={title} nav={nav} accent={RED} bg="#f6f1e4" onBack={() => go('home')}
      topRight={<span>Call for takeout: <b>555-0142</b></span>}
      sidebar={<>
        <div style={{ fontWeight: 700, color: RED, marginBottom: 4 }}>Our Menu</div>
        {(['pizza', 'pasta', 'sandwiches', 'salads', 'appetizers', 'desserts', 'beverages', 'kids'] as PiePage[]).map((k) => <div key={k}><span className={'link-1999' + (page === k ? ' visited' : '')} onClick={() => go(k)}>🍕 {k === 'kids' ? 'Kids Menu' : k[0].toUpperCase() + k.slice(1)}</span></div>)}
        <div style={{ fontWeight: 700, color: RED, margin: '10px 0 4px' }}>Our Hours</div>
        <div style={{ fontSize: 10 }}>Mon: Closed<br />Tue, Thu: 11 to 9<br />Fri, Sat: 11 to 10<br />Sun: 11 to 9</div>
        <div style={{ marginTop: 8 }}><span className="link-1999" onClick={onOrder}>Order Online &raquo;</span></div>
      </>}>{body}</SubPage>
  );
  const menuLinks = <P>{(['pizza', 'pasta', 'sandwiches', 'salads', 'appetizers', 'desserts', 'beverages', 'kids'] as PiePage[]).map((k, i) => <span key={k}>{i ? ' · ' : ''}<span className="link-1999" onClick={() => go(k)}>{k === 'kids' ? 'Kids Menu' : k[0].toUpperCase() + k.slice(1)}</span></span>)}</P>;
  switch (page) {
    case 'menu': return wrap('Our Menu', <>{menuLinks}<P>Everything is made fresh daily. Dough is made every morning; sauce is our family recipe. Ask about gluten-free crust (12&quot; only).</P></>);
    case 'pizza': return wrap('Pizza', <>
      <Table rows={[['Cheese', '10" $7.99 · 14" $11.99 · 16" $13.99'], ['One topping', '10" $8.99 · 14" $12.99 · 16" $14.99'], ['Each additional topping', '$1.00 / $1.50 / $1.75'], ['The Shoppe Special', 'pepperoni, sausage, mushroom, onion, green pepper, 14" $15.99'], ['Meat Lovers', 'pepperoni, sausage, ham, bacon, 14" $15.99'], ['Veggie', 'mushroom, onion, green pepper, tomato, olive, 14" $14.99']]} />
      <P>Toppings: pepperoni, sausage, ham, bacon, ground beef, mushroom, onion, green pepper, black olive, tomato, pineapple, jalapeño, extra cheese.</P>{menuLinks}</>);
    case 'pasta': return wrap('Pasta', <><Table rows={[['Spaghetti & Meatballs', '$8.49'], ['Baked Lasagna', '$9.49'], ['Fettuccine Alfredo', '$8.99 (add chicken $2.00)'], ['Baked Ravioli', '$8.49'], ['Mostaccioli', '$7.99']]} /><P>All pasta served with garlic bread. Add a side salad for $1.99.</P>{menuLinks}</>);
    case 'sandwiches': return wrap('Sandwiches', <><Table rows={[['Italian Sub', '$6.49'], ['Meatball Sub', '$6.49'], ['Chicken Parmesan Sub', '$6.99'], ['Ham & Cheese', '$5.99'], ['Steak Hoagie', '$7.49']]} /><P>Served hot on a fresh-baked roll with chips.</P>{menuLinks}</>);
    case 'salads': return wrap('Salads', <><Table rows={[['Garden Salad', 'small $3.49 · large $5.99'], ['Caesar Salad', 'small $3.99 · large $6.49'], ['Antipasto Salad', '$7.49'], ['Chicken Caesar', '$7.99']]} /><P>Dressings: Italian, ranch, Caesar, blue cheese, French.</P>{menuLinks}</>);
    case 'appetizers': return wrap('Appetizers', <><Table rows={[['Garlic Knots', '6 for $3.50 · 12 for $6.00'], ['Cheesy Bread', '$4.99'], ['Mozzarella Sticks', '$5.49'], ['Chicken Wings', '10 for $7.99, mild, hot, or BBQ'], ['Breadsticks with marinara', '$3.99']]} />{menuLinks}</>);
    case 'desserts': return wrap('Desserts', <><Table rows={[['Cannoli', '$2.49'], ['Tiramisu', '$3.99'], ['Cinnamon Knots', '6 for $3.99'], ['Spumoni', '$2.99']]} />{menuLinks}</>);
    case 'beverages': return wrap('Beverages', <><Table rows={[['Fountain drinks', 'small $1.29 · large $1.79, free refills dine-in'], ['2-liter (with any large pizza)', '$2.49'], ['Bottled water', '$1.00'], ['Coffee', '$1.00']]} />{menuLinks}</>);
    case 'kids': return wrap('Kids Menu', <><P>For our guests 10 and under. Each comes with a small drink and a scoop of spumoni.</P><Table rows={[['Personal cheese pizza', '$4.99'], ['Spaghetti & one meatball', '$4.99'], ['Chicken fingers & fries', '$4.99'], ['Grilled cheese', '$3.99']]} /><P>Crayons and a coloring sheet at every table.</P>{menuLinks}</>);
    case 'specials': return wrap('Specials', <>
      <H>Lunch Special - $5.99</H><P>Two slices and a fountain drink, 11 am, 2 pm daily. Add a garden salad for $1.50.</P>
      <H>Family Night, every Tuesday</H><P>Large one topping pizza $11.99. Dine in or carry out. No coupon needed.</P>
      <H>Garlic Knots</H><P>6 for $3.50 with any pizza order.</P>
      <H>Little League teams</H><P>Show your jersey after a game for a free pitcher of pop with two or more large pizzas.</P>
    </>);
    case 'about': return wrap('About Us', <>
      <P>Italian Pie Shoppe opened in 1987 on Main Street with six tables and one oven. The recipes came from the family kitchen: a slow cooked tomato sauce, hand-stretched dough, and a blend of three cheeses that has not changed in twenty years.</P>
      <P>Today the second generation runs the restaurant. We still make the dough every morning, we still cut the pizza in squares if you ask, and most of the staff went to school right here in town.</P>
      <P>Thank you for twenty years of Tuesday nights.</P>
    </>);
    case 'location': return wrap('Location & Hours', <>
      <P>123 Main Street, Maple Grove, MN 55369 - across from the town clock, next to the toy store. Parking on Main Street and in the city lot behind the building.</P>
      <Table rows={[['Monday', 'Closed'], ['Tuesday, Thursday', '11 am, 9 pm'], ['Friday, Saturday', '11 am, 10 pm'], ['Sunday', '11 am, 9 pm']]} />
      <P>Delivery within 5 miles, $2.00 charge, $12 minimum. Last delivery 30 minutes before close.</P>
    </>);
    case 'contact': return wrap('Contact', <>
      <Table rows={[['Phone (takeout & delivery)', '555-0142'], ['Catering', '555-0142, ask for the manager'], ['Email', 'info@italianpieshoppe.com'], ['Address', '123 Main Street, Maple Grove, MN 55369']]} />
      <P>Call ahead for parties of 8 or more. We can accommodate up to 30 in the back room.</P>
    </>);
    case 'order': return wrap('Order Online', <><P>Online ordering is coming soon. Please call 555-0142 to place your order.</P></>);
  }
  return null;
}
