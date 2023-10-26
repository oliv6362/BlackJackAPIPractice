
//global variables
let deckId = '';
let playerCardNumber = 0;
let botCardNumber = 0;
let storedBotCards = [];

let playerStay = false;
let playerBust = false;
let botStay = false;
let botBust = false;

//Fetches new deck of cards with json api and initializes the game
async function getDeck() {
  const requestDeckURL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
  const request = new Request(requestDeckURL);

  const response = await fetch(request);
  const deck = await response.json();

  deckId = deck.deck_id;  
  populateHeader();
  showDeck();
}

//Populates the header section of the webpage
function populateHeader() {
  const header = document.querySelector(".header");
  const myH1 = document.createElement("h1");
  myH1.textContent = "Welcome to BlackJack!"
  header.appendChild(myH1);
}

//Shows the back of a card to represent the deck
function showDeck() {
  const section = document.querySelector(".cardDeck");
  backCardImage(section);
}

//function that actually shows/creates the back of a card
function backCardImage(section) {
  const deckImageUrl = "https://deckofcardsapi.com/static/img/back.png";
  const deckImage = document.createElement("img"); 

  deckImage.width = 150;
  deckImage.src = deckImageUrl; 
  section.appendChild(deckImage); 
}

//Draws cards for the player and the bot.
async function drawCard() {
  const drawCardURL = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;
  const response = await fetch(drawCardURL);
  const drawCardData = await response.json();
  const cards = drawCardData.cards;

  if (playerBust == false && playerStay == false) {
    playerCards(drawCardData, [cards[0]]);
  } 

  if (botCardNumber < 17 && botBust == false && botStay == false) {
    botCards(drawCardData, [cards[1]]);
  }
}

//Handles  the logic and display of cards for the player
function playerCards(drawCardData, cards) {

  if (drawCardData.success) {
    const section = document.querySelector(".playerHand");

    for (const card of cards) {
      const playerCard = document.createElement("img"); 

      playerCard.width = 150;
      playerCard.src = card.image; 
      section.appendChild(playerCard);

      let playerCardValue = convertCardValue(card.value); 
      playerCardNumber += playerCardValue;
    }

    if (playerCardNumber > 21) {
      const myH2 = document.createElement("h2");
      myH2.textContent = "BUST!";
      section.appendChild(myH2);
      playerBust = true;
      handleGameConditions();
    }
  }
}

//Handles  the logic and display of cards for the bot
function botCards(drawCardData, cards) {
  const section = document.querySelector(".botHand");
  const botCard = document.createElement("img"); 
  if (playerBust == true && botStay == true) {
    botShowCards(section, botCard);
    updateBotStatus(section);
  }
  else
  if (playerStay == true && botStay == true) {
    botShowCards(section, botCard);
    updateBotStatus(section);

  } else
    if (drawCardData.success && botStay == false) {
      storedBotCards.push(botCard)

      for (const card of cards) {
        botCard.width = 150;
        botCard.src = card.image; 

        let botCardValue = convertCardValue(card.value); 
        botCardNumber += botCardValue;
        backCardImage(section);
      }

      if (botCardNumber >= 17) {
        const myH2 = document.createElement("h2");
        myH2.textContent = "STAY!";
        section.appendChild(myH2);

        if (botCardNumber > 21) {
          botBust = true;
        } else if (botCardNumber <= 21) {
          botStay = true;
        }

        if (playerStay == true || playerBust == true) {

          botShowCards(section, botCard);
          updateBotStatus(section);
        }
      }

    }
}

//updates the bot status regarding Bust/Stay
function updateBotStatus(section) {
  if (botBust == true) {
    const myH2 = document.createElement("h2");
    myH2.textContent = "BUST!";
    section.appendChild(myH2);
  } else
    if (botStay == true) {
      const myH2 = document.createElement("h2");
      myH2.textContent = "STAY!";
      section.appendChild(myH2);
    }
}

//Handles the conditions and logic for the games outcome
async function handleGameConditions() {
  
  if (playerBust == true && botStay == true) { 
    botCards();
  } else
  if (playerBust == true) { 
    while (botStay == false && botBust == false) {
      await drawCard();
    }
  }

  if (botStay == true && playerStay == true) {  
    botCards();
  } else
    if (botStay == false && playerStay == true) { 
      while (botStay == false && botBust == false) {
        await drawCard();
      }
    }
}

//converts the cards with a image to numeric values
function convertCardValue(cardValue) {
  switch (cardValue) {
    case "ACE": return 11;
    case "KING":
    case "QUEEN":
    case "JACK": return 10;
    default: return parseInt(cardValue);
  }
}

//Reveals the bots cards to the player and then calls a class that determines the outcome of the game
function botShowCards(section, botCard) {
  section.innerHTML = "";

  section.appendChild(botCard);
  storedBotCards.forEach(storedCard => {
    section.appendChild(storedCard);
  });
  storedBotCards = [];
  determineGameOutcome();
}

//handles if the player has chosen to stay 
function stay() {
  if (playerStay === false && playerBust === false) {

    const section = document.querySelector(".playerHand");
    const myH3 = document.createElement("h3");
    myH3.textContent = "STAY!";
    section.appendChild(myH3);
    playerStay = true;
    handleGameConditions();
  }
}

// Determines the outcome of the game and displays the result.
function determineGameOutcome() {
  if (playerCardNumber > botCardNumber && playerCardNumber <= 21 || botCardNumber > 21 && playerCardNumber <= 21) {
    const section = document.querySelector(".playerHand");
    const myH1 = document.createElement("h1");
    myH1.textContent = "YOU WIN!";
    section.appendChild(myH1);
  }
  else if (playerCardNumber < botCardNumber && botCardNumber <= 21 || playerCardNumber > 21 && botCardNumber <= 21) {
    const section = document.querySelector(".playerHand");
    const myH1 = document.createElement("h1");
    myH1.textContent = "YOU LOSE!";
    section.appendChild(myH1);
  }
  else if (playerCardNumber === botCardNumber || playerBust == true && botBust == true) {
    const section = document.querySelector(".playerHand");
    const myH1 = document.createElement("h1");
    myH1.textContent = "DRAW!";
    section.appendChild(myH1);
  }
}

//resets the game so the player can play again
async function resetGame() {
  const returnCardURL = `https://deckofcardsapi.com/api/deck/${deckId}/return/`;
  const response = await fetch(returnCardURL);
  const returnCardData = await response.json();

  const playerSection = document.querySelector(".playerHand");
  const botSection = document.querySelector(".botHand");
  playerSection.innerHTML = "";
  botSection.innerHTML = "";
  playerCardNumber = 0;
  botCardNumber = 0;
  storedBotCards = [];
  playerBust = false;
  playerStay = false;
  botBust = false;
  botStay = false;
}

getDeck();

