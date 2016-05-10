$(function() {
    
    //$(document).ready(function(){



//});
    
    
    
  var Mustache = require('mustache');

  $.getJSON('js/work.json', function(data) {
    var template = $('#cardsdata').html();
    var html = Mustache.to_html(template, data);
    $('#projects').html(html);  
      
      var index;
      for (index = 0; index < data.projects.length; ++index) {
            projectsArray.push(data.projects[index])
        }

      console.log('create thumbs');
     // enableButtons();
      
     // document.getElementById ("projects").addEventListener ("click", toggleOverlay, false);
      $('#projects .thumb-container .cardDetails .btn').click(toggleOverlay);
      

      
  });//getJSON
    


}); //function


