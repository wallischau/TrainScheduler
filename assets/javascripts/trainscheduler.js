/* Title: Train scheduler                                   */
/* Author: Wallis Chau                                      */
/* Description: Display train schedules and option          */
/*              to add new train schedule                   */
/* Date: 9/2/17                                             */

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

/* calcNextArrival                                 */
/* Description: calculate next arrival time        */
/* parameter: time - time of first train           */
/*            freq - how often the train comes     */
/* return:    moment object of next arrival        */
function calcNextArrival(time, freq) {
	//get time info
	var mTime = moment(time,'H:mm');	
	console.log(moment(mTime).format('h:mm'));
	//check if it has past, if yes, set new time
	while (mTime.diff(moment(), 'm') <= 0) {
		mTime.add(freq, 'm');
	}
	return mTime;
}

/* calMinuteAway                                       */
/* Description: calculate minutes before train arrives */
/* return: minutes                                     */
function calcMinuteAway(mArrival) {
	return(moment(mArrival).diff(moment(), 'm'));	
}


$(document).ready(function() {

//retrieve from firebase
database.ref().on("child_added", function(snapshot, prevChildKey) {
	var name = snapshot.val().name;
	var dest = snapshot.val().dest;
	var firstTrainTime = snapshot.val().firstTrainTime;
	var frequency = snapshot.val().frequency;
	// console.log(firstTrainTime);
	//display table of schedule from database
	updateTable(name, dest, firstTrainTime, frequency );

});

/* undateTable                                          */
/* Description: display schedule in table row           */
/* parameter: name, dest, firstTime, freq  - details to */
/*            display                                   */
function updateTable(name, dest, firstTime, freq ) {
	var entry;
	//calculate next arrival
	var mNextArrival = calcNextArrival(firstTime, freq);
	//calculate minute away
	var minuteAway = calcMinuteAway(mNextArrival);
	var arrivalString = moment(mNextArrival).format("h:mmA");
	// console.log(arrivalString);
	entry = `<tr><td>${name}</td><td>${dest}</td><td class="td-freq">${freq}</td><td class="td-arrival">${arrivalString}</td><td class="td-away">${minuteAway}</td></tr>`;
	$('#table-schedule > tbody').append(entry);

}

//add train button click
$('#add-train-btn').on('click', function(event) {
	event.preventDefault();
	//take user input
	var name;
	var dest;
	var firstTrainTime;
	var frequency;
	var entry;

	name = $('#train-name-input').val().trim();
	dest = $('#train-dest-input').val().trim();
	firstTrainTime = $('#train-time-input').val().trim();
	frequency = parseInt($('#train-freq-input').val().trim());
	//add to firebase
	var newTrain = {
		name: name,
		dest: dest,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	};
	database.ref().push(newTrain);
}); //on click add train

/* undateRowTable                                    */
/* Description: update arrival time and minutes away */
function updateRowTable() {
	var rowCount = $('#table-schedule >tbody >tr').length;
	$('#table-schedule >tbody >tr').each(function() {
		//update minute away every minute
		var away = $(this).find(".td-away").html();
		//check if <0
		if (away > 0) {
			$(this).find(".td-away").html(--away);
		}
		else {
			//reset minute away
			var freq = $(this).find(".td-freq").html();
			$(this).find(".td-away").html(freq);
			//get new arrival time
			var arrival = $(this).find(".td-arrival").html();
			var mNextArrival = calcNextArrival(arrival, freq);
			$(this).find(".td-arrival").html(moment(mNextArrival).format("h:mmA"));
		}
	}); //tr .each
}

//update table periodically
var interval = setInterval(updateRowTable, 60000);

}); //ready
