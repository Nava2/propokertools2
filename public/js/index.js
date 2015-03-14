
var suits = ['clubs', 'spades', 'diamonds', 'hearts'];

$('#simulate').click(function () {
   var boardData = {
            table: { flop: ['ah', 'td', 'jh'] },
            hands: [['ac', 'jd'], ['90%']]
        };
   submitData(boardData, function(data){
        $('#output').append($('<pre>').text(JSON.stringify(data, null, '  ')));
   });
});

$('#cardPicker').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var playerId = button.attr('data-playerId');
    var numCards = button.attr('data-numCards');

    console.log(playerId);
    console.log(numCards);

    var $modal = $(this);
    $('#selection-title #currCard', this).text(numCards);
    $('#selection-title #numCards', this).text(numCards);

    $modal.data("playerId",playerId);
    
    <!-- TODO: implement num cards functionality -->
});

$("#saveCards").click(function() {
    console.log("Saving changes for player id: " + $("#cardPicker").data("playerId"));
});

$(window).load(function() {
    $(window).trigger('resize');

    $('#liteAccordion').liteAccordion({
        containerWidth: 700,
        containerHeight: 500
    });
});

$(window).resize(function () {
    var $player = $('.player .circle');
    $player.css({
        'height': $player.outerWidth() + 'px'
    });

    $('.plus-content p', $player).each(function() {
        var $this = $(this);
        $this.css({
            'margin-top': (-($this.parent().parent().outerHeight(true) - $this.height()) / 2) + 'px'
        });
    });
});

/*
 * Modal suit pickers:
 */

/*
 * When you click on a suit image, it will display the cards associated with the suit and hide the old display.
 */
(function () {
    var suitDisplayed = suits[0]; // init

    function getCardDisplay(suit) {
        return $('#card-selection-' + suit.toLowerCase());
    }

    suits.forEach(function (suit) {
        $('.suit-select #suit-' + suit).click(function () {
            getCardDisplay(suitDisplayed).hide();

            getCardDisplay(suit).show();
            suitDisplayed = suit;
        });
    });

    $('.suit-select #suit-' + suitDisplayed).click();
})();

$('.player .selected').hide();

$('.player .circle').show();

$('#reset').click((function () {
    var circleShowing = true;
    return function () {
        var $player = $('.player');
        if (circleShowing) {
            $('.no-cards', $player).hide();
            $('.selected', $player).show();
        } else {
            $('.no-cards', $player).show();
            $('.selected', $player).hide();
        }

        circleShowing = !circleShowing;
    };
})());

var GameActions = {

    /**
     * Set a player's hand on the table to be the cards passed.
     * @param playerNo Player number
     * @param {Card} cards Cards for the player
     */
    setPlayerCards: function (playerNo, cards) {
        var $player = $('#p' + playerNo);

        if (_.isUndefined(cards)) {
            cards = [];
        }

        if (_.isArray(cards) && cards.length == 0) {
            // empty hand
            $('.selected', $player).hide();
            $('.no-cards', $player).show();
            return;
        }

        $('.selected', $player).show();
        $('.no-cards', $player).hide();

        var imgs = $('.selected img', $player);
        var selectables = $('.selected .plus-content', $player);
        cards.forEach(function (card, i) {
            $(imgs[i]).attr('src', 'images/Cards/' + card.suit + '/' + card.value + card.suit.toUpperCase()[0] + '.svg');
        });


        // show and hide
        cards.forEach(function (card, i) {
            $(imgs[i]).show();
            $(selectables[i]).hide();
        });

         _.range(cards.length, 2).forEach(function (i) {
             $(imgs[i]).hide();
             $(selectables[i]).show();
        });

        $('.selected .plus-content span', $player).each(function () {
            var $this = $(this);

            $this.css({
                'top': (($this.parent().parent().height() - $this.height())/2) + 'px'
            });
        });
    },

    /**
     * Set the labels for a player's result.
     * @param playerNo
     * @param handLikelyHood
     * @param isBest
     * @private
     */
    __setHandResult: function (playerNo, handLikelyHood, isBest) {
        var $rspan = $('#p' + playerNo + ' .result');

        if ($rspan.length === 0) {
            return;
        }

        if (_.isNumber(handLikelyHood)) {
            $rspan.text(handLikelyHood + '%');
        }

        if (isBest) {
            $rspan.removeClass('label-primary');
            $rspan.addClass('label-success');
        } else {
            $rspan.addClass('label-primary');
            $rspan.removeClass('label-success');
        }
    },

    /**
     * Sets the board to show the result likely hoods.
     * @param {Number[]} handLikelyHoods Array of percentages (out of 100).
     */
    setHandResults: function (handLikelyHoods) {
        var bestIndex = _.chain(_.range(handLikelyHoods.length)).zip(handLikelyHoods)
            .max(function (x) { return x[1]; })
            .value()[0];

        var setHand = _.bind(function (v) {
            this.__setHandResult.apply(this, v);
        }, this);

        handLikelyHoods.map(function (likelyHood, i) {
            return [i + 1, likelyHood, i === bestIndex];
        }).forEach(setHand);

        _.range(handLikelyHoods.length, 6).map(function (i) {
            return [i + 1, undefined, false];
        }).forEach(setHand);

    }
};

