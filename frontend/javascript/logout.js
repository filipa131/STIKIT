$(document).ready(function () 
{
  let currentPath = window.location.pathname;
  let apiUrl = currentPath + "/../backend/api/logout.php";
  $.ajax({
    url: apiUrl,
    type: "POST",
    dataType: "json",
    success: function (response) 
    {
      if (response.success) 
      {
        window.location.href = "index.php?rt=login";
      } 
      else 
      {
        window.location.href = "index.php?rt=";
      }
    },
    error: function () 
    {
      console.log("Greska u dohvacanju podataka");
    },
  });
});
