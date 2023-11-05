$(document).ready(function () 
{
  $("#login-form").submit(function (event) 
  {
    event.preventDefault();

    let formData = {
      username: $("input[name=username]").val(),
      password: $("input[name=password]").val(),
    };

    let currentPath = window.location.pathname;
    let apiUrl = currentPath + "/../backend/api/login.php";

    $.ajax({
      url: apiUrl,
      type: "POST",
      dataType: "json",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) 
      {
        if (response.success) 
        {
          window.location.href = "index.php?rt=";
        } 
        else 
        {
          console.log("Login failed: " + response.message);
          $(".error-message").text(response.message);
        }
      },
      error: function () 
      {
        console.log("Error occurred while logging in");
        $(".error-message").text("Error occurred. Please try again.");
      },
    });
  });
});
