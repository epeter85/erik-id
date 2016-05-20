    var preloadPathArray =[];            

function preloadComplete(event) {

                    console.log('complete loading: ' + loadedSlidesArray)

                    for (index = 0; index < loadedSlidesArray.length; ++index) {

                        var $id = 'cell' + index
                        var $cellElems = $("<div class='carousel-cell' id='" + $id + "'></div>");
                        $('.overlay-carousel').flickity('append', $cellElems);
                        document.getElementById($id).appendChild(loadedSlidesArray[index]);

                    }


                }

                function handleFilePreload(event) {

                    var item = event.item; // A reference to the item that was passed in to the LoadQueue
                    var type = item.type;

                    // Add any images to the page body.
                    if (type == createjs.LoadQueue.IMAGE) {

                        loadedSlidesArray.push(event.result);
                    }
                }

                function handleProgressPreload(event) {
                    console.log('percent loaded: ' + event.loaded)
                }

function getPreloadImages() {
    
    var mediaSize = Foundation.MediaQuery.current;
    var imageMediaSize;
    var $retina = false;
    
    if (window.devicePixelRatio >= 2) {
        $retina = true;
    }

    switch (mediaSize) {
        case 'small':
            imageMediaSize = 'small';
            break;
        case 'medium':
            imageMediaSize = 'medium';
            break;
        case 'large':
        case 'xlarge':
        case 'xxlarge':
            imageMediaSize = 'large';
            break;
    }
    
}


                //add image paths to image loader cue
                var preloadQueue = new createjs.LoadQueue();
                preloadQueue.on("complete", preloadComplete, this);
                preloadQueue.on("fileload", handleFilePreload, this);
                preloadQueue.on("progress", handleProgressPreload, this);
                preloadQueue.loadManifest(preloadPathArray, true); // Note the 2nd argument that tells the queue not to start loading yet
