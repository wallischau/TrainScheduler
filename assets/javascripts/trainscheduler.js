
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
	var mTime = moment(time,'H:mm');	
	console.log(moment(mTime).format('h:mm'));
	//check if it is past
	while (mTime.diff(moment(), 'm') <= 0) {
		mTime.add(freq, 'm');
	}
	return mTime;
}

function calcMinuteAway(mArrival) {
	return(moment(mArrival).diff(moment(), 'm') + 1);	
}

$(document).ready(function() {

//retrieve from firebase
database.ref().on("child_added", function(snapshot, prevChildKey) {
	var name = snapshot.val().name;
	var dest = snapshot.val().dest;
	var firstTrainTime = snapshot.val().firstTrainTime;
	var frequency = snapshot.val().frequency;
	//calculate next arrival
	var mNextArrival = calcNextArrival(firstTrainTime, frequency);
	console.log(firstTrainTime);
	//calculate minute away
	var minuteAway = calcMinuteAway(mNextArrival);

	updateTable(name, dest, frequency, mNextArrival, minuteAway);

});

function updateTable(name, dest, freq, marrival, maway) {
	var entry;
	var arrivalString = moment(marrival).format("h:mmA");
	console.log(arrivalString);
	entry = `<tr><td>${name}</td><td>${dest}</td><td>${freq}</td><td>${arrivalString}</td><td>${maway}</td></tr>`;
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
	var mNextArrival;

	name = $('#train-name-input').val().trim();
	dest = $('#train-dest-input').val().trim();
	firstTrainTime = $('#train-time-input').val().trim();
	frequency = parseInt($('#train-freq-input').val().trim());
	console.log(name);
	console.log(dest);
	console.log(firstTrainTime);
	console.log(frequency);
//	//calculate next arrival
//	mNextArrival = calcNextArrival(firstTrainTime, frequency);
	//calculate minute away
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
