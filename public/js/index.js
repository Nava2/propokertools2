var suits = ['clubs', 'spades', 'diamonds', 'hearts'];

$('#simulate').click(function () {
   var boardData = {
            table: { flop: ['ah', 'td', 'jh'] },
            hands: [['ac', 'jd'], ['90%']]
        };
   submitData(boardData, function(data){
        $('#output').append($('<pre>').text(JSON.stringify(data, null, '  ')));
   });
});

$('#cardPicker').on('show.bs.modal', function (event) {
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

    
    
    <!-- TODO: implement num cards functionality -->
});

$("#saveCards").click(function() {
    console.log("Saving changes for player id: " + $("#cardPicker").data("playerId"));
});

$(window).load(function() {
    $(window).trigger('resize');

    $('#liteAccordion').liteAccordion({
        containerWidth: 700,
        containerHeight: 550
    });
});

$(window).resize(function () {
    var $player = $('.player');
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

    suits.forEach(function (suit) {
        $('.suit-select .' + suit).click(function () {
            $('.card-select .' + suitDisplayed).hide();

            $('.card-select .' + suit).show();
            suitDisplayed = suit;
        });

        $('.card-select .' + suit).hide();
    });

    $('.suit-select .' + suitDisplayed).click();
})();



(function(){

    var cards = [
        {short:"A", long:"Ace"},
        {short:"2", long:"two"},
        {short:"3", long:"three"},
        {short:"4", long:"four"},
        {short:"5", long:"five"},
        {short:"6", long:"six"},
        {short:"7", long:"seven"},
        {short:"8", long:"eight"},
        {short:"9", long:"nine"},
        {short:"T", long:"10 ten"},
        {short:"J", long:"jack"},
        {short:"Q", long:"queen"},
        {short:"K", long:"king"}
    ];

    var suits = [
        {short:"C", long:"Clubs", selector:$(".card-select .clubs")},
        {short:"D", long:"Diamonds", selector:$(".card-select .diamonds")},
        {short:"H", long:"Hearts", selector:$(".card-select .hearts")},
        {short:"S", long:"Spades", selector:$(".card-select .spades")}
    ];

    var allCards = [];
    $.each(cards,function(index,card){
        $.each(suits,function(index,suit){
            var cardObject = {
                card: card,
                suit: suit,
                search: card.short+""+suit.short+" "+card.long+" "+suit.long,
                selector:$("#card-"+card.short+""+suit.short)
            };
            
            allCards.push(cardObject);
        });
    });

    console.log(allCards);

    var cardsEngine = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('search'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: allCards,
      limit: 13
    });
     
    cardsEngine.initialize();

    var $searchInput = $("#search");

    //second way of doing autocomplete display
    $searchInput.on('input',function(e){
        var search = $searchInput.val();
        if ( search ){
            $(".suit-select").hide();
            //hide all cards
            $.each(allCards,function(index,value){
                value.selector.hide();
            });

            //show only cards that need to be displayed
            cardsEngine.get(search, function(suggestions){
                console.log(suggestions);
                $.each(suggestions, function(index,card){
                    card.selector.show();
                });
            });

        }else{
            //no search input, go back to default view
            $.each(allCards,function(index,value){
                value.selector.hide();
            });

            suits[0].selector.click();
            $(".suit-select").show();
            $("."+suits[0].long.toLowerCase()).show();
        }
    })


})();


