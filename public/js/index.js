var suits = ['clubs', 'spades', 'diamonds', 'hearts'];

$('#simulate').click(function () {
    boardData = {
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
            $('.circle', $player).hide();
            $('.selected', $player).show();
        } else {
            $('.circle', $player).show();
            $('.selected', $player).hide();
        }

        circleShowing = !circleShowing;
    };
})());


