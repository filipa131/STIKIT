$( document ).ready( function () 
{
  let currentPath = window.location.pathname;
  let apiUrl1 = currentPath + "/../backend/api/home.php";
  let stickersId = [];
  let userId;

  dohvatiIDKorisnika( function ( korisnik ) 
  {
    userId = korisnik;

    $.ajax({
      url: apiUrl1,
      type: "GET",
      dataType: "json",
      success: function ( response ) 
      {
        if ( response.success ) 
        {
            let stickers1 = response.stickers;
            stickers1.forEach( element => {
              stickersId.push( element.sticker_id );
            });
        }
        else 
        {
          window.location.href = "index.php?rt=login";
        }
      },
      error: function () 
      {
        console.log("Greska u dohvacanju podataka");
      }
    });

    $( document ).on( 'click','#srce',function( event )
    {
      let gumb = event.target;

      if ( gumb.className === "nespremljenoSrce" )
      {
        // dodaj jedan lajk
        gumb.classList.remove( "nespremljenoSrce" );
        gumb.classList.add( "spremljenoSrce" );
        dodajSrce( gumb.name );
      }
      else if ( gumb.className === "spremljenoSrce" )
      {
        // oduzmi jedan lajk
        gumb.classList.remove( "spremljenoSrce" );
        gumb.classList.add( "nespremljenoSrce" );
        oduzmiSrce( gumb.name );
      }
    });

    let apiUrl = currentPath + "/../backend/api/explore.php";

    $( "#searchBtn" ).click( function() 
    {
      var inputValue = $( "#searchInput" ).val();
      var words = inputValue.split(" "); 
      var filter = words.filter( function( word ) {
          return word.trim() !== "";
      });

      $.ajax({
        url: apiUrl,
        type: "POST",
        data: { filter: filter },
        success: function() 
        {
            console.log( "Data stored in session successfully" );
            prikaziStickere( stickersId, userId );
        },
        error: function() 
        {
            console.log( "Error storing data in session" );
        }
      });
    });

    prikaziStickere( stickersId, userId );
  });
});

function prikaziStickere( stickersId, userId )
{
  let currentPath = window.location.pathname;
  let apiUrl = currentPath + "/../backend/api/explore.php";

  $.ajax({
    url: apiUrl,
    type: "GET",
    dataType: "json",
    success: function ( response ) 
    {
      if ( response.success ) 
      {
        let stickers = response.stickers;

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

        let container = $( "#stickers-container" );
        container.empty();
        stickers.forEach(function ( sticker ) 
        {
          let blobString = sticker.sticker;

          console.log( blobString );
    
          let img = $( "<img>" );
          img.attr( "src", "data:image/png;base64," + atob(blobString) );
    
          let divSticker = $( '<div class="div-sticker">' );
          divSticker.append( img );
          
          if ( userId === sticker.user_id )
          {
            divSticker.append( '<p class="stickerTekst">Autor:&nbsp;@' + sticker.author + '</p>' );
          }
          else
          {
            if ( stickersId.includes( sticker.sticker_id ) )
            {
              divSticker.append( '<p class="stickerTekst">Autor:&nbsp;@' + sticker.author + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="submit" class="spremljenoSrce" id="srce" name="' + sticker.sticker_id + '">&#10084</button></p>' );
            }
            else
            {
              divSticker.append('<p class="stickerTekst">Autor:&nbsp;@' + sticker.author + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="submit" class="nespremljenoSrce" id="srce" name="' + sticker.sticker_id + '">&#10084</button></p>' );
            }
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
    }
  });
}

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
