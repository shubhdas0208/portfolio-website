// Generated from the book list (covers via Open Library). Edit the list, not this file by hand.

export interface LibraryBook {
  id: string
  title: string
  author: string
  series?: string
  cover?: string
  /** cover width / height */
  ratio?: number
  /** spine colour sampled from the cover */
  spine: string
  /** readable text colour on the spine */
  ink: string
  year?: number
  pages?: number
  /** stands cover-forward on the shelf */
  faceOut?: boolean
}

export interface ShelfGroup { label: string; books: LibraryBook[] }
export interface Shelf { id: string; label: string; groups: ShelfGroup[] }

export const READING: LibraryBook[] = [
  {
    "id": "india-bharat-and-pakistan",
    "title": "India, Bharat and Pakistan",
    "author": "J. Sai Deepak",
    "spine": "#0b502e",
    "ink": "#f6f1e9",
    "cover": "/images/books/library/india-bharat-and-pakistan.webp",
    "ratio": 0.656,
    "year": 2022,
    "faceOut": true
  },
  {
    "id": "sea-of-poppies",
    "title": "Sea of Poppies",
    "author": "Amitav Ghosh",
    "spine": "#dedac9",
    "ink": "#14110f",
    "series": "Ibis Trilogy, Book 1",
    "cover": "/images/books/library/sea-of-poppies.webp",
    "ratio": 0.65,
    "year": 2005,
    "pages": 543,
    "faceOut": true
  },
  {
    "id": "founding-sales",
    "title": "Founding Sales",
    "author": "Peter Kazanjy",
    "spine": "#d4dde2",
    "ink": "#14110f",
    "cover": "/images/books/library/founding-sales.webp",
    "ratio": 0.662,
    "faceOut": true
  }
]

