/**
 * Created by Yaqzan on 013, Mar 13, 2015.
 */

var Player = {
    playerID: [0, 1, 2, 3, 4, 5],
    hand: hand,

    setNewHand: function (newHand){
        this.hand = newHand;
    },
    setPlayerID: function (newID){
        this.playerID = newID;
    }
};

var Table = {
    theFlop : [card1, card2, card3],
    theTurn : card4,
    theRiver : card5,
    setFlop: function (newCard1, newCard2, newCard3){
        this.theFlop = [newCard1, newCard2, newCard3];
    },
    setTurn: function (newCard){
        this.theTurn = newCard;
    },
    setRiver: function (newCard){
        this.theRiver = newCard;
    }
};

var Hand = {
    first : card1,
    second : card2,
    setFirstCard: function (newCard){
        this.first = newCard;
    },
    setCardSuit: function (newCard){
        this.second = newCard;
    }
};

var Card = {
    suit: ["diamonds", "spades", "hearts", "clubs"],
    value: ["A", "1", "2", "3", "4", "5" , "6" ,"7" ,"8" ,"9" ,"10" ,"J" ,"Q" , "K"],
    setCardValue: function (value){
        this.value = value;
    },
    setCardSuit: function (suit){
        this.suit = suit;
    }
};