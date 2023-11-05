$( document ).ready( function () 
{
  let currentPath = window.location.pathname;
  let apiUrl = currentPath + "/../backend/api/etUser.php";

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
          p.textContent = "Još nemate stickera";
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
          divSticker.append(img);
          divSticker.append( '<p class="stickerTekst">Vrijeme:&nbsp;' + sticker.date + '</p>' );
          divSticker.append( '<p class="stickerTekst">&#10084&nbsp;' + sticker.saves + '</p>' );
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
  