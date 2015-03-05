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
    var button = $(event.relatedTarget)[0] // Button that triggered the modal
    var playerId = button.id;

    <!-- TODO get cards from card repo-->
    $("#mCardInput").val(playerId);

})