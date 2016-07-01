function createMainCarousel() {
    
   // var test = document.getElementsByClassName("main-carousel");
    //var carousel = document.querySelector('.main-carousel')
    var flkty = Flickity.data('.main-carousel')
    
    //console.log('create main carousel ' + flkty)
    
    if (flkty !== undefined) {
        console.log('kill carousel');
        $('.main-carousel').flickity('destroy');
        $('.main-carousel').html("");
    }
    
    $('.main-carousel').flickity({
        // options
        cellAlign: 'left',
        contain: true,
        wrapAround: true,
        lazyLoad: true,
        autoPlay: true,
        imagesLoaded: true
    });
    
     var flkty = $('.main-carousel').data('flickity');
    
    $('.main-carousel').on( 'cellSelect', function() {

        switch(flkty.selectedIndex) {
            case 1:
                $('#mainLogo > #caption').css('color', 'white');
                break;
            default:
                $('#mainLogo > #caption').css('color', 'black');
               
        }
    })

    
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
//function getCarouselImage(image, id) {

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
    
    //return $image;
    
    //add this somewhere else
    var $cellElems = $("<div class='carousel-cell'><img src='" + $image + "' /></div>");
    
    if(id === 'detail'){
        
        console.log('APPEND DETAIL IMAGES')
        $('.overlay-carousel').flickity( 'append', $cellElems );
    }
    
    if(id === 'main'){

        $('.main-carousel').flickity( 'append', $cellElems );
    }
    ///

};