Foundation.Interchange.SPECIAL_QUERIES['retina_small'] = 'only screen and (min-width: 1px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min-resolution: 192dpi), only screen and (min-width: 1px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_medium'] = 'only screen and (min-width: 641px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 641px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 641px) and (min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min-resolution: 192dpi), only screen and (min-width: 641px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_large'] = 'only screen and (min-width: 1025px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1025px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min-resolution: 192dpi), only screen and (min-width: 1025px) and (min-resolution: 2dppx)';


var projectsArray = [];
var slidesArray;
var isFlickity = false;
var slideImage0;
var slideImage1;
var slideImage2;
var currentMediaSize;
var previousMediaSize;


/*update images on detail view carousel*/

function changeCarouselImage(image) {
    
    console.log('changeCarouselImage')

    var $image;
    var $size = Foundation.MediaQuery.current;
    var $retina = false;

    if (window.devicePixelRatio >= 2) {
        $retina = true;
    }

    if ($retina) {

        switch ($size) {
        case 'small':
            $image = 'images/slides/' + image + '_LG_x2.jpg';
            viewState = 'sm_ret';
            break;
        case 'medium':
            $image = 'images/slides/' + image + '_LG_x2.jpg';
            viewState = 'md_ret';
            break;
        case 'large':
        case 'xlarge':
        case 'xxlarge':
            $image = 'images/slides/' + image + '_LG_x2.jpg';
            viewState = 'lg_ret';
            break;
        }

    } else {

        switch ($size) {
        case 'small':
            $image = 'images/slides/' + image + '_LG.jpg';
            viewState = 'sm';
            break;
        case 'medium':
            $image = 'images/slides/' + image + '_LG.jpg';
            viewState = 'md';
            break;
        case 'large':
        case 'xlarge':
        case 'xxlarge':
            $image = 'images/slides/' + image + '_LG.jpg';
            viewState = 'lg';
            break;
        }
    }

    var $cellElems = $("<div class='carousel-cell'><img src='" + $image + "' /></div>");
    $('.overlay-carousel').flickity( 'append', $cellElems );

};


/*overlay js*/

//(function () {
    var container = document.querySelector('div.container'),
        triggerBttn = document.getElementById('trigger-overlay'),
        overlay = document.querySelector('div.overlay'),
        closeBttn = overlay.querySelector('button.overlay-close');
    transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        support = {
            transitions: Modernizr.csstransitions
        };

    function toggleOverlay(event, button) {

        if (classie.has(overlay, 'open')) {
            
            if (isFlickity) {
                console.log('carousel kill');
                $('.overlay-carousel').flickity('destroy');
                $('.overlay-carousel').html("");
                isFlickity = false;
            }
            
            
            classie.remove(overlay, 'open');
            classie.remove(container, 'overlay-open');
            classie.add(overlay, 'close');
            var onEndTransitionFn = function (ev) {
                if (support.transitions) {
                    if (ev.propertyName !== 'visibility') return;
                    this.removeEventListener(transEndEventName, onEndTransitionFn);
                }
                classie.remove(overlay, 'close');
            };
            if (support.transitions) {
                overlay.addEventListener(transEndEventName, onEndTransitionFn);
            } else {
                onEndTransitionFn();
            }
        } else if (!classie.has(overlay, 'close')) {
            
            console.log(event.data.msg)
            
            if (event.data.msg === 'detailsBtn'){

                $('#detailView').show();
                $('#whatIsThis').hide();

                //add title
                $(".project-details > .copy > .titleText").html("");
                $(".project-details > .copy > .titleText").append(projectsArray[event.target.id].title);
                //add header copy
                $(".project-details > .copy > .header").html("");
                $(".project-details > .copy > .header").append(
                    '<div><span>client: </span>' + projectsArray[event.target.id].client + '</div><div><span>agency: </span>' + projectsArray[event.target.id].agency + '</div><div><span>platform: </span>' + projectsArray[event.target.id].platform + '</div>'
                );
                //add description
                $(".project-details > .copy > .description").html("");
                $(".project-details > .copy > .description").append(projectsArray[event.target.id].description);
                //add url
                $(".project-details > .copy > #buttons > .view_site_btn").html("");
                $(".project-details > .copy > #buttons > .view_site_btn").append(
                    "<a href=" + projectsArray[event.target.id].url + " target='_blank'><i class='fa fa-eye' aria-hidden='true'></i>view website</a>"
                );
                

                    console.log('carousel init');
                    $('.overlay-carousel').flickity({
                        // options
                        cellAlign: 'left',
                        contain: true,
                        wrapAround: true,
                        lazyLoad: 2,
                        imagesLoaded: true
                    });
                
                
                    isFlickity = true;
                
                    slidesArray = [];
                
                slidesArray.push(projectsArray[event.target.id].slides);
                
                for (index = 0; index < slidesArray[0].length; ++index) {
                    changeCarouselImage(slidesArray[0][index]);
                }

                setTimeout(resizeCarousel, 50);
                
            }else{
                
                $('#detailView').hide();
                $('#whatIsThis').show();
            }
            
            classie.add(overlay, 'open');
            classie.add(container, 'overlay-open');
             
        }
         
    }

    
