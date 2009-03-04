function findTrain(number) {
    var trainNumber = 4676;
    $.get("http://trainview.septa.org/", function(data) {
        var numberCells = $(data).find("#train_table td").grep(function
        console.log(data.substr(0, 2));
    });
    document.getElementById("indicator").object.setValue(10);
}