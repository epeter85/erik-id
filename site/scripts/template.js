$(function() {
  var Mustache = require('mustache');

  $.getJSON('js/work.json', function(data) {
    var template = $('#cardsdata').html();
    var html = Mustache.to_html(template, data);
    $('#cards').html(html);  
      
  });//getJSON

}); //function