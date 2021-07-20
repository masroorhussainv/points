document.addEventListener("turbolinks:load", function() {
  $("input[name='stories[]']").click(() => {
    const selected = $("input[name='stories[]']:checked");

    if (selected.length > 0) {
      const ending = selected.length == 1 ? "y" : "ies";
      $("#bulk_delete")
        .text(`Bulk Delete (${selected.length} Stor${ending})`)
        .attr("aria-disabled", "false")
        .prop("disabled", false);
    } else {
      $("#bulk_delete")
        .text("Bulk Delete")
        .attr("aria-disabled", "true")
        .prop("disabled", true)
    }
  })

  $("#bulk_delete").click((event) => {
    let stories_ids = []
    $("input[name='stories[]']:checked").each((_, checkbox) => {
      stories_ids.push($(checkbox).val())
    })

    $(event.target)
      .text("Bulk Delete")
      .attr("aria-disabled", "true")
      .prop("disabled", true)

    let token = $("meta[name='csrf-token']").attr("content")
    $.ajaxSetup({
      beforeSend: function (xhr) {
        xhr.setRequestHeader("X-CSRF-Token", token);
      }
    });

    $.ajax({
      url: "/stories/bulk_destroy",
      data: {ids: stories_ids},
      type: "POST",
      success: () => {
        $(stories_ids).each((_, id) => {
          console.log(id)
          $("#story_" + id).remove();
        })
      },
      error: (result) => {
        console.log("There was an error destroying the stories")
      }
    })
  })

  $(document).on("click", ".delete", (e) => {
    let element = $(e.target)

    if (!confirm("Are you sure?")) { return }

    let token = $("meta[name='csrf-token']").attr("content")
    $.ajaxSetup({
      beforeSend: function (xhr) {
        xhr.setRequestHeader("X-CSRF-Token", token);
      }
    });

    $.ajax({
      url: element.data("delete-url"),
      type: "DELETE",
      error: (result) => {
        console.log("There was an error destroying the story")
      }
    })
  })
})
