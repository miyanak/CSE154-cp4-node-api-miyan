/**
 * Name: Miya Nakata
 * Section: CSE 154 AA (TA Elias Martin)
 * Date: May 18, 2023
 *
 * This is the index.js file for my CP4 assignment. It handles all of the
 * interactions between the API, the webpage, and the user.
 */

"use strict";

(function() {
  const SHUFFLE_URL = "/shuffle";
  const INFO_URL = "/info";

  let p1Deck = [];
  let p2Deck = [];
  let warSpaceDeck = [];

  window.addEventListener("load", init);

  /**
   * Sets up the inital document handlers for the webpage
   */
  function init() {
    id("start-btn").addEventListener("click", makeShuffleRequest);
    id("flip-btn").addEventListener("click", playRound);
    id("war-btn").addEventListener("click", goToWar);
    id("end-btn").addEventListener("click", endGame);
  }

  /**
   * Make GET request to shuffle the card deck and get 2 sub-decks
   */
  async function makeShuffleRequest() {
    try {
      let res = await fetch(SHUFFLE_URL + "/2");
      await statusCheck(res);
      let deck = await res.json();
      setUpGame(deck);
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Make GET request to CardDeck API to get the image src of a card
   * @param {string} cardName - name of the card
   * @return {string} cardImg - source link to card's image
   */
  async function makeCardImgRequest(cardName) {
    try {
      let res = await fetch(INFO_URL + "?cardname=" + cardName);
      await statusCheck(res);
      let cardImg = await res.text();
      return cardImg;
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Sets up the initial game environment
   * @param {*} deck - the shuffled deck of cards from the API
   */
  function setUpGame(deck) {
    id("intro-view").classList.toggle("hidden");
    id("game-view").classList.toggle("hidden");
    p1Deck = deck[0];
    p2Deck = deck[1];
  }

  /**
   * Populates the war space with the card on the top of each player's deck.
   */
  async function playRound() {
    let p1CardName = p1Deck.shift();
    let p2CardName = p2Deck.shift();
    warSpaceDeck.push(p1CardName);
    warSpaceDeck.push(p2CardName);

    let p1Src = await makeCardImgRequest(p1CardName);
    let p2Src = await makeCardImgRequest(p2CardName);

    let p1Img = gen("img");
    p1Img.src = p1Src;
    p1Img.alt = p1CardName;
    p1Img.classList.add("playing-card");

    let p2Img = gen("img");
    p2Img.src = p2Src;
    p2Img.alt = p2CardName;
    p2Img.classList.add("playing-card");

    id("p1-war-card").replaceChild(p1Img, qs("#p1-war-card img"));
    id("p2-war-card").replaceChild(p2Img, qs("#p2-war-card img"));

    // update deck count for each player
    qs("#p1-cards-left span").textContent = p1Deck.length;
    qs("#p2-cards-left span").textContent = p2Deck.length;

    determineWinner(p1CardName, p2CardName);
  }

  /**
   * Determines the winner of the round and checks if a player
   * has lost the game.
   * @param {string} p1CardName - name of player 1's card
   * @param {string} p2CardName - name of player 2's card
   */
  function determineWinner(p1CardName, p2CardName) {
    let p1Value = p1CardName.split("-");
    let p2Value = p2CardName.split("-");
    p1Value = p1Value[0];
    p2Value = p2Value[0];
    compareCardValues(p1Value, p2Value);
    if (p1Deck.length === 0 || p2Deck.length === 0) {
      id("flip-btn").disabled = true;
      id("war-btn").disable = true;
      if (p1Deck.length === 0) {
        qs("h1").textContent = "Challenger won the war!";
      } else {
        qs("h1").textContent = "You won the war!";
      }
    }
  }

  /**
   * Checks the card values of the players and determines the winner
   * @param {*} p1Value - value of player 1's card
   * @param {*} p2Value - value of player 2's card
   */
  function compareCardValues(p1Value, p2Value) {
    if (p1Value - p2Value > 0) {
      qs("h1").textContent = "You won this round :)";
      while (warSpaceDeck.length > 0) {
        p1Deck.push(warSpaceDeck.shift());
      }
      qs("#p1-cards-left span").textContent = p1Deck.length;
      let currPoints = qs("#p2-points span").textContent;
      qs("#p1-points span").textContent = parseInt(currPoints) + 1;
      warSpaceDeck = [];
    } else if (p1Value - p2Value < 0) {
      qs("h1").textContent = "Challenger won this round :(";
      while (warSpaceDeck.length > 0) {
        p2Deck.push(warSpaceDeck.shift());
      }
      qs("#p2-cards-left span").textContent = p2Deck.length;
      let currPoints = qs("#p2-points span").textContent;
      qs("#p2-points span").textContent = parseInt(currPoints) + 1;
      warSpaceDeck = [];
    } else {
      qs("h1").textContent = "Equal Value Cards: Time for War!";
      id("flip-btn").classList.add("hidden");
      id("war-btn").classList.remove("hidden");
    }
  }

  /**
   * Simulates the game-play of two players going to war.
   */
  function goToWar() {
    if (p1Deck.length < 3) {
      while (p1Deck.length > 1) {
        warSpaceDeck.push(p1Deck.shift());
      }
    } else {
      for (let i = 0; i < 3; i++) {
        warSpaceDeck.push(p1Deck.shift());
      }
    }
    if (p2Deck.length < 3) {
      while (p1Deck.length > 1) {
        warSpaceDeck.push(p2Deck.shift());
      }
    } else {
      for (let i = 0; i < 3; i++) {
        warSpaceDeck.push(p2Deck.shift());
      }
    }
    qs("#p1-cards-left span").textContent = p1Deck.length;
    qs("#p2-cards-left span").textContent = p2Deck.length;
    id("war-btn").classList.add("hidden");
    id("flip-btn").classList.remove("hidden");
  }

  /**
   * Ends the current game
   */
  function endGame() {
    id("intro-view").classList.toggle("hidden");
    id("game-view").classList.toggle("hidden");
    id("flip-btn").disabled = false;
    id("war-btn").disabled = false;
    p1Deck = [];
    p1Deck = [];
    warSpaceDeck = [];
    qs("#p1-cards-left span").textContent = 25;
    qs("#p2-cards-left span").textContent = 25;
    qs("#p1-points span").textContent = 0;
    qs("#p2-points span").textContent = 0;
    qs("#p1-war-card img").src = "card-back.png";
    qs("#p1-war-card img").alt = "back of card";
    qs("#p2-war-card img").src = "card-back.png";
    qs("#p2-war-card img").alt = "card-back.png";
    qs("h1").textContent = "War: The Card Game";
  }

  // ------ HELPER FUNCTIONS -----
  /**
   * Error handler function takes whatever error message occured and pastes it on the webpage.
   * @param {String} err - the error message from either request function calls
   */
  function handleError(err) {
    let pTag = gen("p");
    pTag.textContent = err;
    qs("body").appendChild(pTag);
  }

  /**
   * Checks to ensure no errors occured in fetching data from the API.
   * @param {*} res - the Promise object from the fetch call
   * @return {String} the error text or the Promise object
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Creates a new DOM element
   * @param {String} tagName - name of new DOM element
   * @return {DOMElement} newly created DOM element with the tagName
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Finds the element with the specified id attribute.
   * @param {string} id - element id
   * @returns {HTMLElement} the DOM node with the id name.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Finds the first occurance of an element that matches the selector
   * @param {String} selector - element name of any combinatorial
   * @returns {DOMElement} the first element that would be matched by the given CSS selector string
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();