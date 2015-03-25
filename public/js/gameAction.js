(function (window){
	var ga = { };

    function updateSimulateButton (){
        if (pp2.board.table().flop().length != 3 ){
            $("#simulate").attr("disabled","disabled");
            return;
        }

        var count = 0;
        //check if atleast 2 player's hand has been set
        _.each(pp2.board.players(),function(p){
            if ( p.hand().length != 0 ){
                count++;
                if ( count >= 2){
                    return;
                }
            }
        })

        if ( count == 2 ){
            $("#simulate").removeAttr('disabled');
        }else{
            $("#simulate").attr("disabled","disabled");
        }
    }
    /**
     * Set a player's hand on the table to be the cards passed.
     * @param playerId Player number
     * @param {Card[]} cards Cards for the player
     */
    ga.setPlayerCards = function (playerId, cards) {
        var $player = $('#' + playerId);

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

        var $imgs = $('.selected img', $player);
        var $selectables = $('.selected .card-placeholder', $player);
        cards.forEach(function (card, i) {
            console.log(card);
            $($imgs[i]).attr('src', 'images/Cards/' + card.suit.long + '/' + card.value.short + card.suit.short + '.svg');
        });


        // show and hide
        cards.forEach(function (card, i) {
            $($imgs[i]).show();
            $($selectables[i]).hide();
        });

         _.range(cards.length, 2).forEach(function (i) {
             $($imgs[i]).hide();
             $($selectables[i]).show();
        });

        $('.selected .plus-content .glyphicon-plus', $player).each(function () {
            var $this = $(this);

            $this.css({
                'top': (($this.parent().parent().height() - $this.height())/2) + 'px'
            });
        });
        updateSimulateButton();
    };

    ga.updateBoardEnabledState = function (boardTypeId, isSet) {
        var state = {
            flop: "turn",
            turn: "river"
        };

        if ( isSet ){
            $("#"+boardTypeId+" .enabled").removeClass("enabled").addClass("button");
            if ( boardTypeId in state){
                $("#"+state[boardTypeId]+" .button").removeClass("button").addClass("enabled");
            }
        } else {
            $("#"+boardTypeId+" .button").removeClass("button").addClass("enabled");
            if ( boardTypeId in state){
                $("#"+state[boardTypeId]+" .enabled").removeClass("enabled").addClass("button");
            }
        }

    };

    ga.setBoard = function (boardTypeId, cards) {
        var $boardType = $("#" + boardTypeId);
        if (_.isUndefined(cards)) {
            cards = [];
        } else if ( !_.isArray(cards)) {
            cards = [cards];
        }

        $('img', $boardType).remove();
        if (_.isArray(cards) && cards.length == 0) {
            // empty hand
            $('.plus-content', $boardType).show();
            ga.updateBoardEnabledState(boardTypeId, false);
        } else {
            $('.plus-content', $boardType).hide();

            cards.forEach(function (card, i) {
                $boardType.find(".table-card:nth-child("+(i+1)+")")
                    .append("<img src='images/Cards/" + card.suit.long + '/' + card.value.short + card.suit.short + ".svg' />");
            });
            ga.updateBoardEnabledState(boardTypeId, true);
        }

        updateSimulateButton();
    };

    /**
     * Set the labels for a player's result.
     * @param playerNo
     * @param handLikelyHood
     * @param isBest
     * @private
     */
    var __setHandResult = function (playerNo, handLikelyHood, isBest) {
        var $rspan = $('#p' + playerNo + ' .result');

        if ($rspan.length === 0) {
            return;
        }

        if (_.isNumber(handLikelyHood)) {
            $rspan.text(handLikelyHood + '%');
        } else {
            $rspan.text('');
        }

        if (isBest) {
            $rspan.removeClass('label-primary');
            $rspan.addClass('label-success');
        } else {
            $rspan.addClass('label-primary');
            $rspan.removeClass('label-success');
        }
    };

    /**
     * Sets the board to show the result likely hoods.
     * @param {Number[]} handLikelyHoods Array of percentages (out of 100).
     */
    ga.setHandResults = function (handLikelyHoods) {
        var bestIndex = _.chain(_.range(handLikelyHoods.length)).zip(handLikelyHoods)
            .max(function (x) { return x[1]; })
            .value()[0];

        handLikelyHoods.map(function (likelyHood, i) {
            return [i + 1, likelyHood, i === bestIndex];
        }).forEach(function (args) { __setHandResult.apply(null, args); });

        _.range(handLikelyHoods.length, 6).map(function (i) {
            return [i + 1, undefined, false];
        }).forEach(function (args) { __setHandResult.apply(null, args); });
    };

    window.GameActions = ga;
})(window);