/**
 * Created by Yaqzan on 013, Mar 13, 2015.
 */

// Initializes and fills a deck with all playing cards.
//Use the remove function to remove a card from the deck
function Deck () {
    this.cards = new Array();
    var counter =2;
    for (i = 0; i < 13; i++) {
        var card = new Card(counter, "clubs");
        counter++;
        this.cards[i] = card;
    }
    counter=2;
    for (i = 13; i < 26; i++) {
        var card = new Card(counter, "diamonds");
        counter++;
        this.cards[i] = card;
    }
    counter=2;
    for (i = 26; i < 39; i++) {
        var card = new Card(counter, "hearts");
        counter++;
        this.cards[i] = card;
    }
    counter=2;
    for (i = 39; i < 52; i++) {
        var card = new Card(counter, "spades");
        counter++;
        this.cards[i] = card;
    }
}
Deck.prototype.remove = function(card) {
    var value = card.value;
    var suit = card.suit;
    for(i=0; i<52; i++){
        if (this.cards[i].value == value && this.cards[i].suit == suit){
            this.cards[i] = null;
            break;
        }
    }
};
//*****************************************************************************************************
//playerID should be int, hand should be object of type Hand
function Player (playerID, hand) {
    this.ID = playerID;
    this.hand = hand;
}
Player.prototype.setNewHand = function(newHand) {
    this.hand = newHand;
};
Player.prototype.setPlayerID = function(newID) {
    this.ID = newPlayerID;
};
//****************************************************************************************************
// This assumes that only the flop is known initially. So only 3 cards are needed to initialize
// The TUrn and the River can be added afterwards via the methods
function Table (card1, card2, card3, deck) {
    this.flop = [card1, card2, card3];
    this.turn = null;
    this.river = null;
    deck.remove(card1);
    deck.remove(card2);
    deck.remove(card3);
}
Table.prototype.setFlop = function(c1, c2, c3) {
    this.flop = [c1, c2, c3];
    deck.remove(c1);
    deck.remove(c2);
    deck.remove(c3);
};
Table.prototype.setTurn = function(newCard) {
    this.turn = newCard;
    deck.remove(newCard);
};
Table.prototype.setRiver = function(newCard) {
    this.river = newCard;
    deck.remove(newCard);
};
//**********************************************************************************
// c1 and c2 should be Card objects. So should newCard when calling those functions
// deck should be an object of type Deck
function Hand(c1, c2, deck) {
    this.cards = [c1, c2];
    deck.remove(c1);
    deck.remove(c2);
}
Hand.prototype.setFirstCard = function (newCard){
    this.cards[0] = newCard;
    deck.remove(newCard);
};
Hand.prototype.setSecondCard = function (newCard){
    this.cards[1] = newCard;
    deck.remove(newCard);
};
//**********************************************************************************
// Value should be an int pertaining to the card value.
// Jack = 11,   Queen = 12, King =13,  Ace = 14
// Suit should be a string; one of "spades", "diamonds", "clubs", "hearts"
function Card(value, suit) {
    this.suit = suit;
    this.value = value;
}
Card.prototype.setCardValue = function (newVal){
    this.value = newVal;
};
Card.prototype.setSuit = function (newSuit){
    this.suit = newSuit;
};