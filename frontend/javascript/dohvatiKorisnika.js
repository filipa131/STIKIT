$(document).ready(function() 
{
    let currentPath = window.location.pathname;
    let apiUrl = currentPath + "/../backend/api/dohvatiKorisnika.php";

    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function(response) 
      {
        // Postavi ime korisnika u gumb
        $('#userBtn').text('@' + response.korisnik);
      }
    });
  });