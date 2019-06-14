
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDV2pPyBVfRmLsbEFfBv3xuRUZOgF_F9oM",
    authDomain: "train-b8133.firebaseapp.com",
    databaseURL: "https://train-b8133.firebaseio.com",
    projectId: "train-b8133",
    storageBucket: "train-b8133.appspot.com",
    messagingSenderId: "823600195197",
    appId: "1:823600195197:web:aa0c64ca60a11194"
  };
  // Initialize Firebase

  firebase.initializeApp(firebaseConfig);

  // Variables
  // ================================================================================

  // Get a reference to the database service
  var database = firebase.database();

  // Functions
  // ================================================================================

  // On Click

    $('#add-train-button').on('click', function(e) {
      e.preventDefault();
      let trainName = $("#train-name-input").val();
      let destinationName = $("#destination-input").val();
      let trainTime = $("#trainTime-input").val();
      let frequency = $("#frequency-input").val();

      // Creates local "temporary" object for holding train data
      var newTrain = {
        name: trainName,
        destination: destinationName,
        start: trainTime,
        rate: frequency
      };
      // Uploads train data to the database
      database.ref().push(newTrain);
      alert("New train added!");
    });


    database.ref().on("child_added", function(childSnapshot) {
      alert("Receiving Data");
      // Store everything into a variable.
      var trainName = childSnapshot.val().name;
      var trainDestination = childSnapshot.val().destination;
      var trainStart = childSnapshot.val().start;
      var trainRate = childSnapshot.val().rate;

      // ======================= Calculations Start Here ==================

      // Frequency
      var tFrequency = trainRate;
      // Start Time ex. 3:30 AM
      var firstTime = trainStart;
      var firstTimePretty = moment.unix(trainStart).format("HH:mm");
      // Prettify the train start
      var trainStartPretty = moment.unix(trainStart).format("HH:mm");
      // Current Time
      var currentTime = moment();
      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "day");
      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;

      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;

      // Next Train
      var nextTrain = currentTime.add(tMinutesTillTrain, 'minutes');
      var nextArrival = moment(nextTrain).format("HH:mm");

      // Create the new row
      var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(nextArrival),
        $("<td>").text(tMinutesTillTrain)
      );

      // Append the new row to the table
      $("#train-table > tbody").append(newRow);
    });
