/**
 * Created by Yaqzan on 013, Mar 13, 2015.
 */

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
//**********************************************************************************
function Table (card1, card2, card3) {
    this.flop = [card1, card2, card3];
    this.turn = null;
    this.river = null;
}
Table.prototype.setFlop = function(c1, c2, c3) {
    this.flop = [c1, c2, c3];
};
Table.prototype.setTurn = function(newCard) {
    this.turn = newCard;
};
Table.prototype.setRiver = function(newCard) {
    this.river = newCard;
};
//**********************************************************************************
// c1 and c2 should be Card objects. So should newCard when calling those functions
function Hand(c1, c2) {
    this.cards = [c1, c2];
}
Hand.prototype.setFirstCard = function (newCard){
    this.cards = [newCard, this.cards[1]];
};
Hand.prototype.setSecondCard = function (newCard){
    this.cards = [this.cards[0], newCard];
};
//**********************************************************************************

function Card(value, suit) {
    this.suit = suit;
    this.value = value;
}
Hand.prototype.setCardValue = function (newVal){
    this.value = newVal;
};
Hand.prototype.setSuit = function (newSuit){
    this.suit = newSuit;
};