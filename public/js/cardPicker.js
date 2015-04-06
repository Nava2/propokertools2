(function (window){  
    var boardMap = {
        pflop: "flop",
        pturn:  "turn",
        priver: "river"
    };

    var SLIDER_MIN_MAX = [1, 100];

    var $cardPicker = $('#cardPicker');
    //event listeners
    $cardPicker.on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        // get the data passed in
        var playerId = button.attr('data-playerId');
        var numCards = button.attr('data-numCards');
        if ( button.attr('data-status') == 'disabled'){
            return false;
        }


        //update modal headers
        var $modal = $(this);
        $('#selection-title #currCard', this).text(numCards);
        $('#selection-title #numCards', this).text(numCards);

        $modal.data("playerId",playerId);

        //update the number of cards in the footer
        $.each($modal.find("#picked-cards").children(),function(index){
            if ( index >= numCards){
                $(this).hide();
                $(this).removeClass("valid");
            }else{
                $(this).show();
                $(this).addClass("valid")
            }

        });

        $('.card-select img[id^=card].disabled', $modal).removeClass('disabled');

        //disable cards
        pp2.board.deck().getCardsInUse().forEach(function(card){
            if (_.isObject(card)) {
                $("#card-" + card.value.short + card.suit.short, $modal).addClass("disabled");
            }
        });

        if (playerId in boardMap) {
            $("#advanced-accordion").hide();
        }else{
            $("#advanced-accordion").show();
            var playerHand = pp2.board.player(playerId).hand();
            var advancedSelected =  $("#advanced").hasClass("selected");
            var isCard = playerHand.length == 0 || !_.isNumber(playerHand[1]);
            if ( advancedSelected && isCard ){
                $("#advanced").click();
            }else if ( !advancedSelected && !isCard) {
                $("#advanced").click();
            }
        }


        //get saved cards
        var playerId = $modal.data("playerId");
        var hand = [];
        if (playerId in boardMap) {
            hand = pp2.board.table().setCards(boardMap[playerId]);
        }else{
            hand = pp2.board.player(playerId).hand();
        }
        if ( _.isUndefined(hand)){
            hand = [];
        }else if ( !_.isArray(hand)){
            hand = [hand];
        }

        var sliderValues = _.clone(SLIDER_MIN_MAX);
        hand.forEach(function(card, i){
            if(!_.isNumber(card)){
                modalSearch.setCard($modal.find("#card-"+card.value.short+""+card.suit.short));
            }else{
                sliderValues[i] = card;
            }
        });

        //update advanced slider values
        $("#slider-range").slider('option', 'values', sliderValues);
        $("#range").val(sliderValues[0]+"% - "+sliderValues[1]+"%");

        updateSaveCardButton();

    });

    $cardPicker.on('shown.bs.modal', function () {
        var $modal = $(this);

        $("#search").focus();

        $('.plus-content .glyphicon-plus', $modal).each(function () {
            var $this = $(this);

            var display = $this.parent().css('display');
            $this.parent().show();

            $this.css({
                top: (($this.parent().parent().height() - $this.height()) / 2) + 'px',
                width: $this.height() + 'px'
            });

            $this.css({
                left: (($this.parent().parent().width() - $this.width()) / 2) + 'px'
            });
            $this.parent().css('display', display);

        });

    });


    /*
     * Modal close event listener
     */
    $cardPicker.on('hide.bs.modal', function () {
        //reset modal data to default state
        $("#search").val("").trigger('input');
        $(".delete-card").click();
        $('.suit-select .' + pp2.Suits.Clubs.long).click();

    });

    $("#saveCards").click(function() {
       
        var $cardPicker = $('#cardPicker');
        var hand = [];
        var playerId = $cardPicker.data("playerId");


        if($("#advanced").hasClass("selected")){
            $cardPicker.modal("hide");
            hand = $("#slider-range").slider( "values" );
            pp2.board.player(playerId).hand(hand);
            GameActions.setHandResults([]);
        }
        else {
            $("#picked-cards > .pick-card > img", $cardPicker).each(function(index, card) {
                var suit = $(card).data("card-suit");
                var value = $(card).data("card-value");
                hand.push(pp2.Cards[suit][value]);
            });

            if(hand.length == 0 && (playerId == "pturn" || playerId == "priver") ){
                hand = null;
            }

            if (playerId in boardMap){
                pp2.board.table().setCards(boardMap[playerId],hand);
            }else{
                pp2.board.player(playerId).hand(hand);
            }
            
            $cardPicker.modal("hide");
            GameActions.setHandResults([]);
            GameActions.updateBoardEnabledState();
        }
    });


    window.updateSaveCardButton = function(){
        if ( $("#picked-cards > .enabled").length == 0 || $(".pick-card > .delete-card:visible").length == 0 || $("#advanced").hasClass("selected")){
            $("#saveCards").removeAttr('disabled');
        }else{
            $("#saveCards").attr('disabled','disabled');
        }
    };

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
                    search: card.short + suit.short + " " + card.long + " " + suit.long,
                    selector:"#card-" + card.short + suit.short
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
        var $search = $("#search");
        $search.on('input',function(e){
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
                $("."+pp2.Suits.Clubs.long.toLowerCase(),$cardPicker).show();
            }
        });

        $search.keyup(function(e){
            if ( e.keyCode != 13 || $(this).val() == ''){ //enter was not pressed
                 return;
            }
            
            var $card = $(".card-select.card-display > img:visible:not(.disabled)").first();
            if ( $card.length == 0){
                return;
            }

            modalSearch.setCard($card);

        })

    })();

    /*
     * JQueryUI advanced tab % slider
     */
    $(function() {
        var $sliderRange = $("#slider-range");
        $sliderRange.slider({
            range: true,
            min: SLIDER_MIN_MAX[0],
            max: SLIDER_MIN_MAX[1],
            values: SLIDER_MIN_MAX,
            slide: function( event, ui ) {
                $("#range").val(" " + ui.values[ 0 ] + "% - " + ui.values[ 1 ] + "%");
            }
        });

        $("#range").val(" " + $sliderRange.slider( "values", 0 ) +
            "% - " + $sliderRange.slider( "values", 1 ) + "%" );
    });

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
            if ( $selectedCard.hasClass("valid") && $selectedCard.hasClass("button") ){
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
            $cardElement.clone().show().appendTo($selectedCard);     
            $cardElement.addClass("disabled");

            //remove button class from parent
            selectNextActiveCard();
            updateSaveCardButton();
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
            $card.remove();

            //change the selection back into a button
            $(this).parent().find(".plus-content").show();
            $(this).parent().addClass("button");
            recalculateActiveCard();
            updateSaveCardButton();
            return false;
        });

        var Globals = {};
        Globals.setCard = setCard;
        return Globals;
    })();

    window.modalSearch = modalSearch;
})(window);