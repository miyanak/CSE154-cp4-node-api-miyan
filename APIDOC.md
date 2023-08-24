# Playing Cards API Documentation
The Playing Cards API provides information about all cards within a standard 52 card deck. It also allows clients to interact with each card individually.

## Get a list of all cards in the deck
**Request Format:** /info?cardname={valid-card-name}

**Request Type:** GET

**Returned Data Format**: JSON or Plain Text

**Description:** Returns a JSON of all the cards in the deck and their respective information. If the query parameter is set with a valid card name, only the source link for the card's image is returned in Plain Text. A valid card name is all lowercase with dashes in between words. The integer values of 11, 12, 13, and 14 all equate to the face cards of jack, queen, king, and ace respectively.

**Example Request:** /info

**Example Response:**
```json
{
  "14-of-clubs": {
    "name": "ace-of-clubs",
    "image": "https://www.improvemagic.com/wp-content/uploads/2020/11/ka.png",
    "alt": "Ace of Clubs"
  },
  "two-of-clubs": {
    "name": "two-of-clubs",
    "image": "https://www.improvemagic.com/wp-content/uploads/2020/11/k2.png",
    "alt": "Two of Clubs"
  }...
}
```
**Example Request:** /info?cardname=14-of-clubs

**Example Response:**
```
"https://www.improvemagic.com/wp-content/uploads/2020/11/ka.png"
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid card name, returns an error with the message: `{cardname} is not a valid card name.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong.`

## Shuffle deck
**Request Format:** /shuffle/:split

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Shuffles a 52 deck of cards and returns the shuffled deck. Can divide the shuffled deck into sub-decks using the 'split' parameter and inputting an valid int value. The default sub-deck amount is zero. A valid int is any int that is between 1 to 52. If the int does not evenly divide 52, the last sub-deck will contain the remaining cards.

**Example Request:** /shuffle/9

**Example Response:**
```json
[
  [
    "king-of-clubs",
    "ten-of-hearts",
    "two-of-spades",
    "ace-of-diamonds",
    "three-of-hearts"
  ],
  [
    "five-of-clubs",
    "four-of-hearts",
    ...
  ],
  ...
  [
    "ace-of-clubs",
    "three-of-diamonds",
    "queen-of-spades",
    "ten-of-diamonds",
    "three-of-clubs",
    "five-of-hearts",
    "jack-of-hearts"
  ]
]
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid int value for "split" parameter, returns an error with the message: `{split} is not a valid int value to split the deck.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong.`
