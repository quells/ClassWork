// *********************************************************************************
// TO DO:
// 1. Display all chirps on page load
// 2. Add new chirp to database and prepend to existing chirps
// *********************************************************************************

// When the page loads, grab and display all of our chirps
$(function() {
    $.ajax({
        method: "GET",
        url: "/api/chirps/all",
        success: function(response) {
            if (response.error) {
                console.trace()
                alert("Something went wrong")
                return
            }
            var chirps = $("#chirps")
            response.chirps.forEach(function(c) {
                chirps.append(renderChirp(c))
            })
        }
    })
})

function renderChirp(c) {
    var div = $(`<div class="chirp" id="chirp-${c.id}">`)
    $("<p class='chirp-text'>").text(c.text).appendTo(div)
    $("<p>").text(c.user_real).attr("alt", c.user_handle).appendTo(div)
    $("<p>").text(moment(c.created_at).fromNow()).appendTo(div)
    return div
}

// When user chirps
$("#submitChirp").click(function() {
    var username = $("#username").val()
    var isValid = /^[a-zA-Z0-9_]+$/.test(username)
    if (!isValid) {
        console.trace()
        alert("invalid username")
        return
    }
    var chirpText = $("#chirp").val()
    $.ajax({
        method: "GET",
        url: "/api/users/id_for/" + username,
        success: function(response) {
            if (response.error) {
                if (response.errorMsg === "user does not exist") {
                    $.ajax({
                        method: "POST",
                        url: "/api/users/new",
                        data: {
                            user_handle: username,
                            real_name: $("#realname").val()
                        },
                        success: function(response) {
                            sendChirp(response.id, chirpText)
                        }
                    })
                } else {
                    console.trace()
                    alert("something went wrong")
                }
            } else {
                sendChirp(response.id, chirpText)
            }
        }
    })
})

function sendChirp(user_id, text) {
    $.ajax({
        method: "POST",
        url: "/api/chirps/new",
        data: {
            user_id: user_id,
            chirp: text
        },
        success: function(response) {
            if (response.error) {
                console.trace()
                alert("something went wrong")
                return
            }
            var chirp_id = response.chirp_id
            $.ajax({
                method: "GET",
                url: "/api/chirps/" + chirp_id,
                success: function(response) {
                    if (response.error) {
                        console.trace()
                        alert("something went wrong")
                        return
                    }
                    $("#chirps").prepend(renderChirp(response.chirp))
                }
            })
        }
    })
}
