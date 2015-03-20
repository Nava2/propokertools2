
(function (window) {



    var Simulate = (function () {

        /**
         * Submits data to the server.
         * @param boardData
         * @param {Function} [callback]
         */
        function submitData(boardData, callback) {
            $.ajax({
                url : '/submit',
                type : "POST",
                data : JSON.stringify(boardData),
                contentType : "application/json; charset=utf-8",
                dataType : "json",
                success: function (data) {
                    var id = data.id;

                    function reqStatus() {
                        $.get("/status/" + id, function (data) {
                            if (!/^(?:Error|Running)/.test(data.message)) {
                                if (_.isFunction(callback)) {
                                    callback(data.message);
                                }
                            } else {
                                setTimeout(reqStatus, 30);
                            }
                        });
                    }

                    setTimeout(reqStatus, 30);
                }
            });
        }

        function Card2Tag(card) {
            return card.tag;
        }


        function buildBoardData() {
            var gtable = pp2.board.table();

            var table = {
                flop: _.map(gtable.flop(), Card2Tag),
                turn: gtable.turn(),
                river: gtable.river()
            };

            var hands = _.chain(pp2.board.players()).map(function (player) {
                return player.hand();
            }).map(function (hand) {
               if (_.isArray(hand)) {
                   return _.map(hand, Card2Tag);
               } else if (_.isNumber(hand)) {
                   return [hand + '%'];
               } else {
                   return undefined;
               }
            }).value();

            var board = {
                table: table,
                hands: hands
            };

            return board;
        }




        return {
            buildBoardData: buildBoardData,

            submit: submitData
        };


    })();

    $('#simulate').click(function () {
        Simulate.submit(Simulate.buildBoardData(), function (results) {
            console.log("Got results: ", results);
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

        pp2.board.player('p1').hand([pp2.Cards.Ace.Clubs, pp2.Cards.Ace.Diamonds]);
        pp2.board.player('p2').hand([pp2.Cards.Ace.Spades, pp2.Cards.King.Spades]);
        GameActions.setPlayerCards('p1', pp2.board.player('p1').hand());
        GameActions.setPlayerCards('p2', pp2.board.player('p2').hand());

        pp2.board.table().flop([pp2.Cards.Two.Spades, pp2.Cards.Two.Clubs, pp2.Cards.Three.Spades]);

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
