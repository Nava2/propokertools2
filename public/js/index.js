
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
                GameActions.updateBoardEnabledState();
            }
        })
    });

    $('#output-tables').click(function (event) {
        var $this = $(event.target);
        function replay(){
            var board = $this.data('value');

            GameActions.setHandResults([]);
            pp2.board.loadState(board);
            GameActions.updateBoardEnabledState();
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

    $(window).load(function() {
        $(window).trigger('resize');
        
        $('#liteAccordion').liteAccordion({
            containerWidth: 700,
            containerHeight: 750,
            onSlideAnimComplete: function(){
                updateSaveCardButton();
            },
        });
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
