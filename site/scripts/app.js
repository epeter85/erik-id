Foundation.Interchange.SPECIAL_QUERIES['retina_small'] = 'only screen and (min-width: 1px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min-resolution: 192dpi), only screen and (min-width: 1px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_medium'] = 'only screen and (min-width: 641px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 641px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 641px) and (min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min-resolution: 192dpi), only screen and (min-width: 641px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_large'] = 'only screen and (min-width: 1025px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1025px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min-resolution: 192dpi), only screen and (min-width: 1025px) and (min-resolution: 2dppx)';


var projectsArray = [];
var isFlickity = false;
var slideImage0;
var slideImage1;
var slideImage2;
var currentMediaSize;
var previousMediaSize;

//update images on detail view carousel
function changeCarouselImage(image) {

    var $image;
    var $size = Foundation.MediaQuery.current;
    var $retina = false;

    if (window.devicePixelRatio >= 2) {
        $retina = true;
    }

    if ($retina) {

        switch ($size) {
        case 'small':
            $image = 'images/' + image + '_SM_x2.jpg';
            viewState = 'sm_ret';
            break;
        case 'medium':
            $image = 'images/' + image + '_MD_x2.jpg';
            viewState = 'md_ret';
            break;
        case 'large':
        case 'xlarge':
        case 'xxlarge':
            $image = 'images/' + image + '_LG_x2.jpg';
            viewState = 'lg_ret';
            break;
        }

    } else {

        switch ($size) {
        case 'small':
            $image = 'images/' + image + '_SM.jpg';
            viewState = 'sm';
            break;
        case 'medium':
            $image = 'images/' + image + '_MD.jpg';
            viewState = 'md';
            break;
        case 'large':
        case 'xlarge':
        case 'xxlarge':
            $image = 'images/' + image + '_LG.jpg';
            viewState = 'lg';
            break;
        }
    }

    var $cellElems = $("<div class='carousel-cell'><img src='" + $image + "' /></div>");
    $('.overlay-carousel').flickity( 'append', $cellElems );
};

///overlay js
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

    function toggleOverlay(event) {
        
        console.log('toggleOverlay')

        if (classie.has(overlay, 'open')) {
            
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

            classie.add(overlay, 'open');
            classie.add(container, 'overlay-open');

            //initiate carousel for first time
            if (!isFlickity) {
                isFlickity = true;
                console.log('carousel init first time');
                $('.overlay-carousel').flickity({
                    // options
                    cellAlign: 'left',
                    contain: true,
                    wrapAround: true,
                    lazyLoad: true,
                    autoPlay: true,
                    imagesLoaded: true
                });
            }else{
                //else remove previous slide images
                console.log('carousel exists');
                $('.overlay-carousel').flickity('destroy');
                $('.overlay-carousel').html("");
                $('.overlay-carousel').flickity({
                    // options
                    cellAlign: 'left',
                    contain: true,
                    wrapAround: true,
                    lazyLoad: true,
                    autoPlay: true,
                    imagesLoaded: true
                });
            }
            
            slideImage0 = projectsArray[event.target.id].image1;
            slideImage1 = projectsArray[event.target.id].image2;
            slideImage2 = projectsArray[event.target.id].image3;
            
            changeCarouselImage(slideImage0);
            changeCarouselImage(slideImage1);
            changeCarouselImage(slideImage2);
             
        }
         
    }

    
//})();


$( window ).resize(function() {

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
        $('.overlay-carousel').flickity({
            // options
            cellAlign: 'left',
            contain: true,
            wrapAround: true,
            lazyLoad: true,
            autoPlay: true,
            imagesLoaded: true
        });
        
        console.log(slideImage0);
        
        changeCarouselImage(slideImage0);
        changeCarouselImage(slideImage1);
        changeCarouselImage(slideImage2);
        
        
    }

    previousMediaSize = currentMediaSize;
});