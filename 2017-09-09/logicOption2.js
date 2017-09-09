// Initialize Firebase
var config = {
    apiKey: "AIzaSyAKIAoJnBg9-poZtnFNIxaTxb_u2DUJIxw",
    authDomain: "pedregaldecauca.firebaseapp.com",
    databaseURL: "https://pedregaldecauca.firebaseio.com",
    projectId: "pedregaldecauca",
    storageBucket: "pedregaldecauca.appspot.com",
    messagingSenderId: "559875883079"
};
firebase.initializeApp(config);

var database = firebase.database();
var rootPath = "codersbay";

// Initial Values
var initialBid = 0.0;
var initialBidder = "No one :-(";
var highPrice = initialBid;
var highBidder = initialBidder;

function updateUI() {
    $("#highest-price").text("$" + highPrice.toFixed(2));
    $("#highest-bidder").text(highBidder);
}

// When remote data changes, update local data and update UI
database.ref(rootPath).on("value", function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    if (data) {
        // Update local store
        highPrice = parseFloat(data.highPrice);
        highBidder = data.highBidder;
    }
    updateUI();
}, function(error) {
    console.log(error);
});

// Handle new bids
$("#submit-bid").click(function(event) {
    event.preventDefault();

    var bidName = $("#bidder-name").val();
    var bidValue = parseFloat($("#bidder-price").val()).toFixed(2);
    console.log(bidName + " bid $" + bidValue);

    if (bidValue > highPrice) {
        alert("You have made the highest bid!");
        database.ref(rootPath + "/highBidder").set(bidName);
        database.ref(rootPath + "/highPrice").set(bidValue);
        highBidder = bidName;
        highPrice = bidValue;
        updateUI();
    } else {
        alert("Your bid of $" + bidValue + " was not higher than the highest bid of $" + highPrice);
    }
})
