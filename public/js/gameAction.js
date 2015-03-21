(function (window){
	window.GameActions = {

        /**
         * Set a player's hand on the table to be the cards passed.
         * @param playerNo Player number
         * @param {Card} cards Cards for the player
         */
        setPlayerCards: function (playerId, cards) {
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

            //hand range given
            if(typeof(cards[0]) == "number"){
                
            }
            //standard card selection
            else{

                var imgs = $('.selected img', $player);
                var selectables = $('.selected .card-placeholder', $player);
                cards.forEach(function (card, i) {
                    console.log(card);
                    $(imgs[i]).attr('src', 'images/Cards/' + card.suit.long + '/' + card.value.short + card.suit.short + '.svg');
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
             }

            $('.selected .plus-content .glyphicon-plus', $player).each(function () {
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

})(window);;