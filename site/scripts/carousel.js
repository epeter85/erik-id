function createMainCarousel() {
    
    $('.main-carousel').flickity({
        // options
        cellAlign: 'left',
        contain: true,
        wrapAround: true,
        lazyLoad: true,
        autoPlay: true,
        imagesLoaded: true
    });
    
}


function createDetailCarousel() {
    
     if (Foundation.MediaQuery.atLeast('large')) {
            
            //no autoplay
            $('.overlay-carousel').flickity({
                // options
                cellAlign: 'left',
                contain: true,
                wrapAround: true,
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
                autoPlay: true,
                imagesLoaded: true
            });
        }
    
    
}

function killDetailCarousel() {
    console.log(killDetailCarousel);
    $('.overlay-carousel').flickity('destroy');
    $('.overlay-carousel').html("");
    isFlickity = false;
}
    
    
/*update images on detail view carousel*/

function changeCarouselImage(image, id) {

    var $image;
    var $size = Foundation.MediaQuery.current;
    var $retina = false;

    if (window.devicePixelRatio >= 2) {
        $retina = true;
    }

    if ($retina) {

        switch ($size) {
        case 'small':
            if(id === 'detail'){
                $image = 'images/slides/' + image + '_LG_x2.jpg';
            }else{
                $image = 'images/main_carousel/' + image + '_SM_x2.jpg';
            }
            viewState = 'sm_ret';
            break;
        case 'medium':
            if(id === 'detail'){
                $image = 'images/slides/' + image + '_LG_x2.jpg';
            }else{
                $image = 'images/main_carousel/' + image + '_MD_x2.jpg';
            }
            viewState = 'md_ret';
            break;
        case 'large':
        case 'xlarge':
        case 'xxlarge':
            if(id === 'detail'){
                $image = 'images/slides/' + image + '_LG_x2.jpg';
            }else{
                $image = 'images/main_carousel/' + image + '_LG_x2.jpg';
            }
            viewState = 'lg_ret';
            break;
        }

    } else {

        switch ($size) {
        case 'small':
            if(id === 'detail'){
                $image = 'images/slides/' + image + '_LG.jpg';
            }else{
                $image = 'images/main_carousel/' + image + '_SM.jpg';
            }
            viewState = 'sm';
            break;
        case 'medium':
            if(id === 'detail'){
                $image = 'images/slides/' + image + '_LG.jpg';
            }else{
                $image = 'images/main_carousel/' + image + '_MD.jpg';
            }
            viewState = 'md';
            break;
        case 'large':
        case 'xlarge':
        case 'xxlarge':
            if(id === 'detail'){
                $image = 'images/slides/' + image + '_LG.jpg';
            }else{
                $image = 'images/main_carousel/' + image + '_LG.jpg';
            }
            viewState = 'lg';
            break;
        }
    }
    
    var $cellElems = $("<div class='carousel-cell'><img src='" + $image + "' /></div>");
    
    if(id === 'detail'){
        
        $('.overlay-carousel').flickity( 'append', $cellElems );
    }
    
    if(id === 'main'){

        $('.main-carousel').flickity( 'append', $cellElems );
    }

};