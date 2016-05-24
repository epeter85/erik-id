Foundation.Interchange.SPECIAL_QUERIES['retina_small'] = 'only screen and (min-width: 1px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min-resolution: 192dpi), only screen and (min-width: 1px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_medium'] = 'only screen and (min-width: 641px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 641px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 641px) and (min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min-resolution: 192dpi), only screen and (min-width: 641px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_large'] = 'only screen and (min-width: 1025px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1025px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min-resolution: 192dpi), only screen and (min-width: 1025px) and (min-resolution: 2dppx)';


var projectsArray = [];
var slidesArray;
var slidesPathArray;
var loadedSlidesArray;
var isFlickity = false;


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
            
            setTimeout(killDetailCarousel, 1000);
            
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
            
            if (event.data.msg === 'detailsBtn'){

                $('#detailView').show();
                $('#whatIsThis').hide();

                createDetailCarousel();
                    
                isFlickity = true;

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
            
                
                slidesArray = [];
                slidesPathArray = [];
                loadedSlidesArray = [];
                var $retina = false;

                if (window.devicePixelRatio >= 2) {
                    $retina = true;
                }
                
                function handleComplete(event) {

                    console.log('complete loading: ' + loadedSlidesArray)
                    
                    for (index = 0; index < loadedSlidesArray.length; ++index) {
                    
                        var $id = 'cell' + index
                        var $cellElems = $("<div class='carousel-cell' id='" + $id + "'></div>");
                         $('.overlay-carousel').flickity( 'append', $cellElems );
                        document.getElementById($id).appendChild(loadedSlidesArray[index]);
                         
                    }
                    
                    $('.overlay-carousel').flickity('resize');
                    
                    classie.add(overlay, 'open');
                    classie.add(container, 'overlay-open');
                 }
                
                 function handleFileLoad(event) {
                     
                     var item = event.item; // A reference to the item that was passed in to the LoadQueue
                     var type = item.type;

                     // Add any images to the page body.
                     if (type == createjs.LoadQueue.IMAGE) {
                
                         loadedSlidesArray.push(event.result);
                     }
                 }
                
                function handleProgressLoad(event) {
                    console.log ('percent loaded: ' + event.loaded)
                }
                
                
                //get image paths
                //put into slidesPathArray
                slidesArray.push(projectsArray[event.target.id].slides);
                
                for (index = 0; index < slidesArray[0].length; ++index) {
                    
                    var $imagePath;
                    
                    if($retina){
                        $imagePath = 'images/slides/' + slidesArray[0][index] + '_LG_x2.jpg';
                    }else{
                        $imagePath = 'images/slides/' + slidesArray[0][index] + '_LG.jpg';
                    }
                    
                    slidesPathArray.push($imagePath);
                }
                
                //add image paths to image loader cue
                var queue = new createjs.LoadQueue();
                queue.on("complete", handleComplete, this);
                queue.on("fileload", handleFileLoad, this);
                queue.on("progress", handleProgressLoad, this);
                queue.loadManifest(slidesPathArray, true); // Note the 2nd argument that tells the queue not to start loading yet

                
            }else{
                
                $('#detailView').hide();
                $('#whatIsThis').show();
                
                classie.add(overlay, 'open');
                classie.add(container, 'overlay-open');
            }
             
        }
         
    }

    
//})();



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


