(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.2.1';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

},{}],2:[function(require,module,exports){
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

Foundation.Interchange.SPECIAL_QUERIES['retina_small'] = 'only screen and (min-width: 1px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1px) and (min-resolution: 192dpi), only screen and (min-width: 1px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_medium'] = 'only screen and (min-width: 641px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 641px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 641px) and (min-device-pixel-ratio: 2), only screen and (min-width: 641px) and (min-resolution: 192dpi), only screen and (min-width: 641px) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['retina_large'] = 'only screen and (min-width: 1025px) and (-webkit-min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min--moz-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (-o-min-device-pixel-ratio: 2/1), only screen and (min-width: 1025px) and (min-device-pixel-ratio: 2), only screen and (min-width: 1025px) and (min-resolution: 192dpi), only screen and (min-width: 1025px) and (min-resolution: 2dppx)';



/*button listeners*/
var targetAnchor;

function scrollToAnchor() {
    console.log('scrollToAnchor')
    
    var $target = $(targetAnchor);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = targetAnchor;
	    });
    
}

function cardDetailsHandler(event) {
    
    event.preventDefault();
    
    var details = $(this).find('.cardDetails');
    
    if(details.css('opacity') == 0) {
        $('#projects .cardDetails').css('opacity', '0');
        details.fadeTo( 50 , 1);
        $(this).find('.cardDetails .btn').click({msg: 'detailsBtn'}, toggleOverlay);
    }else{
        details.fadeTo( 50 , 0);
        $(this).find('.cardDetails .btn').off();
    }

}

function menuButtonHandler(event) {
    
    event.preventDefault();
    
    targetAnchor = this.hash;
    console.log(targetAnchor);
    
    if( $(event.target).hasClass('sideMenu')) {
        
        $('#offCanvas').foundation('close');
        setTimeout(scrollToAnchor, 300);
    
    }else{
       scrollToAnchor();
   }

}



