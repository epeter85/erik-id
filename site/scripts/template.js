var projectsArray = [];

$(function() {
  var Mustache = require('mustache');

  $.getJSON('js/work.json', function(data) {
    var template = $('#cardsdata').html();
    var html = Mustache.to_html(template, data);
    $('#projects').html(html);  
      
      var index;
      for (index = 0; index < data.projects.length; ++index) {
            projectsArray.push(data.projects[index])
        }
      
  });//getJSON

}); //function