function submitData(boardData, callback){
    boardData = {
            table: { flop: ['ah', 'td', 'jh'] },
            hands: [['ac', 'jd'], ['90%']]
        };

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
                        $('#output').append($('<pre>').text(JSON.stringify(data.message, null, '  ')));
                        callback(data.message);
                    } else {
                        setTimeout(reqStatus, 100);
                    }
                });
            }

            setTimeout(reqStatus, 100);
        }
    });
}