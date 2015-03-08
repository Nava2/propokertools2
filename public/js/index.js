$('#simulate').click(function () {
    boardData = {
            table: { flop: ['ah', 'td', 'jh'] },
            hands: [['ac', 'jd'], ['90%']]
        };
   submitData(boardData, function(data){
        $('#output').append($('<pre>').text(JSON.stringify(data.message, null, '  ')));
   });
});

$('#cardPicker').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var playerId = button.attr('data-playerId');
    var numCards = button.attr('data-numCards');

    console.log(playerId);
    console.log(numCards);

    var $modal = $(this);
    $modal.data("playerId",playerId);
    
    <!-- TODO: implement num cards functionality -->
})

$("#saveCards").click(function(){
    console.log("Saving changes for player id: "+$("#cardPicker").data("playerId"));
})

$(window).load(function() {
    $('#liteAccordion').liteAccordion({
        containerWidth: 700,
        containerHeight: 550
    });
});