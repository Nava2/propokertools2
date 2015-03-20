
if (_.isUndefined(window)) {
    window = {};
}

var pp2 = (function () {
    /**
     * Defines global constants.
     */
    var Globals = {
        /**
         * Values for card information.
         */
        Values : {
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
        },

        Suits: {
            Clubs:    { short: "C", long: "Clubs" },
            Diamonds: { short: "D", long: "Diamonds" },
            Hearts:   { short: "H", long: "Hearts" },
            Spades:   { short: "S", long: "Spades" }
        },

        Cards: { }

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
        this.allCards = _.flatten(_.map(Globals.Suits, function (obj) {
            return _.map(Globals.Values, function (cobj) {
                return Globals.Cards[obj.long][cobj.long];
            });
        }));

        this.cardsAvailable = [];
        var that = this;
        this.allCards.forEach(function (v) { that.cardsAvailable.push(v); });

        this.cardsInUse = [];

        return this;
    }
    Deck.prototype = Object.create(Object.prototype);
    Deck.prototype.constructor = Deck;

    Deck.prototype.setCardAvailable = function (card) {
        var inUseIdx = _.indexOf(this.cardsInUse, card);
        if (inUseIdx !== -1) {
            this.cardsInUse.splice(inUseIdx, 1);
        }

        var avIdx = _.indexOf(this.cardsAvailable, card);

        if (avIdx == -1) {
            this.cardsAvailable.push(card);
        }
    };

    Deck.prototype.setCardUnavailable = function (card) {
        var unavIdx = _.indexOf(this.cardsAvailable, card);
        if (unavIdx !== -1) {
            this.cardsAvailable.splice(unavIdx, 1);
        }

        if (_.indexOf(this.cardsInUse, card) == -1) {
            this.cardsInUse.push(card);
        }
    };

    Deck.prototype.getAvailableCards = function(suit) {
        if (_.isUndefined(suit)) {
            return this.cardsAvailable;
        }

        return _.where(this.cardsAvailable, {suit: suit});
    };

    Deck.prototype.isCardAvailable = function (card) {
        if (_.isUndefined(card)) {
            throw new TypeError('card must be defined.');
        }

        return _.indexOf(this.cardsAvailable, card) > -1;
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
            newHand.forEach(function (c) {
                that._deck.setCardUnavailable(c);
            });
            this._hand.forEach(function (c) {
                that._deck.setCardAvailable(c);
            });

            this._hand = newHand;
        }

        return this._hand;
    };

    Player.prototype.id = function () {
        return this._id;
    };

    Player.prototype.deck = function () {
        return _deck;
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

        this.flop(flop);
        this.turn(turn);
        this.river(river);

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
            flop.forEach(function (c) {
                that._deck.setCardUnavailable(c);
            });
            this._flop.forEach(function (c) {
                that._deck.setCardAvailable(c);
            });
            this._flop = flop;

        }

        return this._flop;
    };

    /**
     * Set the turn of the table to `newCard`.
     * @param {Card|Card[]} newCard Set the turn to the new value, if it is an Array, the first value is used.
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
            this._deck.setCardUnavailable(newCard);
            this._deck.setCardAvailable(newCard);
            this._turn = newCard;
        }

        return this._turn;
    };

    /**
     * Set the river of the table to `newCard`.
     * @param {Card|Card[]} newCard Set the turn to the new value, if it is an Array, the first value is used.
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
            this._deck.setCardUnavailable(newCard);
            this._deck.setCardAvailable(newCard);
            this._river = newCard;
        }

        return this._river;
    };

    /**
     * Holds all data about the Game board.
     * @constructor
     */
    function Game() {
        this._deck = new Deck();
        this._players = {};
        _.range(1, 7).forEach(_.bind(function (i) {
            this._players['p' + i] = new Player(this._deck, 'p' + i);
        }, this));
        this._table = new Table(this._deck);

        return this;
    }
    Game.prototype = Object.create(Object.prototype);
    Game.prototype.constructor = Game;

    Game.prototype.table = function () {
        return this._table;
    };

    Game.prototype.deck = function () {
        return this._deck;
    };

    Game.prototype.player = function (id) {
        return this._players[id];
    };

    Game.prototype.players = function () {
        return this._players;
    };


    Globals.Game = Game;
    Globals.board = new Game(); // preinitialize a game.

    return Globals;

})();

