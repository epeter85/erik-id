Foundation.Interchange.SPECIAL_QUERIES['retina_small'] = 'only screen and (min-width: 1px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min-resolution: 192dpi), only screen and (min-width: 1px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_medium'] = 'only screen and (min-width: 641px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 641px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 641px) and (min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min-resolution: 192dpi), only screen and (min-width: 641px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_large'] = 'only screen and (min-width: 1025px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1025px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min-resolution: 192dpi), only screen and (min-width: 1025px) and (min-resolution: 2dppx)';



/*button listeners*/
var targetAnchor;

function scrollToAnchor() {
    console.log('scrollToAnchor')
    
    var $target = $(targetAnchor);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = targetAnchor;
	    });
    
}

function cardDetailsHandler(event) {
    
    var details = $(this).find('.cardDetails');
    
     $('#projects .thumb-container .cardDetails').fadeTo( 50 , 0);
    
    if(details.css('opacity') == 0) {
        details.fadeTo( 50 , 1);
        $(this).find('.cardDetails .btn').click({msg: 'detailsBtn'}, toggleOverlay);
    }else{
        details.fadeTo( 50 , 0);
    }

}



function menuButtonHandler(event) {
    
    event.preventDefault();
    
    targetAnchor = this.hash;
    console.log(targetAnchor);
    
    if( $(event.target).hasClass('sideMenu')) {
        
        $('#offCanvas').foundation('close');
        setTimeout(scrollToAnchor, 300);
    
    }else{
       scrollToAnchor();
   }

}


