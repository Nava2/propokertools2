/**
 * Created by kevin on 15-03-20.
 */

(function (window) {

    var Simulate = {};

    /**
     * Submits data to the server.
     * @param boardData
     * @param {Function} [callback]
     */
    function submitData(boardData, callback) {
        $.ajax({
            url : '/submit',
            type : "POST",
            data : JSON.stringify(boardData),
            contentType : "application/json; charset=utf-8",
            dataType : "json",
            success: function (data) {
                var id = data.id;

                function reqStatus() {
                    $.get("/status/" + id, function (data) {
                        if (!/^(?:Error|Running)/.test(data.message)) {
                            if (_.isFunction(callback)) {
                                callback(data.message, boardData);
                            }
                        } else {
                            setTimeout(reqStatus, 30);
                        }
                    });
                }

                setTimeout(reqStatus, 30);
            }
        });
    }

    function buildBoardData() {
        var gtable = pp2.board.table();

        var table = {
            flop: _.map(gtable.flop(), pp2.Cards.toTag),
            turn: pp2.Cards.toTag(gtable.turn()),
            river: pp2.Cards.toTag(gtable.river())
        };

        var hands = _.chain(pp2.board.players()).map(function (player) {
            return player.hand();
        }).map(function (hand) {
            if (_.isArray(hand)) {
                return _.map(hand, pp2.Cards.toTag);
            } else if (_.isNumber(hand)) {
                return [hand + '%'];
            } else {
                return undefined;
            }
        }).value();

        return {
            table: table,
            hands: hands
        };
    }

    var suit2Unicode = {
        h: '&#9829;',
        d: '&#9830;',
        c: '&#9827;',
        s: '&#9824;'
    };

    function tag2ColorClass(tag) {
        if (tag[1] == 'h' || tag[1] == 'd') {
            return "red";
        } else {
            return "black";
        }
    }

    var tableTemplate = $("#outputTemplate").html();
    function appendSimulationResult(result, input) {
        var $output = $('#output-tables');
        if ($output.children().length > 1) {
            $output.prepend('<hr />');
        }

        var now = new Date();
        $output.prepend(_.template(tableTemplate)({
            result: result,
            submitData: input,
            timeStr: now.today() + ' ' + now.timeNow(),
            suit2Unicode: suit2Unicode,
            tag2ColorClass: tag2ColorClass
        }));
    }

        // Module:
    Simulate.buildBoardData = buildBoardData;

    Simulate.appendSimulationResult = appendSimulationResult;
    Simulate.submit = submitData;

    window.Simulate = Simulate;

})(window);