//})();



/*Window resize listener and image swap
for view details carousel */

function resizeCarousel() {
    
    console.log('resize carousel');
    
    var mediaSize = Foundation.MediaQuery.current;

    switch (mediaSize) {
        case 'small':
            currentMediaSize = 'small';
            break;
        case 'medium':
            currentMediaSize = 'medium';
            break;
        case 'large':
        case 'xlarge':
        case 'xxlarge':
            currentMediaSize = 'large';
            break;
    }
    
    if(isFlickity && previousMediaSize !== currentMediaSize) {
        
        console.log('resize triggered');
        $('.overlay-carousel').flickity('destroy');
        $('.overlay-carousel').html("");


        //SKIPS 2 SLIDES FOR LARGE FORMAT
        if (Foundation.MediaQuery.atLeast('large')) {
            
            //no autoplay
            $('.overlay-carousel').flickity({
                // options
                cellAlign: 'left',
                contain: true,
                wrapAround: true,
                lazyLoad: 2,
                imagesLoaded: true
            });
            
            $('.overlay-carousel .flickity-prev-next-button.next').click(function(){
                var flkty = $('.overlay-carousel').data('flickity');
                var defaultSelect = flkty.selectedIndex;
                var newSelect = defaultSelect + 1;
                $('.overlay-carousel').flickity( 'select', newSelect );
            });
            $('.overlay-carousel .flickity-prev-next-button.previous').click(function(){
                var flkty = $('.overlay-carousel').data('flickity');
                var defaultSelect = flkty.selectedIndex;
                var newSelect = defaultSelect - 1;
                $('.overlay-carousel').flickity( 'select', newSelect );
            });

        }else{
            
            $('.overlay-carousel').flickity({
                // options
                cellAlign: 'left',
                contain: true,
                wrapAround: true,
                lazyLoad: 2,
                autoPlay: true,
                imagesLoaded: true
            });
        }

        
                for (index = 0; index < slidesArray[0].length; ++index) {
                    changeCarouselImage(slidesArray[0][index]);
                }
            
       // }
        
        
    }

    previousMediaSize = currentMediaSize;
}

$( window ).resize(function() {

    if (isFlickity) {
        resizeCarousel();
    }
});

/*after template is executed
  add images
  */

function addThumbImages() {

    var $retina = false;

    if (window.devicePixelRatio >= 2) {
        $retina = true;
    }
    
    //console.log('isRetina: ' + $retina);
    
    var _projects = document.getElementById('projects');
    var _projectsList = _projects.getElementsByTagName("li");
    var _img = _projects.getElementsByTagName("img");
    
    for (var i=0;i<=_img.length-1;i++)
    {
        var _img_div = $(_img[i]);
        var _imgs = projectsArray[i].cardImage

        if ($retina) {
            _img_div.attr('src', 'images/thumbs/' + _imgs + '_x2.jpg');
        }else{
            _img_div.attr('src', 'images/thumbs/' + _imgs + '.jpg');
        }
    }
    
    
};


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
