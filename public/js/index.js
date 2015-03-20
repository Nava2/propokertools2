
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

    var $cardPicker = $('#cardPicker');

    $cardPicker.on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        // get the data passed in
        var playerId = button.attr('data-playerId');
        var numCards = button.attr('data-numCards');


        //update modal headers
        var $modal = $(this);
        $('#selection-title #currCard', this).text(numCards);
        $('#selection-title #numCards', this).text(numCards);

        $modal.data("playerId",playerId);

        //update the number of cards in the footer
        $.each($modal.find("#picked-cards").children(),function(index){
            if ( index >= numCards){
                $(this).hide();
            }else{
                $(this).show();
            }
        });
    });

    var $modalOriginalState = null;
    $cardPicker.on('shown.bs.modal', function () {
        var $modal = $(this);

        $("#search").focus();

        $('.plus-content .glyphicon-plus', $modal).each(function () {
            var $this = $(this);

            $this.css({
                top: (($this.parent().parent().height() - $this.height()) / 2) + 'px',
                width: $this.height() + 'px',
            });

            $this.css({
                left: (($this.parent().parent().width() - $this.width()) / 2) + 'px',
            })

        });

        var playerId = $modal.data("playerId");
        //get saved cards
        var hand = pp2.board.player(playerId).hand();
        hand.forEach(function(card){
            modalSearch.setCard($modal.find("#card-"+card.value.short+""+card.suit.short));
        });


        $('#liteAccordion').liteAccordion({
            containerWidth: 700,
            containerHeight: 550
        });
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
    /*
     * Modal close event listener
     */
    $cardPicker.on('hidden.bs.modal', function () {
        //reset modal data to default state
        $(this).replaceWith($modalOriginalState.clone(true,true));

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

    /*
     * Modal suit pickers:
     */

    /*
     * When you click on a suit image, it will display the cards associated with the suit and hide the old display.
     */
     
    (function () {
        var suitDisplayed = pp2.Suits.Clubs.long; // init

        $.each(pp2.Suits,function (index,suitObject) {
            var suit = suitObject.long;
            $('.suit-select .' + suit).click(function () {
                $('.card-select .' + suitDisplayed).hide();

                $('.card-select .' + suit).show();
                suitDisplayed = suit;
            });

            $('.card-select .' + suit).hide();
        });

        $('.suit-select .' + suitDisplayed).click();
    })();

    //modal search functionality
    (function(){

        var allCards = [];
        $.each(pp2.Values,function(index,card){
            $.each(pp2.Suits,function(index,suit){
                var cardObject = {
                    card: card,
                    suit: suit,
                    search: card.short+""+suit.short+" "+card.long+" "+suit.long,
                    selector:"#card-"+card.short+""+suit.short
                };
                
                allCards.push(cardObject);
            });
        });


        var cardsEngine = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('search'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: allCards,
          limit: 13
        });
         
        cardsEngine.initialize();


        //second way of doing autocomplete display
        $("#search").on('input',function(e){
            var search = $(this).val();
            if ( search ){
                $(".suit-select").hide();
                //hide all cards
                $.each(allCards,function(index,value){
                    $(value.selector).hide();
                });

                //show only cards that need to be displayed
                cardsEngine.get(search, function(suggestions){

                    $.each(suggestions, function(index,card){
                        $(card.selector).show();
                    });
                });

            }else{
                //no search input, go back to default view
                $.each(allCards,function(index,value){
                    $(value.selector).hide();
                });

                $(".suit-select").show();
                $("."+pp2.Suits.Clubs.long.toLowerCase()).show();
            }
        })

        $("#search").keyup(function(e){
            if ( e.keyCode != 13 || $(this).val() == ''){ //enter was not pressed
                 return;
            }
            
            var $card = $(".card-select.card-display>img:visible:not(.disabled)").first();
            if ( $card.length == 0){
                return;
            }

            modalSearch.setCard($card);

        })

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


    //modal select card functonality
    var modalSearch = (function(){
        
        function getSelectedCard(){
            var $selectedCard = $(".pick-card.enabled");
            if ( $selectedCard.length == 0 ){
                return null;
            }
            return $selectedCard;
        }

        function selectNextActiveCard(){
            var $selectedCard = getSelectedCard();
            if($selectedCard == null ){
                return;
            }

            $selectedCard.removeClass("enabled");
            $selectedCard = $selectedCard.next();
            if ( $selectedCard.is(":visible") && $selectedCard.hasClass("button") ){
                $selectedCard.removeClass("button")
                $selectedCard.addClass("enabled");
            }
        }

        //all card pick event
        $(".card-select > img").click(function(){
            if ( $(this).hasClass("disabled")){
                return;
            }
            
            setCard($(this));

        });

        $(".pick-card").click(function(){
            if ( $(this).hasClass("button")){
                $(this).parent().find(".enabled").removeClass("enabled").addClass("button");

                $(this).removeClass("button").addClass("enabled");
            }
        });

        var setCard = function($cardElement){
            var $selectedCard = getSelectedCard();
            //set the card image to the bottom selected card 
            if ( $selectedCard  == null ){
               return;
            }

            $selectedCard.find(".plus-content").hide();
            $selectedCard.find(".delete-card").show();
            $cardElement.clone().appendTo($selectedCard);     
            $cardElement.addClass("disabled");

            //remove button class from parent
            selectNextActiveCard();
        };

        $(".delete-card").click(function(){
            $(this).hide();

            //get card and renable it
            var $card = $(this).parent().find("img");
            console.log($card.attr('id'));
            console.log($(".card-select.card-display"))
            $(".card-select.card-display").find('#'+$card.attr('id')).removeClass("disabled");
            $card.remove();

            //change the selection back into a button
            $(this).parent().find(".plus-content").show();
            $(this).parent().addClass("button");
        })

        var Globals = {};
        Globals.setCard = setCard;
        return Globals;
    })();

})(window);
