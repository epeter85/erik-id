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
       // resizeCarousel();
    }
    
    if(isFlickity && previousMediaSize !== currentMediaSize) {
        resizeCarousel();
    }
    
    previousMediaSize = currentMediaSize;
    
}


function resizeCarousel() {
    
    console.log('resize detail carousel')


        $('.overlay-carousel').flickity('destroy');
        $('.overlay-carousel').html("");
        
        createDetailCarousel();
        
        for (index = 0; index < slidesArray[0].length; ++index) {
            
            //loader
            changeCarouselImage(slidesArray[0][index], 'detail');
            
        }
        
        $('.overlay-carousel').flickity('resize')

}

function resizePage() {
    
    console.log('resize page');
    
    var currentImagePaths = getPreloadImagePaths(preloadArray);
    
    loadPageImages();
    
    
}

$( window ).resize(function() {

    getCurrentMediaQuery();

});