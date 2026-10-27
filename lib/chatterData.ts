export interface Line { who: 'them' | 'me'; text: string }

export interface Session { date: string; lines: Line[]; live?: boolean }

export interface Buddy {
  id: string;
  screenName: string;
  real: string;
  history: Session[];
}

export const MY_NAME = 'macgruber7';

export const BUDDIES: Buddy[] = [
  {
    id: 'dad', screenName: 'dad', real: 'Dad',
    history: [
      { date: 'March 14, 2009, 8:15 PM', lines: [
        { who: 'them', text: 'farkle after dinner?' },
        { who: 'me', text: 'yes!!' },
      ] },
      { date: 'April 25, 2009, 6:40 PM', lines: [
        { who: 'them', text: 'first tball practice tomorrow. 9am' },
        { who: 'me', text: 'r u coming' },
        { who: 'them', text: 'coming? im the coach. i have a hat that says coach' },
        { who: 'me', text: 'u didnt tell me that' },
        { who: 'them', text: 'well you know now!' },
      ] },
      { date: 'May 23, 2009, 1:10 PM', lines: [
        { who: 'me', text: 'r u in the family room' },
        { who: 'them', text: 'watching nascar' },
      ] },
    ],
  },

  {
    id: 'mom', screenName: 'mom', real: 'Mom',
    history: [
      { date: 'April 18, 2009, 7:25 AM', lines: [
        { who: 'them', text: 'the morning glories have bloomed!' },
      ] },
      { date: 'May 20, 2009, 5:40 PM', lines: [
        { who: 'me', text: 'can we have fun plates tonight?' },
        { who: 'them', text: 'yes lets do it!' },
      ] },
      { date: 'June 4, 2009, 4:50 PM', lines: [
        { who: 'them', text: 'grandma is watching you two this weekend so make sure to clean your room' },
        { who: 'me', text: 'kk' },
      ] },
      { date: 'June 6, 2009, 9:45 PM', lines: [
        { who: 'me', text: 'sarahs having her friends over, can i have my friends over?' },
        { who: 'them', text: 'no not until youre older' },
        { who: 'them', text: 'but i will make you chocolate milk before bed' },
      ] },
    ],
  },

  {
    id: 'sarah', screenName: 'xXsarahXx97', real: 'Sarah',
    history: [
      { date: 'April 14, 2009, 7:15 PM', lines: [
        { who: 'them', text: 'mom says im teaching u to tie ur shoes tonight' },
        { who: 'me', text: 'i dont want to' },
        { who: 'them', text: 'u need to know how' },
        { who: 'me', text: 'its hard' },
        { who: 'them', text: 'ill give u cheese for everytime u get it right' },
        { who: 'me', text: 'fine' },
        { who: 'them', text: 'bring both shoes. not one' },
      ] },
      { date: 'May 15, 2009, 7:02 AM', lines: [
        { who: 'them', text: 'we should go to the gas station and get hotdogs and funyuns' },
        { who: 'me', text: 'when' },
        { who: 'them', text: 'lets go before the park' },
      ] },
      { date: 'June 5, 2009, 9:10 PM', lines: [
        { who: 'them', text: 'my friends r coming over tomorrow night' },
        { who: 'me', text: 'can i hang out with u guys' },
        { who: 'them', text: 'no. ur 8' },
        { who: 'me', text: 'so' },
        { who: 'them', text: 'so mom said u have to go to bed' },
        { who: 'me', text: 'ill remmeber this' },
      ] },
    ],
  },

  {
    id: 'maddie', screenName: 'maddie_bug53353', real: 'Maddie',
    history: [
      { date: 'May 1, 2009, 3:30 PM', lines: [
        { who: 'them', text: 'MOLLY' },
        { who: 'them', text: 'r u there' },
        { who: 'me', text: 'yes hi' },
        { who: 'them', text: 'bike to my house after school tomorrow??' },
        { who: 'me', text: 'ok!!' },
      ] },
      { date: 'May 16, 2009, 11:05 AM', lines: [
        { who: 'me', text: 'whats ur garage code again' },
        { who: 'them', text: '1227' },
      ] },
      { date: 'June 2, 2009, 7:40 PM', lines: [
        { who: 'them', text: 'can u watch tucker next weekend?' },
        { who: 'me', text: 'i will ask my mom and dad but im sure it will be a yes' },
        { who: 'them', text: 'yay!!' },
      ] },
      { date: 'June 11, 2009, 4:12 PM', lines: [
        { who: 'them', text: 'DQ saturday?? i have 6 dollars' },
        { who: 'me', text: 'yes!! i will bike there' },
        { who: 'them', text: 'me too' },
        { who: 'them', text: 'lets go during lunch' },
        { who: 'me', text: 'yes' },
        { who: 'me', text: 'brb mom needs computer' },
      ] },
    ],
  },

  {
    id: 'grandma', screenName: 'grandma', real: 'Grandma',
    history: [
      { date: 'May 17, 2009, 9:30 AM', lines: [
        { who: 'them', text: 'Hello Molly this is Grandma' },
        { who: 'them', text: 'I am typing on the computer' },
        { who: 'me', text: 'hi grandma!!' },
        { who: 'them', text: 'Your Aunt Jean showed me. It is very slow. When are you coming to Fargo next?' },
        { who: 'me', text: 'mom said july!' },
        { who: 'them', text: 'Good. I will make lefse!' },
      ] },
      { date: 'June 6, 2009, 8:45 PM', lines: [
        { who: 'them', text: 'I am watching you girls this weekend.' },
        { who: 'me', text: 'yay!!' },
        { who: 'them', text: 'We will find something fun to do.' },
      ] },
      { date: 'June 10, 2009, 7:15 AM', lines: [
        { who: 'me', text: 'love u grandma!' },
        { who: 'them', text: 'Love you too kiddo' },
      ] },
    ],
  },
];

export const WAITING: Record<string, string> = {
  sarah: 'r u almost done on the computer?? i need it',
};

export const IDLE_MESSAGE = { buddyId: 'maddie', text: 'r u on yourworld? im getting on right now' };

export const ONLINE_AT_START = ['sarah', 'dad'];
export const MOBILE = ['sarah', 'dad'];
