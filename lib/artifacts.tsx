import type { ReactElement } from 'react';

export interface BuiltinPicture {
  id: string;
  name: string;
  date: string;
  svg: ReactElement;
}


/* eslint-disable @next/next/no-img-element */
const pic = (src: string, alt: string) => <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#fff' }} draggable={false} />;

export const BUILTIN_PICTURES: BuiltinPicture[] = [
  { id: 'bp-family', name: 'my family.bmp', date: '4/3/2008', svg: pic('/pictures/family.jpg', 'my family') },
  { id: 'bp-rainbow', name: 'rainbow.bmp', date: '2/19/2009', svg: pic('/pictures/rainbow.jpg', 'rainbow') },
  { id: 'bp-birthday', name: 'my birthday.jpg', date: '6/30/2008', svg: pic('/pictures/birthday.jpg', 'my birthday') },
  { id: 'bp-tucker', name: 'tucker.jpg', date: '5/2/2008', svg: pic('/pictures/tucker.jpg', 'tucker') },
];




