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

        $('#projects .thumb-container .cardDetails .btn').click(toggleOverlay);
        $('#projects > li > .thumb-container > img').click(toggleOverlay);
        $('.overlay-close').click(toggleOverlay);
        $('.back_btn').click(toggleOverlay);
        
        addThumbImages();
        
    }); //getJSON
}); //function