$(function () {

    var Mustache = require('mustache');
    
    $.getJSON('js/work.json', function (data) {

        var template = $('#cardsdata').html();
        var html = Mustache.to_html(template, data);
        $('#projects').html(html);

        var index;
        for (index = 0; index < data.projects.length; ++index) {
            projectsArray.push(data.projects[index])
        }
        
        //add listeners to buttons after data is loaded and templates are executed
        $('#projects .thumb-container .cardDetails .btn').click({msg: 'detailsBtn'}, toggleOverlay);
        $('#projects > li > .thumb-container > img').click({msg: 'detailsBtn'}, toggleOverlay);
        $('.overlay-close').click(toggleOverlay);
        $('.back_btn').click(toggleOverlay);
        
        $('.sideMenu').click(menuButtonHandler);
        $('.mainMenu').click(menuButtonHandler);

        addThumbImages();
        
    }); //getJSON
}); //function