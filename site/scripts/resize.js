var currentMediaSize;
var previousMediaSize;
//var resizeImageArray = [];
var resizeMainCarouselImageArray = [];
//var mainCarouselPreloadQueue;
//var resizeDetailCarouselImageArray = [];


function getCurrentMediaQuery() {
    
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
    
    if(previousMediaSize !== currentMediaSize) {
        
        resizePage();
       // resizeCarousel();
    }
    
    if(isFlickity && previousMediaSize !== currentMediaSize) {
        resizeCarousel();
    }
    
    previousMediaSize = currentMediaSize;
    
}

function handleFileMainCarouselPreload(event) {
    
}

function handleProgressMainCarouselPreload(event) {
    
    //console.log('percent loaded: ' + event.loaded)
    
      var percentLoaded = Math.round(event.loaded*100);
    
}

function mainCarouselPreloadComplete(event) {
    
    for (var index=0;index <= resizeMainCarouselImageArray.length-1;index++) {
        
        var $cellElems = $("<div class='carousel-cell'><img src='" + resizeMainCarouselImageArray[index] + "' /></div>");
        $('.main-carousel').flickity( 'append', $cellElems );
    }
    
    
    
    /*if(id === 'detail'){
        
        $('.overlay-carousel').flickity( 'append', $cellElems );
    }
    
    if(id === 'main'){*/

        //$('.main-carousel').flickity( 'append', $cellElems );
  //  }
    
    $('.main-carousel').flickity('resize');
}


function initCarouselPreload(imageArray) {

    //add image paths to image loader cue
    mainCarouselPreloadQueue = new createjs.LoadQueue();
    mainCarouselPreloadQueue.on("complete", mainCarouselPreloadComplete, this);
    mainCarouselPreloadQueue.on("fileload", handleFileMainCarouselPreload, this);
    mainCarouselPreloadQueue.on("progress", handleProgressMainCarouselPreload, this);
    mainCarouselPreloadQueue.loadManifest(imageArray, true);

}

function resizeCarousel() {
    
    console.log('resize carousel')

   // createMainCarousel();
    
    //for (var index=0;index <= mainSlidesArray.length-1;index++) {
        
        //loader
        //var $image = getCarouselImage(mainSlidesArray[index], 'main');
       // changeCarouselImage(mainSlidesArray[index], 'main');
        //resizeMainCarouselImageArray.push($image);
   // }
    
   // initCarouselPreload(resizeMainCarouselImageArray);
    //console.log(resizeMainCarouselImageArray)
        
    //$('.main-carousel').flickity('resize')
    
    //if in detail view
    if(isFlickity) {

        $('.overlay-carousel').flickity('destroy');
        $('.overlay-carousel').html("");
        
        createDetailCarousel();
        
        for (index = 0; index < slidesArray[0].length; ++index) {
            
            //loader
            changeCarouselImage(slidesArray[0][index], 'detail');
        }
        
        $('.overlay-carousel').flickity('resize')
    }

}

function resizePage() {
    
    console.log('resize page');
    
    var currentImagePaths = getPreloadImagePaths(preloadArray);
    //console.log(currentImagePaths)
    
    loadPageImages();
    
    
}

$( window ).resize(function() {

    getCurrentMediaQuery();

});