//variables
var preloadQueue;
var preloadArray = [];
var mainSlidesArray = [];
var formatArray = [];
var preloadPathArray = [];
var firstLoad = true;
var numberHomeSlideImages = 4;

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
    
        preloadArray = [{'name':'haagen_dazs', 'sizes':'3', 'path':'images/main_carousel/', 'format':'.jpg'},
                        {'name':'pretender', 'sizes':'3', 'path':'images/main_carousel/', 'format':'.jpg'},
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
var projectsArray = [];
var slidesArray;
var slidesPathArray;
var loadedSlidesArray;
var isFlickity = false;
var overlayType;


/*overlay js*/

//(function () {
    var container = document.querySelector('div.container'),
        triggerBttn = document.getElementById('trigger-overlay'),
        overlay = document.querySelector('div.overlay'),
        closeBttn = overlay.querySelector('button.overlay-close');
    transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        support = {
            transitions: Modernizr.csstransitions
        };

    function toggleOverlay(event, button) {
        
        

        if (classie.has(overlay, 'open')) {
            
            $(".project-details > .copy > #buttons > .view_site_btn").unbind( "click");
            
            $( "body" ).removeClass( 'noscroll' );
            
            if (overlayType === 'detailsBtn'){
                setTimeout(killDetailCarousel, 1000);
            }
            
            classie.remove(overlay, 'open');
            classie.remove(container, 'overlay-open');
            classie.add(overlay, 'close');
            var onEndTransitionFn = function (ev) {
                if (support.transitions) {
                    if (ev.propertyName !== 'visibility') return;
                    this.removeEventListener(transEndEventName, onEndTransitionFn);
                }
                classie.remove(overlay, 'close');
            };
            if (support.transitions) {
                overlay.addEventListener(transEndEventName, onEndTransitionFn);
            } else {
                onEndTransitionFn();
            }
            
            overlayType = '';
            
        //} else if (!classie.has(overlay, 'close')) {
        } else {
            
            //google tracking here
            
            //console.log(projectsArray[event.target.id].title);
            
            $( "body" ).addClass( 'noscroll' );
            
            if (event.data.msg === 'detailsBtn'){
                
                overlayType = 'detailsBtn';
                
                ga('send', 'pageview', projectsArray[event.target.id].title);
                
                $( "#loadingCaption2").show();
                $( "#loadingCaption2" ).fadeTo("fast", 1);

                $('#detailView').show();
                $('#whatIsThis').hide();

                createDetailCarousel();
                
                $(".overlay-carousel").css('opacity' , '0');
                    
                isFlickity = true;

                //add title
                $(".project-details > .copy > .titleText").html("");
                $(".project-details > .copy > .titleText").append(projectsArray[event.target.id].title);
                //add header copy
                $(".project-details > .copy > .header").html("");
                $(".project-details > .copy > .header").append(
                    '<div><span>client: </span>' + projectsArray[event.target.id].client + '</div><div><span>agency: </span>' + projectsArray[event.target.id].agency + '</div><div><span>platform: </span>' + projectsArray[event.target.id].platform + '</div>'
                );
                //add description
                $(".project-details > .copy > .description").html("");
                $(".project-details > .copy > .description").append(projectsArray[event.target.id].description);
                //add url
                $(".project-details > .copy > #buttons > .view_site_btn").html("");
                $(".project-details > .copy > #buttons > .view_site_btn").append(
                    "<a href=" + projectsArray[event.target.id].url + " target='_blank'><i class='fa fa-eye' aria-hidden='true'></i>view website</a>"
                );
                
                var currentUrl = projectsArray[event.target.id].url;
                
                $(".project-details > .copy > #buttons > .view_site_btn").click(function(){
                    //console.log('clicked')
                   console.log(currentUrl);
                    //ga('send', 'event', ['link'], ['get url'], [currentUrl]);
                     ga('send', 'event', {
                            eventCategory: 'Outbound Link',
                            eventAction: 'click',
                            eventLabel: currentUrl
                          });
                    });
                
                //ga('send', 'event', ['link'], ['get url'], []);
                
                if(projectsArray[event.target.id].url === "no link"){
                    console.log(projectsArray[event.target.id].url);
                    $('.view_site_btn').hide();
                }else{
                    $('.view_site_btn').show();
                }
                
                slidesArray = [];
                slidesPathArray = [];
                loadedSlidesArray = [];
                var $retina = false;

                if (window.devicePixelRatio >= 2) {
                    $retina = true;
                }
                
                function handleComplete(event) {

                    //console.log('complete loading: ' + loadedSlidesArray)
                    
                    for (index = 0; index < loadedSlidesArray.length; ++index) {
                    
                        var $id = 'cell' + index+1;
                        
                        var $cellElems = $("<div class='carousel-cell' id='" + $id + "'></div>");
                         $('.overlay-carousel').flickity( 'append', $cellElems );
                        document.getElementById($id).appendChild(loadedSlidesArray[index]);
                         
                    }
                    
                    $('.overlay-carousel').flickity('resize');
                    $( "#loadingCaption2" ).fadeTo("fast", 0);
                    $('.overlay-carousel').fadeTo("slow", 1);

                 }
                
                 function handleFileLoad(event) {
                     
                     var item = event.item; // A reference to the item that was passed in to the LoadQueue
                     var type = item.type;

                     // Add any images to the page body.
                     if (type == createjs.LoadQueue.IMAGE) {
                
                         loadedSlidesArray.push(event.result);
                     }
                 }
                
                function handleProgressLoad(event) {
                    
                   // console.log ('percent loaded: ' + event.loaded)
    
                        var percentLoaded = Math.round(event.loaded*100);

                        $( "#loadingCaption2" ).html( 'loading: ' + percentLoaded + '%');
                }
                
                
                //get image paths
                //put into slidesPathArray
                slidesArray.push(projectsArray[event.target.id].slides);
                
                //console.log(slidesArray);
                
                for (index = 0; index < slidesArray[0].length; ++index) {
                    
                    var $imagePath;
                    
                    if($retina){
                        $imagePath = 'images/slides/' + slidesArray[0][index] + '_LG_x2.jpg';
                    }else{
                        $imagePath = 'images/slides/' + slidesArray[0][index] + '_LG.jpg';
                    }
                    
                    slidesPathArray.push($imagePath);
                }
                
                //add image paths to image loader cue
                var queue = new createjs.LoadQueue();
                queue.on("complete", handleComplete, this);
                queue.on("fileload", handleFileLoad, this);
                queue.on("progress", handleProgressLoad, this);
                queue.loadManifest(slidesPathArray, true); // Note the 2nd argument that tells the queue not to start loading yet

                
            }else{
                
                $('#detailView').hide();
                $('#whatIsThis').show();

            }
            
                classie.add(overlay, 'open');
                classie.add(container, 'overlay-open');
             
        }
         
    }

    
//})();



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

       // $('.thumb-container .cardDetails').hide();
        //add listeners to buttons after data is loaded and templates are executed
        $('.thumb-container').click(cardDetailsHandler);
        
       // $('#projects .thumb-container .cardDetails .btn').click({msg: 'detailsBtn'}, toggleOverlay);
        //$('#projects > li > .thumb-container > img').click({msg: 'detailsBtn'}, toggleOverlay);
        
        $('.overlay-close').click(toggleOverlay);
        $('.back_btn').click(toggleOverlay);
        
        $('#footer-image').click({msg: 'whatsThisBtn'}, toggleOverlay);
        
        
        $('.sideMenu').click(menuButtonHandler);
        $('.mainMenu').click(menuButtonHandler);

       // addThumbImages();
        
    }); //getJSON
}); //function
},{"mustache":1}]},{},[2])