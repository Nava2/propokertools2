function submitData(boardData, callback){
   

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