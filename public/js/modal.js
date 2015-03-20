(function (window){  
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
            console.log("recalculating route");
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
            return recalculateActiveCard();
        })

        var Globals = {};
        Globals.setCard = setCard;
        return Globals;
    })();

    window.modalSearch = modalSearch;
})(window);;