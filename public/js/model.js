
if (_.isUndefined(window)) {
    window = {};
}

if (!_.has(Date.prototype, 'today') && !_.has(Date.prototype, 'timeNow')) {
    // For todays date;
    Date.prototype.today = function () {
        return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
    };

    // For the time now
    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
    };
}

var pp2 = (function () {
    /**
     * Defines global constants.
     */
    var Globals = { };


        /**
         * Values for card information.
         */
    Globals.Values = {
        Ace:   { short:"A", long: "Ace" },
        Two:   { short:"2", long: "Two" },
        Three: { short:"3", long: "Three" },
        Four:  { short:"4", long: "Four" },
        Five:  { short:"5", long: "Five" },
        Six:   { short:"6", long: "Six" },
        Seven: { short:"7", long: "Seven" },
        Eight: { short:"8", long: "Eight" },
        Nine:  { short:"9", long: "Nine" },
        Ten:   { short:"T", long: "Ten" },
        Jack:  { short:"J", long: "Jack" },
        Queen: { short:"Q", long: "Queen" },
        King:  { short:"K", long: "King" }
    };

    Globals.Suits = {
        Clubs:    { short: "C", long: "Clubs" },
        Diamonds: { short: "D", long: "Diamonds" },
        Hearts:   { short: "H", long: "Hearts" },
        Spades:   { short: "S", long: "Spades" }
    };

    Globals.Cards = {
        All: [],

        /**
         * Converts a card to it's tag or undefined if its undefined.
         * @param {Card} card
         * @returns {undefined|String}
         */
        toTag: function (card) {
            if (_.has(card, 'tag')) {
                return card.tag;
            } else {
                return undefined;
            }
        },

        /**
         * Convert a tag back to a Card
         * @param {String} tag
         * @returns {undefined|Card}
         */
        fromTag: function (tag) {
            if (!tag) {
                return undefined;
            } else {
                return _.findWhere(Globals.Cards.All, { tag: tag });
            }
        }
    };

    _.forEach(Globals.Values, function (value) {
        _.forEach(Globals.Suits, function (suit) {
            var c = Card(suit, value);

            if (_.isUndefined(Globals.Cards[suit.long])) {
                Globals.Cards[suit.long] = {};
            }

            if (_.isUndefined(Globals.Cards[value.long])) {
                Globals.Cards[value.long] = {};
            }

            Globals.Cards[suit.long][value.long] = c;
            Globals.Cards[value.long][suit.long] = c;
            Globals.Cards.All.push(c);
        });
    });

    /**
     * Simple object constructor.
     * @param suit
     * @param value
     * @returns {{suit: *, value: *}}
     * @constructor
     */
    function Card(suit, value) {
        return {
            suit: suit,
            value: value,
            tag: ('' + value.short + suit.short).toLowerCase()
        };
    }

    /**
     * Initializes and fills a deck with all playing cards.
     * Use the remove function to remove a card from the deck
     * @constructor
     */
    function Deck() {
        this.cardsAvailable = _.map(Globals.Cards.All, function (c) { return c; });
        this.cardsInUse = [];

        return this;
    }
    Deck.prototype = Object.create(Object.prototype);
    Deck.prototype.constructor = Deck;

    Deck.prototype.setCardAvailable = function (card) {
        if (_.isUndefined(card)) {
            return;
        }

        var inUseIdx = _.findIndex(this.cardsInUse, function(c) { return card.tag === c.tag; });
        if (inUseIdx > -1) {
            this.cardsInUse.splice(inUseIdx, 1);
        }

        var unavIdx = _.findIndex(this.cardsAvailable, function(c) { return card.tag === c.tag; });

        if (unavIdx < 0) {
            this.cardsAvailable.push(card);
        }
    };

    Deck.prototype.setCardUnavailable = function (card) {
        if (_.isUndefined(card)) {
            return;
        }

        var unavIdx = _.findIndex(this.cardsAvailable, function(c) { return card.tag === c.tag; });
        if (unavIdx > -1) {
            this.cardsAvailable.splice(unavIdx, 1);
        }

        var avIdx = _.findIndex(this.cardsInUse, function(c) { return card.tag === c.tag; });
        if (avIdx < 0) {
            this.cardsInUse.push(card);
        }
    };

    /**
     * Get the available cards of `suit`, or if unspecified all unavailable cards.
     * @param {Object} suit
     * @returns {Card[]}
     */
    Deck.prototype.getAvailableCards = function(suit) {
        if (_.isUndefined(suit)) {
            return this.cardsAvailable;
        }

        return _.where(this.cardsAvailable, {suit: suit});
    };

    /**
     * Check if a card is available
     * @param {Card} card
     * @returns {boolean} True if the card is available
     */
    Deck.prototype.isCardAvailable = function (card) {
        if (_.isUndefined(card)) {
            throw new TypeError('card must be defined.');
        }

        return _.indexOf(this.cardsAvailable, card) > -1;
    };

    /**
     * Reset all cards to be available.
     */
    Deck.prototype.resetDeck = function () {
        this.cardsInUse = [];
        this.cardsAvailable = _.map(Globals.Cards.All, function (c) { return c; });
    };

    /**
     *
     * @param {Deck} deck Reference to the global deck.
     * @param {String} playerID ID for this player.
     * @param {Card[]} [hand] Array of cards
     * @constructor
     */
    function Player (deck, playerID, hand) {
        if (_.isUndefined(deck)) {
            throw new TypeError("Deck must be defined.");
        }

        this._deck = deck;

        this._id = playerID;

        this._hand = [];

        this.hand(hand);

        return this;
    }
    Player.prototype = Object.create(Object.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.hand = function(newHand) {
        if (_.isArray(newHand)) {
            if (newHand.length > 2) {
                throw new TypeError("hand is more than two cards, hand=" + newHand);
            }

            var that = this;
            this._hand.forEach(function (c) {
                that._deck.setCardAvailable(c);
            });
            newHand.forEach(function (c) {
                that._deck.setCardUnavailable(c);
            });

            this._hand = newHand;
            GameActions.setPlayerCards(this._id, this._hand);
        }

        return this._hand;
    };

    Player.prototype.id = function () {
        return this._id;
    };

    Player.prototype.deck = function () {
        return this._deck;
    };

    /**
     * Initialize the table with the flop, turn and river if set.
     * @param {Deck} deck
     * @param {Card[]} [flop]
     * @param {Card} [turn]
     * @param {Card} [river]
     * @constructor
     */
    function Table(deck, flop, turn, river) {
        if (_.isUndefined(deck)) {
            throw new TypeError("Deck must be defined.");
        }

        this._flop = [];
        this._turn = undefined;
        this._river = undefined;

        this._deck = deck;

        /*(this.flop(flop);
        this.turn(turn);
        this.river(river);*/

        return this;
    }
    Table.prototype = Object.create(Object.prototype);
    Table.prototype.constructor = Table;

    Table.prototype.deck = function () {
        return this._deck;
    };

    Table.prototype.flop = function(flop) {
        if (_.isArray(flop)) {
            if (flop.length !== 3 && flop.length !== 0) {
                throw new TypeError('Flop must be zero or three cards, flop=' + flop);
            }

            var that = this;
            _.each(this._flop, function (c) {
                that._deck.setCardAvailable(c);
            });
            _.each(flop, function (c) {
                that._deck.setCardUnavailable(c);
            });

            this._flop = flop;

            GameActions.setBoard("flop", this._flop);

        }

        return this._flop;
    };

    /**
     * Set the turn of the table to `newCard`.
     * @param {Card|Card[]} [newCard] Set the turn to the new value, if it is an Array, the first value is used. If
     *      the parameter is null, it will set the stored value to undefined.
     * @returns {Card|undefined} Return the current turn card or undefined if unset.
     */
    Table.prototype.turn = function(newCard) {
        if (_.isArray(newCard)) {
            if (newCard.length !== 1 && newCard.length !== 0) {
                throw new TypeError('turn must be zero or one cards (passed an array), turn=' + newCard);
            }

            newCard = newCard[0];
        }

        if (_.isObject(newCard)) {
            this._deck.setCardAvailable(this._turn);
            this._deck.setCardUnavailable(newCard);
            this._turn = newCard;
        } else if (_.isNull(newCard)) {

            this._deck.setCardAvailable(this._turn);
            this._turn = undefined;
        }

        GameActions.setBoard("turn", this._turn);

        return this._turn;
    };

    /**
     * Set the river of the table to `newCard`.
     * @param {Card|Card[]|null} [newCard] Set the turn to the new value, if it is an Array, the first value is used. If
     *      the parameter is null, it will set the stored value to undefined.
     * @returns {Card|undefined} Return the current turn card or undefined if unset.
     */
    Table.prototype.river = function(newCard) {
        if (_.isArray(newCard)) {
            if (newCard.length !== 1 && newCard.length !== 0) {
                throw new TypeError('river must be zero or one cards (passed an array), river=' + newCard);
            }

            newCard = newCard[0];
        }

        if (_.isObject(newCard)) {
            this._deck.setCardAvailable(this._river);
            this._deck.setCardUnavailable(newCard);
            this._river = newCard;
        } else if (_.isNull(newCard)) {

            this._deck.setCardAvailable(this._river);
            this._river = undefined;
        }

        GameActions.setBoard("river", this._river);

        return this._river;
    };

    /**
     * Holds all data about the Game board.
     * @constructor
     */
    function Game() {
        this._deck = new Deck();
        this._players = {};
        var that = this;
        _.range(1, 7).forEach(function (i) {
            that._players['p' + i] = new Player(that._deck, 'p' + i);
        });
        this._table = new Table(that._deck);

        return this;
    }
    Game.prototype = Object.create(Object.prototype);
    Game.prototype.constructor = Game;

    /**
     * Get the table of the board.
     * @returns {Table}
     */
    Game.prototype.table = function () {
        return this._table;
    };

    /**
     * Get the deak of cards for the table.
     * @returns {Deck}
     */
    Game.prototype.deck = function () {
        return this._deck;
    };

    Game.prototype.player = function (id) {
        return this._players[id];
    };

    Game.prototype.players = function () {
        return this._players;
    };

    function cardArrToTags(cards) {
        return _.map(cards, Globals.Cards.toTag);
    }

    function tagsToCardArr(tags) {
        return _.map(tags, Globals.Cards.fromTag);
    }

    /**
     * Create a saved "state" for loading later.
     * @returns {{players: String[][], table: {flop: String[], turn: (undefined|String), river: (undefined|String)}}}
     */
    Game.prototype.saveState = function () {
        var table = this.table();

        return {
            players : _.map(this.players(), function (p) { return cardArrToTags(p.hand()); }),
            table: {
                flop: cardArrToTags(table.flop()),
                turn: Globals.Cards.toTag(table.turn()),
                river: Globals.Cards.toTag(table.river())
            }
        };
    };

    /**
     * Reset the current game to have no cards selected and clean slate (i.e. as if new game).
     */
    Game.prototype.resetState = function () {
        _.each(this.players(), function (p) {
            p.hand([]);
        });

        this.table().flop([]);
        this.table().turn(null);
        this.table().river(null);
    };

    /**
     * Load a state from #saveState.
     * @param {{players: String[][], table: {flop: String[], turn: (undefined|String), river: (undefined|String)}}} state
     */
    Game.prototype.loadState = function (state) {
        //this.deck().resetDeck();

        var that = this;
        _.each(state.players, function (hand, i) {
            that.player('p' + (i + 1)).hand(tagsToCardArr(hand));
        });

        this.table().flop(tagsToCardArr(state.table.flop));
        this.table().turn(Globals.Cards.fromTag(state.table.turn));
        this.table().river(Globals.Cards.fromTag(state.table.river));
    };


    Globals.Game = Game;
    Globals.board = new Game(); // preinitialize a game.

    return Globals;

})();

