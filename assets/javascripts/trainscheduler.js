
  // Initialize Firebase
var config = {
    apiKey: "AIzaSyAqxLO_HHbKmagtxzq1Bcqzgasv8LTg-x4",
    authDomain: "train-scheduler-65acd.firebaseapp.com",
    databaseURL: "https://train-scheduler-65acd.firebaseio.com",
    projectId: "train-scheduler-65acd",
    storageBucket: "",
    messagingSenderId: "1029295091320"
  };
firebase.initializeApp(config);
database = firebase.database();

function calcNextArrival(time, freq) {
	//get time info
	var mTime = moment(time,'H HH');	
	console.log(time);
	console.log(moment(mTime).get('hour'));
	console.log(moment(mTime).get('minute'));
}


$(document).ready(function() {

//retrieve from firebase
database.ref().on("child_added", function(snapshot, prevChildKey) {
	var name = snapshot.val().name;
	var dest = snapshot.val().dest;
	var firstTrainTime = snapshot.val().firstTrainTime;
	var frequency = snapshot.val().frequency;
	updateTable(name, dest, firstTrainTime, frequency);

});

function updateTable(name, dest, time, freq) {
	var entry;
	entry = `<tr><td>${name}</td><td>${dest}</td><td>${freq}</td><td>${time}</td><td>0</)td></tr>`;
	$('#table-schedule > tbody').append(entry);

}

$('#add-train-btn').on('click', function(event) {
	event.preventDefault();
//take user input
	var name;
	var dest;
	var firstTrainTime;
	var frequency;
	var entry;
	var nextArrival;

	name = $('#train-name-input').val().trim();
	dest = $('#train-dest-input').val().trim();
	firstTrainTime = $('#train-time-input').val().trim();
	frequency = parseInt($('#train-freq-input').val().trim());
	console.log(name);
	console.log(dest);
	console.log(firstTrainTime);
	console.log(frequency);
	//calculate next arrival
	nextArrival = calcNextArrival(firstTrainTime, frequency);
	//calculate minute away
	//display to table
	updateTable(name, dest, firstTrainTime, frequency);
	//add to firebase
	var newTrain = {
		name: name,
		dest: dest,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	};
	database.ref().push(newTrain);




}); //on click add train
 





}); //ready
