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
    }
    
    if(isFlickity && previousMediaSize !== currentMediaSize) {
        resizeCarousel();
    }
    

    
    previousMediaSize = currentMediaSize;
    
}

function resizeCarousel() {
    
    console.log('resize carousel');

        $('.overlay-carousel').flickity('destroy');
        $('.overlay-carousel').html("");
        
        createDetailCarousel();
        
        for (index = 0; index < slidesArray[0].length; ++index) {
            changeCarouselImage(slidesArray[0][index]);
        }
        
        $('.overlay-carousel').flickity('resize')

}

function resizePage() {
    
    console.log('resize page');
    
    var currentImagePaths = getPreloadImagePaths(preloadArray);
    console.log(currentImagePaths)
    
    loadPageImages();
    
    
}

$( window ).resize(function() {

    getCurrentMediaQuery();

});