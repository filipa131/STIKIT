$(document).ready(function () 
{
  $("#register-form").submit(function (event) 
  {
    event.preventDefault();

    let formData = {
      username: $("input[name=username]").val(),
      password: $("input[name=password]").val(),
      email: $("input[name=email]").val(),
    };

    let apiUrl = "../backend/api/register.php";

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
          window.location.href = "../index.php?rt=login";
          console.log("Poslan reg mail");
        } 
        else 
        {
          console.log("Registration failed: " + response.message);
          $(".error-message").text(response.message);
        }
      },
      error: function () 
      {
        console.log("Error occurred while trying to register.");
        $(".error-message").text("Error occurred. Please try again.");
      },
    });
  });
});
