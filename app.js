var config = {
    apiKey: "AIzaSyB-q1eXLugjjoYPfwyal0CsBxL5klrrNSs",
    authDomain: "train-scheduler-7ec63.firebaseapp.com",
    databaseURL: "https://train-scheduler-7ec63.firebaseio.com",
    projectId: "train-scheduler-7ec63",
    storageBucket: "",
    messagingSenderId: "585576149296"
};
firebase.initializeApp(config);

var database = firebase.database();
var trainName = "";
var destination = "";
var trainTime = "";
var frequency = 0;
var currentTime = moment().format("hh:mm:ss a");

//load page functions/intervals on load
clock();
tickTock();

//real time clock on header
function clock() {
    $("#time").html(moment().format('ddd MMM Do h:mm:ss a'));
}
setInterval(clock, 1000);

$("#add-train").on("click", function () {
    //prevent empty form input
    if ($("#nameInput").val() === "" || $("#destInput").val() === "" || $("#freqInput").val() === "" || $("#freqInput").val() <=0) {
        console.log("empty Field");
        return false;
    }
    // Get inputs
    trainName = $("#nameInput").val().trim();
    destination = $("#destInput").val().trim();
    trainTime = $("#timeInput").val().trim();
    frequency = $("#freqInput").val().trim();


    // Change what is saved in firebase
    database.ref().push({
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency,
    });

});

//tick tock refreshes databse pulls in real time
function tickTock() {
    //clear curent train schedule for refresh
    $("#table").empty();

    //on database update
    database.ref().on("child_added", function (childSnapshot) {
        //establish new time formats from database
        var freq = parseInt(childSnapshot.val().frequency);
        //format times for math function
        var formatTime = moment(childSnapshot.val().trainTime, 'HH:mm a').subtract(1, "day");
        var diffTime = moment().diff(formatTime, "minutes");
        var timeLeft = diffTime % freq;
        var tMinutesTillTrain = freq - timeLeft;
        var next = moment().add(tMinutesTillTrain, "minutes");
        var nextTrain = moment(next).format("hh:mm a");
        //update train schedule table
        $("#table").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" + freq + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>")
    });

};
setInterval(tickTock, 1000);