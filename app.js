"use strict";

const express = require("express");
const app = express();

const fs = require("fs").promises;
const multer = require("multer");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

app.get("/info", async (req, res) => {
  try {
    let cardName = req.query.cardname;
    if (cardName) {
      let contents = await fs.readFile("data/card-names.txt", "utf-8");
      let names = contents.split("\n");
      if (!names.includes(cardName)) {
        res.status(400);
        res.type("text").send(cardName + "is not a valid card name.");
      } else {
        let imgSrc = await getCardInfo(cardName);
        res.type("text").send("" + imgSrc);
      }
    } else {
      let cardsInfo = await fs.readFile("data/cards-info.txt", "utf-8");
      let response = cardsInfo.split("\n");
      res.json(response);
    }
  } catch (err) {
    res.status(500);
    res.type("text").send("Something went wrong.");
  }
});

app.get("/shuffle/:split", async (req, res) => {
  try {
    let split = req.params.split;
    if (parseInt(split) < 0 || parseInt(split) > 52) {
      let error = split + " is not a valid int value to split the deck";
      res.status(400);
      res.type("text").send(error);
    } else {
      let contents = await fs.readFile("data/card-names.txt", "utf-8");
      let deck = contents.split("\n");
      let shuffledDeck = shuffleDeck(deck, split);
      res.json(shuffledDeck);
    }
  } catch (err) {
    res.status(500);
    res.type("text").send("Something went wrong.");
  }
});

/**
 * Shuffles a 52 deck of cards and divides it up into sub-decks.
 * @param {array} deck - array of card names
 * @param {int} split - number of sub-decks
 * @returns {array} shuffledDeck- returns array of sub-decks
 */
function shuffleDeck(deck, split) {
  for (let oldIndex = deck.length - 1; oldIndex > 0; oldIndex--) {
    let newIndex = Math.floor(Math.random() * oldIndex);
    let temp = deck[oldIndex];
    deck[oldIndex] = deck[newIndex];
    deck[newIndex] = temp;
  }
  let shuffledDeck = [];
  let subDeckCount = 52 / split;
  for (let i = 0; i < deck.length; i += subDeckCount) {
    let subDeck = deck.slice(i, i + subDeckCount);
    shuffledDeck.push(subDeck);
  }
  return shuffledDeck;
}

/**
 * Locates and returns the image source of a card in the card deck.
 * @param {string} cardName - name of the card you want the image for
 * @returns {string} imgSrc - image source of the card
 */
async function getCardInfo(cardName) {
  let cardsInfo = await fs.readFile("data/cards-info.txt", "utf-8");
  let allCards = JSON.parse(cardsInfo);
  let imgSrc = allCards[cardName]["image"];
  return imgSrc;
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);