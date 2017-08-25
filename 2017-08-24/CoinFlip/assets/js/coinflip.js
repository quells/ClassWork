
    // Coin Flip JavaScript
    // These variables are declared for us.
    var headsCount = 0;
    var tailsCount = 0;
    var wins = 0;
    var losses = 0;

    function flipThatCoin(result) {

      //  STEP ONE:

        //  Declare and initialize a variable named randomNumber to either 0 or 1. Make it random.
        var randomNumber = Math.floor(Math.random()*2);
        console.log(randomNumber);

      //  STEP TWO:

        //  If randomNumber is equal to zero then:
        if (randomNumber == 0) {
            $("#coin-image").html($("<img>").attr("src", "http://random-ize.com/coin-flip/us-quarter/us-quarter-front.jpg"))
        } else {
            $("#coin-image").html($("<img>").attr("src", "http://random-ize.com/coin-flip/us-quarter/us-quarter-back.jpg"))
        }

          //  Find the div with an id of coin-image.
          //  Replace its html with an img tag containing this image:
          //  http://random-ize.com/coin-flip/us-quarter/us-quarter-front.jpg

        // Else:

          //  Find the div with an id of coin-image.
          //  Replace its html with an img tag containing this image:
          //  http://random-ize.com/coin-flip/us-quarter/us-quarter-back.jpg

      //  STEP THREE:

        // If result is equal to randomNumber, do the following:
        $("#win-lose").empty();
        var winLoseText = "";
        if (result == randomNumber) {
            wins++;
            winLoseText = "Winner!";
            $("#wins").text(wins);
        } else {
            losses++;
            winLoseText = "Loser!";
            $("#losses").text(losses);
        }
        $("<h2>").text(winLoseText).appendTo($("#win-lose"));

          //  Increment wins by one.
          //  Find the div with an id of win-lose. Update it with an h2 of "Winner!"
          //  Find the div with an id of wins. Update it with the value of the wins variable.

        // Else:

          //  Increment losses by one.
          //  Find the div with an id of win-lose. Update it with an h2 of "Loser!"
          //  Find the div with an id of losses. Update it with the value of the losses variable.

    }
