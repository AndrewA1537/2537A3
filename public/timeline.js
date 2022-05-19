function loadEvents() {
    $.ajax({
        url: `http://localhost:5000/timeline/getAllEvents`,
        type: "GET",
        success: (x) => {
            console.log(x);

            for (i = 0; i < x.length; i++) {
                $("main").append(
                    `
                    <p>
                        Event Text - ${x[i].text}
                    <br>
                        Event Time - ${x[i].time}
                    <br>
                        Event Hits - ${x[i].hits}
                    <br>
                        <button class="likeButton" id="${x[i]["_id"]}">like</button>
                    </p>
                    `
                );
            };
        }
    });
};

function incrementHits() {
    x = this.id;
    $.ajax({
        url: `http://localhost:5000/timeline/update/${x}`,
        type: "GET",
        sucess: (e) => (console.log(e))
    });
    // reload the main div
    // $("main").load("timeline.html");
};

function setup() {
    loadEvents();

    $("body").on("click", ".likeButton", incrementHits);
}


$(document).ready(setup);