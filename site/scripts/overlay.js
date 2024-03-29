var projectsArray = [];
var slidesArray;
var slidesPathArray;
var loadedSlidesArray;
var isFlickity = false;
var overlayType;


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
            
            $(".project-details > .copy > #buttons > .view_site_btn").unbind( "click");
            
            $( "body" ).removeClass( 'noscroll' );
            
            if (overlayType === 'detailsBtn'){
                setTimeout(killDetailCarousel, 1000);
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
            
            overlayType = '';
            
        //} else if (!classie.has(overlay, 'close')) {
        } else {
            
            console.log(projectsArray[event.target.id])
            //google tracking
            //var id = projectsArray[event.target.id].title;
            
            
            if(typeof projectsArray[event.target.id] === 'undefined') {
                    
                    console.log('whats-this');
                    ga('send', 'pageview', 'whats-this');

               }else{
                    console.log(projectsArray[event.target.id].title);
                    ga('send', 'pageview', projectsArray[event.target.id].title);
                  
               }
            
            
            $( "body" ).addClass( 'noscroll' );
            
            if (event.data.msg === 'detailsBtn'){
                
                overlayType = 'detailsBtn';
                
                ga('send', 'pageview', projectsArray[event.target.id].title);
                
                $( "#loadingCaption2").show();
                $( "#loadingCaption2" ).fadeTo("fast", 1);

                $('#detailView').show();
                $('#whatIsThis').hide();

                createDetailCarousel();
                
                $(".overlay-carousel").css('opacity' , '0');
                    
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
                
                var currentUrl = projectsArray[event.target.id].url;
                
                $(".project-details > .copy > #buttons > .view_site_btn").click(function(){
                    //console.log('clicked')
                   console.log(currentUrl);
                    //ga('send', 'event', ['link'], ['get url'], [currentUrl]);
                     ga('send', 'event', {
                            eventCategory: 'Outbound Link',
                            eventAction: 'click',
                            eventLabel: currentUrl
                          });
                    });
                
                //ga('send', 'event', ['link'], ['get url'], []);
                
                if(projectsArray[event.target.id].url === "no link"){
                    console.log(projectsArray[event.target.id].url);
                    $('.view_site_btn').hide();
                }else{
                    $('.view_site_btn').show();
                }
                
                slidesArray = [];
                slidesPathArray = [];
                loadedSlidesArray = [];
                var $retina = false;

                if (window.devicePixelRatio >= 2) {
                    $retina = true;
                }
                
                function handleComplete(event) {

                    //console.log('complete loading: ' + loadedSlidesArray)
                    
                    for (index = 0; index < loadedSlidesArray.length; ++index) {
                    
                        var $id = 'cell' + index+1;
                        
                        var $cellElems = $("<div class='carousel-cell' id='" + $id + "'></div>");
                         $('.overlay-carousel').flickity( 'append', $cellElems );
                        document.getElementById($id).appendChild(loadedSlidesArray[index]);
                         
                    }
                    
                    $('.overlay-carousel').flickity('resize');
                    $( "#loadingCaption2" ).fadeTo("fast", 0);
                    $('.overlay-carousel').fadeTo("slow", 1);

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
                    
                   // console.log ('percent loaded: ' + event.loaded)
    
                        var percentLoaded = Math.round(event.loaded*100);

                        $( "#loadingCaption2" ).html( 'loading: ' + percentLoaded + '%');
                }
                
                
                //get image paths
                //put into slidesPathArray
                slidesArray.push(projectsArray[event.target.id].slides);
                
                //console.log(slidesArray);
                
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

            }
            
                classie.add(overlay, 'open');
                classie.add(container, 'overlay-open');
             
        }
         
    }

    
//})();


