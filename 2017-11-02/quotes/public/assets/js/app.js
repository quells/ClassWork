$(function() {
    $(document).on("click", ".edit-button", function() {
        var div = $(this).parent()
        var id = div.attr("id").split("-")[1]
        var author = div.find("p").text().slice(1)
        var quote = div.find("blockquote").text()

        div.empty()
        var form = $("<form>")

        var authorRow = $(`<div class="form-group">`).appendTo(form)
        $(`<label for="authorName-${id}">Author Name</label>`).appendTo(authorRow)
        $(`<input type="text" name="author" id="authorName-${id}" class="form-control" placeholder="Author Name">`).val(author).appendTo(authorRow)

        var quoteRow = $(`<div class="form-group">`).appendTo(form)
        $(`<label for="quoteText-${id}">Quote Text</label>`).appendTo(quoteRow)
        $(`<textarea name="quote" id="quoteText-${id}" class="form-control" placeholder="Quote Text">`).val(quote).appendTo(quoteRow)

        var buttonRow = $(`<div class="form-group">`).appendTo(form)
        var submit = $("<button type='submit' class='btn btn-warning'>").text("Done").data("db_id", id).appendTo(buttonRow)
        var deleteButton = $("<button type='button' class='btn btn-danger'>").text("Delete").data("db_id", id).appendTo(buttonRow)

        submit.click(function(e) {
            e.preventDefault()

            var id = parseInt($(this).data("db_id"))
            var div = $("#quote-" + id)
            var author = div.find("form div [name='author']").val()
            var quote = div.find("form div [name='quote']").val()

            $.ajax({
                method: "POST",
                url: "/api/update",
                data: {
                    id: id,
                    author: author,
                    quote: quote
                },
                success: function(response) {
                    if (!response.error) {
                        var div = $("#quote-" + response.id)
                        div.empty()

                        $("<blockquote>").text(response.quote).appendTo(div)
                        $("<p class='text-right'>").html("&mdash;" + response.author).appendTo(div)
                        $("<a class='edit-button'>").text("Edit").attr("href", "#quote-" + response.id).appendTo(div)
                    } else {
                        alert("Something went wrong")
                    }
                }
            })
        })

        deleteButton.click(function() {
            var id = parseInt($(this).data("db_id"))

            $.ajax({
                method: "DELETE",
                url: "/api/delete",
                data: {
                    id: id
                },
                success: function(response) {
                    if (!response.error) {
                        var div = $("#quote-" + response.id)
                        div.remove()
                    } else {
                        alert("Something went wrong")
                    }
                }
            })
        })

        div.append(form)
    })

    $("#addQuote").find("button").click(function(e) {
        e.preventDefault()

        var author = $("#authorName-new").val()
        var quote = $("#quoteText-new").val()

        $.ajax({
            method: "PUT",
            url: "/api/add",
            data: {
                author: author,
                quote: quote
            },
            success: function(response) {
                if (!response.error) {
                    var div = $(`<div class="quote" id="quote-${response.id}">`)
                    $(`<blockquote>${response.quote}</blockquote>`).appendTo(div)
                    $(`<p class="text-right">&mdash;${response.author}</p>`).appendTo(div)
                    $(`<a href="#quote-${response.id}" class="edit-button">Edit</a>`).appendTo(div)
                    div.appendTo($("#quotes"))

                    $("#authorName-new").val("")
                    $("#quoteText-new").val("")
                } else {
                    alert("Something went wrong")
                }
            }
        })
    })
})
