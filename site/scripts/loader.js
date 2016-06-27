//variables
var preloadQueue;
var preloadArray = [];
var mainSlidesArray = [];
var formatArray = [];
var preloadPathArray = [];
var firstLoad = true;
var numberHomeSlideImages = 3;

function preloadComplete(event) {
    
    loadPageImages (); 

}

function loadPageImages() {

    document.getElementById('logoImage').appendChild(preloadPathArray[numberHomeSlideImages]);
    document.getElementById('homePackImage').appendChild(preloadPathArray[numberHomeSlideImages+1]);
    document.getElementById('checkListImage').appendChild(preloadPathArray[numberHomeSlideImages + 2]);
    document.getElementById('origWackyPackImage').appendChild(preloadPathArray[numberHomeSlideImages + 3]);

    createMainCarousel();
    
    //add main carousel images to dom
    for (var index=0;index<=numberHomeSlideImages-1;index++)
    {
        var $id = 'cell' + index;
        var $cellElems = $("<div class='carousel-cell' id='" + $id + "'></div>");
        $('.main-carousel').flickity( 'append', $cellElems );
        document.getElementById($id).appendChild(preloadPathArray[index]);
    }
    
    //strip height to Flickity Viewport styling
    //older browser issue
    $('.main-carousel .flickity-viewport').css('height', '');
    
    
    //add thumb images to dom
    var _img = document.getElementsByClassName("thumb-container");
    
       for (var i=0;i<=_img.length-1;i++)
        {
            var _img_div = $(_img[i]);
            $( _img_div ).append( $( preloadPathArray[i + numberHomeSlideImages + 4] ) );

        }
    
    if (firstLoad) {
        
        $( ".container" ).show();
        
        $( "#loaderOverlay" ).fadeOut( "slow", function() {
            $( "#loaderOverlay").hide();
        });
        
        $('.main-carousel').flickity('resize');
        
        firstLoad = false;
        
    }else{
        
        
    }

}

function handleFilePreload(event) {

    var item = event.item; // A reference to the item that was passed in to the LoadQueue
    var type = item.type;

    // Add any images to the page body.
    if (type == createjs.LoadQueue.IMAGE) {

        preloadPathArray.push(event.result);
    }
}

function handleProgressPreload(event) {
    //console.log('percent loaded: ' + event.loaded)
    
    var percentLoaded = Math.round(event.loaded*100);
    
    $( "#loadingCaption" ).html( 'loading: ' + percentLoaded + '%');
}

function getPreloadImagePaths(imageArray) {
    
    var mediaSize = Foundation.MediaQuery.current;
    var imageMediaSize;
    var $retina = false;
    var imagePathArray = [];
    mainSlidesArray = [];
    
    if (window.devicePixelRatio >= 2) {
        $retina = true;
    }

    switch (mediaSize) {
        case 'small':
            imageMediaSize = '_SM';
            break;
        case 'medium':
            imageMediaSize = '_MD';
            break;
        case 'large':
        case 'xlarge':
        case 'xxlarge':
            imageMediaSize = '_LG';
            break;
    }
    
    for (var i=0;i<=imageArray.length-1;i++) {
        
        var imgPath;
        var $imageName = imageArray[i].name;
        var $imageSizes = imageArray[i].sizes;
        var $imagePath = imageArray[i].path;
        var $imageFormat = imageArray[i].format;
        
        switch ($imageSizes) {
            case '1':
                imgPath = $imagePath + $imageName;
                break;
             case '2':
                if(mediaSize === 'small'){
                   imgPath = $imagePath + $imageName + '_SM';
                }else{
                    imgPath = $imagePath + $imageName;
                }
                break;
            case '3':
                imgPath = $imagePath + $imageName + imageMediaSize;
                break;
                
        }
        
        //capture main carousel images
        if(i < numberHomeSlideImages) {
            
            mainSlidesArray.push(imageArray[i].name);
        
        }

        //retina or not
        if ($retina) {
            imgPath = imgPath + '_x2'
        }
        
        //image format
        imgPath = imgPath + $imageFormat;
        
        imagePathArray.push(imgPath);
        
    }
    
    // console.log(mainSlidesArray)

    return imagePathArray;
    
}

function initPreload(imageArray) {

    //add image paths to image loader cue
    preloadQueue = new createjs.LoadQueue();
    preloadQueue.on("complete", preloadComplete, this);
    preloadQueue.on("fileload", handleFilePreload, this);
    preloadQueue.on("progress", handleProgressPreload, this);
    preloadQueue.loadManifest(imageArray, true); // Note the 2nd argument that tells the queue not to start loading yet

}


$(window).load(function() {
    
        //image types
        // 1 = one size norm + retina
        // 2 = two sizes SM + medium & up
        // 3 = three sizes SM + MD + LG
    
        preloadArray = [{'name':'pretender', 'sizes':'3', 'path':'images/main_carousel/', 'format':'.jpg'},
                        {'name':'subway', 'sizes':'3', 'path':'images/main_carousel/', 'format':'.jpg'},
                        {'name':'computers', 'sizes':'3', 'path':'images/main_carousel/', 'format':'.jpg'},
                        /*{'name':'pretender', 'sizes':'3', 'path':'images/main_carousel/', 'format':'.jpg'},
                        {'name':'pretender', 'sizes':'3', 'path':'images/main_carousel/', 'format':'.jpg'},*/
                        
                        {'name':'logo', 'sizes':'3', 'path':'images/', 'format':'.png'},
                        {'name':'homePack', 'sizes':'2', 'path':'images/', 'format':'.png'},
                        {'name':'checklist', 'sizes':'1', 'path':'images/', 'format':'.jpg'},
                        {'name':'original_wacky_pack', 'sizes':'1', 'path':'images/', 'format':'.png'}

        ];
    
        //add cards to preload array
        for (var i=0;i<=projectsArray.length-1;i++) {
            preloadArray.push({'name':projectsArray[i].cardImage,
                               'sizes':'1', 'path':'images/thumbs/', 
                               'format':'.jpg'});
        }
    
        initPreload(getPreloadImagePaths(preloadArray));

    });
