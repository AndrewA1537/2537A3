// function to handle the login button being clicked
function login() {
    // set data = to value of fields typed by user
    let data = {
        username: $("#username").val(),
        password: $("#password").val()
    };

    // fetch promise to response objects
    fetch('/login', {
        // method type
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
        // .then to handle asynchronous call
    }).then(response => response.json()).then((data) => {
        // if successful auth
        if (data.success) {
            // redirect to user profile,
            window.location.href = '/profile'
        } else {
            // or display an error message
            $("#error-text").text("Invalid login: Try again")
        };
    });
};