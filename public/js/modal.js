(function (window){  


    var $cardPicker = $('#cardPicker');
    //event listeners
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


    var $modalOriginalState = null;
    $(window).load(function() {
        $modalOriginalState = $("#cardPicker").clone(true,true);

    });

    /*
     * Modal close event listener
     */
    $cardPicker.on('hidden.bs.modal', function () {
        //reset modal data to default state
        $(this).replaceWith($modalOriginalState.clone(true,true));

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
        pp2.board.player(playerId).hand(hand);
        GameActions.setPlayerCards(playerId, hand);
        $cardPicker.modal("hide");
    });


    //suit select
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

        function recalculateActiveCard(){

            $(".pick-card.enabled").removeClass("enabled").addClass("button");
            $(".pick-card.button").first().removeClass("button").addClass("enabled");
            return false;
        }

        $(".delete-card").click(function(){
            $(this).hide();

            //get card and re-enable it
            var $card = $(this).parent().find("img");
            $(".card-select.card-display").find('#'+$card.attr('id')).removeClass("disabled");
            $modalOriginalState.find('#'+$card.attr('id')).removeClass("disabled");
            $card.remove();

            //change the selection back into a button
            $(this).parent().find(".plus-content").show();
            $(this).parent().addClass("button");
            return recalculateActiveCard();
        })

        var Globals = {};
        Globals.setCard = setCard;
        return Globals;
    })();

    window.modalSearch = modalSearch;
})(window);;