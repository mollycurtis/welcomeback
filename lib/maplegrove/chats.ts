export interface ChatOption { ask: string; reply: string }

export const CHATS: Record<string, ChatOption[]> = {
  mayor: [
    { ask: 'How is the town doing?', reply: 'Budget is balanced, the clock is four minutes fast, and nobody has complained about the geese this week. A good month.' },
    { ask: 'Anything I can help with?', reply: 'Visit a shop, talk to a neighbor, play a game at the Arcade. A town is just people showing up. That is the whole speech.' },
    { ask: 'How long have you been mayor?', reply: 'Long enough that the ribbon scissors have my initials on them. Not long enough to fix the clock.' },
  ],
  audrey: [
    { ask: 'What is in this week\'s paper?', reply: 'Festival prep, a very small crime, and a column about the fountain. Read it at the desk, it is free.' },
    { ask: 'Got any tips for a story?', reply: 'Everything is a story if you stand there long enough. Send me anything strange you see in town.' },
    { ask: 'Do you ever run out of news?', reply: 'In Maple Grove? Never. Somebody repainted a mailbox last week. Front page.' },
  ],
  olivia: [
    { ask: 'How are the gardens?', reply: 'Blooming or sleeping, depending on the month. Either way there is something to do with a trowel.' },
    { ask: 'When is the Farmers Market?', reply: 'Saturdays, when the season allows. Hazel brings the apples, I bring the flowers, everybody brings opinions.' },
    { ask: 'Any planting advice?', reply: 'Water in the morning, talk to them a little, and stop moving them around. Same advice I give people.' },
  ],
  theo: [
    { ask: 'What are you exploring today?', reply: 'The Woodbury trail. Three things go missing on it every day and I intend to find every one of them.' },
    { ask: 'Best spot in town?', reply: 'The stone bridge at Apple Valley at sunset. Skip a stone, count the skips, tell no one your record.' },
    { ask: 'Ever get lost?', reply: 'Constantly. That is how you find the good stuff.' },
  ],
  walt: [
    { ask: 'What is new in the store?', reply: 'Stock rotates every day. If you like something, buy it today, tomorrow it might be a lamp.' },
    { ask: 'Any decorating tips?', reply: 'One rug pulls a room together. One too many and it is a rug store. Trust me, I run one.' },
    { ask: 'How long have you sold furniture?', reply: 'Thirty years. I can tell a sofa\'s age by the squeak.' },
  ],
  june: [
    { ask: 'What is good today?', reply: 'Muffins are warm, cocoa is bottomless in winter, and the cider is Hazel\'s. Order at the counter.' },
    { ask: 'How is business?', reply: 'Busy in the morning, quiet at two, chaos after school. Like clockwork.' },
    { ask: 'Can I leave a tip?', reply: 'The jar is on the counter. Every coin goes to the summer reading club prizes.' },
  ],
  raj: [
    { ask: 'What is on sale?', reply: 'Maple Chips, always. Check the gold tags on the shelves, they mark what someone in town loves.' },
    { ask: 'Where are the good snacks?', reply: 'Left wall, top shelf. Do not tell the kids I told you.' },
    { ask: 'Is cart six really cursed?', reply: 'It squeaks. That is all. It squeaks in a way that follows you.' },
  ],
  lena: [
    { ask: 'What looks are in?', reply: 'Whatever is on the rack this week. Try one on in the mirror, no pressure, I will tell you the truth.' },
    { ask: 'Any style advice?', reply: 'Buy the thing you keep coming back to. Twice is a pattern.' },
    { ask: 'Do you make these?', reply: 'Some. The rest I find. Finding is a skill too.' },
  ],
  principal: [
    { ask: 'How is school going?', reply: 'Classes are open every day, one of each. Math, Science, History. Nobody has failed yet. Do not be the first.' },
    { ask: 'What is your favorite subject?', reply: 'History. Everything that happens here already happened somewhere else first.' },
    { ask: 'Any rules I should know?', reply: 'Walk in the halls, be kind, and return your library books. Someone in this town still has not.' },
  ],
  gram: [
    { ask: 'How are you today, Gram?', reply: 'Old, busy, and out of lemonade. So, about the same as yesterday.' },
    { ask: 'How many stickers do you have?', reply: 'Four thousand and change. Forty one albums. The change is in a shoebox and we do not speak of it.' },
    { ask: 'Any advice for a new neighbor?', reply: 'Say hello to everyone once. Twice to Walt, he never hears the first one.' },
  ],
  maya: [
    { ask: 'Any good trades today?', reply: 'I have doubles of the Town Hall card if you have a Lakeville. Otherwise I am open to offers.' },
    { ask: 'How do I get stickers?', reply: 'Do things. Fish, farm, spin the wheel, win at the Arcade. Town Hall keeps your book.' },
    { ask: 'What is the rarest sticker?', reply: 'Festival Pin. You have to be in the park during a festival, which is always, so honestly just go to the park.' },
  ],
  nora: [
    { ask: 'How does savings work?', reply: 'Put Maple Bucks in savings and they grow a little every day. Come back tomorrow and there is more than you left. That is the whole trick.' },
    { ask: 'Busy day at the window?', reply: 'Mornings are steady, then it is just me and the vault. The vault does not talk much.' },
    { ask: 'Do you like working here?', reply: 'I like that everybody comes in eventually. You learn the whole town from behind a counter.' },
  ],
  hazel: [
    { ask: 'How is the harvest?', reply: 'Good year for apples, great year for pumpkins. Come pick once a day, everything you pick is yours to give away.' },
    { ask: 'How do you make the cider?', reply: 'Apples, a press, patience. Mostly patience.' },
    { ask: 'Do you ever leave the farm?', reply: 'Saturdays for the market. Sundays I stand in the field and admire it.' },
  ],
  sam: [
    { ask: 'How is the water today?', reply: 'Cold. It is always cold. The raft is closed until it is not, which is July.' },
    { ask: 'Any fishing tips?', reply: 'Cast off the dock, watch the bobber, reel when it dips. Do not reel early. Everyone reels early.' },
    { ask: 'Do you coach anything?', reply: 'Swimming, and the Academy softball team. Both involve a lot of yelling encouragement.' },
  ],
};
