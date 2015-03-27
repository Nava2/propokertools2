(function (window){
	var ga = { };

    function updateSimulateButton (){
        var count = pp2.board.numberOfHandsSet();

        if ( count >= 2 ){
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
            updateSimulateButton();
            return;
        }

        $('.selected', $player).show();
        $('.no-cards', $player).hide();

        var $imgs = $('.selected img', $player);
        var $selectables = $('.selected .card-placeholder', $player);
        var $low = $('.selected .low-range', $player)
        var $high = $('.selected .high-range', $player);

        //hand range given
        if(typeof(cards[0]) == "number"){
            $low.text(cards[0]+"% -");
            $high.text(cards[1]+"%");
            $imgs.hide();
            $selectables.hide();
        }
        //standard card selection
        else{
            $low.text("");
            $high.text("");

            var $imgs = $('.selected img', $player);

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
         }

        $('.selected .plus-content .glyphicon-plus', $player).each(function () {
            var $this = $(this);

            $this.css({
                'top': (($this.parent().parent().height() - $this.height())/2) + 'px'
            });
        });
        updateSimulateButton();
    };

    function updateBoardEnabled(enableId, disableId){
        if ( enableId != null){
            $("#"+enableId).removeClass("button").addClass("enabled");
        }
        if ( disableId != null){
            $("#"+disableId).removeClass("enabled").addClass("button");    
        }
    }

    ga.updateBoardEnabledState = function () {
        if ( _.isEmpty(pp2.board.table().flop())){
            _.each([1,2,3],function(i){
                updateBoardEnabled("f"+i);
            })
            updateBoardEnabled(null,"t1");
            updateBoardEnabled(null,"r1");
            return;
        }else{
            updateBoardEnabled("t1","r1");
        }

        if ( _.isEmpty(pp2.board.table().turn())){
            updateBoardEnabled("t1","r1");
            return;
        }else{
            updateBoardEnabled("r1");
        }

        if ( !_.isEmpty(pp2.board.table().river())){
            updateBoardEnabled(null,"r1");
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
        } else {
            $('.plus-content', $boardType).hide();

            cards.forEach(function (card, i) {
                $boardType.find(".table-card:nth-child("+(i+1)+")")
                    .append("<img src='images/Cards/" + card.suit.long + '/' + card.value.short + card.suit.short + ".svg' />");
            });
        } 
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
