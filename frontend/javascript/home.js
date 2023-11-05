$(document).ready(function () 
{
  let userId;

  dohvatiIDKorisnika(function (korisnik) 
  {
    userId = korisnik;

    $(document).on('click','#srce',function(event)
    {
      var gumb = event.target;
      console.log("button " + gumb.name + "\n");

      if (gumb.className === "spremljenoSrce")
      {
        // oduzmi jedan lajk
        gumb.classList.remove("spremljenoSrce");
        gumb.classList.add("nespremljenoSrce");
        oduzmiSrce(gumb.name);
      }
      else if (gumb.className === "nespremljenoSrce")
      {
        gumb.classList.remove("nespremljenoSrce");
        gumb.classList.add("spremljenoSrce");
        dodajSrce(gumb.name);
      }
    });
  
    let currentPath = window.location.pathname;
    let apiUrl = currentPath + "/../backend/api/home.php";
    $.ajax({
      url: apiUrl,
      type: "GET",
      dataType: "json",
      success: function ( response ) 
      {
        if ( response.success ) 
        {
          let stickers = response.stickers;
          if ( stickers.length === 0 )
          {
            let p = document.getElementById( "nemaStickera" );
            p.textContent = "Još nemate spremljenih stickera";
          }

          stickers.sort( function( a, b ) 
          {
            if ( b.saves !== a.saves ) 
            {
              return b.saves - a.saves; 
            } 
            else 
            {
              return new Date( b.date ) - new Date( a.date );
            }
          });

          stickers.forEach( function ( sticker ) 
          {
            let blobString = sticker.sticker;

            let img = $( "<img>" );
            img.attr( "src", "data:image/png;base64," + atob( blobString ) );

            let divSticker = $( '<div class="div-sticker">' );
            divSticker.append( img );
            
            if ( userId === sticker.user_id )
            {
              divSticker.append( '<p class="stickerTekst">Autor:&nbsp;@' + sticker.author + '</p>' );
            }
            else
            {
              divSticker.append( '<p class="stickerTekst">Autor:&nbsp;@' + sticker.author + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="submit" class="spremljenoSrce" id="srce" name="' + sticker.sticker_id + '">&#10084</button></p>' );
            }
            divSticker.append( '<p class="stickerTekst">Vrijeme:&nbsp;' + sticker.date + '</p>' );

            let container = $( "#stickers-container" );
            container.append( divSticker );
          });
        }
        else 
        {
          window.location.href = "index.php?rt=login";
        }
      },
      error: function () 
      {
        console.log( "Greska u dohvacanju podataka" );
      },
    });
  });
});

function dodajSrce( name )
{
  let currentPath = window.location.pathname;
  let apiUrl = currentPath + "/../backend/api/addHearts.php";

  $.ajax({
    url: apiUrl,
    type: "POST",
    data: {poslano : name},
    success: function( response ) 
    {
        console.log( "Data stored in session successfully: dodano srce" );
        console.log( response );
    },
    error: function() 
    {
        console.log( "Error storing data in session" );
    }
  });
}

function oduzmiSrce( name )
{
  let currentPath = window.location.pathname;
  let apiUrl = currentPath + "/../backend/api/removeHearts.php";

  $.ajax({
    url: apiUrl,
    type: "POST",
    data: { poslano: name },
    success: function( response ) 
    {
        console.log( "Data stored in session successfully: oduzeto srce" );
        console.log( response );
    },
    error: function() 
    {
        console.log( "Error storing data in session" );
    }
  });
}

function dohvatiIDKorisnika( callback )
{
  let currentPath = window.location.pathname;
  let apiUrl2 = currentPath + "/../backend/api/korisnik.php";
  let korisnik;

  $.ajax({
    url: apiUrl2,
    type: "GET",
    dataType: "json",
    success: function ( response ) 
    {
      if ( response.success ) 
      {
        korisnik = response.korisnik;
        callback( korisnik );
      }
      else 
      {
        window.location.href = "index.php?rt=login";
      }
    },
    error: function () 
    {
      console.log( "Greska u dohvacanju podataka" );
      callback( null );
    }
  });
}