export const SHELVES: Shelf[] = [
  {
    "id": "nonfiction",
    "label": "Non-fiction and sci-fi",
    "groups": [
      {
        "label": "Product & Tech",
        "books": [
          {
            "id": "swipe-to-unlock",
            "title": "Swipe to Unlock",
            "author": "Neel Mehta",
            "spine": "#f9f9f8",
            "ink": "#14110f",
            "cover": "/images/books/library/swipe-to-unlock.webp",
            "ratio": 0.648,
            "year": 2017,
            "pages": 345
          },
          {
            "id": "decode-and-conquer",
            "title": "Decode and Conquer",
            "author": "Lewis C. Lin",
            "spine": "#343231",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/decode-and-conquer.webp",
            "ratio": 0.667,
            "year": 2013,
            "pages": 202
          },
          {
            "id": "cracking-the-pm-interview",
            "title": "Cracking the PM Interview",
            "author": "Gayle Laakmann McDowell",
            "spine": "#ef5b16",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/cracking-the-pm-interview.webp",
            "ratio": 0.658,
            "year": 2013,
            "pages": 363
          },
          {
            "id": "the-design-of-everyday-things",
            "title": "The Design of Everyday Things",
            "author": "Don Norman",
            "spine": "#e2d922",
            "ink": "#14110f",
            "cover": "/images/books/library/the-design-of-everyday-things.webp",
            "ratio": 0.644,
            "year": 1988
          },
          {
            "id": "ai-engineering",
            "title": "AI Engineering",
            "author": "Chip Huyen",
            "spine": "#fbfbfb",
            "ink": "#14110f",
            "cover": "/images/books/library/ai-engineering.webp",
            "ratio": 0.76,
            "year": 2024,
            "pages": 442
          }
        ]
      },
      {
        "label": "Startups & Sales",
        "books": [
          {
            "id": "zero-to-one",
            "title": "Zero to One",
            "author": "Peter Thiel",
            "spine": "#6191b9",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/zero-to-one.webp",
            "ratio": 0.863,
            "year": 2001,
            "pages": 253
          },
          {
            "id": "the-right-it",
            "title": "The Right It",
            "author": "Alberto Savoia",
            "spine": "#f6dd08",
            "ink": "#14110f",
            "cover": "/images/books/library/the-right-it.webp",
            "ratio": 0.665,
            "year": 2019,
            "pages": 137
          },
          {
            "id": "the-mom-test",
            "title": "The Mom Test",
            "author": "Rob Fitzpatrick",
            "spine": "#dc226f",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/the-mom-test.webp",
            "ratio": 0.648,
            "year": 2014,
            "pages": 135
          },
          {
            "id": "demand-side-sales-101",
            "title": "Demand-Side Sales 101",
            "author": "Bob Moesta",
            "spine": "#fcd906",
            "ink": "#14110f",
            "cover": "/images/books/library/demand-side-sales-101.webp",
            "ratio": 0.679,
            "year": 2020,
            "pages": 224
          },
          {
            "id": "stay-hungry-stay-foolish",
            "title": "Stay Hungry Stay Foolish",
            "author": "Rashmi Bansal",
            "spine": "#f4f2ef",
            "ink": "#b3242a",
            "cover": "/images/books/library/stay-hungry-stay-foolish.webp",
            "ratio": 0.648,
            "year": 2008
          }
        ]
      },
      {
        "label": "History & Politics",
        "books": [
          {
            "id": "sapiens",
            "title": "Sapiens",
            "author": "Yuval Noah Harari",
            "spine": "#fcf8f6",
            "ink": "#14110f",
            "cover": "/images/books/library/sapiens.webp",
            "ratio": 0.65,
            "year": 2011,
            "pages": 456,
            "faceOut": true
          },
          {
            "id": "india-that-is-bharat",
            "title": "India, That Is Bharat",
            "author": "J. Sai Deepak",
            "spine": "#142c5e",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/india-that-is-bharat.webp",
            "ratio": 0.652,
            "year": 2021,
            "pages": 484
          },
          {
            "id": "inglorious-empire",
            "title": "Inglorious Empire",
            "author": "Shashi Tharoor",
            "spine": "#eae6d1",
            "ink": "#14110f",
            "cover": "/images/books/library/inglorious-empire.webp",
            "ratio": 0.662,
            "year": 2017,
            "pages": 336
          }
        ]
      },
      {
        "label": "Lives & Mind",
        "books": [
          {
            "id": "elon-musk",
            "title": "Elon Musk",
            "author": "Ashlee Vance",
            "spine": "#1a1418",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/elon-musk.webp",
            "ratio": 0.66,
            "year": 2013,
            "pages": 396
          },
          {
            "id": "steve-jobs",
            "title": "Steve Jobs",
            "author": "Walter Isaacson",
            "spine": "#f2f2f2",
            "ink": "#14110f",
            "cover": "/images/books/library/steve-jobs.webp",
            "ratio": 0.694,
            "year": 2011,
            "pages": 664
          },
          {
            "id": "autobiography-of-a-yogi",
            "title": "Autobiography of a Yogi",
            "author": "Paramahansa Yogananda",
            "spine": "#5f8aba",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/autobiography-of-a-yogi.webp",
            "ratio": 0.665,
            "year": 1946,
            "pages": 514
          },
          {
            "id": "psycho-cybernetics",
            "title": "Psycho-Cybernetics",
            "author": "Maxwell Maltz",
            "spine": "#eae5e6",
            "ink": "#14110f",
            "cover": "/images/books/library/psycho-cybernetics.webp",
            "ratio": 0.665,
            "year": 1960,
            "pages": 270
          }
        ]
      },
      {
        "label": "Sci-fi",
        "books": [
          {
            "id": "project-hail-mary",
            "title": "Project Hail Mary",
            "author": "Andy Weir",
            "spine": "#110b0a",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/project-hail-mary.webp",
            "ratio": 0.65,
            "year": 2021,
            "pages": 496
          },
          {
            "id": "a-short-stay-in-hell",
            "title": "A Short Stay in Hell",
            "author": "Steven L. Peck",
            "spine": "#a4927d",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/a-short-stay-in-hell.webp",
            "ratio": 0.694,
            "year": 2009,
            "pages": 104
          }
        ]
      }
    ]
  },
  {
    "id": "fiction",
    "label": "Fiction",
    "groups": [
      {
        "label": "Mythology",
        "books": [
          {
            "id": "the-immortals-of-meluha",
            "title": "The Immortals of Meluha",
            "author": "Amish Tripathi",
            "spine": "#192c2c",
            "ink": "#f6f1e9",
            "series": "Shiva Trilogy, Book 1",
            "cover": "/images/books/library/the-immortals-of-meluha.webp",
            "ratio": 0.662,
            "year": 2010,
            "pages": 416,
            "faceOut": true
          },
          {
            "id": "the-secret-of-the-nagas",
            "title": "The Secret of the Nagas",
            "author": "Amish Tripathi",
            "spine": "#565747",
            "ink": "#f6f1e9",
            "series": "Shiva Trilogy, Book 2",
            "cover": "/images/books/library/the-secret-of-the-nagas.webp",
            "ratio": 0.637,
            "year": 2011,
            "pages": 412
          },
          {
            "id": "the-oath-of-the-vayuputras",
            "title": "The Oath of the Vayuputras",
            "author": "Amish Tripathi",
            "spine": "#723828",
            "ink": "#f6f1e9",
            "series": "Shiva Trilogy, Book 3",
            "cover": "/images/books/library/the-oath-of-the-vayuputras.webp",
            "ratio": 0.7,
            "year": 2013,
            "pages": 575
          },
          {
            "id": "the-palace-of-illusions",
            "title": "The Palace of Illusions",
            "author": "Chitra Banerjee Divakaruni",
            "spine": "#5b6a3d",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/the-palace-of-illusions.webp",
            "ratio": 0.66,
            "year": 2008,
            "pages": 372
          },
          {
            "id": "the-hidden-hindu",
            "title": "The Hidden Hindu",
            "author": "Akshat Gupta",
            "spine": "#1e1206",
            "ink": "#f6f1e9",
            "series": "The Hidden Hindu, Book 1",
            "cover": "/images/books/library/the-hidden-hindu.webp",
            "ratio": 0.646,
            "year": 2021
          },
          {
            "id": "the-hidden-hindu-2",
            "title": "The Hidden Hindu 2",
            "author": "Akshat Gupta",
            "spine": "#51342a",
            "ink": "#f6f1e9",
            "series": "The Hidden Hindu, Book 2",
            "cover": "/images/books/library/the-hidden-hindu-2.webp",
            "ratio": 0.644,
            "year": 2022,
            "pages": 250
          },
          {
            "id": "the-hidden-hindu-3",
            "title": "The Hidden Hindu 3",
            "author": "Akshat Gupta",
            "spine": "#8a5a2b",
            "ink": "#f6f1e9",
            "series": "The Hidden Hindu, Book 3"
          },
          {
            "id": "the-guardians-of-the-halahala",
            "title": "The Guardians of the Halahala",
            "author": "Shatrujeet Nath",
            "spine": "#3d2b4f",
            "ink": "#f6f1e9",
            "series": "Vikramaditya Veergatha, Book 1"
          },
          {
            "id": "the-conspiracy-at-meru",
            "title": "The Conspiracy at Meru",
            "author": "Shatrujeet Nath",
            "spine": "#a33b2a",
            "ink": "#f6f1e9",
            "series": "Vikramaditya Veergatha, Book 2"
          },
          {
            "id": "the-vengeance-of-indra",
            "title": "The Vengeance of Indra",
            "author": "Shatrujeet Nath",
            "spine": "#7a2e1f",
            "ink": "#f6f1e9",
            "series": "Vikramaditya Veergatha, Book 3"
          },
          {
            "id": "the-wrath-of-the-hellfires",
            "title": "The Wrath of the Hellfires",
            "author": "Shatrujeet Nath",
            "spine": "#1f3a4d",
            "ink": "#f6f1e9",
            "series": "Vikramaditya Veergatha, Book 4"
          }
        ]
      },
      {
        "label": "Myth Thrillers",
        "books": [
          {
            "id": "the-mahabharata-secret",
            "title": "The Mahabharata Secret",
            "author": "Christopher C. Doyle",
            "spine": "#5d4624",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/the-mahabharata-secret.webp",
            "ratio": 0.65,
            "year": 2013,
            "pages": 386
          },
          {
            "id": "a-secret-revealed",
            "title": "A Secret Revealed",
            "author": "Christopher C. Doyle",
            "spine": "#0b090b",
            "ink": "#f6f1e9",
            "series": "Mahabharata Quest, Prequel",
            "cover": "/images/books/library/a-secret-revealed.webp",
            "ratio": 0.623,
            "year": 2020
          },
          {
            "id": "the-alexander-secret",
            "title": "The Alexander Secret",
            "author": "Christopher C. Doyle",
            "spine": "#2c2e1e",
            "ink": "#f6f1e9",
            "series": "Mahabharata Quest, Book 1",
            "cover": "/images/books/library/the-alexander-secret.webp",
            "ratio": 0.623,
            "year": 2020
          },
          {
            "id": "the-secret-of-the-druids",
            "title": "The Secret of the Druids",
            "author": "Christopher C. Doyle",
            "spine": "#38231a",
            "ink": "#f6f1e9",
            "series": "Mahabharata Quest, Book 2",
            "cover": "/images/books/library/the-secret-of-the-druids.webp",
            "ratio": 0.65,
            "year": 2017,
            "pages": 422
          },
          {
            "id": "son-of-bhrigu",
            "title": "Son of Bhrigu",
            "author": "Christopher C. Doyle",
            "spine": "#c38755",
            "ink": "#f6f1e9",
            "series": "Pataala Prophecy, Book 1",
            "cover": "/images/books/library/son-of-bhrigu.webp",
            "ratio": 0.671,
            "year": 2018,
            "pages": 347
          },
          {
            "id": "the-mists-of-brahma",
            "title": "The Mists of Brahma",
            "author": "Christopher C. Doyle",
            "spine": "#e2e4e4",
            "ink": "#14110f",
            "series": "Pataala Prophecy, Book 2",
            "cover": "/images/books/library/the-mists-of-brahma.webp",
            "ratio": 0.656
          },
          {
            "id": "the-rozabal-line",
            "title": "The Rozabal Line",
            "author": "Ashwin Sanghi",
            "spine": "#4d0a06",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/the-rozabal-line.webp",
            "ratio": 0.623,
            "year": 2010,
            "pages": 418
          },
          {
            "id": "the-krishna-key",
            "title": "The Krishna Key",
            "author": "Ashwin Sanghi",
            "spine": "#152938",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/the-krishna-key.webp",
            "ratio": 0.646,
            "year": 2012,
            "pages": 475
          },
          {
            "id": "the-keepers-of-the-kalachakra",
            "title": "The Keepers of the Kalachakra",
            "author": "Ashwin Sanghi",
            "spine": "#7e554e",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/the-keepers-of-the-kalachakra.webp",
            "ratio": 0.65,
            "year": 2018,
            "pages": 416
          },
          {
            "id": "harappa-curse-of-the-blood-river",
            "title": "Harappa: Curse of the Blood River",
            "author": "Vineet Bajpai",
            "spine": "#252650",
            "ink": "#f6f1e9",
            "series": "Harappa Trilogy, Book 1",
            "cover": "/images/books/library/harappa-curse-of-the-blood-river.webp",
            "ratio": 0.658
          },
          {
            "id": "pralay-the-great-deluge",
            "title": "Pralay: The Great Deluge",
            "author": "Vineet Bajpai",
            "spine": "#30171d",
            "ink": "#f6f1e9",
            "series": "Harappa Trilogy, Book 2",
            "cover": "/images/books/library/pralay-the-great-deluge.webp",
            "ratio": 0.65,
            "year": 2018,
            "pages": 315
          },
          {
            "id": "kashi-secret-of-the-black-temple",
            "title": "Kashi: Secret of the Black Temple",
            "author": "Vineet Bajpai",
            "spine": "#1a2427",
            "ink": "#f6f1e9",
            "series": "Harappa Trilogy, Book 3",
            "cover": "/images/books/library/kashi-secret-of-the-black-temple.webp",
            "ratio": 0.658
          }
        ]
      },
      {
        "label": "Thrillers",
        "books": [
          {
            "id": "angels-demons",
            "title": "Angels & Demons",
            "author": "Dan Brown",
            "spine": "#182f3a",
            "ink": "#f6f1e9",
            "series": "Robert Langdon, Book 1",
            "cover": "/images/books/library/angels-demons.webp",
            "ratio": 0.571,
            "year": 2000,
            "pages": 575
          },
          {
            "id": "the-da-vinci-code",
            "title": "The Da Vinci Code",
            "author": "Dan Brown",
            "spine": "#8b1a0c",
            "ink": "#f6f1e9",
            "series": "Robert Langdon, Book 2",
            "cover": "/images/books/library/the-da-vinci-code.webp",
            "ratio": 0.685,
            "year": 2003,
            "pages": 489,
            "faceOut": true
          },
          {
            "id": "the-lost-symbol",
            "title": "The Lost Symbol",
            "author": "Dan Brown",
            "spine": "#dfce94",
            "ink": "#14110f",
            "series": "Robert Langdon, Book 3",
            "cover": "/images/books/library/the-lost-symbol.webp",
            "ratio": 0.662,
            "year": 2009,
            "pages": 604
          },
          {
            "id": "inferno",
            "title": "Inferno",
            "author": "Dan Brown",
            "spine": "#3e2e2d",
            "ink": "#f6f1e9",
            "series": "Robert Langdon, Book 4",
            "cover": "/images/books/library/inferno.webp",
            "ratio": 0.64,
            "year": 2013,
            "pages": 576
          },
          {
            "id": "origin",
            "title": "Origin",
            "author": "Dan Brown",
            "spine": "#0a1838",
            "ink": "#f6f1e9",
            "series": "Robert Langdon, Book 5",
            "cover": "/images/books/library/origin.webp",
            "ratio": 0.656,
            "year": 2013,
            "pages": 632
          },
          {
            "id": "deception-point",
            "title": "Deception Point",
            "author": "Dan Brown",
            "spine": "#93110a",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/deception-point.webp",
            "ratio": 0.598,
            "year": 2001,
            "pages": 559
          },
          {
            "id": "digital-fortress",
            "title": "Digital Fortress",
            "author": "Dan Brown",
            "spine": "#879c5b",
            "ink": "#f6f1e9",
            "cover": "/images/books/library/digital-fortress.webp",
            "ratio": 0.652,
            "year": 1998,
            "pages": 447
          },
          {
            "id": "the-silent-patient",
            "title": "The Silent Patient",
            "author": "Alex Michaelides",
            "spine": "#d6d5d4",
            "ink": "#14110f",
            "cover": "/images/books/library/the-silent-patient.webp",
            "ratio": 0.66,
            "year": 2018,
            "pages": 352
          }
        ]
      }
    ]
  },
  {
    "id": "riordan",
    "label": "Rick Riordan",
    "groups": [
      {
        "label": "Percy Jackson",
        "books": [
          {
            "id": "the-lightning-thief",
            "title": "The Lightning Thief",
            "author": "Rick Riordan",
            "spine": "#194643",
            "ink": "#f6f1e9",
            "series": "Percy Jackson, Book 1",
            "cover": "/images/books/library/the-lightning-thief.webp",
            "ratio": 0.754,
            "year": 2005,
            "pages": 384,
            "faceOut": true
          },
          {
            "id": "the-sea-of-monsters",
            "title": "The Sea of Monsters",
            "author": "Rick Riordan",
            "spine": "#1c8cb0",
            "ink": "#f6f1e9",
            "series": "Percy Jackson, Book 2",
            "cover": "/images/books/library/the-sea-of-monsters.webp",
            "ratio": 0.61,
            "year": 2005,
            "pages": 282
          },
          {
            "id": "the-titan-s-curse",
            "title": "The Titan's Curse",
            "author": "Rick Riordan",
            "spine": "#1c3758",
            "ink": "#f6f1e9",
            "series": "Percy Jackson, Book 3",
            "cover": "/images/books/library/the-titan-s-curse.webp",
            "ratio": 0.658,
            "year": 2007,
            "pages": 320
          },
          {
            "id": "the-battle-of-the-labyrinth",
            "title": "The Battle of the Labyrinth",
            "author": "Rick Riordan",
            "spine": "#531b1b",
            "ink": "#f6f1e9",
            "series": "Percy Jackson, Book 4",
            "cover": "/images/books/library/the-battle-of-the-labyrinth.webp",
            "ratio": 0.665,
            "year": 2005,
            "pages": 367
          },
          {
            "id": "the-last-olympian",
            "title": "The Last Olympian",
            "author": "Rick Riordan",
            "spine": "#131f1c",
            "ink": "#f6f1e9",
            "series": "Percy Jackson, Book 5",
            "cover": "/images/books/library/the-last-olympian.webp",
            "ratio": 0.65,
            "year": 2008,
            "pages": 381
          }
        ]
      },
      {
        "label": "Heroes of Olympus",
        "books": [
          {
            "id": "the-lost-hero",
            "title": "The Lost Hero",
            "author": "Rick Riordan",
            "spine": "#32422f",
            "ink": "#f6f1e9",
            "series": "Heroes of Olympus, Book 1",
            "cover": "/images/books/library/the-lost-hero.webp",
            "ratio": 0.66,
            "year": 2010,
            "pages": 556
          },
          {
            "id": "the-son-of-neptune",
            "title": "The Son of Neptune",
            "author": "Rick Riordan",
            "spine": "#534e3a",
            "ink": "#f6f1e9",
            "series": "Heroes of Olympus, Book 2",
            "cover": "/images/books/library/the-son-of-neptune.webp",
            "ratio": 0.642,
            "year": 2011,
            "pages": 512
          },
          {
            "id": "the-mark-of-athena",
            "title": "The Mark of Athena",
            "author": "Rick Riordan",
            "spine": "#50292d",
            "ink": "#f6f1e9",
            "series": "Heroes of Olympus, Book 3",
            "cover": "/images/books/library/the-mark-of-athena.webp",
            "ratio": 0.66,
            "year": 2011,
            "pages": 582
          },
          {
            "id": "the-house-of-hades",
            "title": "The House of Hades",
            "author": "Rick Riordan",
            "spine": "#422530",
            "ink": "#f6f1e9",
            "series": "Heroes of Olympus, Book 4",
            "cover": "/images/books/library/the-house-of-hades.webp",
            "ratio": 0.658,
            "year": 2013
          },
          {
            "id": "the-blood-of-olympus",
            "title": "The Blood of Olympus",
            "author": "Rick Riordan",
            "spine": "#4a2727",
            "ink": "#f6f1e9",
            "series": "Heroes of Olympus, Book 5",
            "cover": "/images/books/library/the-blood-of-olympus.webp",
            "ratio": 0.66,
            "year": 2001,
            "pages": 525
          }
        ]
      },
      {
        "label": "Kane Chronicles",
        "books": [
          {
            "id": "the-red-pyramid",
            "title": "The Red Pyramid",
            "author": "Rick Riordan",
            "spine": "#bd9365",
            "ink": "#14110f",
            "series": "Kane Chronicles, Book 1",
            "cover": "/images/books/library/the-red-pyramid.webp",
            "ratio": 0.673,
            "year": 2010,
            "pages": 533,
            "faceOut": true
          },
          {
            "id": "the-throne-of-fire",
            "title": "The Throne of Fire",
            "author": "Rick Riordan",
            "spine": "#491e32",
            "ink": "#f6f1e9",
            "series": "Kane Chronicles, Book 2",
            "cover": "/images/books/library/the-throne-of-fire.webp",
            "ratio": 0.66,
            "year": 2011,
            "pages": 452
          },
          {
            "id": "the-serpent-s-shadow",
            "title": "The Serpent's Shadow",
            "author": "Rick Riordan",
            "spine": "#2b2c3b",
            "ink": "#f6f1e9",
            "series": "Kane Chronicles, Book 3",
            "cover": "/images/books/library/the-serpent-s-shadow.webp",
            "ratio": 0.688,
            "year": 2012,
            "pages": 405
          }
        ]
      },
      {
        "label": "Trials of Apollo",
        "books": [
          {
            "id": "the-hidden-oracle",
            "title": "The Hidden Oracle",
            "author": "Rick Riordan",
            "spine": "#0c3d4d",
            "ink": "#f6f1e9",
            "series": "Trials of Apollo, Book 1",
            "cover": "/images/books/library/the-hidden-oracle.webp",
            "ratio": 0.66,
            "year": 2016,
            "pages": 384
          },
          {
            "id": "the-dark-prophecy",
            "title": "The Dark Prophecy",
            "author": "Rick Riordan",
            "spine": "#2f1a2e",
            "ink": "#f6f1e9",
            "series": "Trials of Apollo, Book 2",
            "cover": "/images/books/library/the-dark-prophecy.webp",
            "ratio": 0.658,
            "year": 2017,
            "pages": 432
          },
          {
            "id": "the-burning-maze",
            "title": "The Burning Maze",
            "author": "Rick Riordan",
            "spine": "#2b263f",
            "ink": "#f6f1e9",
            "series": "Trials of Apollo, Book 3",
            "cover": "/images/books/library/the-burning-maze.webp",
            "ratio": 0.654,
            "year": 2018,
            "pages": 448
          },
          {
            "id": "the-tyrant-s-tomb",
            "title": "The Tyrant's Tomb",
            "author": "Rick Riordan",
            "spine": "#432d2e",
            "ink": "#f6f1e9",
            "series": "Trials of Apollo, Book 4",
            "cover": "/images/books/library/the-tyrant-s-tomb.webp",
            "ratio": 0.66,
            "year": 2019,
            "pages": 448
          },
          {
            "id": "the-tower-of-nero",
            "title": "The Tower of Nero",
            "author": "Rick Riordan",
            "spine": "#13263e",
            "ink": "#f6f1e9",
            "series": "Trials of Apollo, Book 5",
            "cover": "/images/books/library/the-tower-of-nero.webp",
            "ratio": 0.658,
            "year": 2020,
            "pages": 416
          }
        ]
      },
      {
        "label": "Magnus Chase",
        "books": [
          {
            "id": "the-sword-of-summer",
            "title": "The Sword of Summer",
            "author": "Rick Riordan",
            "spine": "#3e2f55",
            "ink": "#f6f1e9",
            "series": "Magnus Chase, Book 1",
            "cover": "/images/books/library/the-sword-of-summer.webp",
            "ratio": 0.696,
            "year": 2015,
            "pages": 512,
            "faceOut": true
          },
          {
            "id": "the-hammer-of-thor",
            "title": "The Hammer of Thor",
            "author": "Rick Riordan",
            "spine": "#0e2f33",
            "ink": "#f6f1e9",
            "series": "Magnus Chase, Book 2",
            "cover": "/images/books/library/the-hammer-of-thor.webp",
            "ratio": 0.658,
            "year": 2017
          },
          {
            "id": "the-ship-of-the-dead",
            "title": "The Ship of the Dead",
            "author": "Rick Riordan",
            "spine": "#172533",
            "ink": "#f6f1e9",
            "series": "Magnus Chase, Book 3",
            "cover": "/images/books/library/the-ship-of-the-dead.webp",
            "ratio": 0.679,
            "year": 2005
          }
        ]
      }
    ]
  }
]

export const LIBRARY_COUNT = READING.length + SHELVES.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.books.length, 0), 0)
