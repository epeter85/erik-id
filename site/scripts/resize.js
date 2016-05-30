var currentMediaSize;
var previousMediaSize;

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
        resizeCarousel();
    }
    
    if(isFlickity && previousMediaSize !== currentMediaSize) {
        resizeCarousel();
    }
    
    previousMediaSize = currentMediaSize;
    
}

function resizeCarousel() {
    
    $('.main-carousel').flickity('destroy');
    $('.main-carousel').html("");
    
    createMainCarousel();
    
    for (var index=0;index <= mainSlidesArray.length-1;index++) {
        
        changeCarouselImage(mainSlidesArray[index], 'main');
    }
        
    $('.main-carousel').flickity('resize')
    
    //if in detail view
    if(isFlickity) {

        $('.overlay-carousel').flickity('destroy');
        $('.overlay-carousel').html("");
        
        createDetailCarousel();
        
        for (index = 0; index < slidesArray[0].length; ++index) {
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