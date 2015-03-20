
(function (window) {

    $('#simulate').click(function () {
       var boardData = {
                table: { flop: ['ah', 'td', 'jh'] },
                hands: [['ac', 'jd'], ['90%']]
            };
       submitData(boardData, function(data){
            $('#output').append($('<pre>').text(JSON.stringify(data, null, '  ')));
       });
    });

   /*
    * JQueryUI advanced tab % slider
    */
    $(function() {
        $( "#slider-range" ).slider({
          range: true,
          min: 0,
          max: 100,
          values: [ 0, 100 ],
          slide: function( event, ui ) {
            $( "#range" ).val(" " + ui.values[ 0 ] + "% - " + ui.values[ 1 ] + "%");
          }
        });
        
        $( "#range" ).val(" " + $( "#slider-range" ).slider( "values", 0 ) +
        "% - " + $( "#slider-range" ).slider( "values", 1 ) + "%" );
    });
    
    $("#saveCards").click(function() {
        var $cardPicker = $('#cardPicker');
        var playerId = $cardPicker.data("playerId");
        var hand = [];
        $("#picked-cards > .pick-card > img", $cardPicker).each(function(index, card) {
            var suit = $(card).data("card-suit");
            var value = $(card).data("card-value");
            hand.push(pp2.Cards[suit][value]);
            $modalOriginalState.find("#"+card.id).addClass("disabled");
        });

        console.log(playerId);
        console.log("saved clicked");
        pp2.board.player(playerId).hand(hand);
        GameActions.setPlayerCards(playerId, hand);
        $cardPicker.modal("hide");
    });


    $(window).load(function() {
        $(window).trigger('resize');
        $modalOriginalState = $("#cardPicker").clone(true,true);

    });

    $(window).resize(function () {
        var $player = $('.player .no-cards');
        $player.css({
            'height': $player.outerWidth() + 'px'
        });

        $('.plus-content .glyphicon-plus', $player).each(function() {
            var $this = $(this);
            $this.css({
                top: (($this.parent().parent().height() - $this.height()) / 2) + 'px',
                width: $this.height() + 'px'
            });
        });


        $('.table-card-set .plus-content .glyphicon-plus').each(function () {
            var $this = $(this);

            $this.css({
                top: (($this.parent().parent().height() - $this.height()) / 2) + 'px'
                //width: $this.height() + 'px'
            });
        });
    });

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

})(window);
