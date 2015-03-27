
(function (window) {

    $('#simulate').click(function () {
        var board = pp2.board.saveState();

        Simulate.submit( Simulate.buildBoardData(), function (results) {
            console.log("Got results: ", results);
            Simulate.appendSimulationResult(results, board);

            var equities = _.pluck(results.hands, 'equity');
            GameActions.setHandResults(equities);
        });
    });

    $('#reset').click(function () {
        if ( pp2.board.isBoardEmpty() ){
            return;
        }
        bootbox.confirm("Are you sure you want to reset?",function(result){
            if ( result ){
                GameActions.setHandResults([]);
                pp2.board.resetState();
            }
        })
    });

    $('#output-tables').click(function (event) {
        var $this = $(event.target);
        function replay(){
            var board = $this.data('value');

            GameActions.setHandResults([]);
            pp2.board.loadState(board);
        }

        if ($this.hasClass('resetBtn')) {
            if ( pp2.board.isBoardEmpty() ){
                return replay();
            }
            bootbox.confirm("Are you sure you want to replay?",function(result){
                if ( result ){
                    replay();
                }
            })

        }
    });

   /*
    * JQueryUI advanced tab % slider
    */
    $(function() {
        var $sliderRange = $("#slider-range");
        $sliderRange.slider({
          range: true,
          min: 0,
          max: 100,
          values: [ 0, 100 ],
          slide: function( event, ui ) {
            $("#range").val(" " + ui.values[ 0 ] + "% - " + ui.values[ 1 ] + "%");
          }
        });
        
        $("#range").val(" " + $sliderRange.slider( "values", 0 ) +
            "% - " + $sliderRange.slider( "values", 1 ) + "%" );
    });
    


    $(window).load(function() {
        $(window).trigger('resize');

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

    $('.player .selected').hide();

    $('.player .circle').show();
})(window);
